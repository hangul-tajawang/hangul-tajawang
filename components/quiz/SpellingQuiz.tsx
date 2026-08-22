"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle2, XCircle, Lightbulb, Trophy } from "lucide-react";
import { QuizQuestion } from "@/lib/quiz-data";
import { useRouter, useSearchParams } from "next/navigation";
import { AdSenseUnit } from "../layout/AdSenseUnit";

interface Props {
  question: QuizQuestion;
  nextQuestionId: string | null;
  currentIndex: number;
  totalLength: number;
}

export const SpellingQuiz: React.FC<Props> = ({ question, nextQuestionId, currentIndex, totalLength }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const currentScore = parseInt(searchParams.get("s") || "0", 10);

  const shuffledOptions = useMemo(() => {
    return [question.correctAnswer, ...question.wrongAnswers].sort(() => Math.random() - 0.5);
  }, [question]);

  const handleSelect = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    setTimeout(() => {
      setShowExplanation(true);
    }, 600);
  };

  const handleNext = () => {
    const isCorrect = selectedAnswer === question.correctAnswer;
    const nextScore = isCorrect ? currentScore + 1 : currentScore;
    
    if (nextQuestionId) {
      router.push(`/quiz/${nextQuestionId}?s=${nextScore}`);
    } else {
      setIsGameOver(true);
    }
  };

  const handleRestart = () => {
    router.push(`/quiz`);
  };

  if (isGameOver) {
    const isCorrect = selectedAnswer === question.correctAnswer;
    const finalScore = isCorrect ? currentScore + 1 : currentScore;
    const percentage = Math.round((finalScore / totalLength) * 100);
    
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md w-full border border-zinc-100">
          <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-6" />
          <h2 className="text-3xl font-bold mb-2 text-zinc-900">모든 퀴즈 완료!</h2>
          <p className="text-zinc-500 mb-8 font-medium">당신의 맞춤법 점수는?</p>
          <div className="bg-blue-50 text-blue-600 text-6xl font-bold py-8 rounded-2xl mb-8 border border-blue-100">
            {percentage}점
          </div>
          <p className="text-lg font-bold text-zinc-800 mb-8">
            {percentage >= 80 ? "훌륭해요! 맞춤법 장인이시네요!" : percentage >= 60 ? "잘했어요! 조금만 더 다듬어봐요!" : "맞춤법 공부가 조금 더 필요해요!"}
          </p>
          <div className="mb-6 flex justify-center empty:hidden">
            <AdSenseUnit label="content-banner-mobile" width={320} height={100} tight />
          </div>
          <button 
            onClick={handleRestart}
            className="w-full py-4 bg-zinc-900 text-white text-lg font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            퀴즈 메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-800 flex items-center gap-2">
          <span>✍️</span> 맞춤법 실전 퀴즈
        </h2>
        <div className="bg-surface-low px-4 py-1.5 rounded-full text-sm font-bold text-zinc-600 border border-surface-high">
          {currentIndex + 1} / {totalLength}
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-zinc-200 mb-6">
        <p className="text-center text-zinc-500 mb-8 font-medium">빈칸에 들어갈 알맞은 말을 고르세요.</p>
        <h3 className="text-2xl md:text-3xl font-bold text-center leading-relaxed mb-12 text-zinc-900">
          {question.question.split("___").map((part, i, arr) => (
            <React.Fragment key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="inline-block w-24 h-10 border-b-2 border-zinc-400 mx-2 align-middle" />
              )}
            </React.Fragment>
          ))}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shuffledOptions.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.correctAnswer;
            
            let btnClass = "border-zinc-200 hover:border-blue-400 hover:bg-blue-50 text-zinc-800";
            if (showExplanation) {
              if (isCorrect) btnClass = "bg-green-50 border-green-500 text-green-700";
              else if (isSelected) btnClass = "bg-red-50 border-red-500 text-red-700";
              else btnClass = "opacity-50 border-zinc-200 text-zinc-500";
            } else if (isSelected) {
              btnClass = "bg-blue-50 border-blue-500 text-blue-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                disabled={!!selectedAnswer}
                className={`py-4 px-6 rounded-xl border-2 text-lg font-bold transition-all flex items-center justify-between group ${btnClass}`}
              >
                {option}
                {showExplanation && isCorrect && <CheckCircle2 className="text-green-500" />}
                {showExplanation && isSelected && !isCorrect && <XCircle className="text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 해설 영역 */}
      <div className={`transition-all duration-500 transform ${showExplanation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col gap-4">
          <div className="flex gap-3 items-start">
            <div className="mt-1 bg-white p-1.5 rounded-lg shadow-sm">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 mb-1">정답: {question.correctAnswer}</h4>
              <p className="text-zinc-700 text-sm leading-relaxed mb-2 font-medium">{question.explanation}</p>
            </div>
          </div>
          <button 
            onClick={handleNext}
            className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md text-lg"
          >
            {nextQuestionId ? "다음 퀴즈로 이동" : "최종 결과 보기"}
          </button>
        </div>
      </div>
    </div>
  );
};
