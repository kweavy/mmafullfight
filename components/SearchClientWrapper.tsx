'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { VideoGrid } from './VideoGrid';

interface Video {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  video_embed: string;
  description: string;
  categories: string[];
}

interface Props {
  videos: Video[];
  totalPages: number;
  initialPage: number;
  query: string;
}

export default function SearchClientWrapper({
  videos,
  totalPages,
  initialPage,
  query,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const url = `/search/${encodeURIComponent(query)}?page=${page}`;
    router.push(url);
  };

  return (
    <VideoGrid
      videos={videos}
      loading={false}
      currentPage={initialPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
