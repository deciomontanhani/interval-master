import * as Tone from 'tone';
import { Note } from './types';

// Inicializar o sintetizador com a configuração para piano
let synth: Tone.PolySynth | null = null;

// Inicializa o sintetizador
export const initAudio = async (): Promise<void> => {
  // Garante que o contexto de áudio está inicializado após interação do usuário
  await Tone.start();
  
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.set({
      envelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.3,
        release: 1
      }
    });
  }
};

// Converte objeto Note para formato de nota do Tone.js
const formatNoteForTone = (note: Note): string => {
  // Se não tiver oitava definida, usa a oitava 4 como padrão
  const octave = note.octave || 4;
  return `${note.name}${octave}`;
};

// Toca uma nota
export const playNote = (note: Note, duration: number = 1): void => {
  if (!synth) {
    console.error('Synth not initialized. Call initAudio() first.');
    return;
  }
  
  const formattedNote = formatNoteForTone(note);
  synth.triggerAttackRelease(formattedNote, duration);
};

// Toca um acorde (múltiplas notas ao mesmo tempo)
export const playChord = (notes: Note[], duration: number = 1): void => {
  if (!synth) {
    console.error('Synth not initialized. Call initAudio() first.');
    return;
  }
  
  const formattedNotes = notes.map(formatNoteForTone);
  synth.triggerAttackRelease(formattedNotes, duration);
};

// Toca uma sequência de notas
export const playSequence = async (notes: Note[], duration: number = 0.5, gap: number = 0.1): Promise<void> => {
  if (!synth) {
    console.error('Synth not initialized. Call initAudio() first.');
    return;
  }
  
  // Converte os tempos para segundos do Tone.js
  const now = Tone.now();
  
  notes.forEach((note, index) => {
    const formattedNote = formatNoteForTone(note);
    const time = now + (duration + gap) * index;
    synth?.triggerAttackRelease(formattedNote, duration, time);
  });
  
  // Aguarde até que a última nota termine
  return new Promise((resolve) => {
    setTimeout(resolve, (notes.length * (duration + gap) * 1000));
  });
};

// Toca um som de acerto
export const playCorrectSound = (): void => {
  if (!synth) {
    console.error('Synth not initialized. Call initAudio() first.');
    return;
  }
  
  // Sequência ascendente rápida com som agradável
  const now = Tone.now();
  synth.triggerAttackRelease('C5', 0.1, now);
  synth.triggerAttackRelease('E5', 0.1, now + 0.1);
  synth.triggerAttackRelease('G5', 0.2, now + 0.2);
};

// Toca um som de erro
export const playWrongSound = (): void => {
  if (!synth) {
    console.error('Synth not initialized. Call initAudio() first.');
    return;
  }
  
  // Som dissonante curto
  const now = Tone.now();
  synth.triggerAttackRelease('C4', 0.1, now);
  synth.triggerAttackRelease('C#4', 0.2, now + 0.05);
}; 