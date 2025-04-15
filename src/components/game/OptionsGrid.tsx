'use client';

import React, { useCallback } from 'react';
import { Note } from '@/lib/types';
import { Card } from '../ui/Card';
import { noteToIndex } from '@/lib/intervals';

interface OptionsGridProps {
  options: Note[];
  onSelect: (note: Note) => void;
  disabled?: boolean;
  correct?: Note | null;
  selected?: Note | null;
}

export const OptionsGrid = ({
  options,
  onSelect,
  disabled = false,
  correct = null,
  selected = null
}: OptionsGridProps) => {
  const getOptionClass = useCallback((option: Note) => {
    if (!selected || !correct) return '';
    
    if (correct && noteToIndex[option.name] === noteToIndex[correct.name]) {
      return 'border-2 border-green-500 bg-green-50';
    }
    
    if (
      selected &&
      noteToIndex[option.name] === noteToIndex[selected.name] &&
      noteToIndex[option.name] !== noteToIndex[correct?.name || '']
    ) {
      return 'border-2 border-red-500 bg-red-50';
    }
    
    return '';
  }, [selected, correct]);
  
  const handleOptionClick = useCallback((option: Note) => {
    if (!disabled) {
      onSelect(option);
    }
  }, [disabled, onSelect]);
  
  // Determinar o melhor layout de grid com base na quantidade de opções
  const getGridClass = () => {
    const count = options.length;
    
    // Em dispositivos móveis sempre 2 colunas para telas pequenas
    if (count <= 3) {
      return "grid-cols-2 md:grid-cols-3";
    } else if (count === 4) {
      return "grid-cols-2 md:grid-cols-2 lg:grid-cols-4";
    } else {
      return "grid-cols-2 md:grid-cols-3";
    }
  };
  
  return (
    <div className={`grid ${getGridClass()} gap-3 w-full`}>
      {options.map((option, index) => (
        <Card
          key={`${option.name}-${index}`}
          className={`
            aspect-square flex flex-col items-center justify-center
            cursor-pointer transition-all p-0 overflow-hidden
            hover:bg-blue-50 active:bg-blue-100 touch-manipulation
            min-h-[80px] md:min-h-[100px]
            ${disabled ? 'opacity-80 pointer-events-none' : ''}
            ${getOptionClass(option)}
          `}
          elevation={selected ? 'none' : 'sm'}
          onClick={() => handleOptionClick(option)}
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl md:text-3xl font-bold">
              {option.name}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}; 