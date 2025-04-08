'use client';

import React from 'react';

interface ScoreDisplayProps {
  score: number;
  streak: number;
  round: number;
  totalRounds: number;
  level: number;
  className?: string;
}

export const ScoreDisplay = ({
  score,
  streak,
  round,
  totalRounds,
  level,
  className = ''
}: ScoreDisplayProps) => {
  const getLevelName = (level: number) => {
    switch (level) {
      case 1: return 'Iniciante';
      case 2: return 'Intermediário';
      case 3: return 'Avançado';
      case 4: return 'Expert';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between items-center">
        <div className="text-gray-600 font-medium">Pontuação:</div>
        <div className="text-2xl font-bold text-[#3861FB]">{score}</div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-gray-600 font-medium">Sequência:</div>
        <div 
          className={`
            font-bold px-3 py-1 rounded-full text-white 
            ${streak > 0 ? 'bg-[#F5B014]' : 'bg-gray-400'}
          `}
        >
          {streak}x
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-gray-600 font-medium">Rodada:</div>
        <div className="font-semibold">
          {round}/{totalRounds}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-gray-600 font-medium">Nível:</div>
        <div className="font-semibold text-[#1D3557]">
          {getLevelName(level)}
        </div>
      </div>
    </div>
  );
}; 