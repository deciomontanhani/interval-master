export type NoteName = 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E' | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B';
export type OctaveNumber = 3 | 4 | 5;
export type Note = { name: NoteName; octave?: OctaveNumber };

export type IntervalType = 'M' | 'm' | 'J' | 'A' | 'd';  // Maior, menor, justa, aumentada, diminuta
export type IntervalNumber = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type Interval = { number: IntervalNumber; type?: IntervalType }; // tipo opcional para nível iniciante

// Estrutura de uma pergunta
export interface Question {
  referenceNote: Note;
  interval: Interval;
  correctAnswer: Note;
  options: Note[];
  timeLimit: number;
}

// Estado do jogo
export interface GameState {
  level: 1 | 2 | 3 | 4;
  currentRound: number;
  questionsInRound: number;
  currentQuestion: Question | null;
  score: number;
  streak: number;
  timeRemaining: number;
  gameStatus: 'menu' | 'playing' | 'round_summary' | 'results';
  answeredQuestions: {
    question: Question;
    userAnswer: Note | null;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  currentRoundQuestions: {
    question: Question;
    userAnswer: Note | null;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  canAdvanceRound: boolean;
}

export interface GameContextType {
  gameState: GameState;
  startGame: (level: 1 | 2 | 3 | 4) => void;
  answerQuestion: (note: Note) => void;
  nextQuestion: () => void;
  continueToNextRound: () => void;
  resetGame: () => void;
  goToMenu: () => void;
} 