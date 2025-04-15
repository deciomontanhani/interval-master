'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatIntervalName } from '@/lib/intervals';
import { Question, Note } from '@/lib/types';

interface RoundSummaryProps {
  roundNumber: number;
  level: number;
  questions: {
    question: Question;
    userAnswer: Note | null;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  canAdvance: boolean;
  onContinue: () => void;
  onQuit: () => void;
}

export const RoundSummary = ({
  roundNumber,
  level,
  questions,
  canAdvance,
  onContinue,
  onQuit
}: RoundSummaryProps) => {
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(q => q.isCorrect).length;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  return (
    <Card className="w-full max-w-3xl p-6">
      <h2 className="text-2xl font-bold text-center mb-2 text-[#1D3557]">
        Resumo da Rodada {roundNumber}
      </h2>
      
      <div className="text-center mb-4">
        <p className="text-gray-600">Nível {level}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-lg font-bold text-[#3861FB]">{correctAnswers}/{totalQuestions}</p>
          <p className="text-sm text-gray-600">Acertos</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-lg font-bold text-[#F5B014]">{accuracy.toFixed(0)}%</p>
          <p className="text-sm text-gray-600">Precisão</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-lg font-bold text-[#E63946]">
            {canAdvance ? "Sim" : "Não"}
          </p>
          <p className="text-sm text-gray-600">Pode Avançar</p>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-semibold mb-2">Detalhes:</h3>
        
        {questions.map((q, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg flex justify-between items-center ${
              q.isCorrect ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <div>
              <p className="font-medium">
                {formatIntervalName(q.question.interval)}
              </p>
              <p className="text-sm text-gray-600">
                Nota ref: {q.question.referenceNote.name}
                {q.userAnswer && ` → ${q.userAnswer.name}`}
                {!q.userAnswer && ' → Tempo esgotado'}
                {!q.isCorrect && q.userAnswer && ` (Correto: ${q.question.correctAnswer.name})`}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {q.isCorrect ? 'Correto' : 'Incorreto'}
              </p>
              <p className="text-xs text-gray-600">
                {q.timeSpent}s
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mb-6">
        {canAdvance ? (
          <p className="text-green-600 font-semibold">
            Parabéns! Você acertou todas as perguntas e pode avançar para a próxima rodada.
          </p>
        ) : (
          <p className="text-red-600 font-semibold">
            Você teve alguns erros nesta rodada. Não é possível avançar.
          </p>
        )}
      </div>
      
      <div className="flex space-x-4">
        <Button 
          variant="danger" 
          className="flex-1"
          onClick={onQuit}
        >
          Encerrar
        </Button>
        
        <Button 
          variant="primary" 
          className="flex-1"
          onClick={onContinue}
        >
          {canAdvance ? "Continuar" : "Ver Resultados"}
        </Button>
      </div>
    </Card>
  );
}; 