'use client';

import React from 'react';
import { Note } from '@/lib/types';

interface NoteDisplayProps {
  note: Note;
  label?: string;
  className?: string;
  showOctave?: boolean;
  compact?: boolean;
}

export const NoteDisplay = ({
  note,
  label,
  className = '',
  showOctave = true,
  compact = false
}: NoteDisplayProps) => {
  return (
    <div 
      className={`
        flex ${compact ? 'inline-flex' : 'flex-col'} items-center justify-center
        ${compact ? 'p-1.5' : 'p-3'}
        ${className}
      `}
    >
      <div className={`font-bold ${compact ? 'text-lg' : 'text-xl'}`}>
        {note.name}{showOctave && note.octave ? note.octave : ''}
      </div>
      {label && <div className={`text-gray-500 ${compact ? 'text-sm ml-2' : 'text-sm mt-1'}`}>{label}</div>}
    </div>
  );
}; 