'use client';

import { useEffect, useState } from 'react';
import { getFighters, type FightersResponse, type Fighter } from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function generatePairs(fighters: (Fighter & { id: string })[], count: number) {
  const pairs: { fighter1: Fighter & { id: string }; fighter2: Fighter & { id: string } }[] = [];
  while (pairs.length < count) {
    const [a, b] = [...fighters].sort(() => 0.5 - Math.random()).slice(0, 2);
    if (a.id !== b.id) pairs.push({ fighter1: a, fighter2: b });
  }
  return pairs;
}

export default function HeroTapeSlider() {
  const [pairs, setPairs] = useState<
    { fighter1: Fighter & { id: string }; fighter2: Fighter & { id: string } }[]
  >([]);
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const data: FightersResponse = await getFighters();
      const all = Object.entries(data)
        .filter(([, f]) => f.imgUrl)
        .map(([id, f]) => ({ ...f, id }));
      setPairs(generatePairs(all, 10));
    };
    load();
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % pairs.length);
  const prev = () => setCurrent((prev) => (prev - 1 + pairs.length) % pairs.length);

  if (pairs.length === 0)
    return (
      <div className="h-screen bg-black text-white flex justify-center items-center">
        Loading...
      </div>
    );

  const { fighter1, fighter2 } = pairs[current];

  const statRows = [
    { label: 'AGE', value1: fighter1.age, value2: fighter2.age },
    { label: 'HEIGHT', value1: fighter1.height, value2: fighter2.height },
    { label: 'WEIGHT', value1: fighter1.weight, value2: fighter2.weight },
    { label: 'REACH', value1: fighter1.reach, value2: fighter2.reach },
    { label: 'LEG REACH', value1: fighter1.legReach, value2: fighter2.legReach },
    { label: 'STYLE', value1: fighter1.fightingStyle || '-', value2: fighter2.fightingStyle || '-' },
  ];

  const handleSimulate = () => {
    localStorage.setItem(
      'selectedFighters',
      JSON.stringify({
        fighter1,
        fighter2,
        isDreamMode: false,
      })
    );
    router.push('/fight');
  };

  return (
    <section className="relative h-screen w-full bg-black text-white overflow-hidden font-sans">
      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute z-20 left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute z-20 right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Layout */}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-4 md:px-16">
        <div className="flex w-full justify-between items-center mb-4">
          {/* Fighter 1 */}
          <div className="w-1/3 text-center flex flex-col items-center">
            <img
              src={fighter1.imgUrl}
              alt={fighter1.name}
              className="h-[60vh] object-contain"
            />
            <h2 className="text-3xl lg:text-4xl font-extrabold mt-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent uppercase">
              {fighter1.name}
            </h2>
            <p className="text-sm text-white/70">{fighter1.category}</p>
            <p className="text-xs text-white/50 mt-1">
              Record: {fighter1.wins}-{fighter1.losses}-{fighter1.draws}
            </p>
          </div>

          {/* Tale of the Tape */}
          <div className="w-1/3 bg-zinc-900/80 rounded-xl py-6 px-6 shadow-2xl text-center border border-zinc-700">
            <h3 className="text-sm tracking-widest uppercase text-yellow-400 mb-1">
              UFC FIGHT NIGHT
            </h3>
            <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent uppercase">
              Tale of the Tape
            </h2>

            <div className="grid grid-cols-3 gap-y-3 text-sm md:text-base font-bold">
              {statRows.map((row, i) => (
                <div key={i} className="contents">
                  <div className="text-right bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    {row.value1 || '-'}
                  </div>
                  <div className="text-center text-white/60 font-semibold">
                    {row.label}
                  </div>
                  <div className="text-left bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    {row.value2 || '-'}
                  </div>
                </div>
              ))}
            </div>

            {/* Simulate Button */}
            <div className="mt-10">
              <Button
                onClick={handleSimulate}
                variant="outline"
                className="border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-full"
              >
                <span className="text-lg lg:text-xl font-extrabold bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent uppercase tracking-wide">
                  Simulate The Fight With AI
                </span>
              </Button>
            </div>
          </div>

          {/* Fighter 2 */}
          <div className="w-1/3 text-center flex flex-col items-center">
            <img
              src={fighter2.imgUrl}
              alt={fighter2.name}
              className="h-[60vh] object-contain scale-x-[-1]"
            />
            <h2 className="text-3xl lg:text-4xl font-extrabold mt-2 bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent uppercase">
              {fighter2.name}
            </h2>
            <p className="text-sm text-white/70">{fighter2.category}</p>
            <p className="text-xs text-white/50 mt-1">
              Record: {fighter2.wins}-{fighter2.losses}-{fighter2.draws}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
