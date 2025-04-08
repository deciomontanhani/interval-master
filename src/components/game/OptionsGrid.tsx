'use client';

import React, { useState } from 'react';
import { Note } from '@/lib/types';
import { Card } from '../ui/Card';

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
  const getOptionClass = (option: Note) => {
    if (!selected || !correct) return '';
    
    if (option.name === correct.name && option.octave === correct.octave) {
      return 'border-2 border-green-500 bg-green-50';
    }
    
    if (
      selected &&
      option.name === selected.name &&
      option.octave === selected.octave &&
      (option.name !== correct.name || option.octave !== correct.octave)
    ) {
      return 'border-2 border-red-500 bg-red-50';
    }
    
    return '';
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
      {options.map((option, index) => (
        <Card
          key={`${option.name}-${option.octave}-${index}`}
          className={`
            p-4 text-center cursor-pointer transition-all
            hover:bg-blue-50 hover:shadow-md
            ${disabled ? 'opacity-80 pointer-events-none' : ''}
            ${getOptionClass(option)}
          `}
          elevation={selected ? 'none' : 'sm'}
          onClick={() => !disabled && onSelect(option)}
        >
          <div className="text-xl md:text-2xl font-bold">
            {option.name}
          </div>
          <div className="text-sm text-gray-600">
            Oitava {option.octave}
          </div>
        </Card>
      ))}
    </div>
  );
}; 