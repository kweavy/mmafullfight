import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { VideoPlayer } from './VideoPlayer';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Star, Clock, PlayCircle, AlertTriangle, Check } from 'lucide-react';
import { useState } from 'react';
import { redirect } from 'next/navigation';
import Script from 'next/script';

interface VideoDetailProps {
  id: string;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  video_embed: string;
  slug: string;
  description: string;
  categories: string[];
  fighters?: string[];
  date?: string;
  venue?: string;
  url?: string;
  rating?: number;
}

async function getVideoDetails(id: string): Promise<Video> {
  const { data, error } = await supabase
    .from('video_details')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  return data;
}

async function getSimilarVideos(video: Video): Promise<Video[]> {
  // Find similar videos based on categories
  const { data, error } = await supabase
    .from('video_details')
    .select('*')
    .neq('id', video.id)
    .containedBy('categories', video.categories)
    .limit(4);

  if (error) {
    console.error('Error fetching similar videos:', error);
    return [];
  }

  return data || [];
}

async function reportVideoProblem(formData: FormData): Promise<void> {
  'use server';
  
  const url = formData.get('url') as string;

  // Construct the message payload
  const payload = JSON.stringify({
    api_key: process.env.WHATSAPP_API_KEY,
    sender: process.env.WHATSAPP_SENDER,
    number: process.env.WHATSAPP_REPORT_NUMBER,
    message: `Video Problem on this page: ${url}`
  });

  try {
    // Use Node.js http module for server-side fetching
    const https = await import('https');
    
    await new Promise((resolve, reject) => {
      const req = https.request('https://wa.sediapulsa.com/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
          responseBody += chunk;
        });

        res.on('end', () => {
          try {
            const result = JSON.parse(responseBody);
            if (result.status === true) {
              resolve(undefined);
            } else {
              reject(new Error('Failed to send message'));
            }
          } catch (parseError) {
            reject(new Error('Failed to parse response'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(payload);
      req.end();
    });

    // Redirect with success message
    redirect(`${url}?report=success`);
  } catch (error) {
    console.error('Error reporting video problem:', error);
    
    // Redirect with error message
    redirect(`${url}?report=success`);
  }
}

export async function VideoDetail({ id }: VideoDetailProps) {
  const video = await getVideoDetails(id);
  const similarVideos = await getSimilarVideos(video);
  const currentUrl = `/video/${video.slug}`;
  const searchParams = new URLSearchParams(currentUrl.includes('?') ? currentUrl.split('?')[1] : '');

  const reportStatus = searchParams.get('report');

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white relative pt-20">
        {/* Background Blur Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-30" 
          style={{ backgroundImage: `url(${video.thumbnail})` }}
        />

        {/* Back Button */}
        <Link 
          href="/" 
          className="fixed top-24 left-4 z-20 text-white hover:text-[#E50914] flex items-center"
        >
          <ChevronLeft className="mr-2 h-6 w-6" />
          Back
        </Link>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Hero Section */}
          <div className="relative h-[70vh] w-full overflow-hidden">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            
            {/* Video Details Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
              <div className="container mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-3xl drop-shadow-lg">
                  {video.title}
                </h1>

                {/* Categories and Metadata */}
                <div className="flex flex-wrap items-center gap-3">
                  {video.categories?.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="bg-[#E50914]/80 text-white"
                    >
                      {category}
                    </Badge>
                  ))}
                  {video.rating && (
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-5 w-5 mr-1" />
                      <span>{video.rating}/10</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <VideoPlayer video={video} />
              
              {/* Ad Placement Below Video Player */}
              {/* Ad Placement Below Video Player */}
              <div className="mt-6">
                <Script
                  async
                  data-cfasync="false"
                  src="//pl26378347.profitableratecpm.com/17ff9c6569cbd48e106a4c3250b9972f/invoke.js"
                />
                <div id="container-17ff9c6569cbd48e106a4c3250b9972f"></div>
              </div>
            </div>

            <form 
              action={reportVideoProblem} 
              className="fixed top-24 right-4 z-20"
            >
              <input 
                type="hidden" 
                name="url" 
                value={`${process.env.NEXT_PUBLIC_SITE_URL}/video/${video.slug}`} 
              />
              <button 
                type="submit" 
                className="text-white bg-red-600 hover:bg-red-700 p-2 rounded flex items-center"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Video Not Play ? Report Now!
              </button>
            </form>
   
            {/* Additional Details */}
            <div className="space-y-6 bg-[#1a1a1a] p-6 rounded-lg">
              {video.fighters && video.fighters.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-[#E50914]" />
                    Fighters
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {video.fighters.map((fighter) => (
                      <Badge key={fighter} variant="outline" className="bg-gray-800 text-white">
                        {fighter}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {video.date && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Event Date</h2>
                  <p className="text-gray-400">{new Date(video.date).toLocaleDateString()}</p>
                </div>
              )}

              {video.venue && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Venue</h2>
                  <p className="text-gray-400">{video.venue}</p>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-400 whitespace-pre-wrap line-clamp-6">{video.description}</p>
              </div>
            </div>
          </div>

         

          {/* Similar Videos Section */}
          {similarVideos.length > 0 && (
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-bold mb-6">Similar Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {similarVideos.map((similarVideo) => (
                  <Link 
                    key={similarVideo.id} 
                    href={`/video/${similarVideo.slug}`} 
                    className="group relative"
                  >
                    <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={similarVideo.thumbnail}
                        alt={similarVideo.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <PlayCircle 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        text-white opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 w-12 h-12"
                      />
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-[#E50914]">
                        {similarVideo.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {similarVideo.categories?.slice(0, 2).map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className="bg-gray-800 text-white text-xs"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
