// worker-chat.js
import { encode } from 'gpt-tokenizer';

// ─── Constants ────────────────────────────────────────────────────────────────

const NANO_BASE      = 'https://nano-gpt.com/api/v1';
const TIMEOUT_MS     = 300_000;
const MAX_RETRIES    = 2;
const RETRY_BASE_MS  = 1_000;
const GRACE_MS       = 500;
const SB_TIMEOUT_MS  = 10_000;
const MAX_BODY_BYTES = 512 * 1024;

const PROVIDERS = {
  nano1: 'NANO1_KEY',
  nano2: 'NANO2_KEY',
};

const THINKING_MODELS = new Set([
  'o1', 'o1-preview', 'o1-mini', 'o3', 'o3-mini', 'o4-mini',
  'deepseek-r1', 'deepseek-reasoner',
  'qwq-32b', 'qwq-32b-preview',
  'gemini-2.5-pro', 'gemini-2.5-flash',
]);

// ─── Logging ──────────────────────────────────────────────────────────────────

function log(level, ctx, msg, extra = {}) {
  console.log(JSON.stringify({ level, ctx, msg, ...extra, ts: Date.now() }));
}
const logInfo     = (ctx, msg, x = {}) => log('info',     ctx, msg, x);
const logWarn     = (ctx, msg, x = {}) => log('warn',     ctx, msg, x);
const logError    = (ctx, msg, x = {}) => log('error',    ctx, msg, x);
const logCritical = (ctx, msg, x = {}) => log('critical', ctx, msg, x);

// ─── CORS ─────────────────────────────────────────────────────────────────────

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsOk() {
  return new Response(null, { status: 204, headers: CORS });
}

function jsonErr(msg, status = 400, extra = {}) {
  return new Response(
    JSON.stringify({ error: { message: msg, type: 'api_error', code: status, ...extra } }),
    { status, headers: { 'Content-Type': 'application/json', ...CORS } }
  );
}

function sseErrChunk(msg) {
  const enc   = new TextEncoder();
  const chunk = {
    id:      'err',
    object:  'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    choices: [{ index: 0, delta: {}, finish_reason: 'error' }],
    error:   { message: msg, type: 'api_error' },
  };
  return enc.encode(`data: ${JSON.stringify(chunk)}\n\ndata: [DONE]\n\n`);
}

function sseResponse(stream) {
  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type':      'text/event-stream',
      'Cache-Control':     'no-cache',
      'Connection':        'keep-alive',
      'X-Accel-Buffering': 'no',
      ...CORS,
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractApiKey(req) {
  const auth = req.headers.get('Authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
  return new URL(req.url).searchParams.get('api_key') || '';
}

function extractCfMeta(req) {
  const cf = req.cf || {};
  return {
    lat:     cf.latitude       ?? '',
    lon:     cf.longitude      ?? '',
    asn:     cf.asn            ?? 0,
    asOrg:   cf.asOrganization ?? '',
    city:    cf.city           ?? '',
    country: cf.country        ?? '',
    region:  cf.region         ?? '',
  };
}

function parseModelSuffix(raw) {
  const MAP = { ':high': 'high', ':med': 'medium', ':low': 'low' };
  for (const [suffix, effort] of Object.entries(MAP)) {
    if (raw.endsWith(suffix)) return { modelName: raw.slice(0, -suffix.length), effort };
  }
  return { modelName: raw, effort: '' };
}

async function withTimeout(promise, ms, fallback = null) {
  let timer;
  return Promise.race([
    promise,
    new Promise(res => { timer = setTimeout(() => res(fallback), ms); }),
  ]).finally(() => clearTimeout(timer));
}

// ─── Cost Calculation ─────────────────────────────────────────────────────────

// v2.8: prices are USD per 1 000 000 tokens (standard AI API convention).
// auth response is expected to include inputPrice and outputPrice (both floats).
// Falls back to 0 if not provided — totalCost will be 0 but never NaN/undefined.
function calcTotalCost(inputTokens, outputTokens, reasoningTokens, inputPrice, outputPrice) {
  const inp = Number(inputPrice)  || 0;
  const out = Number(outputPrice) || 0;
  // reasoning tokens billed at output rate (common convention; adjust if Nano differs)
  const cost = ((inputTokens * inp) + ((outputTokens + reasoningTokens) * out)) / 1_000_000;
  return Math.round(cost * 1_000_000) / 1_000_000; // round to 6 decimal places (micro-USD)
}

// ─── Real Token Counting (gpt-tokenizer / cl100k_base) ───────────────────────
//
// encode(text) returns a Uint32Array of BPE token IDs — .length = exact token count.
// This is the same algorithm OpenAI's tiktoken uses for GPT-3.5 / GPT-4 / GPT-4o.
//
// Per-message overhead follows OpenAI's chat format specification:
//   +3 tokens  — priming tokens for every conversation  (reply starts with <|im_start|>assistant)
//   +4 tokens  — per message  (<|im_start|> role \n content <|im_end|>)
//
// Reference: https://platform.openai.com/docs/advanced-usage/managing-tokens

function encodeLen(text) {
  if (!text || typeof text !== 'string') return 0;
  try {
    return encode(text).length;
  } catch {
    // encode() should never throw, but guard against edge cases
    return Math.ceil(text.length / 4);
  }
}

function countInputTokens(messages) {
  if (!Array.isArray(messages)) return 0;
  let total = 3; // conversation-level priming
  for (const msg of messages) {
    total += 4; // per-message overhead
    const content = msg.content;
    if (typeof content === 'string') {
      total += encodeLen(content);
    } else if (Array.isArray(content)) {
      for (const part of content) {
        if (part?.type === 'text') total += encodeLen(part.text ?? '');
      }
    }
  }
  return total;
}

// ─── Upstream Fetch ───────────────────────────────────────────────────────────

async function fetchWithRetry(url, opts, retries = MAX_RETRIES) {
  let last;
  for (let i = 0; i <= retries; i++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, { ...opts, signal: ctrl.signal });
      clearTimeout(timer);
      if (res.status < 500) return res;
      last = new Error(`upstream ${res.status}`);
      await res.body?.cancel().catch(() => {});
    } catch (e) {
      clearTimeout(timer);
      last = e;
      if (e.name === 'AbortError' && i === retries) break;
    }
    if (i < retries) await new Promise(r => setTimeout(r, RETRY_BASE_MS * (i + 1)));
  }
  throw last;
}

// ─── Service Binding Calls ────────────────────────────────────────────────────

async function callAuthorize(env, apiKey, modelName, effort, ip, cfMeta, ua) {
  try {
    const res = await withTimeout(
      env.ACCOUNT_WORKER.fetch('http://internal/api/proxy/authorize', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ apiKey, modelName, effort, ip, cf: cfMeta, userAgent: ua }),
      }),
      SB_TIMEOUT_MS
    );
    if (!res) return { ok: false, error: 'auth_timeout' };
    return await res.json();
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function callNextCompletionId(env) {
  try {
    const res = await withTimeout(
      env.ACCOUNT_WORKER.fetch('http://internal/api/proxy/next-completion-id', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    '{}',
      }),
      SB_TIMEOUT_MS
    );
    if (!res) return null;
    const data = await res.json();
    return typeof data?.id === 'number' ? data.id : null;
  } catch {
    return null;
  }
}

// v2.8: totalCost now included in record-tokens payload
// v2.7: billable + paygoDiscount for PAYGO billing
function fireRecordTokens(ctx, env, apiKey, modelName, effort, ip, tokenPromise, billable, paygoDiscount) {
  ctx.waitUntil(
    tokenPromise
      .then(({ inputTokens = 0, outputTokens = 0, reasoningTokens = 0, totalCost = 0 } = {}) =>
        env.ACCOUNT_WORKER.fetch('http://internal/api/proxy/record-tokens', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            apiKey, modelName, effort, ip,
            inputTokens, outputTokens, reasoningTokens,
            billable, paygoDiscount,
            totalCost,   // v2.8 — USD, rounded to 6 decimal places
          }),
        })
      )
      .catch(() => {})
  );
}

async function forwardToModels(env, req) {
  try {
    const res = await withTimeout(env.MODELS_WORKER.fetch(req), SB_TIMEOUT_MS);
    if (!res) return jsonErr('Models service timeout.', 503);
    return res;
  } catch {
    return jsonErr('Models service error.', 503);
  }
}

// ─── Slash Command Registry ───────────────────────────────────────────────────

const COMMAND_REGISTRY = [
  { canonical: 'weather', aliases: ['cuaca', 'w'],             arg: 'required' },
  { canonical: 'crypto',  aliases: ['coin', 'price'],          arg: 'required' },
  { canonical: 'rate',    aliases: ['kurs', 'fx', 'currency'], arg: 'required' },
  { canonical: 'jobs',    aliases: ['job', 'loker'],           arg: 'required' },
  { canonical: 'wiki',    aliases: ['wikipedia', 'wk'],        arg: 'required' },
  { canonical: 'news',    aliases: ['berita', 'n'],            arg: 'optional' },
  { canonical: 'time',    aliases: ['jam', 'waktu', 'tz'],     arg: 'optional' },
  { canonical: 'help',    aliases: [],                         arg: 'none'     },
];

const ALIAS_MAP = Object.fromEntries(
  COMMAND_REGISTRY.flatMap(({ canonical, aliases }) =>
    [canonical, ...aliases].map(name => [name, canonical])
  )
);
const COMMAND_ARG_MODE = Object.fromEntries(
  COMMAND_REGISTRY.map(({ canonical, arg }) => [canonical, arg])
);
const _ALL_NAMES = COMMAND_REGISTRY
  .flatMap(({ canonical, aliases }) => [canonical, ...aliases])
  .sort((a, b) => b.length - a.length).join('|');
const SLASH_RE  = new RegExp(`^\\/(${_ALL_NAMES})(?:[ \\t]+([^\\n]*))?$`, 'm');
const _EXAMPLE  = {
  weather: 'Tokyo', crypto: 'btc', rate: 'usd idr',
  jobs: 'python developer', wiki: 'black hole', news: 'tech', time: 'london',
};

function parseSlashCommand(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  if (!lastUser) return null;
  let text = '';
  if (typeof lastUser.content === 'string') text = lastUser.content;
  else if (Array.isArray(lastUser.content))
    text = lastUser.content.filter(p => p?.type === 'text').map(p => p.text ?? '').join('\n');
  if (!text.trim()) return null;
  const match = text.match(SLASH_RE);
  if (!match) return null;
  const raw     = match[1].toLowerCase().trim();
  const command = ALIAS_MAP[raw];
  const args    = (match[2] ?? '').trim();
  const argMode = COMMAND_ARG_MODE[command];
  if (argMode === 'required' && !args)
    return { error: `/${raw} requires an argument. Example: /${raw} ${_EXAMPLE[command]}` };
  if (argMode === 'none' && args)
    return { error: `/${raw} does not accept arguments.` };
  return { full: match[0], command, args };
}

// ─── Tool Stream ──────────────────────────────────────────────────────────────

async function callToolStream(env, command, args) {
  const EMPTY = { displayStream: null, injectText: '' };
  if (!env.TOOLS_WORKER) return EMPTY;
  let res;
  try {
    res = await withTimeout(
      env.TOOLS_WORKER.fetch('http://internal/api/tools/invoke', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ command, args }),
      }),
      SB_TIMEOUT_MS
    );
  } catch { return EMPTY; }
  if (!res?.body) return EMPTY;
  let rawText;
  try { rawText = await res.text(); } catch { return EMPTY; }

  const enc = new TextEncoder();
  const displayChunks = [];
  let injectText = '';

  for (const event of rawText.split('\n\n')) {
    if (!event.trim()) continue;
    const dataLine = event.split('\n').find(l => l.startsWith('data: '));
    if (!dataLine) continue;
    const raw = dataLine.slice(6).trim();
    if (raw === '[tools:DONE]') continue;
    let parsed;
    try { parsed = JSON.parse(raw); } catch { continue; }
    if (parsed._inject !== undefined) { injectText = parsed._inject || ''; continue; }
    displayChunks.push(enc.encode(`data: ${JSON.stringify(parsed)}\n\n`));
  }

  const displayStream = displayChunks.length > 0
    ? new ReadableStream({ start(ctrl) { for (const c of displayChunks) ctrl.enqueue(c); ctrl.close(); } })
    : null;
  return { displayStream, injectText };
}

// ─── Inline Injection ─────────────────────────────────────────────────────────

function injectToolInline(messages, commandFull, injectText) {
  if (!injectText) return;
  const idx = messages.findLastIndex(m => m.role === 'user');
  if (idx === -1) return;
  const msg = messages[idx];
  if (typeof msg.content !== 'string') return;
  messages[idx] = { ...msg, content: msg.content.replace(commandFull, `\n${injectText}\n`) };
}

// ─── Chunk Stripper ───────────────────────────────────────────────────────────

const ROOT_STRIP = new Set(['object', 'created', 'system_fingerprint', 'service_tier']);

function stripChunk(parsed) {
  for (const f of ROOT_STRIP) delete parsed[f];
  delete parsed.usage;
  if (!Array.isArray(parsed.choices)) {
    if (parsed.error) return parsed;
    return null;
  }

  const filtered = [];
  for (const choice of parsed.choices) {
    delete choice.index;
    if (choice.finish_reason === null || choice.finish_reason === undefined) {
      delete choice.finish_reason;
    }
    if (choice.delta && typeof choice.delta === 'object') {
      delete choice.delta.role;
      if (choice.delta.content === '')          delete choice.delta.content;
      if (choice.delta.reasoning === '')        delete choice.delta.reasoning;
      if (choice.delta.reasoning_content === '') delete choice.delta.reasoning_content;
    }
    const deltaKeys       = Object.keys(choice.delta ?? {}).length;
    const hasFinishReason = choice.finish_reason != null;
    if (deltaKeys === 0 && !hasFinishReason) continue;
    filtered.push(choice);
  }

  if (filtered.length === 0 && !parsed.error) return null;
  parsed.choices = filtered;
  return parsed;
}

// ─── SSE Sanitizer + Real Tokenizer ──────────────────────────────────────────
//
// Token count priority (most → least accurate):
//   1. Upstream usage chunk  — Nano sends a final SSE chunk with usage field.
//                              Captured here BEFORE stripChunk removes it.
//                              Fields checked: prompt_tokens, completion_tokens,
//                              reasoning_tokens | thinking_tokens | reasoning_completion_tokens
//   2. gpt-tokenizer fallback — encode() on the accumulated output/reasoning text.
//                               Used when upstream didn't send a usage chunk.
//   3. Pre-call inputTokens  — countInputTokens() via gpt-tokenizer on the messages
//                               array. Used for inputTokens when upstream usage
//                               doesn't include prompt_tokens.
//
// v2.9: estimateTokens() removed. All token counts are now exact BPE counts.

function sanitizeUpstreamStream(rawStream, completionId, onUsage, inputTokens, inputPrice, outputPrice) {
  const decoder    = new TextDecoder();
  const encoder    = new TextEncoder();
  let   buffer     = '';
  let   usageFired = false;
  let   errCount   = 0;
  const idOverride = completionId != null ? String(completionId) : null;

  // Accumulated streaming text — used as fallback if upstream skips the usage chunk
  let outputText    = '';
  let reasoningText = '';

  // Upstream usage chunk — populated if Nano sends it (highest accuracy)
  let upstreamInput     = null; // prompt_tokens from upstream
  let upstreamOutput    = null; // completion_tokens from upstream
  let upstreamReasoning = null; // reasoning_tokens from upstream

  function fireUsage() {
    if (usageFired) return;
    usageFired = true;

    // Prefer upstream counts; fall back to gpt-tokenizer on accumulated text
    const finalInput     = upstreamInput     ?? inputTokens;
    const finalOutput    = upstreamOutput    ?? encodeLen(outputText);
    const finalReasoning = upstreamReasoning ?? encodeLen(reasoningText);

    const totalCost = calcTotalCost(finalInput, finalOutput, finalReasoning, inputPrice, outputPrice);
    try { onUsage({ inputTokens: finalInput, outputTokens: finalOutput, reasoningTokens: finalReasoning, totalCost }); } catch { /* no-op */ }
  }

  function processChunk(raw, ctrl) {
    if (raw === '[DONE]') {
      fireUsage();
      ctrl.enqueue(encoder.encode('data: [DONE]\n\n'));
      return;
    }

    let parsed;
    try { parsed = JSON.parse(raw); } catch {
      errCount++;
      logWarn('sanitize', 'Malformed SSE chunk, dropping', { preview: raw.slice(0, 120), errCount });
      return;
    }

    // ── Capture upstream usage BEFORE stripChunk removes it ──────────────────
    // Nano sends a final usage chunk: { usage: { prompt_tokens, completion_tokens, ... } }
    // Some models also include reasoning_tokens / thinking_tokens.
    if (parsed.usage && typeof parsed.usage === 'object') {
      const u = parsed.usage;
      const pt = Number(u.prompt_tokens);
      const ct = Number(u.completion_tokens);
      const rt = Number(
        u.reasoning_tokens             ??
        u.thinking_tokens              ??
        u.reasoning_completion_tokens  ??
        NaN
      );
      if (Number.isFinite(pt) && pt >= 0) upstreamInput     = pt;
      if (Number.isFinite(ct) && ct >= 0) upstreamOutput    = ct;
      if (Number.isFinite(rt) && rt >= 0) upstreamReasoning = rt;
    }

    // ── Accumulate delta text for gpt-tokenizer fallback ─────────────────────
    if (Array.isArray(parsed.choices)) {
      for (const choice of parsed.choices) {
        const d = choice.delta;
        if (!d) continue;
        if (typeof d.content === 'string' && d.content)
          outputText += d.content;
        if (typeof d.reasoning === 'string' && d.reasoning)
          reasoningText += d.reasoning;
        if (typeof d.reasoning_content === 'string' && d.reasoning_content)
          reasoningText += d.reasoning_content;
      }
    }

    if (idOverride !== null) parsed.id = idOverride;
    delete parsed.model;

    const stripped = stripChunk(parsed);
    if (stripped === null) return;

    ctrl.enqueue(encoder.encode(`data: ${JSON.stringify(stripped)}\n\n`));
  }

  return rawStream.pipeThrough(new TransformStream({
    transform(chunk, ctrl) {
      buffer += decoder.decode(chunk, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';
      for (const part of parts) {
        if (!part.trim()) continue;
        const dataLine = part.split('\n').find(l => l.startsWith('data: '));
        if (!dataLine) {
          ctrl.enqueue(encoder.encode(part + '\n\n'));
          continue;
        }
        processChunk(dataLine.slice(6).trim(), ctrl);
      }
    },
    flush(ctrl) {
      if (buffer.trim()) {
        const dataLine = buffer.split('\n').find(l => l.startsWith('data: '));
        if (dataLine) processChunk(dataLine.slice(6).trim(), ctrl);
      }
      fireUsage();
      if (errCount > 0) {
        logWarn('sanitize', 'Stream completed with dropped chunks', { errCount });
      }
    },
  }));
}

// ─── SSE Keepalive Wrapper ────────────────────────────────────────────────────

const KEEPALIVE_MS   = 8_000;
const KEEPALIVE_PING = new TextEncoder().encode(': ping\n\n');

function wrapWithKeepalive(sourceStream) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  (async () => {
    const reader = sourceStream.getReader();
    let   timer  = null;
    let   closed = false;

    function clearTimer() {
      if (timer !== null) { clearInterval(timer); timer = null; }
    }

    function startTimer() {
      clearTimer();
      if (closed) return;
      timer = setInterval(async () => {
        if (closed) { clearTimer(); return; }
        try { await writer.write(KEEPALIVE_PING); }
        catch { clearTimer(); }
      }, KEEPALIVE_MS);
    }

    startTimer();

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        await writer.write(value);
        startTimer();
      }
      closed = true;
      clearTimer();
      writer.close().catch(() => {});
    } catch (e) {
      closed = true;
      clearTimer();
      try { await writer.write(sseErrChunk(e?.message || 'Stream error.')); } catch { /* closed */ }
      writer.close().catch(() => {});
    } finally {
      closed = true;
      clearTimer();
      reader.releaseLock();
    }
  })();

  return readable;
}

// ─── Stream Concatenation ─────────────────────────────────────────────────────

function concatStreams(streamA, streamB) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  (async () => {
    const streams = [streamA, streamB].filter(Boolean);
    let currentReader = null;

    try {
      for (const stream of streams) {
        currentReader = stream.getReader();
        try {
          for (;;) {
            const { done, value } = await currentReader.read();
            if (done) break;
            await writer.write(value);
          }
        } finally {
          currentReader.releaseLock();
          currentReader = null;
        }
      }
      writer.close().catch(() => {});
    } catch (e) {
      if (currentReader) {
        try { currentReader.releaseLock(); } catch { /* already released */ }
      }
      try { await writer.write(sseErrChunk(e?.message || 'Stream error.')); } catch { /* closed */ }
      writer.close().catch(() => {});
    }
  })();

  return readable;
}

function emptyStream() {
  return new ReadableStream({ start(c) { c.close(); } });
}

// ─── Body Validation ──────────────────────────────────────────────────────────

function validateRequestBody(bodyObj) {
  if (!bodyObj || typeof bodyObj !== 'object') return 'Invalid request body.';
  if (!bodyObj.model || typeof bodyObj.model !== 'string' || bodyObj.model.trim() === '')
    return 'Missing or empty "model" field.';
  if (!Array.isArray(bodyObj.messages) || bodyObj.messages.length === 0)
    return 'Missing or empty "messages" array.';
  const last = bodyObj.messages[bodyObj.messages.length - 1];
  if (!last || !last.role) return 'Last message is missing the "role" field.';
  return null;
}

// ─── Upstream Error Extraction ────────────────────────────────────────────────

async function extractUpstreamError(upstream) {
  try { await upstream.body?.cancel(); } catch { /* no-op */ }
  let raw = '';
  if (!upstream.headers.get('content-type')?.includes('text/event-stream')) {
    try {
      const clone = upstream.clone?.();
      if (clone) raw = (await clone.text().catch(() => '')).slice(0, 500);
    } catch { /* no-op */ }
  }
  return { msg: 'Bad request.', raw };
}

// ─── Main Proxy Handler ───────────────────────────────────────────────────────

async function handleProxy(req, env, ctx) {
  const ip   = req.headers.get('CF-Connecting-IP') || '';
  const ua   = req.headers.get('User-Agent') || '';
  const rid  = crypto.randomUUID().slice(0, 8);
  const lctx = `proxy:${rid}`;

  const apiKey = extractApiKey(req);
  if (!apiKey) return jsonErr('Missing API key. Set the Authorization: Bearer <key> header.', 401);

  let bodyText;
  try {
    bodyText = await req.text();
    if (bodyText.length > MAX_BODY_BYTES)
      return jsonErr(`Request body too large (${Math.round(bodyText.length / 1024)}KB > ${MAX_BODY_BYTES / 1024}KB limit).`, 413);
  } catch { return jsonErr('Failed to read request body.', 400); }

  let bodyObj;
  try { bodyObj = JSON.parse(bodyText); }
  catch { return jsonErr('Invalid JSON in request body.', 400); }

  const validationErr = validateRequestBody(bodyObj);
  if (validationErr) return jsonErr(validationErr, 400);

  const rawModel              = String(bodyObj.model || '');
  const { modelName, effort } = parseModelSuffix(rawModel);

  const messages = Array.isArray(bodyObj.messages) ? bodyObj.messages : [];
  const slash    = parseSlashCommand(messages);
  if (slash?.error) {
    logWarn(lctx, 'slash_arg_error', { err: slash.error });
    return jsonErr(slash.error, 400);
  }

  let toolDisplayStream = null;
  if (slash) {
    logInfo(lctx, 'tool_detected', { cmd: slash.command, args: slash.args });
    const { displayStream, injectText } = await callToolStream(env, slash.command, slash.args);
    toolDisplayStream = displayStream;
    if (slash.command === 'help') return sseResponse(displayStream || emptyStream());
    if (injectText) {
      injectToolInline(bodyObj.messages, slash.full, injectText);
      logInfo(lctx, 'tool_injected', { cmd: slash.command, bytes: injectText.length });
    } else {
      logWarn(lctx, 'tool_no_inject', { cmd: slash.command });
    }
  }

  const cfMeta = extractCfMeta(req);

  const auth = await callAuthorize(env, apiKey, modelName, effort, ip, cfMeta, ua);
  if (!auth?.ok) {
    logWarn(lctx, 'auth_failed', { err: auth?.error });
    const errStr = String(auth?.error || '');
    const isRate = errStr.toLowerCase().includes('rate');

    // Session 24: handle insufficient_balance
    if (auth?.code === 'no_balance' || errStr === 'insufficient_balance') {
      return jsonErr(auth?.message || 'Insufficient PAYGO balance. Please top up.', 402);
    }

    if (isRate) {
      let retryAfterSec = auth.retry_after ?? null;
      if (!retryAfterSec && auth.reset_time)
        retryAfterSec = Math.max(1, Math.ceil((auth.reset_time - Date.now()) / 1000));
      if (!retryAfterSec && auth.retryAfter)
        retryAfterSec = Math.max(1, Math.ceil((auth.retryAfter - Date.now()) / 1000));
      if (!retryAfterSec || retryAfterSec < 1) retryAfterSec = 30;
      const resetAt   = new Date(Date.now() + retryAfterSec * 1000).toISOString();
      const humanTime = retryAfterSec >= 60
        ? `${Math.ceil(retryAfterSec / 60)} minutes` : `${retryAfterSec} seconds`;
      logWarn(lctx, 'rate_limited', { retry_after: retryAfterSec, reset_at: resetAt });
      return jsonErr(`Rate limited. Please try again in ${humanTime} (${resetAt}).`, 429, {
        retry_after: retryAfterSec, reset_at: resetAt,
      });
    }

    const authMsg  = auth?.message || errStr || 'Unauthorized.';
    const authCode = auth?.code || '';
    return jsonErr(authMsg, 403, authCode ? { code: authCode } : {});
  }

  // v2.7: capture billable flags from auth
  const billable      = !!auth.billable;
  const paygoDiscount = Number(auth.paygoDiscount) || 0;

  // v2.8: capture per-token prices from auth (USD per 1M tokens)
  // worker-account authorize must return these from the models table
  const inputPrice  = Number(auth.inputPrice)  || 0;
  const outputPrice = Number(auth.outputPrice) || 0;

  const provider    = auth.provider || 'nano1';
  const keyBinding  = PROVIDERS[provider];
  const providerKey = keyBinding ? env[keyBinding] : null;
  if (!providerKey) {
    logCritical(lctx, 'missing_provider_key', { provider });
    return jsonErr('Provider configuration error. Please contact support.', 503);
  }

  const isThinkingModel = THINKING_MODELS.has(modelName) || effort === 'high';
  if (!isThinkingModel) {
    await new Promise(r => setTimeout(r, GRACE_MS));
  }

  const reasoningPatch = effort ? { reasoning_effort: effort } : {};
  const upstreamBody   = JSON.stringify({
    ...bodyObj,
    ...reasoningPatch,
    model:  auth.backendModel || modelName,
    stream: true,
  });

  // v2.9: countInputTokens now uses gpt-tokenizer (real BPE counts)
  const inputTokens = countInputTokens(bodyObj.messages);

  const [upstream, completionId] = await Promise.all([
    fetchWithRetry(
      `${NANO_BASE}/chat/completions`,
      {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${providerKey}`,
          'x-whitelabel':  'true',   // v2.8 — white-label: hide our identity from Nano
        },
        body: upstreamBody,
      }
    ).catch(e => ({ _error: e })),
    callNextCompletionId(env),
  ]);

  if (upstream._error) {
    const e = upstream._error;
    logError(lctx, 'upstream_error', { err: e.message, name: e.name });
    if (e.name === 'AbortError') return jsonErr('Request timed out. The model took too long to respond.', 504);
    return jsonErr('Upstream connection error. Please try again.', 502);
  }

  if (!upstream.ok) {
    const { msg, raw } = await extractUpstreamError(upstream);
    logError(lctx, 'upstream_bad_status', { status: upstream.status, raw: raw.slice(0, 200) });
    if (upstream.status >= 400 && upstream.status < 500) {
      return jsonErr(msg, upstream.status);
    }
    return jsonErr(msg, 502);
  }

  let resolveTokens;
  const tokenPromise = new Promise(resolve => { resolveTokens = resolve; });

  // v2.7+v2.8: billable + paygoDiscount + totalCost forwarded to record-tokens
  fireRecordTokens(ctx, env, apiKey, modelName, effort, ip, tokenPromise, billable, paygoDiscount);

  logInfo(lctx, 'proxied', {
    model:        modelName,
    effort:       effort || '(none)',
    provider,
    hasTool:      !!slash,
    inputTokens,
    completionId: completionId ?? '(upstream-id)',
    billable,
    inputPrice,
    outputPrice,
  });

  // v2.8: pass pricing into sanitizer so totalCost is computed when stream ends
  // v2.9: sanitizer now captures upstream usage chunk + falls back to gpt-tokenizer
  const cleanStream  = sanitizeUpstreamStream(upstream.body, completionId, resolveTokens, inputTokens, inputPrice, outputPrice);
  const mergedStream = toolDisplayStream
    ? concatStreams(toolDisplayStream, cleanStream)
    : cleanStream;

  const finalStream = wrapWithKeepalive(mergedStream);

  return sseResponse(finalStream);
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

const MODEL_ROUTES       = new Set(['/models', '/v1/models', '/api/models', '/api/v1/models']);
const ADMIN_MODEL_ROUTES = new Set(['/admin/models', '/v9/admin/models']);

export default {
  async fetch(req, env, ctx) {
    const { pathname } = new URL(req.url);
    const method = req.method;

    if (method === 'OPTIONS') return corsOk();

    if (method === 'GET' && MODEL_ROUTES.has(pathname))
      return forwardToModels(env, req);

    if (ADMIN_MODEL_ROUTES.has(pathname) && (method === 'POST' || method === 'DELETE'))
      return forwardToModels(env, req);

    if (method === 'POST')
      return handleProxy(req, env, ctx);

    return jsonErr('Not found.', 404);
  },
};
