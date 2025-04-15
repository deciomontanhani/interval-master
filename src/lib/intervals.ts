import { Note, NoteName, Interval, IntervalType, IntervalNumber } from './types';

// Mapeamento de notas para índices (0-11)
export const noteToIndex: Record<NoteName, number> = {
  'C': 0,
  'C#': 1,
  'Db': 1,
  'D': 2,
  'D#': 3,
  'Eb': 3,
  'E': 4,
  'F': 5,
  'F#': 6,
  'Gb': 6,
  'G': 7,
  'G#': 8,
  'Ab': 8,
  'A': 9,
  'A#': 10,
  'Bb': 10,
  'B': 11
};

// Mapeamento de índices para notas (usando ciclo de quintas)
const indexToNoteSharps: Record<number, NoteName> = {
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

const indexToNoteFlats: Record<number, NoteName> = {
  0: 'C',
  1: 'Db',
  2: 'D',
  3: 'Eb',
  4: 'E',
  5: 'F',
  6: 'Gb',
  7: 'G',
  8: 'Ab',
  9: 'A',
  10: 'Bb',
  11: 'B'
};

// Usar notação de bemóis ou sustenidos com base no ciclo de quintas
const shouldUseFlats = (referenceName: NoteName): boolean => {
  // Notas que tipicamente usam bemóis no ciclo de quintas (F, Bb, Eb, Ab, Db, Gb, Cb)
  return ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(referenceName);
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
  const { name, octave = 4 } = referenceNote;
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
  
  // Decidir se usa bemois ou sustenidos com base na nota de referência
  const newNoteName = shouldUseFlats(name) ? indexToNoteFlats[resultIndex] : indexToNoteSharps[resultIndex];
  
  // Calcular nova oitava apenas para fins de reprodução de áudio
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

// Conjunto fixo de notas para uso durante a hidratação (SSR)
// Isso evita inconsistências entre cliente e servidor
export const getStableNotes = (): Note[] => {
  return [
    { name: 'C', octave: 4 },
    { name: 'D', octave: 4 },
    { name: 'E', octave: 4 },
    { name: 'F', octave: 4 },
    { name: 'G', octave: 4 },
    { name: 'A', octave: 4 },
    { name: 'B', octave: 4 }
  ];
};

// Versão segura para SSR, evita Math.random durante a hidratação
export const generateRandomNoteForSSR = (index: number = 0): Note => {
  const stableNotes = getStableNotes();
  return stableNotes[index % stableNotes.length];
};

// Versão segura para SSR, evita sort aleatório durante a hidratação
export const generateWrongOptionsForSSR = (
  referenceNote: Note, 
  correctAnswer: Note, 
  count: number = 3
): Note[] => {
  const stableNotes = getStableNotes();
  const options: Note[] = [correctAnswer];
  
  // Adiciona notas de forma determinística
  for (let i = 0; i < stableNotes.length && options.length < count + 1; i++) {
    const note = stableNotes[i];
    
    // Verifica se a nota já está nas opções ou é a resposta correta
    const isDuplicate = options.some(
      existingNote => noteToIndex[existingNote.name] === noteToIndex[note.name]
    );
    
    if (!isDuplicate) {
      options.push(note);
    }
  }
  
  // Retorna as opções na ordem original (sem embaralhar)
  return options;
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

// Gera uma nota aleatória
export const generateRandomNote = (): Note => {
  const noteNames = Object.keys(noteToIndex) as NoteName[];
  // Filtrar para obter apenas as notas únicas (sem enarmônicos duplicados)
  const uniqueNoteNames = [...new Set(noteNames.map(name => noteToIndex[name]))].map(index => 
    Math.random() > 0.5 ? indexToNoteSharps[index] : indexToNoteFlats[index]
  );
  const randomName = uniqueNoteNames[Math.floor(Math.random() * uniqueNoteNames.length)] as NoteName;
  const octave = (Math.floor(Math.random() * 3) + 3) as Note['octave']; // Oitavas 3, 4 ou 5
  
  return { name: randomName, octave };
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
    // Ignorando a oitava, verificamos apenas o nome da nota
    const isDuplicate = options.some(
      note => noteToIndex[note.name] === noteToIndex[randomNote.name]
    );
    
    if (!isDuplicate) {
      options.push(randomNote);
    }
  }
  
  // Embaralha as opções
  return options.sort(() => Math.random() - 0.5);
}; 