'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  video_embed: string;
  video_embed1?: string;
  video_embed2?: string;
  video_embed3?: string;
  video_embed4?: string;
  url?: string;
  description: string;
}

interface VideoPlayerProps {
  video: Video;
}

const getPlatformName = (url: string): string => {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    return 'Google Drive';
  } else if (url.includes('doodstream') || url.includes('do7go.com')) {
    return 'Doodstream';
  } else if (url.includes('terabox')) {
    return 'Terabox';
  } else if (url.includes('youtube')) {
    return 'YouTube';
  } else if (url.includes('streamtape')) {
    return 'Streamtape';
  } else if (url.includes('mixdrop') || url.includes('mxdrop')) {
    return 'Mixdrop';
  } else {
    return 'Stream';
  }
};

const getEmbedUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('drive.google.com')) {
    // Extract file ID and return preview URL
    const match = url.match(/\/file\/d\/([^/]+)\//);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
  } else if (url.includes('doodstream') || url.includes('do7go.com')) {
    return url.replace('/d/', '/e/');
  } else if (url.includes('streamtape')) {
    const videoId = url.split('/v/')[1]?.split('/')[0];
    if (videoId) {
      return `https://streamtape.com/e/${videoId}/`;
    }
  } else if (url.includes('mixdrop') || url.includes('mxdrop')) {
    return url.replace('/f/', '/e/');
  }
  return url;
};

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrapedEmbed, setScrapedEmbed] = useState<string | null>(null);
  const [scrapingError, setScrapingError] = useState(false);
  const [selectedEmbedUrl, setSelectedEmbedUrl] = useState<string | null>(null);
  const [currentSource, setCurrentSource] = useState<string | null>(null);

  // Get all available video sources
  const videoSources = [
    { url: video.video_embed, label: 'Source 1' },
    { url: video.video_embed1, label: 'Source 2' },
    { url: video.video_embed2, label: 'Source 3' },
    { url: video.video_embed3, label: 'Source 4' },
    { url: video.video_embed4, label: 'Source 5' },
  ].filter(source => source.url);

  // Effect to handle source changes
  useEffect(() => {
    if (selectedEmbedUrl) {
      setCurrentSource(selectedEmbedUrl);
    }
  }, [selectedEmbedUrl]);

  // Function to track video hits
  const trackVideoHit = async () => {
    try {
      // Check if a record for this video already exists
      const { data: existingRecord } = await supabase
        .from('video_summary')
        .select('id, hit, custom_1')
        .eq('id', video.id)
        .single();

      if (existingRecord) {
        // Update existing record by incrementing hit count
        const currentHits = existingRecord.hit || 0;
        await supabase
          .from('video_summary')
          .update({ 
            hit: currentHits + 1,
            custom_1: (existingRecord.custom_1 || 0) + 1
          })
          .eq('id', video.id);
      } else {
        // Insert new record with hit count of 1
        await supabase
          .from('video_summary')
          .insert({
            id: video.id,
            hit: 1,
            custom_1: 1
            // created_at will be automatically set by Supabase if the column has a default value of now()
          });
      }
    } catch (error) {
      console.error('Error tracking video hit:', error);
    }
  };

  const handlePlayVideo = async () => {
    // Track video view when played
    trackVideoHit();
    
    if (selectedEmbedUrl) {
      setIsPlaying(true);
      setCurrentSource(selectedEmbedUrl);
    } else {
      const embedUrlToScrape = videoSources.find(source => 
        source.url?.includes('https://spcdn.xyz') || source.url?.includes('https://fullfights.net/')
      )?.url;

      if (embedUrlToScrape) {
        try {
          const response = await fetch('/api/scrape', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: video.url }),
          });

          if (response.ok) {
            const scrapedData = await response.json();
            setScrapedEmbed(scrapedData.video_embed);
            setCurrentSource(scrapedData.video_embed);
            setIsPlaying(true);
          } else {
            setScrapingError(true);
            setIsPlaying(true);
          }
        } catch (error) {
          console.error('Error scraping video:', error);
          setScrapingError(true);
          setIsPlaying(true);
        }
      } else {
        const firstValidSource = videoSources.find(source => source.url !== video.video_embed);
        const initialSource = firstValidSource ? getEmbedUrl(firstValidSource.url||'') : getEmbedUrl(video.video_embed);
        setScrapedEmbed(initialSource);
        setCurrentSource(initialSource);
        setIsPlaying(true);
      }
    }
  };

  if (!isPlaying) {
    return (
      <div className="relative rounded-lg overflow-hidden">
        <Image 
          src={video.thumbnail} 
          alt={video.title} 
          width={1200} 
          height={675} 
          className="w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <Button 
            className="bg-[#E50914] text-white p-4 rounded-full hover:bg-[#E50914]/90"
            onClick={handlePlayVideo}
          >
            <Play className="h-10 w-10" />
          </Button>
        </div>
      </div>
    );
  }

  const finalEmbedUrl = currentSource || scrapedEmbed || video.video_embed;

  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden bg-black shadow-2xl">
        {scrapingError ? (
          <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
            <p className="text-white text-xl">Unable to load video. Please try another source.</p>
          </div>
        ) : (
          <div key={finalEmbedUrl} className="w-full aspect-video">
            <iframe
              src={finalEmbedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ border: 'none' }}
            />
          </div>
        )}
      </div>

      {/* Video Source Selection */}
      <div className="flex flex-wrap gap-2">
        {videoSources.map((source, index) => {
          const embedUrl = getEmbedUrl(source.url||'');
          const platform = getPlatformName(source.url||'');
          const isActive = currentSource === embedUrl;
          
          return (
            <Button
              key={embedUrl}
              variant={isActive ? 'default' : 'outline'}
              className={`${
                isActive 
                  ? 'bg-[#E50914] text-white hover:bg-[#E50914]/90' 
                  : 'text-white hover:bg-[#E50914] hover:text-white'
              }`}
              onClick={() => {
                // Track video hit when changing sources
                trackVideoHit();
                
                const newUrl = getEmbedUrl(source.url||'');
                setSelectedEmbedUrl(newUrl);
                setCurrentSource(newUrl);
                setIsPlaying(true);
                setScrapingError(false);
              }}
            >
              {platform} {source.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}