'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface GameLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const GameLayout = ({ children, className = '' }: GameLayoutProps) => {
  const pathname = usePathname();
  const isGamePage = pathname === '/game';
  
  return (
    <div 
      className={`
        min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#E9ECEF]
        flex flex-col items-center px-2 py-2 md:px-4 md:py-3
        ${className}
      `}
    >
      <header className={`w-full max-w-4xl ${isGamePage ? 'mb-2' : 'mb-6'}`}>
        <h1 className={`font-bold text-[#1D3557] text-center ${isGamePage ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'}`}>
          IntervalMaster
        </h1>
      </header>
      
      <main className="w-full max-w-4xl flex-1 flex flex-col">
        {children}
      </main>
      
      <footer className={`w-full max-w-4xl ${isGamePage ? 'mt-2 text-xs' : 'mt-6 text-sm'} text-center text-gray-500`}>
        &copy; {new Date().getFullYear()} IntervalMaster - <a href="https://github.com/deciomontanhani" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Décio Montanhani</a>
      </footer>
    </div>
  );
}; 