import React, { memo } from 'react';

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
  // Calculando porcentagem de tempo restante
  const percentage = Math.max(0, (timeRemaining / totalTime) * 100);
  
  // Determinando a cor com base no tempo restante
  let colorClass = 'bg-green-500';
  if (percentage < 30) {
    colorClass = 'bg-red-500';
  } else if (percentage < 60) {
    colorClass = 'bg-yellow-500';
  }
  
  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all ${colorClass}`}
        style={{ width: `${percentage}%` }}
      />
      <p className="text-center text-sm mt-1 font-bold">
        {Math.ceil(timeRemaining)}s
      </p>
    </div>
  );
}); 