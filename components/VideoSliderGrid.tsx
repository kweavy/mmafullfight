'use client';

import Link from 'next/link';
import { VideoCard } from './VideoCard';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  video_embed: string;
  slug: string;
  description: string;
  categories: string[];
}

interface VideoSliderGridProps {
  title: string;
  videos: Video[];
  showViewMore?: boolean; // opsional toggle
}

export function VideoSliderGrid({ title, videos, showViewMore = true }: VideoSliderGridProps) {
  return (
    <div className="mb-16">
      {title && (
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {videos.slice(0, 20).map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            slug={video.slug}
            title={video.title}
            thumbnail={video.thumbnail}
            videoEmbed={video.video_embed}
            description={video.description}
          />
        ))}
      </div>

      {showViewMore && (
        <div className="mt-8 text-center">
          <Link href="/all-videos">
            <span className="inline-block bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-white/90 transition">
              View More
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
