import { redirect } from "next/navigation";

const IMAGE_BASE = "https://templatecreative.com/android/conormcgregor/upload/";

export default async function DownloadPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`https://templatecreative.com/android/conormcgregor/api/v1/api.php?get_wallpaper_by_slug=1&slug=${params.slug}`, {
    cache: "no-store",
  });

  const json = await res.json();
  const wp = json?.wallpaper;

  if (!wp) {
    return redirect(`/wallpaper/${params.slug}`);
  }

  return redirect(`${IMAGE_BASE}${wp.image_upload}`);
}
