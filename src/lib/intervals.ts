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
  'Fb': 4,  // Fb é enarmônico de E
  'F': 5,
  'E#': 5,  // E# é enarmônico de F
  'F#': 6,
  'Gb': 6,
  'G': 7,
  'G#': 8,
  'Ab': 8,
  'A': 9,
  'A#': 10,
  'Bb': 10,
  'B': 11,
  'Cb': 11  // Cb é enarmônico de B
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
  return CYCLE_OF_FOURTHS.includes(referenceName);
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
  
  // Ajustar a nota com base no tipo de intervalo (maior, menor, etc.)
  let semitonesAway = 0;
  
  // Determinar o número padrão de semitons para este intervalo
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
  
  // Calcular a nota resultante usando o índice
  const startIndex = noteToIndex[name];
  const resultIndex = (startIndex + semitonesAway) % 12;
  
  // Determinar se deve usar bemois ou sustenidos
  let newNoteName: NoteName;
  if (shouldUseFlats(name)) {
    newNoteName = indexToNoteFlats[resultIndex];
  } else {
    newNoteName = indexToNoteSharps[resultIndex];
  }
  
  // Calcular a oitava (para reprodução de áudio)
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

// Notas do ciclo de quintas (usando as formas mais comuns na teoria musical)
// C -> G -> D -> A -> E -> B -> F# -> C# -> (G# ou Ab) -> (D# ou Eb) -> (A# ou Bb) -> F -> C
export const CYCLE_OF_FIFTHS: NoteName[] = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'
];

// Notas do ciclo de quartas (usando as formas mais comuns na teoria musical)
// C -> F -> Bb -> Eb -> Ab -> Db -> Gb -> B -> E -> A -> D -> G -> C
export const CYCLE_OF_FOURTHS: NoteName[] = [
  'C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'
];

// Mapeamento para escalas corretas (para cada nota, quais são as notas que compõem sua escala maior)
// Isso garante que os intervalos seguirão a escala correta
const scaleNotes: Record<NoteName, NoteName[]> = {
  // Escalas com sustenidos
  'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
  'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],  // Corrigido para usar E#, que é musicalmente correto
  
  // Escalas com bemóis
  'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],
  
  // Notas enarmônicas (usando apenas as permitidas pelo tipo NoteName)
  'D#': ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D'],     // Simplificado
  'G#': ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'G'],    // Simplificado
  'A#': ['A#', 'C', 'D', 'D#', 'F', 'G', 'A'],      // Simplificado
  'C#': ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'B'],   // Ajustado
  'Cb': ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'], // Escala teórica de Cb (enarmônica de B)
  'Fb': ['Fb', 'Gb', 'Ab', 'A', 'Cb', 'Db', 'Eb'],  // Adaptada para usar notas válidas do tipo NoteName
  'E#': ['E#', 'F#', 'G#', 'A#', 'B', 'C#', 'D#']   // E# (enarmônico de F)
};

// Ajusta escala para corrigir notas inválidas
const adjustScaleNote = (noteName: string): NoteName => {
  // Mapeia notas não permitidas para suas equivalentes permitidas
  const adjustments: Record<string, NoteName> = {
    'B#': 'C',
    'Fb': 'E',
    // E# agora é uma nota válida no tipo NoteName
    // Outras conversões necessárias podem ser adicionadas aqui
  };
  
  // Verificar se o nome está no mapeamento, senão retornar como está
  return (adjustments[noteName] || noteName) as NoteName;
};

// Função para obter o intervalo correto baseado na escala
// Isso garante que o 3º grau de C seja E, não Fb, etc.
export const getNoteFromScale = (baseNote: NoteName, intervalDistance: number): NoteName => {
  const scale = scaleNotes[baseNote] || scaleNotes['C']; // Fallback para C se a nota não estiver mapeada
  const index = intervalDistance % 7;
  const noteName = scale[index];
  return adjustScaleNote(noteName);
};

// Gera uma nota aleatória do ciclo de quintas
export const generateRandomNote = (): Note => {
  // Combinar os dois ciclos, mas dar preferência para notas com escalas mais simples
  const notesToChooseFrom = [...CYCLE_OF_FIFTHS, ...CYCLE_OF_FOURTHS];
  const randomIndex = Math.floor(Math.random() * notesToChooseFrom.length);
  const noteName = notesToChooseFrom[randomIndex];
  const octave = 4; // Usar oitava fixa para simplificar
  
  return { name: noteName, octave };
};

// Versão segura para SSR, evita Math.random durante a hidratação
export const generateRandomNoteForSSR = (index: number = 0): Note => {
  // Usar apenas notas do ciclo de quintas para estabilidade
  const allNotes = [...CYCLE_OF_FIFTHS, ...CYCLE_OF_FOURTHS];
  const noteName = allNotes[index % allNotes.length];
  return { name: noteName, octave: 4 };
};

// Conjunto fixo de notas para uso durante a hidratação (SSR)
export const getStableNotes = (): Note[] => {
  // Retorna as primeiras 7 notas do ciclo de quintas combinado
  const allNotes = [...CYCLE_OF_FIFTHS, ...CYCLE_OF_FOURTHS];
  return allNotes.slice(0, 7).map(name => ({ name, octave: 4 }));
};

// Versão segura para SSR, evita sort aleatório durante a hidratação
export const generateWrongOptionsForSSR = (
  referenceNote: Note, 
  correctAnswer: Note, 
  count: number = 3,
  isClient: boolean = false
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
  
  // Embaralhar as opções de uma forma determinística no servidor
  // mas aleatória no cliente
  if (isClient) {
    // Embaralhar completamente as opções no cliente
    return shuffleArray([...options]);
  } else {
    // No servidor, usar uma abordagem determinística para evitar erro de hidratação
    // mas ainda assim, não deixar a resposta correta sempre na primeira posição
    const shuffledOptions = [...options];
    // Trocar a resposta correta com uma posição diferente
    // de forma determinística baseada na nota de referência
    const swapIndex = (noteToIndex[referenceNote.name] % (shuffledOptions.length - 1)) + 1;
    
    // Trocar a posição 0 (resposta correta) com a posição swapIndex
    [shuffledOptions[0], shuffledOptions[swapIndex]] = 
    [shuffledOptions[swapIndex], shuffledOptions[0]];
    
    return shuffledOptions;
  }
};

// Função auxiliar para embaralhar um array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
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
  
  // Criar um array com as notas permitidas
  const availableNotes = [...CYCLE_OF_FIFTHS, ...CYCLE_OF_FOURTHS];
  
  // Embaralhar as notas disponíveis
  for (let i = availableNotes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableNotes[i], availableNotes[j]] = [availableNotes[j], availableNotes[i]];
  }
  
  // Adicionar notas até atingir o número desejado de opções
  for (const noteName of availableNotes) {
    // Verifica se a nota já está nas opções ou é a resposta correta
    const isDuplicate = options.some(
      note => noteToIndex[note.name] === noteToIndex[noteName]
    );
    
    if (!isDuplicate) {
      options.push({
        name: noteName,
        octave: correctAnswer.octave
      });
    }
    
    if (options.length >= count + 1) {
      break;
    }
  }
  
  // Embaralha as opções
  return options.sort(() => Math.random() - 0.5);
}; 