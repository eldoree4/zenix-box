# Zenix Box

Aplikasi Android dan iOS berbasis Expo, React Native, dan TypeScript.

## Layar dan fitur

- **Beranda** — pengenalan studio, filter kategori, dan katalog tools.
- **Jelajahi** — pencarian fitur dan filter Foto AI, Restorasi, atau Video.
- **Proyek** — galeri pratinjau sementara selama aplikasi terbuka.
- **Saya** — preferensi dan informasi aplikasi.
- **Studio AI** — pilih foto/video, lihat pratinjau, dan atur intensitas demo.

## Pengembangan lokal

```sh
npm install
npx expo start
```

Gunakan Expo Go untuk uji cepat, atau Android Studio/Xcode untuk pengembangan native. Jalankan `npm run typecheck` untuk pemeriksaan TypeScript.

## Generate build rilis

Konfigurasi EAS tersedia di `eas.json`; panduan credential kosong, konfigurasi identifier, signing, serta persiapan store ada di [`docs/STORE_RELEASE_CHECKLIST.md`](docs/STORE_RELEASE_CHECKLIST.md).

```sh
cp .env.example .env
npx eas-cli@latest build:configure
npm run build:android
npm run build:ios
```

Lengkapi `ANDROID_PACKAGE` dan `IOS_BUNDLE_IDENTIFIER` dengan identifier unik yang kamu miliki sebelum build rilis. Kredensial EAS/Google Play/App Store tidak disertakan dan harus dimasukkan secara privat saat diminta oleh tool resmi. Jangan menyimpan secret di source code.

## Batasan produk saat ini

Ini adalah prototipe UI multi-layar, bukan editor AI produksi. Galeri dapat memilih media dan studio menampilkan pratinjau demo, tetapi pemrosesan AI nyata, ekspor hasil, dan penyimpanan proyek persisten belum diimplementasikan. Jangan menerbitkan klaim pemrosesan AI sebelum backend nyata dan kebijakan privasinya tersedia. Lihat checklist store untuk langkah lanjutan dan catatan kompatibilitas Expo SDK.
