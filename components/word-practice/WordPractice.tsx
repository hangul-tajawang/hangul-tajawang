"use client";

import React, { useState, useEffect, useRef } from "react";
import { TypingUtils, TypingReport } from "@/lib/typing-speed";
import { KeyboardAdBanner } from "../layout/KeyboardAdBanner";
import { Trophy, RotateCcw, Target, Zap, Clock, ChevronRight, Layout, Keyboard, Star, Sparkles, Flame, X } from "lucide-react";
import { BASIC_PRACTICE_STEPS, PracticeStep } from "@/lib/word-data";
import { scrollIntoViewOnFocus } from "@/hooks/useVirtualKeyboard";
import { AdSenseUnit } from "../layout/AdSenseUnit";

export const WordPractice: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<PracticeStep | null>(null);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [correctWords, setCorrectWords] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [report, setReport] = useState<TypingReport | null>(null);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isError, setIsError] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const startStep = (step: PracticeStep) => {
    const shuffled = [...step.words].sort(() => Math.random() - 0.5);
    setSelectedStep(step);
    setCurrentWords(shuffled);
    setCurrentIndex(0);
    setInputValue("");
    setCorrectWords(0);
    setStartTime(null);
    setReport(null);
    setTotalStrokes(0);
    setCombo(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }

    const target = currentWords[currentIndex];
    if (value.length > 0 && !target.startsWith(value)) {
        setIsError(true);
    } else {
        setIsError(false);
    }

    if (value.endsWith(" ")) {
      checkWord(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      checkWord(inputValue.trim());
    }
    if (!["Shift", "Control", "Alt", "Meta", "CapsLock", "Escape"].includes(e.key)) {
        setTotalStrokes(prev => prev + 1);
    }
  };

  const checkWord = (word: string) => {
    if (!word) return;

    const target = currentWords[currentIndex];
    if (word === target) {
      setCorrectWords(prev => prev + 1);
      setCombo(prev => prev + 1);
      setIsError(false);
    } else {
      setCombo(0);
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
    }

    if (currentIndex === currentWords.length - 1) {
      finishPractice();
    } else {
      setCurrentIndex(prev => prev + 1);
      setInputValue("");
    }
  };

  const finishPractice = () => {
    const timeTaken = (Date.now() - (startTime || Date.now())) / 1000;
    const fullOriginal = currentWords.join(" ");
    const finalReport = TypingUtils.generateReport(fullOriginal, fullOriginal, totalStrokes, timeTaken);
    setReport(finalReport);
  };

  const reset = () => {
    setSelectedStep(null);
    setReport(null);
  };

  if (!selectedStep) {
    return (
      <div className="w-full max-w-5xl mx-auto py-12 px-4 animate-in fade-in duration-700 text-center">
        <h2 className="text-4xl font-bold mb-12 flex items-center justify-center gap-3">
            <Star className="text-yellow-400 fill-yellow-400" /> 낱말 연습 단계 선택
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BASIC_PRACTICE_STEPS.map((step, idx) => (
                <button key={step.id} onClick={() => startStep(step)} className="group bg-white p-8 rounded-2xl border border-zinc-200 text-left hover:border-blue-500 hover:shadow-2xl transition-all hover:-translate-y-2">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg uppercase mb-4 tracking-widest">Step {idx + 1}</span>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{step.title}</h3>
                    <p className="text-zinc-400 text-sm font-medium mb-6 leading-relaxed">{step.description}</p>
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">시작하기 <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></div>
                </button>
            ))}
        </div>
      </div>
    );
  }

  if (report) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-500 px-4">
        <div className="bg-white p-12 rounded-2xl shadow-2xl border border-zinc-100 text-center max-w-lg w-full relative overflow-hidden">
          <div className="inline-flex p-5 bg-yellow-50 rounded-full mb-8"><Trophy className="w-16 h-16 text-yellow-500" /></div>
          <h2 className="text-4xl font-bold mb-2">연습 완료!</h2>
          <div className="grid grid-cols-2 gap-4 my-10">
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100"><p className="text-[10px] font-bold text-zinc-400 uppercase mb-2 tracking-widest">정확도</p><p className="text-3xl font-bold text-blue-600">{report.accuracy}%</p></div>
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100"><p className="text-[10px] font-bold text-zinc-400 uppercase mb-2 tracking-widest">최종 타수</p><p className="text-3xl font-bold text-green-600">{report.kpm}타</p></div>
          </div>
          <div className="mb-6 flex justify-center empty:hidden">
            <AdSenseUnit label="content-banner-mobile" width={320} height={100} tight />
          </div>
          <button onClick={reset} className="w-full py-5 bg-zinc-900 text-white font-bold rounded-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"><RotateCcw size={20} /> 다시 선택하기</button>
          {/* 코어 출구 — 낱말을 넘어 지식을 외우는 다음 단계 */}
          <a href="/journey" className="mt-4 block text-sm font-bold text-zinc-500 hover:text-primary transition-colors">
            낱말은 뗐다면, 이제 지식을 타자로 — 지식타자 →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-4 md:py-12 max-w-4xl mx-auto px-4 w-full animate-in fade-in">
      <div className="w-full flex justify-between items-center mb-4 md:mb-12 bg-white p-3 md:p-4 rounded-2xl md:rounded-2xl border border-zinc-100 shadow-sm">
        <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-xl"><Target size={16} className="text-blue-600" /><span className="text-sm font-bold">{currentIndex + 1} / {currentWords.length}</span></div>
            {combo > 1 && <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl animate-bounce"><Flame size={16} className="text-orange-500" /><span className="text-sm font-bold text-orange-600">{combo} COMBO</span></div>}
        </div>
        <button onClick={reset} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400"><RotateCcw size={20} /></button>
      </div>

      <div className={`w-full bg-white rounded-2xl md:rounded-2xl shadow-2xl p-8 md:p-16 mb-6 md:mb-16 text-center border-4 transition-all duration-300 relative overflow-hidden ${isError ? 'border-red-500 animate-shake' : 'border-zinc-100'}`}>
        <div className="absolute top-0 left-0 w-full h-2 bg-zinc-50"><div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(currentIndex / currentWords.length) * 100}%` }} /></div>
        <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold text-zinc-900 mb-2 tracking-tight select-none break-keep">{currentWords[currentIndex]}</h2>
      </div>

      <div className="w-full max-w-md relative group">
        <input ref={inputRef} type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={() => scrollIntoViewOnFocus(inputRef.current)} className={`w-full h-16 md:h-24 px-6 md:px-10 text-2xl md:text-4xl bg-white border-4 rounded-2xl md:rounded-2xl shadow-2xl outline-hidden text-center font-bold transition-all ${isError ? 'border-red-100' : 'border-zinc-100 focus:border-blue-500'}`} placeholder="입력 후 스페이스" autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
      </div>

      <div className="mt-12 md:mt-24 pt-16 border-t border-outline-variant/60 w-full">
        <KeyboardAdBanner />
      </div>
    </div>
  );
};
