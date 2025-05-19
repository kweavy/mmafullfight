'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { VideoGrid } from '@/components/VideoGrid';
import { supabase } from '@/lib/supabase';

interface Fighter {
  name: string;
  imgUrl?: string;
  category?: string;
  wins?: string;
  losses?: string;
  draws?: string;
  status?: string;
  placeOfBirth?: string;
  trainsAt?: string;
  fightingStyle?: string;
  age?: string;
  height?: string;
  weight?: string;
  octagonDebut?: string;
  reach?: string;
  legReach?: string;
  nickname?: string;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  video_embed: string;
  slug: string;
  description: string;
  categories: string[];
}

interface Props {
  params: { id: string };
}

const VIDEOS_PER_PAGE = 8;

export default function FighterDetailClient({ params }: Props) {
  const router = useRouter();
  const { id } = params;
  
  const [fighter, setFighter] = useState<Fighter | null>(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);

  // Fetch fighter details - pre-fetch during SSG but allow for client-side refresh
  useEffect(() => {
    async function fetchFighterDetails() {
      try {
        setLoading(true);
        const response = await fetch(`https://api.octagon-api.com/fighters`);
        const data = await response.json();
        
        if (data[id]) {
          setFighter(data[id]);
        } else {
          console.error('Fighter not found');
          router.push('/fighters');
        }
      } catch (error) {
        console.error('Error fetching fighter details:', error);
        router.push('/fighters');
      } finally {
        setLoading(false);
      }
    }

    fetchFighterDetails();
  }, [id, router]);

  // Fetch related videos - only on client side since this is dynamic content
  useEffect(() => {
    async function fetchRelatedVideos() {
      if (!fighter) return;
      
      try {
        setVideosLoading(true);
        const fighterName = fighter.name.trim();
        
        // Get total count
        const { count } = await supabase
          .from('video_details')
          .select('*', { count: 'exact', head: true })
          .or(`title.ilike.%${fighterName}%,description.ilike.%${fighterName}%`);
        
        setTotalVideos(count || 0);

        // Get paginated data
        const { data, error } = await supabase
          .from('video_details')
          .select('*')
          .or(`title.ilike.%${fighterName}%,description.ilike.%${fighterName}%`)
          .range((currentPage - 1) * VIDEOS_PER_PAGE, currentPage * VIDEOS_PER_PAGE - 1);

        if (error) throw error;
        setVideos(data || []);
      } catch (error) {
        console.error('Error fetching related videos:', error);
      } finally {
        setVideosLoading(false);
      }
    }

    fetchRelatedVideos();
  }, [fighter, currentPage]);

  const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#141414] pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!fighter) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#141414] pt-20">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-white mb-8">Fighter Not Found</h1>
            <button 
              onClick={() => router.push('/fighters')}
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition"
            >
              Return to Fighters List
            </button>
          </div>
        </main>
      </>
    );
  }

  // Safely get the fighter's name
  const fighterName = fighter.name ? fighter.name.trim() : 'Unknown Fighter';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#141414] pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Fighter Profile Card */}
          <div className="bg-gray-900 rounded-lg overflow-hidden mb-12">
            <div className="flex flex-col lg:flex-row">
              {/* Fighter Image */}
              <div className="lg:w-1/3">
                <div className="h-96 lg:h-full bg-gray-800 relative">
                  {fighter.imgUrl ? (
                    <img
                      src={fighter.imgUrl}
                      alt={fighterName}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Fighter Details */}
              <div className="lg:w-2/3 p-6">
                <h1 className="text-4xl font-bold text-white mb-2">{fighterName}</h1>
                {fighter.nickname && (
                  <p className="text-red-500 text-xl mb-2">"{fighter.nickname}"</p>
                )}
                {fighter.category && (
                  <p className="text-gray-400 text-xl mb-4">{fighter.category}</p>
                )}
                
                {/* Record */}
                <div className="flex items-center mb-6">
                  <div className="bg-gray-800 py-2 px-4 rounded-lg flex gap-4">
                    <div className="text-center">
                      <div className="text-green-500 text-2xl font-bold">{fighter.wins || '0'}</div>
                      <div className="text-gray-400 text-sm">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-500 text-2xl font-bold">{fighter.losses || '0'}</div>
                      <div className="text-gray-400 text-sm">Losses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-300 text-2xl font-bold">{fighter.draws || '0'}</div>
                      <div className="text-gray-400 text-sm">Draws</div>
                    </div>
                  </div>
                  {fighter.status && (
                    <div className="ml-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${fighter.status === 'Active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                        {fighter.status}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <InfoItem label="Age" value={fighter.age} />
                  <InfoItem 
                    label="Height" 
                    value={fighter.height ? `${Math.floor(Number(fighter.height) / 12)}'${Number(fighter.height) % 12}"` : undefined} 
                  />
                  <InfoItem label="Weight" value={fighter.weight ? `${fighter.weight} lbs` : undefined} />
                  <InfoItem label="Reach" value={fighter.reach ? `${fighter.reach}"` : undefined} />
                  <InfoItem label="Leg Reach" value={fighter.legReach ? `${fighter.legReach}"` : undefined} />
                  <InfoItem label="Fighting Style" value={fighter.fightingStyle} />
                  <InfoItem label="Octagon Debut" value={fighter.octagonDebut} />
                  <InfoItem label="Place of Birth" value={fighter.placeOfBirth} />
                  <InfoItem label="Trains At" value={fighter.trainsAt} colSpan={2} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Videos */}
          <h2 className="text-3xl font-bold text-white mb-6">
            {fighterName}'s Fights
          </h2>
          
          {videosLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : totalVideos === 0 ? (
            <p className="text-gray-400 text-xl">No videos found for {fighterName}</p>
          ) : (
            <VideoGrid
              videos={videos}
              loading={videosLoading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>
    </>
  );
}

// Helper component for fighter info items
function InfoItem({ label, value, colSpan = 1 }: { label: string; value?: string, colSpan?: number }) {
  return (
    <div className={`${colSpan === 2 ? 'col-span-2' : ''}`}>
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="text-white">{value || 'N/A'}</div>
    </div>
  );
}