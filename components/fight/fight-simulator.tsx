'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dices, Swords, X } from "lucide-react";
import { useRouter } from 'next/navigation';
import { getFighters, type FightersResponse } from '@/lib/api';

const getRandomGradient = () => {
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
    'from-yellow-500 to-red-400',
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

const fightersPerPage = 10;

export default function FightSimulator() {
  const router = useRouter();
  const [fighter1, setFighter1] = useState('');
  const [fighter2, setFighter2] = useState('');
  const [dreamMode, setDreamMode] = useState(false);
  const [fighters, setFighters] = useState<FightersResponse>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [gradients, setGradients] = useState<Record<string, string>>({});
  const [filterClass, setFilterClass] = useState('');

  useEffect(() => {
    const loadFighters = async () => {
      const data = await getFighters();
      const gradientMap: Record<string, string> = {};
      for (const id of Object.keys(data)) {
        gradientMap[id] = getRandomGradient();
      }
      setGradients(gradientMap);
      setFighters(data);
      setIsLoading(false);
    };
    loadFighters();
  }, []);

  const simulateFight = () => {
    localStorage.setItem('selectedFighters', JSON.stringify({
      fighter1: fighters[fighter1],
      fighter2: fighters[fighter2],
      isDreamMode: dreamMode
    }));
    router.push('/fight');
  };

  const fightersList = Object.entries(fighters)
    .map(([id, fighter]) => ({ id, ...fighter }))
    .filter(f => filterClass ? f.category === filterClass : true);

  const totalPages = Math.ceil(fightersList.length / fightersPerPage);
  const paginatedFighters = fightersList.slice(
    (currentPage - 1) * fightersPerPage,
    currentPage * fightersPerPage
  );

  const handleSelect = (id: string) => {
    if (fighter1 === id) setFighter1('');
    else if (fighter2 === id) setFighter2('');
    else if (!fighter1) setFighter1(id);
    else if (!fighter2) setFighter2(id);
  };

  const isSelected = (id: string) => {
    if (id === fighter1) return 'ring-4 ring-blue-500 scale-105';
    if (id === fighter2) return 'ring-4 ring-red-500 scale-105';
    return '';
  };

  const weightClasses = Array.from(new Set(
    Object.values(fighters).map(f => f.category)
  ));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between gap-6 items-center relative">
        {/* Fighter 1 Preview (left) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
          className="w-1/6 flex flex-col items-center text-white">
          <div className={`aspect-[9/16] w-full overflow-hidden rounded-xl ${fighter1 ? 'border-4 border-blue-500' : 'border border-dashed border-white/20'}`}>
            {fighter1 ? (
              <img
                src={fighters[fighter1]?.imgUrl}
                alt={fighters[fighter1]?.name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-white/50">Fighter 1</div>
            )}
          </div>
          {fighter1 && (
            <>
              <h2 className="font-bold mt-2 text-center">{fighters[fighter1]?.name}</h2>
              <p className="text-sm text-white/70 text-center">{fighters[fighter1]?.category}</p>
            </>
          )}
        </motion.div>

     
        {/* Main Content */}
        <div className="w-full md:w-4/6">
          <Card className="p-6 bg-zinc-900 border border-zinc-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <Label className="text-2xl font-extrabold text-white">
                Select Your Fighters
              </Label>
              <div className="flex gap-2">
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-600"
                >
                  <option value="">All Weight Classes</option>
                  {weightClasses.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <Button variant="outline" onClick={() => {
                  setFighter1('');
                  setFighter2('');
                }}>
                  <X className="w-4 h-4 mr-1" /> Clear
                </Button>
              </div>
            </div>

            {/* Fighter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {paginatedFighters.map((fighter) => (
                <motion.div
                  key={fighter.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleSelect(fighter.id)}
                  className={`cursor-pointer rounded-xl overflow-hidden bg-zinc-800 hover:brightness-110 transition-all duration-200 border ${isSelected(fighter.id)}`}
                >
                  <div className={`w-full h-40 bg-gradient-to-br ${gradients[fighter.id]} rounded-t-lg overflow-hidden`}>
                    <img
                      src={fighter.imgUrl}
                      alt={fighter.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-2 text-center text-white">
                    <p className="font-semibold text-sm">{fighter.name}</p>
                    <p className="text-xs text-white/70">{fighter.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-white text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={dreamMode}
                  onCheckedChange={setDreamMode}
                  id="dream-mode"
                />
                <Label htmlFor="dream-mode" className="text-white">
                  Dream Mode (Ignore Reach/Weight Advantage)
                </Label>
              </div>

              <div className="space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    const randomFighters = fightersList
                      .sort(() => Math.random() - 0.5)
                      .slice(0, 2);
                    setFighter1(randomFighters[0].id);
                    setFighter2(randomFighters[1].id);
                  }}
                >
                  <Dices className="mr-2 h-4 w-4" />
                  Random Matchup
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={simulateFight}
                  disabled={!fighter1 || !fighter2}
                >
                  <Swords className="mr-2 h-4 w-4" />
                  Let’s Get It On!
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Fighter 2 Preview (right) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
          className="w-1/6 flex flex-col items-center text-white">
          <div className={`aspect-[9/16] w-full overflow-hidden rounded-xl ${fighter2 ? 'border-4 border-red-500' : 'border border-dashed border-white/20'}`}>
            {fighter2 ? (
              <img
                src={fighters[fighter2]?.imgUrl}
                alt={fighters[fighter2]?.name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-white/50">Fighter 2</div>
            )}
          </div>
          {fighter2 && (
            <>
              <h2 className="font-bold mt-2 text-center">{fighters[fighter2]?.name}</h2>
              <p className="text-sm text-white/70 text-center">{fighters[fighter2]?.category}</p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
