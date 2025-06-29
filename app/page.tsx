'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { VideoCard } from '@/components/VideoCard';
import { VideoSlider } from '@/components/VideoSlider';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { Play, Info, ChevronLeft, ChevronRight, TrendingUp, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { FastAverageColor } from 'fast-average-color';
import { VideoSkeleton } from '@/components/VideoSkeleton';
import { VideoSliderGrid } from '@/components/VideoSliderGrid';
import Script from 'next/script';

interface Video {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  video_embed: string;
  description: string;
  categories: string[];
  created_at?: string;
  hit?: number;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dominantColor, setDominantColor] = useState<string>('#141414');
  const router = useRouter();
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const { data: allVideosData, error: allVideosError } = await supabase
          .from('video_details')
          .select('*')
          .order('created_at', { ascending: false });

        if (allVideosError) throw allVideosError;

        if (allVideosData) {
          setVideos(allVideosData);
          setRecentVideos(allVideosData.slice(0, 20));

          const specificFeaturedVideo = allVideosData.find(video => video.id === "d5ad9421-7303-48e8-8716-eab56bcbc853");
          if (specificFeaturedVideo) {
            setFeaturedVideos([specificFeaturedVideo]);
          } else {
            const ufcVideos = allVideosData.filter(video => video.title?.includes('UFC'));
            setFeaturedVideos(ufcVideos.slice(0, 5));
          }

          const { data: trendingData, error: trendingError } = await supabase
            .from('video_summary')
            .select('id, hit')
            .order('hit', { ascending: false })
            .limit(10);

          if (trendingError) {
            const shuffled = [...allVideosData].sort(() => 0.5 - Math.random());
            setTrendingVideos(shuffled.slice(0, 10));
          } else if (trendingData && trendingData.length > 0) {
            const trendingIds = trendingData.map(item => item.id);
            const trendingVideosData = allVideosData.filter(video =>
              trendingIds.includes(video.id)
            );

            const sortedTrending = trendingVideosData.sort((a, b) => {
              const aHit = trendingData.find(item => item.id === a.id)?.hit || 0;
              const bHit = trendingData.find(item => item.id === b.id)?.hit || 0;
              return bHit - aHit;
            });

            const trendingWithHits = sortedTrending.map(video => ({
              ...video,
              hit: trendingData.find(item => item.id === video.id)?.hit
            }));

            setTrendingVideos(trendingWithHits);
          } else {
            const shuffled = [...allVideosData].sort(() => 0.5 - Math.random());
            setTrendingVideos(shuffled.slice(0, 10));
          }
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = featuredVideos[currentFeaturedIndex]?.thumbnail || '';

    img.onload = () => {
      const fac = new FastAverageColor();
      fac.getColorAsync(img).then(color => {
        setDominantColor(color.rgba);
      }).catch(e => {
        console.error('Color extraction failed:', e);
      });
    };
  }, [currentFeaturedIndex, featuredVideos]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//pl26378347.profitableratecpm.com/17ff9c6569cbd48e106a4c3250b9972f/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    if (adRef.current) {
      adRef.current.innerHTML = '';
      adRef.current.appendChild(script);
    }
  }, []);

  const handleSlideChange = (direction: 'prev' | 'next') => {
    setCurrentFeaturedIndex((prev) => {
      if (direction === 'prev') {
        return prev === 0 ? featuredVideos.length - 1 : prev - 1;
      } else {
        return prev === featuredVideos.length - 1 ? 0 : prev + 1;
      }
    });
  };

  const categories = ['UFC', 'Boxing', 'ONE Championship', 'Bellator', 'PFL', 'Cage Warriors'];

  const getVideosByCategory = (category: string) => {
    return videos.filter(video => video.categories?.includes(category) || video.title?.includes(category));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#141414] pt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <VideoSkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#141414] overflow-x-hidden">
        <AnimatePresence mode="wait">
          {featuredVideos[currentFeaturedIndex] && (
            <motion.div
              key={featuredVideos[currentFeaturedIndex].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-[85vh] w-full group"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${featuredVideos[currentFeaturedIndex].thumbnail})`,
                  filter: 'brightness(0.7)'
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, rgba(20,20,20,1) 0%, ${dominantColor}20 50%, rgba(20,20,20,0.4) 100%)`
                }}
              />
              <button
                onClick={() => handleSlideChange('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => handleSlideChange('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
              <div className="absolute bottom-[20%] left-[5%] max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-5xl font-bold text-white mb-4 line-clamp-2">
                    {featuredVideos[currentFeaturedIndex].title}
                  </h1>
                  <p className="text-lg text-white/90 mb-6 line-clamp-3">
                    {featuredVideos[currentFeaturedIndex].description}
                  </p>
                  <div className="flex items-center gap-4">
                    <Button 
                      size="lg"
                      className="bg-[#E50914] text-white hover:bg-[#E50914]/90 px-8 rounded-full"
                      onClick={() => router.push(`/video/${featuredVideos[currentFeaturedIndex].slug}`)}
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Now
                    </Button>
                    <Button 
                      size="lg"
                      variant="outline"
                      className="bg-white/20 text-white hover:bg-white/30 px-8 rounded-full backdrop-blur-sm"
                      onClick={() => router.push(`/video/${featuredVideos[currentFeaturedIndex].slug}`)}
                    >
                      <Info className="mr-2 h-5 w-5" />
                      More Info
                    </Button>
                  </div>
                </motion.div>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {featuredVideos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeaturedIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentFeaturedIndex ? 'w-8 bg-[#E50914]' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>



        <div className="flex justify-center my-10">
  {/* Script Config */}
  <Script id="mmafullfight-banner-config" strategy="afterInteractive">
    {`
      atOptions = {
        'key' : 'bf10227b0c62864d2cd4a5a2f8477de9',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `}
  </Script>

  {/* Script Loader */}
  <Script
    strategy="afterInteractive"
    src="//www.highperformanceformat.com/bf10227b0c62864d2cd4a5a2f8477de9/invoke.js"
  />
</div>

        <div className="relative z-10 -mt-32 pb-20">
          <div className="container mx-auto px-6">
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-[#E50914]" />
                <h2 className="text-2xl font-bold text-white">Trending Now</h2>
              </div>
                             {/* Adsterra Banner */}
  <div className="mb-10 text-center">
              <div ref={adRef} id="container-17ff9c6569cbd48e106a4c3250b9972f" />
            </div>
              <VideoSlider title='' videos={trendingVideos} />
            </section>


    {/* Iklan Adsterra Tengah */}
    <div className="mb-12 flex justify-center">
      <Script
        strategy="afterInteractive"
        async
        data-cfasync="false"
        src="//pl26378347.profitableratecpm.com/17ff9c6569cbd48e106a4c3250b9972f/invoke.js"
      />
      <div id="container-17ff9c6569cbd48e106a4c3250b9972f" className="w-full max-w-screen-md" />
    </div>

            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-[#E50914]" />
                <h2 className="text-2xl font-bold text-white">Recent Uploads</h2>
              </div>
 

              <VideoSliderGrid title="" videos={recentVideos} />
            </section>



          
          </div>
        </div>
      </main>
    </>
  );
}
