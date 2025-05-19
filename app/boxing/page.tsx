'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { VideoGrid } from '@/components/VideoGrid';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  video_embed: string;
  slug: string;
  description: string;
  categories: string[];
  created_at: string;
}

const VIDEOS_PER_PAGE = 8;

export default function BoxingPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);

  useEffect(() => {
    async function fetchBoxingVideos() {
      try {
        setLoading(true);

        const { count } = await supabase
          .from('video_details')
          .select('*', { count: 'exact', head: true })
          .contains('categories', ['Boxing']);

        setTotalVideos(count || 0);

        const { data, error } = await supabase
          .from('video_details')
          .select('*')
          .contains('categories', ['Boxing'])
          .order('created_at', { ascending: false })
          .range((currentPage - 1) * VIDEOS_PER_PAGE, currentPage * VIDEOS_PER_PAGE - 1);

        if (error) throw error;
        setVideos(data || []);
      } catch (error) {
        console.error('Error fetching boxing videos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBoxingVideos();
  }, [currentPage]);

  const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#141414] pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-4">Boxing Videos</h1>
          <VideoGrid
            videos={videos}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </>
  );
}
