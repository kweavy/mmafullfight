import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function PopularSearches() {
  const { data: keywords, error } = await supabaseServer
    .from('search_keywords')
    .select('keyword, slug, count')
    .order('count', { ascending: false })
    .limit(10);

  if (!keywords || error) return null;

  return (
    <div className="mt-10 text-sm text-center text-gray-400">
      Popular searches:{" "}
      {keywords.map((item, i) => (
        <span key={item.slug}>
          {i > 0 && '| '}
          <Link
            href={`/ufc-wallpaper/search/${item.slug}`}
            className="text-[#E50914] hover:underline mx-1"
          >
            {item.keyword.replace(/^\w/, (c:any) => c.toUpperCase())}
          </Link>
        </span>
      ))}
    </div>
  );
}
