'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameLayout } from '@/components/layout/GameLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Timer } from '@/components/ui/Timer';
import { NoteDisplay } from '@/components/game/NoteDisplay';
import { OptionsGrid } from '@/components/game/OptionsGrid';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { useGame } from '@/context/GameContext';
import { formatIntervalName } from '@/lib/intervals';
import { Note } from '@/lib/types';
import { QUESTIONS_PER_ROUND } from '@/lib/gameLogic';

export default function GamePage() {
  const router = useRouter();
  const { gameState, answerQuestion, resetGame } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<Note | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const {
    currentQuestion,
    timeRemaining,
    score,
    streak,
    level,
    currentRound,
    gameStatus
  } = gameState;
  
  // Redirecionar com base no status do jogo
  useEffect(() => {
    if (gameStatus === 'menu') {
      router.push('/');
    } else if (gameStatus === 'results') {
      router.push('/results');
    } else if (gameStatus === 'round_summary') {
      router.push('/round-summary');
    }
  }, [gameStatus, router]);
  
  // Lidar com a seleção de resposta
  const handleSelectAnswer = (note: Note) => {
    if (showFeedback || !currentQuestion) return;
    
    setSelectedAnswer(note);
    setShowFeedback(true);
    
    // Dar feedback visual por 1.5 segundos antes de passar para a próxima pergunta
    setTimeout(() => {
      answerQuestion(note);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1500);
  };
  
  // Se não houver pergunta atual, mostrar loading
  if (!currentQuestion) {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Painel lateral de pontuação e informações */}
        <div className="md:col-span-1">
          <Card className="mb-4">
            <ScoreDisplay
              score={score}
              streak={streak}
              round={currentRound}
              totalRounds={QUESTIONS_PER_ROUND}
              level={level}
            />
          </Card>
          
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Nota de referência:</h3>
              <NoteDisplay 
                note={currentQuestion.referenceNote} 
                className="border border-gray-200 rounded-lg"
              />
            </div>
            
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => resetGame()}
            >
              Voltar ao Menu
            </Button>
          </Card>
        </div>
        
        {/* Área principal do jogo */}
        <div className="md:col-span-2">
          <Card className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-[#1D3557]">
              Encontre o intervalo:
            </h2>
            
            <div className="bg-[#F8F9FA] p-4 rounded-lg mb-4">
              <p className="text-2xl md:text-3xl font-bold text-center text-[#3861FB]">
                {formatIntervalName(currentQuestion.interval)}
              </p>
            </div>
            
            <div className="mb-6">
              <Timer 
                timeRemaining={timeRemaining} 
                totalTime={currentQuestion.timeLimit} 
              />
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-bold mb-4">
              Selecione a nota que completa o intervalo:
            </h3>
            
            <OptionsGrid 
              options={currentQuestion.options}
              onSelect={handleSelectAnswer}
              disabled={showFeedback}
              correct={showFeedback ? currentQuestion.correctAnswer : null}
              selected={selectedAnswer}
            />
          </Card>
        </div>
      </div>
    </GameLayout>
  );
} 