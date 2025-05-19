import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import SearchClientWrapper from '@/components/SearchClientWrapper';

const VIDEOS_PER_PAGE = 8;

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  video_embed: string;
  slug: string;
  description: string;
  categories: string[];
}

interface Props {
  params: { query: string };
  searchParams?: { page?: string };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const query = decodeURIComponent(params.query || '');
  const currentPage = parseInt(searchParams?.page || '1', 10);

  if (!query) return <p>No search query provided</p>;

  const { count } = await supabase
    .from('video_details')
    .select('*', { count: 'exact', head: true })
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            .order('created_at', { ascending: false });

  const { data } = await supabase
    .from('video_details')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
              .order('created_at', { ascending: false })

    .range((currentPage - 1) * VIDEOS_PER_PAGE, currentPage * VIDEOS_PER_PAGE - 1);

  const totalVideos = count || 0;
  const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);
  const videos: Video[] = data || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#141414] pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">
            Search Results for "{query}"
          </h1>

          {totalVideos === 0 ? (
            <p className="text-gray-400 text-xl">
              No videos found matching your search: "{query}"
            </p>
          ) : (
            <SearchClientWrapper
              videos={videos}
              totalPages={totalPages}
              initialPage={currentPage}
              query={query}
            />
          )}
        </div>
      </main>
    </>
  );
}
