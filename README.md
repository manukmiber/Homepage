# proxychat — landing page ZeikoAI

Halaman statis untuk relay [chtting-relay](https://github.com/manukmiber/Chtting-relay-worker):
API roleplay OpenAI-compatible dengan tiga model, harga tiga pita, dan tagihan USDT.

Isi repo ini **hanya halaman**, tidak ada kode relay. Worker lama (`workers.js`)
sudah dikosongkan dari branch `main`; riwayatnya masih tersimpan di git kalau
suatu saat perlu dilihat lagi (`git log --all`, commit `c2df3f7` ke belakang).

## Isi

```
public/
  index.html     satu halaman: hero, fitur, model, harga, contoh kode, FAQ, kontak
  css/style.css  token warna sama dengan dashboard relay, terang + gelap
  js/main.js     tema, menu mobile, tab contoh kode, tombol salin
wrangler.jsonc   dilayani sebagai Cloudflare Workers static assets
```

Tidak ada build step, tidak ada CDN, tidak ada framework. Buka
`public/index.html` langsung di browser dan halamannya sudah utuh.

## Jalankan lokal

```bash
npx wrangler dev          # http://localhost:8787
# atau tanpa wrangler:
python3 -m http.server -d public 8080
```

## Deploy

```bash
npx wrangler deploy
```

Ganti `name` di `wrangler.jsonc` kalau nama worker-nya beda, lalu pasang custom
domain lewat dashboard Cloudflare.

## Yang masih harus diisi

- **Kontak** di bagian "Minta API key" masih `halo@example.com` — ganti di
  `public/index.html` sebelum halaman dibagikan.
- **Base URL** di contoh kode masih `https://api.contoh-kamu.com` — ganti dengan
  hostname tunnel/domain yang benar-benar dipakai.
- Harga di halaman mengikuti `config/config.example.json` di repo relay. Kalau
  tarifnya berubah, tabel di `#harga` dan kartu model ikut diperbarui.
