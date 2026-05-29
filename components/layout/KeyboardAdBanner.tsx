"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

interface KeyboardItem {
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

const RECOMMEND_KEYBOARDS: KeyboardItem[] = [
  {
    id: "abko",
    name: "ABKO MK108",
    category: "멤브레인 / 가성비 입문용",
    tag: "Entry King",
    price: "2만원대",
    description: "쫀득한 키감과 세련된 오트밀 디자인. 타자 입문자에게 최적의 선택.",
    imageUrl: "/keyboard/abko.png",
    affiliateUrl: "https://link.coupang.com/a/d95o22",
    bgColor: "bg-surface-low",
  },
  {
    id: "hansung",
    name: "한성 GK893B Sports",
    category: "무접점 / 오피스 프리미엄",
    tag: "Office Choice",
    price: "14만원대",
    description: "보글보글 매력적인 무접점 타건감. 극강의 저소음으로 조용한 연습.",
    imageUrl: "/keyboard/abko.png", // GK893B
    affiliateUrl: "https://link.coupang.com/a/d95o22", // 제휴 링크
    bgColor: "bg-indigo-50/50 dark:bg-indigo-950/20",
  },
];

export const KeyboardAdBanner: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-4 block flex items-center justify-center gap-2">
          <Sparkles size={12} className="text-primary" /> Special Gear <Sparkles size={12} className="text-primary" />
        </span>
        <h3 className="headline-md !text-2xl text-on-surface">
          타자 연습의 품격을 높여줄 추천 키보드
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
                  최저가 확인하기 <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-center text-[9px] text-zinc-400 font-medium tracking-widest mt-8 leading-relaxed">
        💡 이 포스팅은 제휴 마케팅 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.
      </p>
    </div>
  );
};
