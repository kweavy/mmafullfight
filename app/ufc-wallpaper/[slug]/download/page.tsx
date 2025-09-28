import { redirect } from "next/navigation";

const IMAGE_BASE = "https://ufcwallpaper.my.id/android/conormcgregor/upload/";

export default async function DownloadPage({ params }: { params: { slug: string } }) {
  try {
    const res = await fetch(`https://ufcwallpaper.my.id/android/conormcgregor/api/v1/api.php?get_wallpaper_by_slug=1&slug=${params.slug}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000), // 8 detik timeout
    });

    if (!res.ok) {
      console.error(`Failed to fetch wallpaper for download: ${res.status}`);
      return redirect(`/ufc-wallpaper/${params.slug}`);
    }

    const json = await res.json();
    const wp = json?.wallpaper;

    if (!wp) {
      return redirect(`/ufc-wallpaper/${params.slug}`);
    }

    return redirect(`${IMAGE_BASE}${wp.image_upload}`);
  } catch (error) {
    console.error("Error in download page:", error);
    return redirect(`/ufc-wallpaper/${params.slug}`);
  }
}
