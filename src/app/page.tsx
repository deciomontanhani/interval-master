'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GameLayout } from '@/components/layout/GameLayout';
import { useGame } from '@/context/GameContext';

export default function Home() {
  const router = useRouter();
  const { startGame } = useGame();
  const [highScore, setHighScore] = useState<number | null>(null);
  
  // Carregar pontuação máxima do localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('intervalMasterHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);
  
  const handleStartGame = (level: 1 | 2 | 3 | 4) => {
    startGame(level);
    router.push('/game');
  };
  
  return (
    <GameLayout>
      <div className="flex flex-col items-center justify-center gap-8">
        <Card className="w-full max-w-xl p-8">
          <p className="text-gray-700 mb-6 text-center">
            Treine seu conhecimento sobre intervalos musicais. Escolha um nível de dificuldade para começar:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => handleStartGame(1)}
              >
                Nível 1: Iniciante
              </Button>
              <p className="text-sm text-gray-600 mt-1 text-center">
                Intervalos genéricos (segunda, terça, etc.) sem classificação específica.
              </p>
            </div>
            
            <div className="flex flex-col">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => handleStartGame(2)}
              >
                Nível 2: Intermediário
              </Button>
              <p className="text-sm text-gray-600 mt-1 text-center">
                Intervalos justos, maiores e menores. Mais opções de resposta.
              </p>
            </div>
            
            <div className="flex flex-col">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => handleStartGame(3)}
              >
                Nível 3: Avançado
              </Button>
              <p className="text-sm text-gray-600 mt-1 text-center">
                Inclui intervalos aumentados e diminutos. Tempo de resposta reduzido.
              </p>
            </div>
            
            <div className="flex flex-col">
              <Button 
                variant="primary"
                className="w-full"
                onClick={() => handleStartGame(4)}
              >
                Nível 4: Expert
              </Button>
              <p className="text-sm text-gray-600 mt-1 text-center">
                Todos os tipos de intervalos, mais opções de resposta, tempo muito limitado.
              </p>
            </div>
          </div>
          
          {highScore !== null && (
            <div className="text-center text-gray-700">
              <p className="font-semibold">Sua maior pontuação:</p>
              <p className="text-2xl font-bold text-[#F5B014]">{highScore} pontos</p>
            </div>
          )}
        </Card>
        
        <Card className="w-full max-w-xl">
          <h3 className="text-xl font-bold mb-4 text-[#1D3557]">Como Jogar</h3>
          
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Você receberá uma nota de referência visual.</li>
            <li>Seu objetivo é identificar a nota que forma o intervalo indicado.</li>
            <li>Selecione a nota correta entre as opções disponíveis.</li>
            <li>Quanto mais rápido você responder, mais pontos ganhará.</li>
            <li>Complete 5 perguntas para avançar de rodada.</li>
            <li>Você só avançará se acertar todas as perguntas da rodada.</li>
          </ul>
        </Card>
      </div>
    </GameLayout>
  );
}
