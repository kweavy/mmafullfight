import React from 'react';

interface VsSectionProps {
  currentRound: number;
  totalRounds: number;
}

export function VsSection({ currentRound, totalRounds }: VsSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-pink-600 filter blur-3xl opacity-20" />
        <span className="text-7xl font-black text-pink-500 drop-shadow-glow animate-pulse">VS</span>
      </div>
      <div className="mt-8 bg-purple-900 px-6 py-3 rounded-full border border-purple-700">
        <div className="text-3xl font-bold text-white">ROUND {currentRound}</div>
        <div className="text-sm text-center text-purple-300">of {totalRounds}</div>
      </div>
    </div>
  );
}