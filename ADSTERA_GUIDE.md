# Adstera Implementation Guide

## Status Implementasi ✅

Kode Adstera telah diimplementasikan dengan benar sesuai dengan standar Next.js dan dokumentasi Adstera.

## Komponen yang Tersedia

### 1. Popunder (✅ Sudah Diimplementasikan)
- **Lokasi**: `app/layout.tsx` - di dalam `<head>`
- **Fungsi**: 1 popunder per halaman
- **URL**: `//weptnastyturmoil.com/d6/9f/02/d69f02efd7c105444200dd1d7de34ee9.js`

### 2. Banner/Interstitial (✅ Sudah Diimplementasikan)
- **Lokasi**: `app/layout.tsx` - sebelum closing `</body>`
- **URL**: `//weptnastyturmoil.com/48/62/60/4862606d1a3cf67d461a8aacaf13bb07.js`

### 3. Banner 728x90 (✅ Komponen Tersedia)
- **Komponen**: `AdsterraBanner`
- **Lokasi File**: `components/AdsterraBanner.tsx`
- **Cara Pakai**:
```tsx
import AdsterraBanner from '@/components/AdsterraBanner';

// Di dalam JSX
<AdsterraBanner className="my-8" />
```

### 4. Native Banner (✅ Komponen Tersedia)
- **Komponen**: `AdsterraNativeBanner`
- **Lokasi File**: `components/AdsterraNativeBanner.tsx`
- **Cara Pakai**:
```tsx
import AdsterraNativeBanner from '@/components/AdsterraNativeBanner';

// Di dalam JSX
<AdsterraNativeBanner className="my-6" />
```

## Contoh Penggunaan di Halaman

```tsx
import AdsterraBanner from '@/components/AdsterraBanner';
import AdsterraNativeBanner from '@/components/AdsterraNativeBanner';

export default function MyPage() {
  return (
    <div>
      <h1>Konten Halaman</h1>
      
      {/* Banner 728x90 */}
      <AdsterraBanner className="my-8" />
      
      <div>Konten lainnya...</div>
      
      {/* Native Banner */}
      <AdsterraNativeBanner className="my-6" />
    </div>
  );
}
```

## Konfigurasi Banner 728x90

```javascript
atOptions = {
  'key' : 'bf10227b0c62864d2cd4a5a2f8477de9',
  'format' : 'iframe',
  'height' : 90,
  'width' : 728,
  'params' : {}
};
```

## Rekomendasi Penempatan

1. **Header/Top**: Setelah navigation
2. **Content**: Di antara konten artikel/video
3. **Sidebar**: Untuk layout dengan sidebar
4. **Footer**: Sebelum footer

## Catatan Penting

- ✅ Semua script menggunakan `strategy="afterInteractive"` untuk performa optimal
- ✅ Popunder hanya 1 per halaman (sudah diatur di layout)
- ✅ Banner responsive dengan `max-w-full overflow-hidden`
- ✅ Menggunakan Next.js `Script` component untuk optimasi loading