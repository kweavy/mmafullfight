import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import PopularSearches from "@/components/PopularSearches";

const BASE_API = "https://ufcwallpaper.my.id/android/conormcgregor/api/v1/api.php";
const IMAGE_BASE = "https://ufcwallpaper.my.id/android/conormcgregor/upload/";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "MMA Wallpapers";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mmawatch.com";

// Force static generation
export const dynamic = "force-static";

export async function generateStaticParams() {
  const totalPages = 10; // Optional: fetch total count from API if available

  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `Download Free UFC Wallpaper HD & 4K (PC, Phone, Laptop) | ${SITE_NAME}`;
  const description = `Get the latest UFC wallpapers in HD and 4K resolution. Download free fighter wallpapers for PC, iPhone, and laptop including Khamzat Chimaev, Islam Makhachev, and more.`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/ufc-wallpaper`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/ufc-wallpaper`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    keywords: [
      "ufc wallpaper",
      "ufc wallpaper hd",
      "ufc wallpaper 4k",
      "ufc wallpaper 4k iphone",
      "ufc wallpaper for laptop",
      "ufc wallpaper khamzat chimaev",
      "ufc wallpaper pc 4k",
      "ufc wallpaper 4k phone",
      "ufc wallpaper islam",
      "ufc wallpaper 4k laptop",
      "mma wallpaper",
      "free ufc backgrounds",
      "download ufc images",
    ],
  };
}

export default async function Page({ params }: { params: { page: string } }) {
  const page = parseInt(params.page) || 1;
  const limit = 20;

  const res = await fetch(
    `${BASE_API}?get_wallpapers=1&page=${page}&count=${limit}&order=ORDER BY g.id DESC&filter=1=1`,
    { cache: "no-store" }
  );
  const json = await res.json();
  const wallpapers = json?.posts || [];

  const totalPages = 10;

  return (
    <>
      <Navbar />

      <main className="min-h-screen mt-10 bg-[#0f0f0f] text-white px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-10 text-center">
            Download UFC Wallpaper HD & 4K
          </h1>

          <form
            action="/ufc-wallpaper/search"
            method="GET"
            className="max-w-xl mx-auto mb-10 flex rounded overflow-hidden border mt-10 border-gray-700"
          >
            <input
              type="text"
              name="q"
              placeholder="Search UFC wallpapers..."
              className="flex-grow px-4 py-2 text-black text-sm outline-none"
              required
            />
            <button
              type="submit"
              className="bg-[#E50914] hover:bg-[#c40810] text-white font-semibold px-4 py-2"
            >
              🔍 Search
            </button>
          </form>

          {/* Wallpaper Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {wallpapers.map((wp: any) => {
              const slug = `${wp.image_name.replace(/\s+/g, "-").toLowerCase()}-${wp.last_update?.split(" ")[0]}`;
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
                  <div className="px-3 py-3 space-y-1 text-sm">
                    <p className="font-semibold text-white line-clamp-2 text-center">{wp.image_name}</p>
                    <div className="text-gray-400 text-center">
                      <p>
                        Category: <span className="text-white">{wp.category_name}</span>
                      </p>
                      <p>Resolution: {wp.resolution}</p>
                      <p>Size: {wp.size}</p>
                      <p>
                        Views: {wp.views} • Downloads: {wp.downloads}
                      </p>
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
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10 gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/ufc-wallpaper/page/${p}`}
                className={`px-4 py-2 rounded-md font-semibold ${p === page
                  ? "bg-[#E50914] text-white"
                  : "bg-[#1a1a1a] text-gray-300 hover:bg-[#E50914]/20"
                  }`}
              >
                {p}
              </Link>
            ))}
          </div>

          <PopularSearches />
        </div>
      </main>
    </>
  );
}
