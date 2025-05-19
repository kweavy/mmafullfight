import React from 'react';
import type { RoundData } from '@/lib/api';

interface FightHistoryProps {
  roundByRoundData: RoundData[];
  fighters: { fighter1Name: string; fighter2Name: string };
}

export function FightHistory({ roundByRoundData, fighters }: FightHistoryProps) {
  return (
    <>
      {roundByRoundData.length > 0 && (
        <div className="bg-gradient-to-b from-purple-950 to-black p-6 border-t-2 border-purple-800">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
            <h3 className="text-2xl font-extrabold text-white uppercase tracking-wider">Fight History</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roundByRoundData.map((round, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-indigo-900 to-black p-4 rounded-lg border border-indigo-800 hover:border-pink-600 transition-colors shadow-md"
              >
                <h4 className="text-lg font-bold text-pink-500 mb-3 uppercase">Round {idx + 1} Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="font-bold text-white">{fighters.fighter1Name}</p>
                    <div className="bg-black bg-opacity-40 p-2 rounded">
                      <p className="text-blue-300">
                        Strikes: <span className="text-white font-bold">{round.fighter1Stats.strikes}</span> (<span className="text-blue-400">{round.fighter1Stats.significant}</span> sig.)
                      </p>
                      <p className="text-blue-300">
                        Takedowns: <span className="text-white font-bold">{round.fighter1Stats.takedowns}</span>/<span className="text-blue-400">{round.fighter1Stats.takedownAttempts}</span>
                      </p>
                      <p className="text-blue-300">
                        Control: <span className="text-white font-bold">{round.fighter1Stats.control}</span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-white">{fighters.fighter2Name}</p>
                    <div className="bg-black bg-opacity-40 p-2 rounded">
                      <p className="text-cyan-300">
                        Strikes: <span className="text-white font-bold">{round.fighter2Stats.strikes}</span> (<span className="text-cyan-400">{round.fighter2Stats.significant}</span> sig.)
                      </p>
                      <p className="text-cyan-300">
                        Takedowns: <span className="text-white font-bold">{round.fighter2Stats.takedowns}</span>/<span className="text-cyan-400">{round.fighter2Stats.takedownAttempts}</span>
                      </p>
                      <p className="text-cyan-300">
                        Control: <span className="text-white font-bold">{round.fighter2Stats.control}</span>
                      </p>
                    </div>
                  </div>
                </div>
                {round.commentary[0] && (
                  <div className="mt-3 text-pink-400 italic text-sm bg-black bg-opacity-30 p-2 rounded">
                    "🎙️ {round.commentary[0].replace('🎙️ ', '')}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}