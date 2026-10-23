# ZeikoAI site

The public ZeikoAI website: the models, their prices, and how each model is
performing.

- `/` is the landing page: Pranata V1 first (hero, what it decides, its
  plans), then the roleplay models, the pricing table, a cost estimator,
  a FAQ, and the two ways to get a key.
- `/models` lists every model with its specs, full rate card and live
  performance: time to first token, output speed, latency, availability,
  requests, tokens and cache rate over 24 hours, 7 days and 30 days, with
  charts. The old `/models/<id>` links redirect to `/models#<id>`.
- `/docs` is the documentation: getting started, the Zeiko Account, the
  playground, Pranata V1, the roleplay models, pricing and plans, and the
  API (basics, decisions, chat, troubleshooting). Plain pages, one per
  topic.
- `/account` is Zeiko Accounts: one account for ZeikoAI and Zeiko Chat
  (email and password, Google or GitHub), and the customer's own area —
  plan and requests left, the one balance, buying plans and balance, payments,
  the key, settings, and the buying guide (`/account/how-to-buy`). A plain page whose script asks the account door
  (`https://auth.zeiko.biz.id`) itself: the site keeps no sign-in and no
  setting for it.

**Read [CLAUDE.md](CLAUDE.md) before changing anything.** It lists what the
site must never show, and every place a price has to be updated.

## Layout

```
public/
  index.html      landing page
  models.html     /models, with placeholders for the performance figures
  404.html
  _redirects      /models/<id> → /models#<id>
  css/style.css   one stylesheet, light and dark
  js/main.js      theme, menu, topbar, copy buttons, plan value, estimator, chart hover
  docs/           /docs, one page per topic
  account/index.html  /account and every page under it (one page)
  js/account/     app.js: asks the account door and draws the page; views.js: the pages;
                  payguide.js: the buying guide; session.js: the top bar's "who is
                  signed in" on every page; me.js: the name and badge both draw
src/
  worker.js       runs for /models and /account only
  render.js       the hourly snapshot → the figures and charts on /models
dev/
  sample-stats.mjs  made-up figures for local development
scripts/
  check-site.mjs  npm run check
```

Every path but `/models` and `/account…` is a plain static file. For `/models`, the worker
reads the hourly snapshot from the `zeiko-models` R2 bucket and renders the
figures into the page before it is sent, so the browser receives finished
HTML and never asks for a data file. If there is no snapshot yet, `/models`
goes out without figures and says they are not available right now.

## Run locally

```bash
npm install
npm run seed:local        # made-up figures into the local bucket
npx wrangler dev          # http://localhost:8787
```

Every page with the top bar asks the same door who is signed in, and shows
their name in place of "Sign in".

`/account` asks the account door named in its `<meta name="zeiko-accounts">`
(and allowed by the page's `connect-src`). The door answers only the site's
own address and the ones its operator adds, so to work on these pages
locally, have it list `http://localhost:8787` and change both places in
`public/account/index.html` to the door you are using — and put them back
before a commit (`npm run check` fails otherwise). Google and GitHub are
set up on the door, not here.

## Check

```bash
npm run check
```

This checks the site for words it must never contain and for requests to
anywhere else, and confirms that each price reads the same everywhere it
appears. It also renders the made-up figures through `src/render.js`, holds
the result to the same rules, and fails if any text from the snapshot would
reach the page, and renders the account pages from a made-up account to the
same rules (money words allowed there). The account area's files are the
only ones that may make a request, and only to the account door. Run it before every commit. `npm run deploy` runs it first
and stops if it fails.

## Deploy

```bash
npm run deploy
```

The `zeiko-models` R2 bucket must exist before a deploy, because the worker
binds to it.
