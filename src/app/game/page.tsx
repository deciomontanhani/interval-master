'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameLayout } from '@/components/layout/GameLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Timer } from '@/components/ui/Timer';
import { NoteDisplay } from '@/components/game/NoteDisplay';
import { OptionsGrid } from '@/components/game/OptionsGrid';
import { useGame } from '@/context/GameContext';
import { formatIntervalName } from '@/lib/intervals';
import { Note } from '@/lib/types';
import { QUESTIONS_PER_ROUND } from '@/lib/gameLogic';

export default function GamePage() {
  const router = useRouter();
  const { gameState, answerQuestion, resetGame } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<Note | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const {
    currentQuestion,
    timeRemaining,
    score,
    streak,
    level,
    currentRound,
    gameStatus
  } = gameState;
  
  // Garantir que a hidratação aconteça corretamente
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Redirecionar com base no status do jogo
  useEffect(() => {
    if (!mounted) return; // Evitar navegação durante a hidratação
    
    if (gameStatus === 'menu') {
      router.push('/');
    } else if (gameStatus === 'results') {
      router.push('/results');
    } else if (gameStatus === 'round_summary') {
      router.push('/round-summary');
    }
  }, [gameStatus, router, mounted]);
  
  // Lidar com a seleção de resposta
  const handleSelectAnswer = (note: Note) => {
    if (showFeedback || !currentQuestion) return;
    
    setSelectedAnswer(note);
    setShowFeedback(true);
    
    // Dar feedback visual por 400ms antes de passar para a próxima pergunta
    setTimeout(() => {
      answerQuestion(note);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 400);
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
  
  // Garantir renderização do lado do cliente para evitar problemas de hidratação
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
      <div className="flex flex-col w-full h-full">
        {/* Header com informações essenciais */}
        <div className="mb-3 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center flex-wrap gap-1">
            <div className="font-semibold p-1.5 bg-blue-100 rounded">
              Nível {level} • Rodada {currentRound}/{QUESTIONS_PER_ROUND}
            </div>
            <div className="font-semibold p-1.5 bg-green-100 rounded">
              {score} pontos {streak > 0 && <span className="text-orange-500">+{streak}</span>}
            </div>
          </div>
          <Button 
            variant="secondary" 
            className="py-1 px-2"
            onClick={() => resetGame()}
          >
            Menu
          </Button>
        </div>
      
        {/* Timer sempre visível na parte superior */}
        <div className="mb-3">
          <Timer 
            timeRemaining={timeRemaining} 
            totalTime={currentQuestion.timeLimit} 
          />
        </div>
        
        {/* Apresentando nota e intervalo como uma pergunta integrada */}
        <Card className="mb-4 p-3">
          <div className="text-center">
            <h3 className="font-semibold mb-2 text-gray-800">Encontre a nota que forma:</h3>
            
            <div className="flex flex-wrap items-center justify-center mb-1 gap-2">
              <div className="flex items-center">
                <NoteDisplay 
                  note={currentQuestion.referenceNote} 
                  className="bg-blue-50 border border-blue-200 rounded-lg"
                  showOctave={false}
                />
                <div className="text-gray-500 mx-2">+</div>
              </div>
              
              <div className="font-bold text-blue-600 text-lg px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                {formatIntervalName(currentQuestion.interval)}
              </div>
              
              <div className="flex items-center">
                <div className="text-gray-500 mx-2">=</div>
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1">
                  <span className="text-gray-500 font-medium">?</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Área das opções - ocupando o máximo de espaço disponível */}
        <div className="flex-1 flex items-start">
          <OptionsGrid 
            options={currentQuestion.options}
            onSelect={handleSelectAnswer}
            disabled={showFeedback}
            correct={showFeedback ? currentQuestion.correctAnswer : null}
            selected={selectedAnswer}
          />
        </div>
      </div>
    </GameLayout>
  );
} 