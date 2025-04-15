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
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
      {options.map((option, index) => (
        <Card
          key={`${option.name}-${index}`}
          className={`
            p-4 text-center cursor-pointer transition-all
            hover:bg-blue-50 hover:shadow-md
            ${disabled ? 'opacity-80 pointer-events-none' : ''}
            ${getOptionClass(option)}
          `}
          elevation={selected ? 'none' : 'sm'}
          onClick={() => handleOptionClick(option)}
        >
          <div className="text-xl md:text-2xl font-bold">
            {option.name}
          </div>
        </Card>
      ))}
    </div>
  );
}; 