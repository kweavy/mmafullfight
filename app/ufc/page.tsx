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
}

const VIDEOS_PER_PAGE = 8;

export default function UFCPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);

 
  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
  
        // Get total count
        const { count } = await supabase
          .from('video_details')
          .select('*', { count: 'exact', head: true })
          .order('created_at', { ascending: false })
          .ilike('title', '%ufc%');
  
        setTotalVideos(count || 0); // ✅ Tambahkan ini
  
        // Get paginated data
        const { data, error } = await supabase
          .from('video_details')
          .select('*')
          .ilike('title', '%ufc%')
          .order('created_at', { ascending: false })
          .range((currentPage - 1) * VIDEOS_PER_PAGE, currentPage * VIDEOS_PER_PAGE - 1);
  
        if (error) throw error;
        setVideos(data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchVideos();
  }, [currentPage]);
  

  const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#141414] pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">UFC Videos</h1>
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