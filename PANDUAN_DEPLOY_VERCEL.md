# Deploy DesaMudah ke Vercel (bisa dibuka di HP)

## Cara 1 - Lewat GitHub (disarankan)
1. Buat repo baru di github.com, lalu upload SEMUA isi folder ini
   (jangan upload `node_modules` dan `dist`; sudah diatur di `.gitignore`).
2. Buka vercel.com -> Add New -> Project -> pilih repo tadi -> Import.
3. Pengaturan terdeteksi otomatis (Framework: Vite, Build: `npm run build`, Output: `dist`).
   Klik **Deploy**.
4. Setelah selesai, Anda dapat link `https://nama-proyek.vercel.app`.
   Buka link itu di HP.

## Cara 2 - Lewat Vercel CLI
```
npm i -g vercel
cd folder-proyek
vercel          # percobaan
vercel --prod   # rilis
```

## Uji lokal sebelum deploy
```
npm install
npm run build     # harus selesai tanpa error
npm run preview
```
Saat `npm run dev`, HP di Wi-Fi yang sama bisa membuka `http://IP-LAPTOP:3000`.

## Jika layar masih putih di HP
Data lama di browser mungkin rusak. Klik "Reset Data & Muat Ulang" yang muncul,
atau hapus data situs di pengaturan browser.
