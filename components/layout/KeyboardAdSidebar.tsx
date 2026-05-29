"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, X, ChevronDown } from "lucide-react";
import { RECOMMEND_KEYBOARDS } from "./KeyboardAdBanner";

export const KeyboardAdSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="w-0 h-0 transition-all duration-500">
        <button 
          onClick={() => setIsCollapsed(false)}
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-surface-lowest border border-outline-variant py-6 px-2.5 rounded-l-2xl shadow-xl hover:-translate-x-1 transition-all group z-[100] flex flex-col items-center gap-3"
          title="운영자 추천 키보드 보기"
        >
          <Sparkles size={16} className="text-primary group-hover:animate-pulse shrink-0" />
          <span className="text-[11px] font-black text-on-surface/70 group-hover:text-primary transition-colors tracking-[0.2em] [writing-mode:vertical-rl]">
            운영자 추천 키보드
          </span>
        </button>
      </div>
    );
  }

  const handleAffiliateClick = (keyboard: any) => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: `click_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          value: 1,
          currency: "KRW",
          items: [{
            item_id: keyboard.id || keyboard.name,
            item_name: keyboard.name,
            item_category: "Affiliate Keyboard",
            price: 1,
            quantity: 1
          }]
        }
      });
    }
  };

  return (
    <div className="w-[300px] flex flex-col gap-6 relative bg-surface-low/30 p-2 -mx-2 rounded-[2rem] transition-all duration-500">
      <button 
        onClick={() => setIsCollapsed(true)}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-surface-lowest border border-outline-variant text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-surface-high rounded-full transition-all shadow-sm z-10 group"
      >
        <span className="text-[10px] font-black tracking-widest">접어두기</span>
        <X size={12} className="group-hover:rotate-90 transition-transform" />
      </button>
      
      <div className="flex flex-col px-2 pt-2">
        <span className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary" /> Editor's Pick
        </span>
        <h3 className="text-lg font-black text-on-surface leading-tight">
          운영자 강력 추천<br/>타건감 끝판왕 키보드
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {RECOMMEND_KEYBOARDS.map((keyboard) => (
          <a
            key={keyboard.id}
            href={keyboard.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleAffiliateClick(keyboard)}
            className="group block bg-surface-lowest border border-outline-variant rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <div className={`w-full aspect-video ${keyboard.bgColor} rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center`}>
              <Image
                src={keyboard.imageUrl}
                alt={keyboard.name}
                width={160}
                height={160}
                className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black rounded-full uppercase tracking-wider">
                  {keyboard.tag}
                </span>
                <span className="text-[10px] text-zinc-400 font-bold">{keyboard.price}</span>
              </div>
              <h4 className="text-base font-black text-on-surface group-hover:text-primary transition-colors">
                {keyboard.name}
              </h4>
              <p className="text-zinc-500 text-xs font-medium leading-relaxed">
                {keyboard.description}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-primary font-black text-[10px] uppercase tracking-wider">
                상세 스펙 보러가기 <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-center text-[9px] text-zinc-400 font-medium tracking-tight mt-4 leading-relaxed">
        💡 이 포스팅은 쿠팡 파트너스 활동의 일환으로,<br/>이에 따른 일정액의 수수료를 제공받습니다.<br/>
        <span className="text-zinc-500 font-bold mt-1.5 block">운영자가 서버비용을 감당하는데 큰 도움이 됩니다 🙇‍♂️</span>
      </p>
    </div>
  );
};
