import React from 'react';
import { Trophy } from 'lucide-react';

interface CommentarySectionProps {
  roundData: { commentary: string[] };
  isSimulating: boolean;
  showWinner: boolean;
  currentRound: number;
  winner: string|null;
  onRematch: () => void;
  onNew: () => void;
}

export function CommentarySection({ roundData, isSimulating, showWinner, currentRound, winner, onRematch, onNew }: CommentarySectionProps) {
  return (
    <div className="bg-gradient-to-b from-black to-purple-950 p-6 border-t-2 border-purple-800">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-pink-600 rounded-full mr-2 animate-pulse"></div>
        <h3 className="text-2xl font-extrabold text-white uppercase tracking-wider">Live Commentary</h3>
      </div>
      <div className="bg-black bg-opacity-50 p-4 rounded-lg border border-purple-900 max-h-48 overflow-y-auto shadow-inner">
        {roundData.commentary.map((comment, idx) => (
          <p key={idx} className={`my-2 ${idx === 0 ? 'font-bold text-cyan-300' : 'text-blue-400'}`}>
            {idx === 0 ? '🎙️ ' : '• '}{comment}
          </p>
        ))}
      </div>
      {showWinner && (
        <div className="mt-6 transform scale-105 transition-all duration-1000 text-center">
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 px-6 py-4 rounded-lg shadow-2xl border-2 border-pink-400">
            <Trophy className="mx-auto w-12 h-12 text-white drop-shadow-lg mb-2" />
            <h2 className="text-3xl font-black text-black mb-1">WINNER</h2>
            <p className="text-2xl font-bold text-white drop-shadow-md">{winner}</p>
            <div className="mt-4 flex flex-col space-y-2">
              <button onClick={onRematch} className="bg-white hover:bg-gray-100 text-black px-6 py-2 rounded-full font-bold transition-colors">Rematch</button>
              <button onClick={onNew} className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition-colors">New Fighters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
