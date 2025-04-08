'use client';

import React from 'react';
import { Note } from '@/lib/types';

interface NoteDisplayProps {
  note: Note;
  label?: string;
  playable?: boolean;
  className?: string;
}

export const NoteDisplay = ({
  note,
  label,
  playable = false,
  className = ''
}: NoteDisplayProps) => {
  return (
    <div 
      className={`
        flex flex-col items-center justify-center p-3
        ${className}
      `}
    >
      <div className="text-xl font-bold">{note.name}{note.octave}</div>
      {label && <div className="text-sm text-gray-500 mt-1">{label}</div>}
    </div>
  );
}; 