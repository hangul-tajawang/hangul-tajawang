"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export interface KeyboardItem {
  id: string;
  name: string;
  category: string;
  tag: string;
  price: string;
  description: string;
  imageUrl: string;
  affiliateUrl: string;
  bgColor: string;
}

export const RECOMMEND_KEYBOARDS: KeyboardItem[] = [
  {
    id: "abko",
    name: "ABKO MK108",
    category: "멤브레인 / 가성비 입문용",
    tag: "Entry King",
    price: "2만원대",
    description: "운영자가 사무실에서 주로 사용하고 있는 키보드입니다. 오트밀 디자인이 세련되고 이쁘며, 무엇보다 소음이 없고 부드러운 멤브레인 타건감을 제공합니다.",
    imageUrl: "/keyboard/abko.png",
    affiliateUrl: "https://link.coupang.com/a/d95o22",
    bgColor: "bg-surface-low",
  },
  {
    id: "aula",
    name: "AULA F87 Pro",
    category: "기계식 / 회목축 타격감 끝판왕",
    tag: "Developer Pick",
    price: "5만원대~6만원 초반",
    description: "운영자가 3개월간 매일 8시간씩 실사용한 최강 갓성비 기계식. '도각도각' 회목축 특유의 중독성 넘치는 타건음과 일주일을 거뜬히 버티는 미친 배터리 효율을 직접 경험해 보세요.",
    imageUrl: "/keyboard/aura.jpg",
    affiliateUrl: "https://link.coupang.com/a/d9thu5F6tM",
    bgColor: "bg-indigo-50/50 dark:bg-indigo-950/20",
  },
];

export const KeyboardAdBanner: React.FC = () => {
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
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-4 block flex items-center justify-center gap-2">
          <Sparkles size={12} className="text-primary" /> Special Gear <Sparkles size={12} className="text-primary" />
        </span>
        <h3 className="headline-md !text-2xl text-on-surface">
          운영자가 좋아하고 직접 사용하고 추천하는 키보드
        </h3>
        <p className="text-zinc-400 text-sm font-medium mt-2">
          손끝이 즐거워지는 타건감으로 오타율을 낮추고 타자 속도를 올리세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {RECOMMEND_KEYBOARDS.map((keyboard) => (
          <a
            key={keyboard.id}
            href={keyboard.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleAffiliateClick(keyboard)}
            className="group block bg-surface-lowest border border-outline-variant rounded-[2.5rem] p-8 shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className={`w-32 h-32 ${keyboard.bgColor} rounded-3xl relative shrink-0 overflow-hidden flex items-center justify-center`}>
                <Image
                  src={keyboard.imageUrl}
                  alt={keyboard.name}
                  width={100}
                  height={100}
                  className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[9px] font-black rounded-full uppercase tracking-wider">
                    {keyboard.tag}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-bold">{keyboard.price}</span>
                </div>
                <h4 className="headline-md !text-xl text-on-surface group-hover:text-primary transition-colors">
                  {keyboard.name}
                </h4>
                <p className="text-zinc-500 text-xs font-medium leading-relaxed line-clamp-2">
                  {keyboard.description}
                </p>
                <div className="pt-1 flex items-center justify-center sm:justify-start gap-1.5 text-primary font-black text-[10px] uppercase tracking-wider">
                  상세 스펙 보러가기 <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-center text-[9px] text-zinc-400 font-medium tracking-widest mt-8 leading-relaxed">
        💡 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다. <br className="sm:hidden" />
        <span className="text-zinc-500 font-bold ml-1">운영자가 서버비용을 감당하는데 큰 도움이 됩니다 🙇‍♂️</span>
      </p>
    </div>
  );
};
