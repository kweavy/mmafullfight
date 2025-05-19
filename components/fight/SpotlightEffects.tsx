import React from 'react';

export function SpotlightEffects() {
  return (
    <>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
    </>
  );
}