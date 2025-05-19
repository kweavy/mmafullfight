import React from 'react';
import type { FighterStats as Stats } from '@/lib/api';

interface FighterStatsProps {
  stats: Stats;
  name: string;
  position: 'left' | 'right';
}

export function FighterStats({ stats, name, position }: FighterStatsProps) {
  const prefix = position === 'left' ? 'blue' : 'cyan';
  return (
    <div className="space-y-4 transform hover:scale-102 transition-transform">
      <div className="space-y-3">
        <h2 className={`text-2xl font-bold text-${prefix}-500`}>{name}</h2>
        {/* Health bar */}
        <div>
          <div className="flex justify-between text-sm">
            <span className={`text-${prefix}-400`}>Health</span>
            <span className="text-white font-bold">{stats.health}%</span>
          </div>
          <div className={`relative h-3 bg-${prefix}-950 rounded-full mt-1 overflow-hidden border border-${prefix}-800`}>
            <div
              className={`h-full transition-all duration-500 ${
                stats.health > 70
                  ? 'bg-green-500'
                  : stats.health > 30
                  ? 'bg-yellow-500'
                  : 'bg-red-600 animate-pulse'
              }`}
              style={{ width: `${stats.health}%` }}
            ></div>
          </div>
        </div>
        {/* Energy bar */}
        <div>
          <div className="flex justify-between text-sm">
            <span className={`text-${prefix}-400`}>Energy</span>
            <span className="text-white font-bold">{stats.energy}%</span>
          </div>
          <div className={`relative h-3 bg-${prefix}-950 rounded-full mt-1 overflow-hidden border border-${prefix}-800`}>
            <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${stats.energy}%` }}></div>
          </div>
        </div>
      </div>
      {/* Stats dashboard */}
      <div className={`bg-gradient-to-b from-${prefix}-900 to-${prefix}-950 p-4 rounded-lg border border-${prefix}-800 shadow-inner`}>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black bg-opacity-30 p-2 rounded text-center">
            <div className={`text-3xl font-bold text-${prefix}-400`}>{stats.strikes}</div>
            <div className={`text-sm text-${prefix}-300`}>STRIKES</div>
          </div>
          <div className="bg-black bg-opacity-30 p-2 rounded text-center">
            <div className={`text-2xl font-bold text-${prefix}-400`}>{stats.significant}</div>
            <div className={`text-sm text-${prefix}-300`}>SIGNIFICANT</div>
          </div>
          <div className="bg-black bg-opacity-30 p-2 rounded text-center mt-2">
            <div className={`text-2xl font-bold text-${prefix}-400`}>{stats.takedowns}</div>
            <div className={`text-sm text-${prefix}-300`}>TAKEDOWNS</div>
          </div>
          <div className="bg-black bg-opacity-30 p-2 rounded text-center mt-2">
            <div className={`text-xl font-bold text-${prefix}-400`}>{stats.control}</div>
            <div className={`text-sm text-${prefix}-300`}>CONTROL</div>
          </div>
        </div>
      </div>
    </div>
  );
}
