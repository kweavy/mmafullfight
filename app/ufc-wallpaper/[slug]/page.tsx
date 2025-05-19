import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ChevronLeft, DownloadCloud, Eye } from "lucide-react";

const BASE_API = "https://templatecreative.com/android/conormcgregor/api/v1/api.php";
const IMAGE_BASE = "https://templatecreative.com/android/conormcgregor/upload/";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "MMA Wallpapers";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mmawatch.com";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const res = await fetch(`${BASE_API}?get_wallpapers=1&page=1&count=1000&order=ORDER BY g.id DESC&filter=1=1`);
  const json = await res.json();
  const wallpapers = json?.posts || [];

  return wallpapers.map((wp: any) => {
    const rawSlug = `${wp.image_name.replace(/\s+/g, '-').toLowerCase()}-${wp.last_update?.split(' ')[0]}`;
    return {
      slug: encodeURIComponent(rawSlug), // ✅ penting
    };
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug); // ✅ decode
  const res = await fetch(`${BASE_API}?get_wallpaper_by_slug=1&slug=${encodeURIComponent(decodedSlug)}`, {
    cache: "no-store",
  });

  let json;
  try {
    json = await res.json();
  } catch {
    return {};
  }

  const wp = json?.wallpaper;
  if (!wp) return {};

  const title = `${wp.image_name} UFC Wallpaper HD & 4K Download (iPhone, PC, Laptop) | ${SITE_NAME}`;
  const description = `Download ${wp.image_name} UFC wallpaper in HD and 4K resolution. Optimized for iPhone, PC, laptop, and mobile devices. Get the best fighter backgrounds including ${wp.category_name}.`;

  const slugUrl = `${BASE_URL}/ufc-wallpaper/${params.slug}`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: slugUrl,
    },
    openGraph: {
      title,
      description,
      url: slugUrl,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: `${IMAGE_BASE}${wp.image_upload}`,
          alt: `${wp.image_name} UFC wallpaper HD & 4K`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${IMAGE_BASE}${wp.image_upload}`],
    },
    keywords: [
      `${wp.image_name} wallpaper`,
      "ufc wallpaper hd",
      "ufc wallpaper 4k",
      "ufc wallpaper 4k iphone",
      "ufc wallpaper for laptop",
      "ufc wallpaper khamzat chimaev",
      "ufc wallpaper pc 4k",
      "ufc wallpaper 4k phone",
      "ufc wallpaper islam",
      "ufc wallpaper 4k laptop",
      "download ufc wallpaper",
      `${wp.category_name} fighter wallpaper`,
    ],
  };
}

export default async function WallpaperDetailPage({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug); // ✅ decode
  const res = await fetch(`${BASE_API}?get_wallpaper_by_slug=1&slug=${encodeURIComponent(decodedSlug)}`, {
    cache: "no-store",
  });

  let json;
  try {
    json = await res.json();
  } catch {
    return notFound();
  }

  const wp = json?.wallpaper;
  if (!wp) return notFound();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white relative pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-30" 
          style={{ backgroundImage: `url(${IMAGE_BASE}${wp.image_upload})` }} 
        />
        <Link 
          href="/ufc-wallpaper" 
          className="fixed top-24 left-4 z-20 text-white hover:text-[#E50914] flex items-center"
        >
          <ChevronLeft className="mr-2 h-6 w-6" />
          Back
        </Link>

        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="relative h-[70vh] w-full overflow-hidden">
            <Image
              src={`${IMAGE_BASE}${wp.image_upload}`}
              alt={wp.image_name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
              <div className="container mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-3xl drop-shadow-lg">
                  {wp.image_name} Wallpaper HD
                </h1>
                <span className="text-3xl font-bold mb-6 text-center">
                  Download {wp.image_name} UFC Wallpaper HD & 4K for Phone, PC, and Laptop
                </span>
                <p className="text-sm mt-5 text-gray-300">
                  {wp.category_name} • {wp.resolution} • {wp.size}
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden">
                <Image
                  src={`${IMAGE_BASE}${wp.image_upload}`}
                  alt={wp.image_name}
                  width={1280}
                  height={720}
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="mt-6 space-y-6">
                <a
                  href={`/download-wallpaper?file=${wp.image_upload}`}
                  className="bg-[#E50914] hover:bg-[#c40810] px-6 py-3 rounded-full text-white font-bold"
                >
                  📥 Download Wallpaper
                </a>

                <div>
                  <Script
                    async
                    data-cfasync="false"
                    src="//pl26378347.profitableratecpm.com/17ff9c6569cbd48e106a4c3250b9972f/invoke.js"
                  />
                  <div id="container-17ff9c6569cbd48e106a4c3250b9972f" className="mt-4" />
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-[#1a1a1a] p-6 rounded-lg">
              <div><h2 className="text-xl font-semibold mb-2">Category</h2><p className="text-gray-400">{wp.category_name}</p></div>
              <div><h2 className="text-xl font-semibold mb-2">Resolution</h2><p className="text-gray-400">{wp.resolution}</p></div>
              <div><h2 className="text-xl font-semibold mb-2">Size</h2><p className="text-gray-400">{wp.size}</p></div>
              <div className="flex gap-4 items-center">
                <div className="flex items-center text-gray-400"><Eye className="w-5 h-5 mr-1" /><span>{wp.views} views</span></div>
                <div className="flex items-center text-gray-400"><DownloadCloud className="w-5 h-5 mr-1" /><span>{wp.downloads} downloads</span></div>
              </div>

              {wp.tags && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {wp.tags.split(",").map((tag: string) => (
                      <Link
                        key={tag}
                        href={`/ufc-wallpaper/search/${encodeURIComponent(tag.trim())}`}
                        className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full hover:bg-[#E50914] transition"
                      >
                        {tag.trim()}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
