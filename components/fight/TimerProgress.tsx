import React from 'react';
import { Timer } from 'lucide-react';

interface TimerProgressProps {
  timeLeft: number;
  totalRounds: number;
  currentRound: number;
  roundProgress: number;
}

export function TimerProgress({ timeLeft, totalRounds, currentRound, roundProgress }: TimerProgressProps) {
  return (
    <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 p-6 border-y-2 border-purple-800">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center bg-black px-4 py-2 rounded-lg">
          <Timer className="w-8 h-8 text-cyan-400 mr-2 animate-pulse" />
          <span className="text-4xl font-mono font-bold text-white">{timeLeft}s</span>
        </div>
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalRounds }).map((_, i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              i < currentRound
                ? 'border-yellow-500 bg-yellow-600 text-black'
                : i === currentRound - 1
                ? 'border-cyan-500 bg-purple-900 text-white animate-pulse'
                : 'border-purple-800 bg-purple-950 text-purple-600'
            }`}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="relative h-4 bg-purple-950 rounded-full overflow-hidden border border-purple-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-600 to-pink-500 transition-all duration-300"
          style={{ width: `${roundProgress}%` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-grid-pattern"></div>
      </div>
    </div>
  );
}
