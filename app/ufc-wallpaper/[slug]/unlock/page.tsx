import { notFound, redirect } from "next/navigation";

const BASE_API = "https://templatecreative.com/android/conormcgregor/api/v1/api.php";
const IMAGE_BASE = "https://templatecreative.com/android/conormcgregor/upload/";
const ADSTERRA_LINK = "https://www.profitableratecpm.com/dkkehrkgn?key=883fc888d7571cc5f949ab2b43dc1549";

export default async function UnlockPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${BASE_API}?get_wallpaper_by_slug=1&slug=${params.slug}`, {
    cache: "no-store",
  });

  const json = await res.json();
  const wp = json?.wallpaper;

  if (!wp) return notFound();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16 space-y-6">
      <h1 className="text-2xl font-bold">Step 1: Click Ad Below</h1>

      <a
        href={ADSTERRA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-full text-white font-bold"
      >
        🚀 Click to Unlock
      </a>

      <h2 className="text-lg mt-8">Step 2: Download Your Wallpaper</h2>

     <a
  href={`/download-wallpaper?file=${wp.image_upload}`}
  className="bg-[#E50914] hover:bg-[#c40810] px-6 py-3 rounded-full text-white font-bold"
>
  📥 Download Wallpaper
</a>

    </div>
  );
}
