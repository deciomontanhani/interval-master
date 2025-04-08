import { Note, NoteName, Interval, IntervalType, IntervalNumber } from './types';

// Mapeamento de notas para índices (0-11)
const noteToIndex: Record<NoteName, number> = {
  'C': 0,
  'C#': 1,
  'D': 2,
  'D#': 3,
  'E': 4,
  'F': 5,
  'F#': 6,
  'G': 7,
  'G#': 8,
  'A': 9,
  'A#': 10,
  'B': 11
};

// Mapeamento de índices para notas
const indexToNote: Record<number, NoteName> = {
  0: 'C',
  1: 'C#',
  2: 'D',
  3: 'D#',
  4: 'E',
  5: 'F',
  6: 'F#',
  7: 'G',
  8: 'G#',
  9: 'A',
  10: 'A#',
  11: 'B'
};

// Número de semitons para intervalos justos/perfeitos
const perfectIntervals: Record<IntervalNumber, number> = {
  '1': 0,
  '4': 5,
  '5': 7,
  '8': 12,
  '2': 2, // Para completar o record, mas estes são normalmente maiores/menores
  '3': 4, // Para completar o record, mas estes são normalmente maiores/menores
  '6': 9, // Para completar o record, mas estes são normalmente maiores/menores
  '7': 11 // Para completar o record, mas estes são normalmente maiores/menores
};

// Número de semitons para intervalos maiores
const majorIntervals: Record<IntervalNumber, number> = {
  '2': 2,
  '3': 4,
  '6': 9,
  '7': 11,
  '1': 0, // Para completar o record, mas estes são normalmente justos
  '4': 5, // Para completar o record, mas estes são normalmente justos
  '5': 7, // Para completar o record, mas estes são normalmente justos
  '8': 12 // Para completar o record, mas estes são normalmente justos
};

// Verifica se um intervalo é tipicamente perfeito (justa)
const isPerfectInterval = (number: IntervalNumber): boolean => {
  return ['1', '4', '5', '8'].includes(number);
};

// Calcula a nota resultante de um intervalo a partir de uma nota de referência
export const calculateInterval = (referenceNote: Note, interval: Interval): Note => {
  const { name, octave } = referenceNote;
  const { number, type = isPerfectInterval(number) ? 'J' : 'M' } = interval;
  
  let semitonesAway = 0;
  
  // Determinar o número de semitons com base no tipo de intervalo
  if (type === 'J') {
    semitonesAway = perfectIntervals[number];
  } else if (type === 'M') {
    semitonesAway = majorIntervals[number];
  } else if (type === 'm') {
    semitonesAway = majorIntervals[number] - 1;
  } else if (type === 'A') {
    semitonesAway = isPerfectInterval(number) 
      ? perfectIntervals[number] + 1 
      : majorIntervals[number] + 1;
  } else if (type === 'd') {
    semitonesAway = isPerfectInterval(number) 
      ? perfectIntervals[number] - 1 
      : majorIntervals[number] - 2;
  }
  
  // Calcular nova nota
  const startIndex = noteToIndex[name];
  const resultIndex = (startIndex + semitonesAway) % 12;
  const newNoteName = indexToNote[resultIndex];
  
  // Calcular nova oitava
  let newOctave = octave;
  if (startIndex + semitonesAway >= 12) {
    const octavesUp = Math.floor((startIndex + semitonesAway) / 12);
    if (number === '8' || (startIndex + semitonesAway) >= 12 * octavesUp) {
      newOctave += octavesUp;
    }
  }
  
  return {
    name: newNoteName,
    octave: newOctave as Note['octave']
  };
};

// Gera um intervalo aleatório com base no nível de dificuldade
export const generateRandomInterval = (level: 1 | 2 | 3 | 4): Interval => {
  // Removendo intervalos de oitava ('8') e uníssono ('1')
  const intervalNumbers: IntervalNumber[] = ['2', '3', '4', '5', '6', '7'];
  const randomNumber = intervalNumbers[Math.floor(Math.random() * intervalNumbers.length)];
  
  if (level === 1) {
    // Nível 1: Apenas intervalos genéricos (sem tipo específico)
    return { number: randomNumber };
  }
  
  if (isPerfectInterval(randomNumber)) {
    // Intervalos justos/perfeitos
    if (level === 2) {
      return { number: randomNumber, type: 'J' };
    } else {
      // Níveis 3 e 4: Possibilidade de aumentado ou diminuto
      const types: IntervalType[] = ['J', 'A', 'd'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      return { number: randomNumber, type: randomType };
    }
  } else {
    // Intervalos maiores/menores
    if (level === 2) {
      const types: IntervalType[] = ['M', 'm'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      return { number: randomNumber, type: randomType };
    } else {
      // Níveis 3 e 4: Possibilidade de aumentado ou diminuto
      const types: IntervalType[] = ['M', 'm', 'A', 'd'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      return { number: randomNumber, type: randomType };
    }
  }
};

// Gera uma nota aleatória dentro de um intervalo de oitavas
export const generateRandomNote = (): Note => {
  const noteNames = Object.keys(noteToIndex) as NoteName[];
  const randomName = noteNames[Math.floor(Math.random() * noteNames.length)];
  const octave = (Math.floor(Math.random() * 3) + 3) as Note['octave']; // Oitavas 3, 4 ou 5
  
  return { name: randomName, octave };
};

// Formata o nome do intervalo para exibição
export const formatIntervalName = (interval: Interval): string => {
  const { number, type } = interval;
  
  if (!type) {
    return `${getIntervalNameByNumber(number)}`;
  }
  
  let typeText = '';
  
  switch(type) {
    case 'M':
      typeText = 'Maior';
      break;
    case 'm':
      typeText = 'Menor';
      break;
    case 'J':
      typeText = 'Justa';
      break;
    case 'A':
      typeText = 'Aumentada';
      break;
    case 'd':
      typeText = 'Diminuta';
      break;
  }
  
  return `${getIntervalNameByNumber(number)} ${typeText}`;
};

// Retorna o nome do intervalo baseado no número
export const getIntervalNameByNumber = (number: IntervalNumber): string => {
  switch(number) {
    case '1': return 'Uníssono';
    case '2': return 'Segunda';
    case '3': return 'Terça';
    case '4': return 'Quarta';
    case '5': return 'Quinta';
    case '6': return 'Sexta';
    case '7': return 'Sétima';
    case '8': return 'Oitava';
    default: return '';
  }
};

// Gera opções erradas para uma pergunta
export const generateWrongOptions = (
  referenceNote: Note, 
  correctAnswer: Note, 
  count: number = 3
): Note[] => {
  const options: Note[] = [correctAnswer];
  
  while (options.length < count + 1) {
    const randomNote = generateRandomNote();
    
    // Verifica se a nota já está nas opções ou é a resposta correta
    const isDuplicate = options.some(
      note => note.name === randomNote.name && note.octave === randomNote.octave
    );
    
    if (!isDuplicate) {
      options.push(randomNote);
    }
  }
  
  // Embaralha as opções
  return options.sort(() => Math.random() - 0.5);
}; 