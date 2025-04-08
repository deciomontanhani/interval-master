'use client';

import React from 'react';

interface GameLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const GameLayout = ({ children, className = '' }: GameLayoutProps) => {
  return (
    <div 
      className={`
        min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#E9ECEF]
        flex flex-col items-center p-4 md:p-8
        ${className}
      `}
    >
      <header className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1D3557] text-center">
          IntervalMaster
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Teste seu conhecimento de intervalos musicais
        </p>
      </header>
      
      <main className="w-full max-w-4xl flex-1">
        {children}
      </main>
      
      <footer className="w-full max-w-4xl mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} IntervalMaster - Todos os direitos reservados
      </footer>
    </div>
  );
}; 