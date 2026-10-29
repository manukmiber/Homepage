// Made-up content for every Zeiko Sites template, the way a person would fill
// the editor in: Indonesian, of realistic length, some entries without a
// picture. Every name, number and address is invented; links go to
// example.com. Pictures are placeholders that dev/sites-preview.mjs draws:
// a name ending in -WxH (img/sampul-16x9.svg) is drawn at that shape.

const WA = '0812 0000 0000';

export const SAMPLES = {
  homepage: {
    title: 'SMA Pelita Contoh',
    tagline: 'Sekolah menengah atas di Kota Contoh, sejak 1987',
    about: 'SMA Pelita Contoh adalah sekolah negeri dengan 24 rombongan belajar, 760 siswa dan 52 guru. Kami percaya setiap anak punya caranya sendiri untuk tumbuh, dan sekolah adalah tempat mencoba.\n\nPendaftaran peserta didik baru dibuka setiap Juni. Hubungi kami lewat WhatsApp untuk jadwal kunjungan sekolah.',
    logo: 'img/logo-1x1.svg',
    cover: 'img/sampul-16x9.svg',
    contact: { whatsapp: WA, phone: '021 0000 0000', email: 'halo@example.com', address: 'Jl. Contoh Raya No. 1, Kota Contoh', maps: 'https://example.com/peta', instagram: 'https://example.com/instagram' },
    items: [
      { title: 'Visi dan misi', text: 'Menjadi sekolah yang membentuk pelajar berkarakter, berprestasi, dan peduli lingkungan.\n\nKami menjalankannya lewat pembelajaran proyek, kegiatan sosial setiap semester, dan kebun sekolah yang dirawat setiap kelas.' },
      { title: 'Program unggulan', text: 'Kelas sains terapan, klub robotik, dan pendampingan masuk perguruan tinggi sejak kelas XI.', image: 'img/program-4x3.svg' },
      { title: 'Ekstrakurikuler', text: 'Pramuka, PMR, paskibra, basket, futsal, paduan suara, teater, jurnalistik, dan English club.', image: 'img/ekskul-3x2.svg' },
      { title: 'Fasilitas', text: 'Perpustakaan, tiga laboratorium, lapangan olahraga, masjid, ruang musik, dan Wi-Fi di setiap kelas.' },
    ],
  },
  gallery: {
    title: 'Buku Tahunan XII IPA 2',
    tagline: 'Angkatan 2026, SMA Pelita Contoh',
    about: 'Tiga tahun, tiga puluh enam orang, satu kelas yang tidak akan kami lupakan.',
    logo: 'img/kelas-1x1.svg',
    contact: { instagram: 'https://example.com/instagram' },
    items: [
      { image: 'img/foto1-3x4.svg', title: 'Hari pertama MPLS', text: 'Juli 2023, masih malu-malu.' },
      { image: 'img/foto2-4x3.svg', title: 'Study tour ke Contoh Tengah' },
      { image: 'img/foto3-1x1.svg', title: 'Juara 2 lomba mading', text: 'Dua minggu begadang demi satu papan.' },
      { image: 'img/foto4-16x9.svg', title: 'Pentas seni', text: 'Lagu penutup yang bikin satu aula ikut bernyanyi.' },
      { image: 'img/foto5-3x4.svg', title: 'Wali kelas kami, Bu Contoh' },
      { image: 'img/foto6-4x3.svg', title: 'Foto terakhir sebelum ujian', text: 'Semua lengkap, satu kali ini saja.', link: 'img/foto6-4x3.svg' },
    ],
  },
  links: {
    title: 'Rara Contoh',
    tagline: 'Ilustrator dan pembuat stiker. Terima pesanan desain custom.',
    logo: 'img/rara-1x1.svg',
    contact: { whatsapp: WA, email: 'rara@example.com' },
    items: [
      { title: 'Lihat portofolio', link: 'https://example.com/portofolio' },
      { title: 'Toko stiker', link: 'https://example.com/toko' },
      { title: 'Instagram', link: 'https://example.com/instagram' },
      { title: 'TikTok: proses menggambar', link: 'https://example.com/tiktok' },
      { title: 'Daftar harga desain custom (PDF)', link: 'harga.pdf' },
    ],
  },
  news: {
    title: 'OSIS SMP Contoh 4',
    tagline: 'Kabar kegiatan OSIS, ekskul dan kelas',
    about: 'Semua kegiatan OSIS periode 2026/2027 kami tulis di sini. Ada usul kegiatan? Kirim lewat WhatsApp.',
    cover: 'img/osis-16x9.svg',
    contact: { whatsapp: WA, instagram: 'https://example.com/instagram' },
    items: [
      { date: '28 Oktober 2026', title: 'Upacara Sumpah Pemuda dan lomba pidato', text: 'Upacara dipimpin kelas IX B. Setelahnya, dua belas peserta lomba pidato membawakan tema "Bahasa yang menyatukan". Juara pertama diraih Dinda dari kelas VIII A.', image: 'img/upacara-3x2.svg' },
      { date: '14 Oktober 2026', title: 'Classmeeting tengah semester', text: 'Futsal, tarik tambang, dan cerdas cermat selama tiga hari. Terima kasih untuk panitia dan semua suporter.' },
      { date: '2 Oktober 2026', title: 'Pendaftaran ekskul dibuka', text: 'Formulir ada di ruang OSIS sampai 9 Oktober. Setiap siswa boleh memilih dua ekskul.\n\nJadwal latihan diumumkan minggu berikutnya.' },
      { date: '20 September 2026', title: 'Pelantikan pengurus OSIS baru', image: 'img/pelantikan-4x3.svg' },
    ],
  },
  invite: {
    title: 'Wisuda dan Perpisahan Kelas XII',
    tagline: 'SMA Pelita Contoh, angkatan 2026',
    about: 'Dengan hormat, kami mengundang Bapak, Ibu, dan Saudara untuk hadir di acara wisuda dan perpisahan siswa kelas XII.\n\nKehadiranmu adalah hadiah terbaik untuk mereka.',
    cover: 'img/aula-3x2.svg',
    contact: { whatsapp: WA },
    event: { date: 'Sabtu, 12 Desember 2026', time: '08.00 – 12.00 WIB', place: 'Aula SMA Pelita Contoh, Jl. Contoh Raya No. 1', maps: 'https://example.com/peta' },
    items: [
      { date: '08.00', title: 'Pembukaan dan sambutan', text: 'Kepala sekolah dan ketua komite.' },
      { date: '08.45', title: 'Prosesi wisuda' },
      { date: '10.30', title: 'Pentas seni kelas XII', text: 'Paduan suara, tari, dan film angkatan.' },
      { date: '11.30', title: 'Foto bersama dan ramah tamah' },
    ],
  },
  catalog: {
    title: 'Dapur Bu Contoh',
    tagline: 'Kue kering dan camilan rumahan, pesan H-2',
    about: 'Semua dibuat sendiri di rumah, tanpa pengawet. Pengiriman di dalam Kota Contoh, atau ambil sendiri.',
    logo: 'img/dapur-1x1.svg',
    contact: { whatsapp: WA, address: 'Perumahan Contoh Blok C-7, Kota Contoh', maps: 'https://example.com/peta', instagram: 'https://example.com/instagram' },
    items: [
      { image: 'img/nastar-1x1.svg', title: 'Nastar keju', price: 'Rp85.000 / toples 500 g', text: 'Selai nanas buatan sendiri.' },
      { image: 'img/kastengel-1x1.svg', title: 'Kastengel', price: 'Rp90.000 / toples 500 g' },
      { image: 'img/putri-salju-4x3.svg', title: 'Putri salju', price: 'Rp75.000', text: 'Lembut, gula halus tebal.' },
      { title: 'Paket hampers lebaran isi 4 toples kecil dengan kartu ucapan', price: 'Rp250.000', text: 'Pilih empat rasa. Pesan paling lambat seminggu sebelumnya.' },
      { image: 'img/brownies-3x2.svg', title: 'Brownies panggang', price: 'Rp60.000 / loyang' },
      { image: 'img/keripik-1x1.svg', title: 'Keripik pisang cokelat', price: 'Rp25.000' },
    ],
  },
  library: {
    title: 'Perpustakaan Digital SD Contoh',
    tagline: 'Buku cerita, modul, dan lembar kerja untuk dibaca di rumah',
    about: 'Semua buku boleh dibaca dan diunduh gratis oleh siswa dan orang tua.',
    contact: { whatsapp: WA, email: 'perpus@example.com' },
    items: [
      { image: 'img/buku1-2x3.svg', title: 'Si Kancil dan Buaya', text: 'Cerita rakyat bergambar, kelas 1–2.', link: 'buku/kancil.pdf' },
      { image: 'img/buku2-2x3.svg', title: 'Ayo Berhitung 1', text: 'Modul matematika kelas 1.', link: 'buku/berhitung-1.pdf' },
      { title: 'Lembar kerja IPAS: siklus air', text: 'Kelas 4, untuk dikerjakan di rumah.', link: 'buku/ipas-siklus-air.pdf' },
      { image: 'img/buku3-2x3.svg', title: 'Atlas Indonesia untuk anak', text: 'Peta 38 provinsi dengan cerita singkat.', link: 'buku/atlas.pdf' },
      { image: 'img/buku4-2x3.svg', title: 'Kumpulan puisi kelas 6', text: 'Karya siswa, tahun ajaran 2025/2026.', link: 'buku/puisi-kelas-6.pdf' },
      { image: 'img/buku5-2x3.svg', title: 'Belajar Membaca Huruf Hijaiyah', link: 'buku/hijaiyah.pdf' },
    ],
  },
};
