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
  
  // Limpa o timer ao desmontar o componente ou quando o status do jogo muda
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);
  
  // Avança para a próxima pergunta
  const nextQuestion = useCallback(() => {
    try {
      const newQuestion = generateQuestion(gameState.level);
      
      setGameState(prev => ({
        ...prev,
        currentQuestion: newQuestion,
        timeRemaining: newQuestion.timeLimit
      }));
    } catch (error) {
      console.error('Erro ao avançar para próxima questão:', error);
    }
  }, [gameState.level]);
  
  // Lidar com o timeout (tempo esgotado)
  const handleTimeout = useCallback(() => {
    if (!gameState.currentQuestion) {
      return;
    }
    
    // Limpar o timer existente
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Prepara o objeto de resposta
    const answerData = {
      question: gameState.currentQuestion,
      userAnswer: null,
      isCorrect: false,
      timeSpent: gameState.currentQuestion.timeLimit
    };
    
    // Atualiza o estado
    setGameState(prev => {
      const updatedState = {
        ...prev,
        streak: 0,
        answeredQuestions: [...prev.answeredQuestions, answerData],
        currentRoundQuestions: [...prev.currentRoundQuestions, answerData],
        questionsInRound: prev.questionsInRound + 1,
        canAdvanceRound: false // Tempo esgotado conta como erro
      };
      
      // Verificamos se a rodada foi concluída
      if (updatedState.questionsInRound >= QUESTIONS_PER_ROUND) {
        return {
          ...updatedState,
          gameStatus: 'round_summary'
        };
      }
      
      return updatedState;
    });
    
    // Aguarde um pouco antes de ir para próxima pergunta
    setTimeout(() => {
      setGameState(prev => {
        // Se já mudamos para o resumo da rodada, não fazemos nada
        if (prev.gameStatus === 'round_summary') {
          return prev;
        }
        
        try {
          // Caso contrário, vamos para a próxima pergunta
          const newQuestion = generateQuestion(prev.level);
          return {
            ...prev,
            currentQuestion: newQuestion,
            timeRemaining: newQuestion.timeLimit
          };
        } catch (error) {
          console.error('Erro ao gerar nova questão após timeout:', error);
          return prev;
        }
      });
    }, 400);
  }, [gameState.currentQuestion]);
  
  // Gerencia o timer
  useEffect(() => {
    // Só iniciamos o timer quando o jogo está em andamento e temos uma questão
    if (gameState.gameStatus === 'playing' && gameState.currentQuestion) {
      // Limpa qualquer timer existente
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Marca o tempo de início
      startTimeRef.current = Date.now();
      
      // Inicia um novo timer
      timerRef.current = setInterval(() => {
        if (startTimeRef.current === null) return;
        
        const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const timeRemaining = Math.max(0, gameState.currentQuestion!.timeLimit - elapsedTime);
        
        // Atualiza o tempo restante
        setGameState(prev => ({ ...prev, timeRemaining }));
        
        // Verifica se o tempo acabou
        if (timeRemaining <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          // O tempo acabou, registrar como resposta incorreta
          handleTimeout();
        }
      }, 50); // Atualização mais frequente para melhor responsividade
      
      // Limpa o timer quando o componente é desmontado ou quando o status do jogo muda
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [gameState.gameStatus, gameState.currentQuestion, handleTimeout]);
  
  // Inicia o jogo com o nível selecionado
  const startGame = useCallback((level: 1 | 2 | 3 | 4) => {
    try {
      console.log('Iniciando jogo com nível:', level);
      
      // Limpa qualquer timer existente
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      const newQuestion = generateQuestion(level);
      console.log('Nova questão gerada:', newQuestion);
      
      setGameState({
        ...initialGameState,
        level,
        gameStatus: 'playing',
        currentQuestion: newQuestion,
        timeRemaining: newQuestion.timeLimit,
        currentRoundQuestions: [],
        canAdvanceRound: false
      });
      
      console.log('Estado do jogo atualizado para playing');
    } catch (error) {
      console.error('Erro ao iniciar o jogo:', error);
    }
  }, []);
  
  // Responde a pergunta atual
  const answerQuestion = useCallback((userAnswer: Note) => {
    if (gameState.currentQuestion === null || gameState.gameStatus !== 'playing') {
      return;
    }
    
    // Limpa o timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
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
    
    // Atualiza o estado
    setGameState(prev => {
      const updatedQuestionsInRound = prev.questionsInRound + 1;
      const newAnsweredQuestions = [...prev.answeredQuestions, answerData];
      const newCurrentRoundQuestions = [...prev.currentRoundQuestions, answerData];
      
      // Verifica se pode avançar de rodada (sem erros na rodada atual)
      const hasNoErrors = newCurrentRoundQuestions.every(q => q.isCorrect);
      
      // Verifica se a rodada foi concluída
      if (updatedQuestionsInRound >= QUESTIONS_PER_ROUND) {
        return {
          ...prev,
          score: newScore,
          streak: newStreak,
          answeredQuestions: newAnsweredQuestions,
          currentRoundQuestions: newCurrentRoundQuestions,
          questionsInRound: updatedQuestionsInRound,
          canAdvanceRound: hasNoErrors,
          gameStatus: 'round_summary'
        };
      }
      
      return {
        ...prev,
        score: newScore,
        streak: newStreak,
        answeredQuestions: newAnsweredQuestions,
        currentRoundQuestions: newCurrentRoundQuestions,
        questionsInRound: updatedQuestionsInRound,
        canAdvanceRound: hasNoErrors
      };
    });
    
    // Aguarde um pouco para mostrar feedback antes de ir para próxima pergunta
    setTimeout(() => {
      setGameState(prev => {
        // Se já mudamos para o resumo da rodada, não fazemos nada
        if (prev.gameStatus === 'round_summary') {
          return prev;
        }
        
        try {
          // Caso contrário, vamos para a próxima pergunta
          const newQuestion = generateQuestion(prev.level);
          return {
            ...prev,
            currentQuestion: newQuestion,
            timeRemaining: newQuestion.timeLimit
          };
        } catch (error) {
          console.error('Erro ao gerar nova questão após resposta:', error);
          return prev;
        }
      });
    }, 400); // 400ms de feedback
  }, [gameState]);
  
  // Continua para a próxima rodada após o resumo
  const continueToNextRound = useCallback(() => {
    // Verifica se pode avançar para o próximo nível
    if (gameState.canAdvanceRound && shouldAdvanceLevel(gameState) && gameState.level < 4) {
      // Avançar para o próximo nível
      const newLevel = (gameState.level + 1) as GameState['level'];
      
      try {
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
      } catch (error) {
        console.error('Erro ao avançar para próximo nível:', error);
      }
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
      try {
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
      } catch (error) {
        console.error('Erro ao avançar para próxima rodada:', error);
      }
    } else {
      // Se não pode avançar (teve erros), vamos para a tela de resultados
      setGameState(prev => ({
        ...prev,
        gameStatus: 'results'
      }));
    }
  }, [gameState]);
  
  // Reseta o jogo para o estado inicial
  const resetGame = useCallback(() => {
    // Limpa qualquer timer existente
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setGameState({
      ...initialGameState,
      currentRoundQuestions: [],
      canAdvanceRound: false
    });
  }, []);
  
  // Volta ao menu principal
  const goToMenu = useCallback(() => {
    // Limpa qualquer timer existente
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setGameState(prev => ({
      ...prev,
      gameStatus: 'menu'
    }));
  }, []);
  
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