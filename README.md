# Zenix Box

Aplikasi mobile Android dan iOS untuk pengalaman studio foto/video AI, dibangun dengan Expo, React Native, dan TypeScript.

## Fitur yang tersedia

- Beranda berbahasa Indonesia dengan katalog tools AI dan filter kategori.
- Pilih foto/video dari galeri menggunakan Expo Image Picker.
- Layar studio dengan pratinjau media, kontrol intensitas visual, serta status demo.
- Navigasi Beranda, Jelajahi, Proyek, dan Saya.
- Katalog AI 4K, Retouch, Face Enhancer, Removal, Color Enhancer, Image Extender, AI Styles, AI Live, Video Collage, Stabilizer, Video Makeup, dan Video Editor.

## Jalankan aplikasi

1. Pasang Node.js LTS dan Expo Go pada perangkat, atau siapkan Android Studio/Xcode.
2. Jalankan `npm install`.
3. Jalankan `npx expo start`.
4. Pindai QR dengan Expo Go, atau tekan `a` untuk Android dan `i` untuk iOS.

## Catatan implementasi

Studio saat ini adalah prototipe UI interaktif. Tombol pratinjau hanya memperagakan status proses; pemrosesan AI sungguhan, penyimpanan hasil, autentikasi, dan fitur berlangganan belum aktif. Integrasikan backend/model AI pilihan sebelum mengiklankan hasil sebagai pemrosesan nyata. Untuk build native, gunakan EAS Build atau Xcode/Android Studio setelah memasang dependensi.
