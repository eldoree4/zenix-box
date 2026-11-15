# Zenix Box — Premium UI preview

Aplikasi React Native + Expo untuk Android dan iOS dengan onboarding, katalog tools AI, studio pratinjau, proyek sesi, profil, dan halaman Zenix Pro.

## Jalankan

```sh
npm install
npx expo start
```

## Flow aplikasi

- **Onboarding** ditampilkan saat dibuka; pengguna bisa memilih Mulai atau Lewati.
- **Beranda / Jelajahi** menampilkan katalog, pencarian, filter, dan CTA memilih media.
- **Studio Preview** membuka galeri foto/video berdasarkan kategori tool, menyediakan kontrol intensitas demo.
- **Proyek** menampilkan draft preview selama aplikasi tetap terbuka.
- **Zenix Pro** menampilkan manfaat dan status segera hadir; pembayaran tidak aktif.
- **Profil** menyediakan informasi privasi, bantuan, serta versi.

## Catatan rilis

Ini adalah prototype UI. Tombol proses hanya membuat draft lokal sementara, bukan hasil AI. Tidak ada upload media, pemrosesan AI nyata, ekspor galeri, penyimpanan persisten, atau pembelian aktif. Sebelum rilis, hubungkan backend yang aman, implementasikan fitur yang dipasarkan, tambahkan penyimpanan dan billing sesuai kebijakan store, serta lengkapi privacy policy dan metadata toko.

Konfigurasi EAS dan build awal tersedia pada `app.config.js`, `eas.json`, dan `docs/STORE_RELEASE_CHECKLIST.md`.
