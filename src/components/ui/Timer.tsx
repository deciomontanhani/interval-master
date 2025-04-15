'use client';

import React, { memo, useState, useEffect } from 'react';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  className?: string;
}

export const Timer = memo(({
  timeRemaining,
  totalTime,
  className = ''
}: TimerProps) => {
  const [percentage, setPercentage] = useState(100);
  const [colorClass, setColorClass] = useState('bg-green-500');
  const [displayTime, setDisplayTime] = useState('');
  
  // Cálculos movidos para um efeito para evitar inconsistências entre servidor e cliente
  useEffect(() => {
    // Calculando porcentagem de tempo restante
    const calculatedPercentage = Math.max(0, (timeRemaining / totalTime) * 100);
    setPercentage(calculatedPercentage);
    
    // Determinando a cor com base no tempo restante
    let newColorClass = 'bg-green-500';
    if (calculatedPercentage < 30) {
      newColorClass = 'bg-red-500';
    } else if (calculatedPercentage < 60) {
      newColorClass = 'bg-yellow-500';
    }
    setColorClass(newColorClass);
    
    // Formatando o tempo para exibição
    setDisplayTime(`${Math.ceil(timeRemaining)}s`);
  }, [timeRemaining, totalTime]);
  
  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all ${colorClass}`}
        style={{ width: `${percentage}%` }}
      />
      <p className="text-center text-sm mt-1 font-bold">
        {displayTime}
      </p>
    </div>
  );
});

// Adicionando o displayName
Timer.displayName = 'Timer'; 