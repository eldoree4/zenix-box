# Zenix Box

Aplikasi Android dan iOS berbasis Expo, React Native, dan TypeScript untuk pengalaman studio foto/video AI.

## Yang sudah disiapkan

1. UI/UX production-ready
   - Beranda premium dengan hero section, katalog AI, filter kategori, dan CTA utama.
   - Navigasi multi-screen: Beranda, Jelajahi, Proyek, Saya.
   - Modal studio untuk foto/video dengan kontrol intensitas dan pratinjau demo.
   - State-aware project gallery dan profil settings.

2. Backend AI API placeholder
   - Ekspresi API dengan endpoint untuk info tool, status sistem, dan mock AI process.
   - Variabel environment kosong yang bisa diisi nanti tanpa mempublikasikan credential.

3. Build flow Android + iOS
   - File EAS config `eas.json` dan `app.config.js` siap untuk build lintas platform.
   - Script build lokal dan checklist release store.

4. Store metadata placeholder
   - Folder `store-metadata` berisi template deskripsi Play Store dan App Store.
   - Informasi yang biasanya perlu diisi sebelum publish dibawa ke file terpisah.

## Struktur repositori

- `App.tsx` — aplikasi utama mobile
- `app.config.js` — konfigurasi build Expo
- `eas.json` — profil build EAS
- `server/index.js` — API backend placeholder
- `scripts/` — script build Android/iOS
- `store-metadata/` — metadata publik untuk Play/App Store
- `docs/STORE_RELEASE_CHECKLIST.md` — checklist release dan pengisian credential

## Menjalankan aplikasi

```sh
npm install
npx expo start
```

## Menjalankan backend API

```sh
npm run server
```

Akses default endpoint:

- http://localhost:4000/api/health
- http://localhost:4000/api/tools
- http://localhost:4000/api/ai/process

## Build produksi

```sh
cp .env.example .env
npx eas-cli@latest build:configure
npm run build:android
npm run build:ios
```

## Catatan penting

- Semua credential, ID unik, signing key, App Store Connect key, Google Play service account, dan AI provider key dibiarkan kosong/placeholder.
- Proses AI saat ini adalah mock API; belum terhubung ke model AI nyata.
- Untuk publish resmi ke Google Play dan App Store, isi identifier, privacy policy, icon, screenshots, permission declaration, dan konfigurasi store sesuai ketentuan masing-masing store.
