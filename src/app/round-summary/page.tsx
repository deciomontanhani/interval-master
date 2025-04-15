'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameLayout } from '@/components/layout/GameLayout';
import { RoundSummary } from '@/components/game/RoundSummary';
import { useGame } from '@/context/GameContext';

export default function RoundSummaryPage() {
  const router = useRouter();
  const { gameState, continueToNextRound, goToMenu } = useGame();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Garantir que a hidratação aconteça corretamente
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Redirecionar para a página inicial se não estiver no status correto
  useEffect(() => {
    if (!mounted) return; // Evitar navegação durante a hidratação
    
    if (gameState.gameStatus !== 'round_summary') {
      router.push('/');
    }
  }, [gameState.gameStatus, router, mounted]);
  
  // Observar mudanças no estado do jogo após continuar
  useEffect(() => {
    if (!mounted) return; // Evitar navegação durante a hidratação
    
    if (shouldRedirect) {
      // Resetar o estado
      setShouldRedirect(false);
      
      // Redirecionar com base no estado atual
      if (gameState.gameStatus === 'playing') {
        router.push('/game');
      } else if (gameState.gameStatus === 'results') {
        router.push('/results');
      }
    }
  }, [gameState.gameStatus, shouldRedirect, router, mounted]);
  
  // Funções de manipulação
  const handleContinue = () => {
    if (!mounted) return;
    
    // Primeiro, realizar a transição de estado
    continueToNextRound();
    
    // Sinalizar que devemos redirecionar após a atualização do estado
    setShouldRedirect(true);
  };
  
  const handleQuit = () => {
    if (!mounted) return;
    
    goToMenu();
    router.push('/');
  };
  
  // Renderização com verificação de hidratação
  if (!mounted) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-xl font-semibold text-gray-600">Carregando...</p>
        </div>
      </GameLayout>
    );
  }
  
  return (
    <GameLayout>
      <div className="flex justify-center items-center min-h-[70vh]">
        <RoundSummary 
          roundNumber={gameState.currentRound}
          level={gameState.level}
          questions={gameState.currentRoundQuestions}
          canAdvance={gameState.canAdvanceRound}
          onContinue={handleContinue}
          onQuit={handleQuit}
        />
      </div>
    </GameLayout>
  );
} 