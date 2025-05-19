'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

interface Fighter {
  name: string;
  imgUrl: string;
  category: string;
  wins: string;
  losses: string;
  draws: string;
  status: string;
  placeOfBirth: string;
  trainsAt: string;
  fightingStyle: string;
  age: string;
  height: string;
  weight: string;
  octagonDebut: string;
  reach: string;
  legReach: string;
}

const FIGHTERS_PER_PAGE = 12;

export default function FightersPage() {
  const [fighters, setFighters] = useState<Record<string, Fighter>>({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Divisions');
  
  useEffect(() => {
    async function fetchFighters() {
      try {
        setLoading(true);
        const response = await fetch('https://api.octagon-api.com/fighters');
        const data = await response.json();
        setFighters(data);
      } catch (error) {
        console.error('Error fetching fighters:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFighters();
  }, []);

  // Get all unique categories using Object.values and reduce instead of Set
  const categoriesArray = Object.values(fighters).map(fighter => fighter.category);
  const uniqueCategories = categoriesArray.reduce<string[]>((acc, category) => {
    if (!acc.includes(category)) {
      acc.push(category);
    }
    return acc;
  }, []);
  
  // Add 'All Divisions' at the beginning
  const categories = ['All Divisions', ...uniqueCategories];
  
  // Filter fighters by selected category
  const filteredFighters = Object.entries(fighters).filter(([_, fighter]) => 
    selectedCategory === 'All Divisions' || fighter.category === selectedCategory
  );
  
  // Calculate pagination
  const totalFighters = filteredFighters.length;
  const totalPages = Math.ceil(totalFighters / FIGHTERS_PER_PAGE);
  const paginatedFighters = filteredFighters.slice(
    (currentPage - 1) * FIGHTERS_PER_PAGE, 
    currentPage * FIGHTERS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#141414] pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">UFC Fighters</h1>
          
          {/* Categories filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedFighters.map(([id, fighter]) => (
                  <Link href={`/fighters/${id}`} key={id} className="block">
                    <div className="bg-gray-900 rounded-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
                      <div className="h-64 bg-gray-800 relative">
                        {fighter.imgUrl ? (
                          <img
                            src={fighter.imgUrl}
                            alt={fighter.name}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white text-xl font-bold mb-2">{fighter.name.trim()}</h3>
                        <p className="text-gray-400 text-sm mb-2">{fighter.category}</p>
                        <div className="flex justify-between">
                          <div className="flex gap-2">
                            <span className="text-green-500">{fighter.wins}W</span>
                            <span className="text-red-500">{fighter.losses}L</span>
                            <span className="text-gray-400">{fighter.draws}D</span>
                          </div>
                          <span className={`text-sm ${fighter.status === 'Active' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {fighter.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded ${
                          currentPage === page
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}