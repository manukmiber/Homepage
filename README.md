# Zeiko site

The public Zeiko website, for Zeiko's cloud products: Zeiko Sites, Zeiko
Hosting, Zeiko VPS and Zeiko Drive, priced in rupiah, and the Zeiko Account
where they are ordered.

- `/` asks what you want to put online and answers with the four products,
  each with its starting price, then how ordering works, what comes with
  every product, a FAQ and WhatsApp.
- `/sites`, `/hosting`, `/vps` and `/drive` are the product pages: what each
  one does, every plan and its price, the way from order to online, and a
  FAQ. Drive's plans come from Drive's own catalog.
- `/status` shows whether each service answers, and `/marketing-template`
  the price sheets to download.
- `/docs` is the guides: the Zeiko Account, Zeiko Hosting and Zeiko Drive.
  Plain pages, one per topic.
- `/account` is the Zeiko Account: one account for every product (email and
  password, Google or GitHub), where hosting, a VPS and websites are ordered,
  paid by QRIS, renewed and run. A plain page whose script asks the account
  door (`https://auth.zeiko.biz.id`) itself: the site keeps no sign-in and no
  setting for it.

Every page is in English and Indonesian (`/id/…`), in a light and a dark
scheme. The look is written down in [DESIGN.md](DESIGN.md); the logo files
are in [brand/zeiko](brand/zeiko).

**Read [CLAUDE.md](CLAUDE.md) before changing anything.** It lists what the
site must never show, and every place a price has to be updated.

## Layout

```
public/
  index.html      the homepage
  sites.html, hosting.html, vps.html, drive.html, status.html, marketing-template.html
  404.html
  id/             every page above in Indonesian
  _redirects      old addresses → their new place
  css/site.css    the stylesheet, light and dark (css/style.css: the account area's, for now)
  js/main.js      theme, language, header, copy buttons
  docs/           /docs, one page per topic
  account/index.html  /account and every page under it (one page)
  js/account/     app.js: asks the account door and draws the page; views.js: the pages;
                  session.js: the top bar's "who is signed in" on every page
src/
  worker.js       runs for /, /drive, /status and /account, and for a 404
  drive.js        Drive's catalog → its plans and lowest price
  status.js       the status document → /status
scripts/
  check-site.mjs  npm run check
```

Every other path is a plain static file. The worker fills a few pages in on
the way out, so the browser receives finished HTML and never asks for a data
file.

## Run locally

```bash
npm install
npx wrangler dev          # http://localhost:8787
```

Every page with the top bar asks the account door who is signed in, and
shows their name in place of "Sign in".

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
anywhere else, confirms that each price reads the same everywhere it
appears, and that every guide link and EN | ID switch lands. It renders
/status, Zeiko S3's lines and the account pages from made-up data to the
same rules. The account area's files are the only ones that may make a
request, and only to the account door. Run it before every commit; `npm run
deploy` runs it first and stops if it fails.

## Deploy

```bash
npm run deploy
```

The `zeiko-models` R2 bucket (it holds the status document) must exist
before a deploy, because the worker binds to it.
