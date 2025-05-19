import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface NotificationsProps {
  apiError: string | null;
  isLoading: boolean;
}

export function Notifications({ apiError, isLoading }: NotificationsProps) {
  return (
    <>
      {apiError && (
        <div className="max-w-5xl mx-auto mb-4 bg-red-800 text-white p-4 rounded-lg border border-red-600 shadow-lg flex items-center transform hover:scale-102 transition-transform">
          <AlertTriangle className="w-6 h-6 mr-2 text-yellow-400 animate-pulse" />
          <p className="font-medium">{apiError}</p>
        </div>
      )}
      {isLoading && (
        <div className="max-w-5xl mx-auto mb-4 bg-gradient-to-r from-purple-700 to-blue-700 text-white p-4 rounded-lg border border-cyan-500 shadow-lg flex items-center">
          <div className="animate-spin mr-3 w-6 h-6 border-4 border-white border-t-transparent rounded-full"></div>
          <p className="font-bold tracking-wide">SIMULATING FIGHT IN PROGRESS...</p>
        </div>
      )}
    </>
  );
}