'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { 
  GameState, 
  GameContextType, 
  Note
} from '@/lib/types';
import { 
  initialGameState, 
  generateQuestion, 
  checkAnswer, 
  calculateScore,
  QUESTIONS_PER_ROUND,
  shouldAdvanceLevel,
  isGameOver
} from '@/lib/gameLogic';

// Criando o contexto com valor inicial
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider do contexto
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    ...initialGameState,
    currentRoundQuestions: [],
    canAdvanceRound: false
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Avança para a próxima pergunta
  const nextQuestion = () => {
    const newQuestion = generateQuestion(gameState.level);
    
    setGameState(prev => ({
      ...prev,
      currentQuestion: newQuestion,
      timeRemaining: newQuestion.timeLimit
    }));
  };
  
  // Lidar com o timeout (tempo esgotado)
  const handleTimeout = useCallback(() => {
    if (gameState.currentQuestion === null) {
      return;
    }
    
    // Prepara o objeto de resposta
    const answerData = {
      question: gameState.currentQuestion,
      userAnswer: null,
      isCorrect: false,
      timeSpent: gameState.currentQuestion.timeLimit
    };
    
    // Atualiza o estado
    setGameState(prev => ({
      ...prev,
      streak: 0,
      answeredQuestions: [...prev.answeredQuestions, answerData],
      currentRoundQuestions: [...prev.currentRoundQuestions, answerData],
      questionsInRound: prev.questionsInRound + 1,
      canAdvanceRound: false // Tempo esgotado conta como erro
    }));
    
    // Aguarde um pouco antes de ir para próxima pergunta
    setTimeout(() => {
      // Verifica se a rodada foi concluída
      if (gameState.questionsInRound + 1 >= QUESTIONS_PER_ROUND) {
        // Rodada completa - mostra resumo da rodada
        setGameState(state => ({
          ...state,
          gameStatus: 'round_summary'
        }));
      } else {
        nextQuestion();
      }
    }, 1500);
  }, [gameState.currentQuestion, gameState.questionsInRound, nextQuestion]);
  
  // Gerencia o timer
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.currentQuestion) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      startTimeRef.current = Date.now();
      
      timerRef.current = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000);
        const timeRemaining = Math.max(0, gameState.currentQuestion!.timeLimit - elapsedTime);
        
        setGameState(prev => ({ ...prev, timeRemaining }));
        
        if (timeRemaining === 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          
          // O tempo acabou, registrar como resposta incorreta
          handleTimeout();
        }
      }, 100);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.gameStatus, gameState.currentQuestion, handleTimeout]);
  
  // Recupera a pontuação máxima do localStorage
  useEffect(() => {
    const storedHighScore = localStorage.getItem('intervalMasterHighScore');
    if (storedHighScore) {
      // Pontuação máxima armazenada - podemos usar em algum lugar da UI futuramente
      localStorage.getItem('intervalMasterHighScore');
    }
  }, []);
  
  // Atualiza a pontuação máxima quando o jogo termina
  useEffect(() => {
    if (gameState.gameStatus === 'results') {
      const storedHighScore = localStorage.getItem('intervalMasterHighScore');
      const currentHighScore = storedHighScore ? parseInt(storedHighScore, 10) : 0;
      
      if (gameState.score > currentHighScore) {
        localStorage.setItem('intervalMasterHighScore', gameState.score.toString());
      }
    }
  }, [gameState.gameStatus, gameState.score]);
  
  // Inicia o jogo com o nível selecionado
  const startGame = (level: 1 | 2 | 3 | 4) => {
    const newQuestion = generateQuestion(level);
    
    setGameState({
      ...initialGameState,
      level,
      gameStatus: 'playing',
      currentQuestion: newQuestion,
      timeRemaining: newQuestion.timeLimit,
      currentRoundQuestions: [],
      canAdvanceRound: false
    });
  };
  
  // Responde a pergunta atual
  const answerQuestion = (userAnswer: Note) => {
    if (gameState.currentQuestion === null || gameState.gameStatus !== 'playing') {
      return;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const timeSpent = startTimeRef.current 
      ? Math.min(Math.floor((Date.now() - startTimeRef.current) / 1000), gameState.currentQuestion.timeLimit)
      : gameState.currentQuestion.timeLimit;
    
    const isCorrect = checkAnswer(gameState.currentQuestion, userAnswer);
    const newStreak = isCorrect ? gameState.streak + 1 : 0;
    
    const newScore = gameState.score + calculateScore(
      timeSpent, 
      isCorrect, 
      gameState.streak, 
      gameState.level
    );
    
    // Prepara o objeto de resposta
    const answerData = {
      question: gameState.currentQuestion,
      userAnswer,
      isCorrect,
      timeSpent
    };
    
    // Adiciona resposta ao histórico geral
    const newAnsweredQuestions = [
      ...gameState.answeredQuestions,
      answerData
    ];
    
    // Adiciona resposta ao histórico da rodada atual
    const newCurrentRoundQuestions = [
      ...gameState.currentRoundQuestions,
      answerData
    ];
    
    // Verifica se pode avançar de rodada (sem erros na rodada atual)
    const hasNoErrors = newCurrentRoundQuestions.every(q => q.isCorrect);
    
    // Atualiza o estado
    setGameState(prev => ({
      ...prev,
      score: newScore,
      streak: newStreak,
      answeredQuestions: newAnsweredQuestions,
      currentRoundQuestions: newCurrentRoundQuestions,
      questionsInRound: prev.questionsInRound + 1,
      canAdvanceRound: hasNoErrors
    }));
    
    // Aguarde um pouco para mostrar feedback antes de ir para próxima pergunta
    setTimeout(() => {
      // Verifica se a rodada foi concluída
      if (gameState.questionsInRound + 1 >= QUESTIONS_PER_ROUND) {
        // Rodada completa - mostra resumo da rodada
        setGameState(state => ({
          ...state,
          gameStatus: 'round_summary'
        }));
      } else {
        // Próxima pergunta na mesma rodada
        const newQuestion = generateQuestion(gameState.level);
        
        setGameState(state => ({
          ...state,
          currentQuestion: newQuestion,
          timeRemaining: newQuestion.timeLimit
        }));
      }
    }, 1500); // 1.5 segundos de feedback
  };
  
  // Continua para a próxima rodada após o resumo
  const continueToNextRound = () => {
    // Verifica se pode avançar para o próximo nível
    if (gameState.canAdvanceRound && shouldAdvanceLevel(gameState) && gameState.level < 4) {
      // Avançar para o próximo nível
      const newLevel = (gameState.level + 1) as GameState['level'];
      const newQuestion = generateQuestion(newLevel);
      
      setGameState(prev => ({
        ...prev,
        level: newLevel,
        currentRound: 1,
        questionsInRound: 0,
        currentQuestion: newQuestion,
        timeRemaining: newQuestion.timeLimit,
        gameStatus: 'playing',
        currentRoundQuestions: []
      }));
    } else if (isGameOver({
      ...gameState,
      currentRound: gameState.currentRound + 1
    })) {
      // Jogo terminou
      setGameState(prev => ({
        ...prev,
        gameStatus: 'results'
      }));
    } else if (gameState.canAdvanceRound) {
      // Próxima rodada, mesmo nível
      const newQuestion = generateQuestion(gameState.level);
      
      setGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        questionsInRound: 0,
        currentQuestion: newQuestion,
        timeRemaining: newQuestion.timeLimit,
        gameStatus: 'playing',
        currentRoundQuestions: []
      }));
    } else {
      // Se não pode avançar (teve erros), vamos para a tela de resultados
      setGameState(prev => ({
        ...prev,
        gameStatus: 'results'
      }));
    }
  };
  
  // Reseta o jogo para o estado inicial
  const resetGame = () => {
    setGameState({
      ...initialGameState,
      currentRoundQuestions: [],
      canAdvanceRound: false
    });
  };
  
  // Volta ao menu principal
  const goToMenu = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'menu'
    }));
  };
  
  // Valor do contexto
  const contextValue: GameContextType = {
    gameState,
    startGame,
    answerQuestion,
    nextQuestion,
    continueToNextRound,
    resetGame,
    goToMenu
  };
  
  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Hook para acessar o contexto
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
}; 