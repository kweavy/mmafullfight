export const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')  // Hapus karakter selain huruf, angka, spasi, dan -
      .replace(/\s+/g, '-')          // Ganti spasi dengan -
      .replace(/-+/g, '-')           // Gabungkan dash berulang
      .replace(/^[-]+|[-]+$/g, '');  // Hapus dash di awal/akhir
  