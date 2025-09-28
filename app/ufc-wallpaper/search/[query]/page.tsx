import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import TrackSearch from "@/components/TrackSearch";
import PopularSearches from "@/components/PopularSearches";
import { supabaseServer } from "@/lib/supabaseServer";

const BASE_API = "https://ufcwallpaper.my.id/android/conormcgregor/api/v1/api.php";
const IMAGE_BASE = "https://ufcwallpaper.my.id/android/conormcgregor/upload/";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "MMA Wallpapers";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mmawatch.com";

export const dynamic = "force-static";

// ✅ Static paths dari Supabase
export async function generateStaticParams() {
  const { data, error } = await supabaseServer
    .from("search_keywords")
    .select("slug")
    .order("count", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Supabase error in generateStaticParams:", error.message);
    return [];
  }

  return (data || []).map((item) => ({
    query: item.slug,
  }));
}

export async function generateMetadata({ params }: { params: { query: string } }): Promise<Metadata> {
  const keyword = decodeURIComponent(params.query);
  const keywordCap = keyword.replace(/\b\w/g, (c) => c.toUpperCase());

  const title = `${keywordCap} - Download Free UFC Wallpaper HD & 4K for PC, Phone & Laptop | ${SITE_NAME}`;
  const description = `Download ${keywordCap} wallpaper in high resolution (HD & 4K). Free UFC fighter backgrounds for PC, iPhone, and Android.`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/ufc-wallpaper/search/${params.query}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/ufc-wallpaper/search/${params.query}`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    keywords: [
      keyword,
      `${keyword} wallpaper`,
      `${keyword} 4k`,
      `${keyword} HD`,
      `download ${keyword} wallpaper`,
      "ufc wallpaper",
      "ufc wallpaper hd",
      "ufc wallpaper 4k",
      "fighter wallpaper",
      "mma background",
    ],
  };
}

export default async function SearchPage({ params }: { params: { query: string } }) {
  const searchTerm = decodeURIComponent(params.query);

  const res = await fetch(
    `${BASE_API}?get_search=1&search=${encodeURIComponent(searchTerm)}&order=ORDER BY g.id DESC&page=1&count=20`,
    { cache: "no-store" }
  );

  const json = await res.json();
  const wallpapers = json?.posts || [];

  return (
    <>
      <Navbar />
      <TrackSearch keyword={searchTerm} />

      <main className="min-h-screen mt-10 bg-[#0f0f0f] text-white px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-400 mb-6">
            <ol className="list-reset flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:underline text-white">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/ufc-wallpaper" className="hover:underline text-white">UFC Wallpaper</Link>
              </li>
              <li>/</li>
              <li className="text-[#E50914] font-semibold truncate max-w-[150px]">
                Search: {searchTerm}
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold mb-6 text-center">
            Download {searchTerm} UFC Wallpaper HD & 4K for Phone, PC, and Laptop
          </h1>

          {wallpapers.length === 0 ? (
            <p className="text-center text-gray-400">No wallpapers found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {wallpapers.map((wp: any) => {
                const slug = `${encodeURIComponent(wp.image_name.replace(/\s+/g, "-").toLowerCase())}-${wp.last_update?.split(" ")[0]}`;
                return (
                  <Link
                    key={wp.image_id}
                    href={`/ufc-wallpaper/${slug}`}
                    className="group block rounded-xl overflow-hidden bg-[#1a1a1a] shadow hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                      <img
                        src={`${IMAGE_BASE}${wp.image_upload}`}
                        alt={wp.image_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="px-3 py-3 text-sm space-y-1">
                      <p className="font-semibold text-white line-clamp-2 text-center">{wp.image_name}</p>
                      <div className="text-gray-400 text-center">
                        <p>Category: <span className="text-white">{wp.category_name}</span></p>
                        <p>Resolution: {wp.resolution}</p>
                        <p>Size: {wp.size}</p>
                        <p>Views: {wp.views} • Downloads: {wp.downloads}</p>
                      </div>
                      {wp.tags && (
                        <p className="text-xs mt-1">
                          Tags:{" "}
                          {wp.tags.split(",").map((tag: string) => (
                            <Link
                              key={tag}
                              href={`/ufc-wallpaper/search/${encodeURIComponent(tag.trim())}`}
                              className="inline-block text-[#E50914] hover:underline mx-1"
                            >
                              {tag.trim()}
                            </Link>
                          ))}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <PopularSearches />

          <div className="mt-10 text-sm text-center text-gray-400">
            Popular keywords:{" "}
            <Link href="/ufc-wallpaper/search/ufc%20wallpaper%204k" className="text-[#E50914] hover:underline mx-1">4K</Link> |
            <Link href="/ufc-wallpaper/search/khamzat%20chimaev" className="text-[#E50914] hover:underline mx-1">Khamzat Chimaev</Link> |
            <Link href="/ufc-wallpaper/search/ufc%20wallpaper%20hd" className="text-[#E50914] hover:underline mx-1">HD</Link> |
            <Link href="/ufc-wallpaper/search/islam%20makhachev" className="text-[#E50914] hover:underline mx-1">Islam</Link>
          </div>
        </div>
      </main>
    </>
  );
}
