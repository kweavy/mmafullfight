# Netlify Build Fix untuk MMA Full Fight

## Masalah
Netlify build gagal karena tidak bisa mengakses API eksternal `ufcwallpaper.my.id` saat build time dengan error:
- `TypeError: fetch failed`
- `ConnectTimeoutError: Connect Timeout Error`
- `ECONNREFUSED`

## Solusi yang Diterapkan

### 1. Error Handling dan Timeout
- Menambahkan `try-catch` blocks di semua fungsi yang melakukan fetch
- Menambahkan `AbortSignal.timeout(8000)` untuk timeout 8 detik
- Menambahkan fallback untuk semua API calls yang gagal

### 2. Robust generateStaticParams
- Menggunakan Supabase untuk `generateStaticParams` sebagai gantinya API eksternal
- Menambahkan error handling untuk mencegah build failure
- Fallback ke array kosong jika data tidak tersedia

### 3. Next.js Configuration
- Menambahkan `staticPageGenerationTimeout: 120` di `next.config.js`
- Error handling untuk fetch requests

### 4. Metadata Error Handling
- Menambahkan try-catch di `generateMetadata`
- Fallback metadata jika API call gagal
- Memindahkan `themeColor` dari metadata ke `generateViewport()`

### 5. Environment Variables
- Membuat `.env.example` untuk konfigurasi
- Menambahkan `SKIP_EXTERNAL_API_DURING_BUILD` option

## File yang Dimodifikasi

1. `/app/ufc-wallpaper/search/[query]/page.tsx`
2. `/app/ufc-wallpaper/[slug]/page.tsx`
3. `/app/ufc-wallpaper/page/[page]/page.tsx`
4. `/app/ufc-wallpaper/[slug]/download/page.tsx`
5. `/app/ufc-wallpaper/[slug]/unlock/page.tsx`
6. `/app/download-wallpaper/route.ts`
7. `/app/layout.tsx` (untuk themeColor fix)
8. `/next.config.js`

## Untuk Deploy ke Netlify

Jika masih ada masalah, bisa set environment variable di Netlify:
```
SKIP_EXTERNAL_API_DURING_BUILD=true
```

Ini akan melewati API calls selama build dan mengandalkan client-side rendering untuk data.

## Testing

1. Build lokal: `npm run build`
2. Check build logs untuk error
3. Deploy ke Netlify dan monitor build logs