'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { VideoCard } from './VideoCard';
import { VideoSkeleton } from './VideoSkeleton';
import { motion } from 'framer-motion';

interface Video {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  video_embed: string;
  description: string;
  categories: string[];
}

interface VideoGridProps {
  videos: Video[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function VideoGrid({
  videos,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}: VideoGridProps) {
  const getPaginationRange = () => {
    const range = [];
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(currentPage + 2, totalPages);

    if (totalPages <= 5) {
      start = 1;
      end = totalPages;
    } else {
      if (currentPage <= 3) {
        end = 5;
      } else if (currentPage + 2 >= totalPages) {
        start = totalPages - 4;
      }
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <VideoSkeleton key={i} />
          ))
        ) : (
          videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              slug={video.slug}
              title={video.title}
              thumbnail={video.thumbnail}
              videoEmbed={video.video_embed}
              description={video.description}
            />
          ))
        )}
      </motion.div>

      {!loading && totalPages > 1 && (
        <div className="pt-8">
          {/* Wrapping pagination in horizontal scroll container */}
          <div className="overflow-x-auto">
            <div className="flex items-center gap-2 justify-center">
              {/* Previous Arrow */}
              <Button
                variant="outline"
                className="text-white hover:bg-[#E50914] hover:text-white rounded-full px-4"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-6 w-6" /> {/* Left Arrow Icon */}
              </Button>

              {/* Page Number Buttons */}
              {getPaginationRange().map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  className={`rounded-full w-10 h-10 ${
                    currentPage === page
                      ? 'bg-[#E50914] text-white hover:bg-[#E50914]/90'
                      : 'text-white hover:bg-[#E50914] hover:text-white'
                  }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              ))}

              {/* Next Arrow */}
              <Button
                variant="outline"
                className="text-white hover:bg-[#E50914] hover:text-white rounded-full px-4"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                <ChevronRight className="h-6 w-6" /> {/* Right Arrow Icon */}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
