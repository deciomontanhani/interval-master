import { 
  Question, 
  Note, 
  GameState
} from './types';
import { 
  calculateInterval, 
  generateRandomInterval, 
  generateRandomNote,
  generateWrongOptions
} from './intervals';

// Constantes de jogo
export const QUESTIONS_PER_ROUND = 5;
export const DEFAULT_TIME_LIMIT = 10; // em segundos

// Faixa de valores para pontuação
export const SCORE_RANGES = {
  FAST: { min: 0, max: 3, points: 10 },
  MEDIUM: { min: 4, max: 7, points: 7 },
  SLOW: { min: 8, max: 10, points: 5 }
};

// Estado inicial do jogo
export const initialGameState: GameState = {
  level: 1,
  currentRound: 1,
  questionsInRound: 0,
  currentQuestion: null,
  score: 0,
  streak: 0,
  timeRemaining: DEFAULT_TIME_LIMIT,
  gameStatus: 'menu',
  answeredQuestions: [],
  currentRoundQuestions: [],
  canAdvanceRound: false
};

// Gera uma nova pergunta de acordo com o nível
export const generateQuestion = (level: 1 | 2 | 3 | 4): Question => {
  // Gera uma nota de referência aleatória
  const referenceNote = generateRandomNote();
  
  // Gera um intervalo aleatório baseado no nível
  const interval = generateRandomInterval(level);
  
  // Calcula a resposta correta
  const correctAnswer = calculateInterval(referenceNote, interval);
  
  // Gera opções erradas (entre 3 a 5 dependendo do nível)
  const optionsCount = level < 3 ? 3 : level === 3 ? 4 : 5;
  const options = generateWrongOptions(referenceNote, correctAnswer, optionsCount);
  
  // Define o limite de tempo (reduz para níveis mais altos)
  const timeLimit = level === 4 ? 7 : DEFAULT_TIME_LIMIT;
  
  return {
    referenceNote,
    interval,
    correctAnswer,
    options,
    timeLimit
  };
};

// Calcula a pontuação com base no tempo de resposta
export const calculateScore = (
  timeSpent: number, 
  isCorrect: boolean, 
  streak: number, 
  level: number
): number => {
  if (!isCorrect) return 0;
  
  let points = 0;
  
  // Pontuação base por velocidade
  if (timeSpent <= SCORE_RANGES.FAST.max) {
    points = SCORE_RANGES.FAST.points;
  } else if (timeSpent <= SCORE_RANGES.MEDIUM.max) {
    points = SCORE_RANGES.MEDIUM.points;
  } else {
    points = SCORE_RANGES.SLOW.points;
  }
  
  // Bônus por sequência (máximo de +10 pontos)
  const streakBonus = Math.min(streak * 2, 10);
  
  // Bônus por nível
  const levelBonus = (level - 1) * 2;
  
  return points + streakBonus + levelBonus;
};

// Verifica se a resposta está correta
export const checkAnswer = (
  question: Question, 
  userAnswer: Note
): boolean => {
  const { correctAnswer } = question;
  return correctAnswer.name === userAnswer.name && correctAnswer.octave === userAnswer.octave;
};

// Checa se o jogador deve avançar para o próximo nível
export const shouldAdvanceLevel = (state: GameState): boolean => {
  // Verifique se completou o número necessário de rodadas para este nível
  const roundsPerLevel = 2; // 2 rodadas por nível (10 perguntas)
  
  if (state.level < 4 && state.currentRound > roundsPerLevel) {
    // Verifique também se tem pelo menos 70% de acertos
    const totalQuestions = state.answeredQuestions.length;
    const correctAnswers = state.answeredQuestions.filter(q => q.isCorrect).length;
    const correctRate = correctAnswers / totalQuestions;
    
    return correctRate >= 0.7;
  }
  
  return false;
};

// Checa se o jogo terminou
export const isGameOver = (state: GameState): boolean => {
  // O jogo termina quando o jogador completa o nível 4 ou
  // quando falha em avançar para o próximo nível
  return (
    state.level === 4 && 
    state.currentRound > 3 // Mais rodadas no nível 4
  );
};

// Formata uma nota para exibição
export const formatNoteDisplay = (note: Note): string => {
  return `${note.name}${note.octave}`;
}; 