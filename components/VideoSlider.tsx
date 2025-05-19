'use client';

import { useState, useRef, useEffect } from 'react';
import { VideoCard } from './VideoCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  video_embed: string;
  slug: string;
  description: string;
  categories: string[];
}

interface VideoSliderProps {
  title: string;
  videos: Video[];
}

export function VideoSlider({ title, videos }: VideoSliderProps) {
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', handleScroll);
      return () => slider.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.8;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="relative">
        <AnimatePresence>
          {showLeftButton && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-4 rounded-r-lg hover:bg-black/80 transition-colors"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
        
        <div
  ref={sliderRef}
  className="flex gap-2 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
>

          {videos.map((video) => (
            <div key={video.id} className="flex-none w-[300px]">
              <VideoCard
                id={video.id}
               slug={video.slug}
                title={video.title}
                thumbnail={video.thumbnail}
                videoEmbed={video.video_embed}
                description={video.description}
              />
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showRightButton && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-4 rounded-l-lg hover:bg-black/80 transition-colors"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}