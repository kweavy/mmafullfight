import React from 'react';
import { Trophy } from 'lucide-react';

interface HeaderBannerProps {
  isTitleFight: boolean;
}

export function HeaderBanner({ isTitleFight }: HeaderBannerProps) {
  return (
    <div className="bg-gradient-to-r from-blue-800 via-purple-600 to-blue-800 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {isTitleFight && <Trophy className="w-8 h-8 text-yellow-400 mr-2 filter drop-shadow-lg animate-bounce" />}
          <h1 className="text-3xl font-black uppercase tracking-wider text-white">
            {isTitleFight ? 'CHAMPIONSHIP FIGHT' : 'UFC MAIN EVENT'}
          </h1>
        </div>
        <div className="flex items-center bg-pink-900 px-3 py-1 rounded-full">
          <div className="w-3 h-3 bg-pink-500 rounded-full mr-2 animate-ping"></div>
          <span className="font-bold uppercase text-white tracking-widest">LIVE</span>
        </div>
      </div>
    </div>
  );
}