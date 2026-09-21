# proxychat — ZeikoAI landing page

A static one-page site for the ZeikoAI API: three roleplay models behind an
OpenAI-compatible endpoint, three pricing bands, USDT invoicing.

This repository holds the page only. The old Cloudflare worker that used to live
here was removed from `main`; it is still in git history if it is ever needed
(`git log --all`, commit `c2df3f7` and earlier).

## Layout

```
public/
  index.html     one page: hero, features, models, pricing, code samples, FAQ, contact
  css/style.css  colour tokens for light and dark
  js/main.js     theme toggle, mobile menu, code tabs, copy button
wrangler.jsonc   served as Cloudflare Workers static assets
```

No build step, no CDN, no framework. Open `public/index.html` straight from disk
and the page is already complete.

## Run locally

```bash
npx wrangler dev          # http://localhost:8787
# or without wrangler:
python3 -m http.server -d public 8080
```

## Deploy

```bash
npx wrangler deploy
```

Change `name` in `wrangler.jsonc` if the worker is called something else, then
attach a custom domain from the Cloudflare dashboard.

## Still to fill in

- **Contact** in the "Request a key" section is still `hello@example.com` —
  replace it in `public/index.html` before the page is shared.
- **Base URL** in the code samples is still `https://api.your-domain.com` —
  replace it with the hostname actually handed to callers.
- If rates change, update both the `#pricing` table and the model cards.
