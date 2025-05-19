import React from 'react';
import type { Fighter } from '@/lib/api';

interface FighterShowcaseProps {
  fighter: Fighter;
  position: 'left' | 'right';
}

export function FighterShowcase({ fighter, position }: FighterShowcaseProps) {
  const gradient = position === 'left' ? 'from-blue-600 to-transparent' : 'from-cyan-600 to-transparent';
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-30 rounded-full filter blur-md`} />
        <img
          src={fighter.imgUrl}
          alt={fighter.name}
          className="h-72 object-contain hover:scale-105 transition-transform duration-300 z-10"
        />
      </div>
      <div className={`w-full mt-2 p-2 rounded-lg text-center ${position === 'left' ? 'bg-blue-900' : 'bg-cyan-900'}`}>
        <h3 className="text-xl font-bold text-white">{fighter.name}</h3>
        <p className={`text-sm ${position === 'left' ? 'text-blue-300' : 'text-cyan-300'}`}>{fighter.record || 'Professional Fighter'}</p>
      </div>
    </div>
  );
}
