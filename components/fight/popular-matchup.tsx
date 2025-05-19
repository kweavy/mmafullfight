'use client';

import { useEffect, useRef, useState } from 'react';
import { getFighters, type FightersResponse, type Fighter } from '@/lib/api';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const gradients = [
  'from-red-500 to-yellow-500',
  'from-purple-600 to-pink-500',
  'from-blue-600 to-indigo-500',
  'from-green-500 to-lime-500',
  'from-orange-500 to-red-600',
  'from-cyan-500 to-blue-500',
  'from-rose-500 to-pink-500',
  'from-teal-500 to-emerald-500',
  'from-indigo-500 to-violet-500',
];

function generatePairs(fighters: FightersResponse, count: number): { fighter1: Fighter; fighter2: Fighter }[] {
  const entries = Object.values(fighters);
  const pairs: { fighter1: Fighter; fighter2: Fighter }[] = [];

  while (pairs.length < count && entries.length >= 2) {
    const shuffled = [...entries].sort(() => 0.5 - Math.random());
    const [fighter1, fighter2] = [shuffled[0], shuffled[1]];

    if (fighter1.name !== fighter2.name) {
      pairs.push({ fighter1, fighter2 });
    }
  }

  return pairs;
}

export default function PopularMatchupsSection() {
  const [pairs, setPairs] = useState<{ fighter1: Fighter; fighter2: Fighter }[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const maxRetries = 3;

  const loadFighters = async (attempt = 1) => {
    const data = await getFighters();
    const generated = generatePairs(data, 10);

    if (generated.length < 10 && attempt < maxRetries) {
      setTimeout(() => loadFighters(attempt + 1), 500);
    } else {
      setPairs(generated);
    }
  };

  useEffect(() => {
    loadFighters();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const scrollAmount = 320;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-black relative">
      {/* Arrows */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 p-2 rounded-full z-20 hover:bg-opacity-100"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 p-2 rounded-full z-20 hover:bg-opacity-100"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Scrollable container */}
      <div className="overflow-x-auto px-6" ref={sliderRef}>
        <div className="flex gap-6 w-max">
          {pairs.map((pair, idx) => {
            const gradient = gradients[idx % gradients.length];
            const f1 = pair.fighter1;
            const f2 = pair.fighter2;

            const f1Wins = parseInt(f1.wins) || 0;
            const f1Losses = parseInt(f1.losses) || 0;
            const f1Total = f1Wins + f1Losses;
            const f1Rate = f1Total > 0 ? Math.round((f1Wins / f1Total) * 100) : 0;

            const f2Wins = parseInt(f2.wins) || 0;
            const f2Losses = parseInt(f2.losses) || 0;
            const f2Total = f2Wins + f2Losses;
            const f2Rate = f2Total > 0 ? Math.round((f2Wins / f2Total) * 100) : 0;

            return (
              <div
                key={idx}
                className={`min-w-[280px] max-w-[300px] rounded-xl overflow-hidden shadow-lg bg-gradient-to-br ${gradient} border border-white/10 flex flex-col items-center`}
              >
                {/* Images */}
                <div className="flex w-full h-48">
                  <img
                    src={f1.imgUrl}
                    alt={f1.name}
                    className="w-1/2 h-full object-cover object-top"
                  />
                  <img
                    src={f2.imgUrl}
                    alt={f2.name}
                    className="w-1/2 h-full object-cover object-top scale-x-[-1]"
                  />
                </div>

                {/* Info & Stats */}
                <div className="p-4 text-white text-center">
                  <h3 className="text-lg font-bold">{f1.name}</h3>
                  <p className="text-xs text-white/70 mb-1">{f1.category}</p>
                 

                  <p className="font-bold text-sm mb-2">vs</p>

                  <h3 className="text-lg font-bold">{f2.name}</h3>
                  <p className="text-xs text-white/70 mb-1">{f2.category}</p>
                
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
