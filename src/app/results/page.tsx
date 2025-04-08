'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GameLayout } from '@/components/layout/GameLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGame } from '@/context/GameContext';
import { formatIntervalName } from '@/lib/intervals';

export default function ResultsPage() {
  const router = useRouter();
  const { gameState, resetGame, goToMenu } = useGame();
  const { score, answeredQuestions, level } = gameState;
  
  // Redirecionar para a página inicial se não vier da página de jogo
  useEffect(() => {
    if (gameState.gameStatus !== 'results') {
      router.push('/');
    }
  }, [gameState.gameStatus, router]);
  
  // Calcular estatísticas
  const totalQuestions = answeredQuestions.length;
  const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  // Encontrar intervalos mais difíceis (com mais erros)
  const intervalErrors = answeredQuestions
    .filter(q => !q.isCorrect)
    .reduce((acc, q) => {
      const intervalName = formatIntervalName(q.question.interval);
      acc[intervalName] = (acc[intervalName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const difficultIntervals = Object.entries(intervalErrors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  // Organizar as perguntas por rodada
  const questionsByRound = answeredQuestions.reduce((acc, q, index) => {
    const roundIndex = Math.floor(index / 5);
    if (!acc[roundIndex]) acc[roundIndex] = [];
    acc[roundIndex].push(q);
    return acc;
  }, {} as Record<number, typeof answeredQuestions>);
  
  const handlePlayAgain = () => {
    resetGame();
    router.push('/');
  };
  
  const handleBackToMenu = () => {
    goToMenu();
    router.push('/');
  };
  
  // Determinar mensagem de fim de jogo
  const getGameOverMessage = () => {
    if (answeredQuestions.length === 0) return "";
    
    const lastRoundQuestions = answeredQuestions.slice(-5);
    const hasErrorsInLastRound = lastRoundQuestions.some(q => !q.isCorrect);
    
    if (hasErrorsInLastRound) {
      return "Você errou questões na última rodada e não pôde continuar.";
    } else if (level === 4 && gameState.currentRound > 3) {
      return "Parabéns! Você completou todos os níveis do jogo!";
    } else {
      return "Obrigado por jogar!";
    }
  };
  
  return (
    <GameLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Painel lateral com pontuação e botões */}
        <div className="md:col-span-1">
          <Card className="mb-4">
            <h2 className="text-xl font-bold mb-6 text-[#1D3557]">Pontuação Final</h2>
            
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-[#3861FB]">{score}</p>
              <p className="text-gray-600">pontos</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center mb-6">
              <div>
                <p className="text-xl font-bold">{correctAnswers}</p>
                <p className="text-gray-600">acertos</p>
              </div>
              <div>
                <p className="text-xl font-bold">{accuracy.toFixed(0)}%</p>
                <p className="text-gray-600">precisão</p>
              </div>
            </div>
            
            <div className="mb-6 text-center">
              <p className="text-gray-700 italic">{getGameOverMessage()}</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={handlePlayAgain}
              >
                Jogar Novamente
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleBackToMenu}
              >
                Voltar ao Menu
              </Button>
            </div>
          </Card>
          
          {difficultIntervals.length > 0 && (
            <Card>
              <h3 className="text-lg font-bold mb-4 text-[#1D3557]">
                Intervalos Mais Difíceis
              </h3>
              
              <ul className="space-y-2">
                {difficultIntervals.map(([interval, count]) => (
                  <li key={interval} className="flex justify-between items-center">
                    <span className="font-medium">{interval}</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                      {count} {count === 1 ? 'erro' : 'erros'}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
        
        {/* Detalhes do jogo */}
        <div className="md:col-span-2">
          <Card>
            <h2 className="text-xl font-bold mb-6 text-[#1D3557]">
              Resumo do Jogo - Nível {level}
            </h2>
            
            {Object.entries(questionsByRound).map(([roundIndex, questions]) => {
              const roundNumber = parseInt(roundIndex) + 1;
              const correctInRound = questions.filter(q => q.isCorrect).length;
              const allCorrect = correctInRound === questions.length;
              
              return (
                <div key={roundIndex} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span>Rodada {roundNumber}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      ({correctInRound}/{questions.length} acertos)
                    </span>
                    {allCorrect && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Perfeito!
                      </span>
                    )}
                  </h3>
                  
                  <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                    {questions.map((q, qIndex) => (
                      <div 
                        key={qIndex}
                        className={`p-3 rounded-lg flex justify-between items-center ${
                          q.isCorrect ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <div>
                          <p className="font-medium">
                            Intervalo: {formatIntervalName(q.question.interval)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Nota de referência: {q.question.referenceNote.name}{q.question.referenceNote.octave}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {q.isCorrect ? 'Correto' : 'Incorreto'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {q.timeSpent}s
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </GameLayout>
  );
} 