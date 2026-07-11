"use client";

import React from "react";
import { Keyboard, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { KeyboardAdBanner } from "@/components/layout/KeyboardAdBanner";

export default function RecommendIndexPage() {
  return (
    <div className="bg-surface min-h-screen pb-24">
      {/* Hero Section */}
      <section className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-20 md:py-28 flex flex-col items-center text-center">
        <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">The Scholar's Tool</span>
        <h1 className="display-lg text-on-surface mb-8 leading-tight tracking-[-0.02em]">
          장비의 미학: <br />
          <span className="text-primary italic">선별된</span> 키보드 컬렉션
        </h1>
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-12 font-medium leading-relaxed tracking-[-0.01em]">
          수많은 키보드 중 오직 타자 연습의 리듬과 <br className="hidden sm:block" />
          집중력을 높여줄 제품들만 엄선했습니다.
        </p>
      </section>

      {/* Keyboard Grid */}
      <section className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* ABKO MK108 Card */}
          <Link href="/recommend/abko-mk108" prefetch={false} className="group block">
            <div className="bg-surface-lowest rounded-[3rem] p-8 md:p-10 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                <Keyboard size={120} />
              </div>
              
              <div className="aspect-square bg-surface-low rounded-[2rem] mb-8 overflow-hidden relative">
                <Image 
                  src="/keyboard/abko.png" 
                  alt="ABKO MK108" 
                  fill
                  className="object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">Entry King</span>
                  <span className="px-3 py-1 bg-zinc-100 text-zinc-400 text-[10px] font-black rounded-full uppercase tracking-widest">Membrane</span>
                </div>
                <h3 className="headline-md !text-2xl group-hover:text-primary transition-colors">ABKO MK108</h3>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                  오트밀 감성의 세련된 디자인과 쫀득한 멤브레인 타건감. 2만원대 입문용 최강자.
                </p>
                <div className="pt-4 flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                  리뷰 및 타건음 보기 <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>

          {/* AULA 독거미 Card */}
          <Link href="/recommend/aula-dokgeomi" prefetch={false} className="group block">
            <div className="bg-surface-lowest rounded-[3rem] p-8 md:p-10 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                <Keyboard size={120} />
              </div>

              <div className="aspect-square bg-surface-low rounded-[2rem] mb-8 overflow-hidden relative">
                <Image
                  src="/keyboard/aura.jpg"
                  alt="AULA 독거미 유선 기계식 키보드"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">Best Value</span>
                  <span className="px-3 py-1 bg-zinc-100 text-zinc-400 text-[10px] font-black rounded-full uppercase tracking-widest">Mechanical</span>
                </div>
                <h3 className="headline-md !text-2xl group-hover:text-primary transition-colors">AULA 독거미 유선</h3>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                  국민 가성비 기계식의 표준. 명확한 타건감으로 타자 연습의 재미가 달라집니다.
                </p>
                <div className="pt-4 flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                  리뷰 보기 <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>

          {/* 한성 GK868B Card */}
          <Link href="/recommend/hansung-gk868b" prefetch={false} className="group block">
            <div className="bg-surface-lowest rounded-[3rem] p-8 md:p-10 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                <Keyboard size={120} />
              </div>

              <div className="aspect-square bg-surface-low rounded-[2rem] mb-8 overflow-hidden relative">
                <Image
                  src="/keyboard/gk868b-1.jpg"
                  alt="한성 GK868B 무접점 키보드"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">3-Year Review</span>
                  <span className="px-3 py-1 bg-zinc-100 text-zinc-400 text-[10px] font-black rounded-full uppercase tracking-widest">무접점</span>
                </div>
                <h3 className="headline-md !text-2xl group-hover:text-primary transition-colors">한성 GK868B</h3>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                  매일 6시간씩 3년을 함께한 무접점. 35g 키압의 가벼움과 보글보글 타건음의 실사용기.
                </p>
                <div className="pt-4 flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                  3년 실사용 후기 보기 <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>

          {/* OMIIYA 108 Card */}
          <Link href="/recommend/omiiya-108" prefetch={false} className="group block">
            <div className="bg-surface-lowest rounded-[3rem] p-8 md:p-10 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                <Keyboard size={120} />
              </div>

              <div className="aspect-square bg-surface-low rounded-[2rem] mb-8 overflow-hidden relative">
                <Image
                  src="/keyboard/omiiya.png"
                  alt="OMIIYA 108키 멤브레인 저소음 키보드"
                  fill
                  className="object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">Office Pick</span>
                  <span className="px-3 py-1 bg-zinc-100 text-zinc-400 text-[10px] font-black rounded-full uppercase tracking-widest">Silent</span>
                </div>
                <h3 className="headline-md !text-2xl group-hover:text-primary transition-colors">OMIIYA 108 저소음</h3>
                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                  옆자리가 모르는 저소음 멤브레인. 사무실에서 눈치 없이 연습량을 쌓는 풀배열.
                </p>
                <div className="pt-4 flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                  리뷰 보기 <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>

        </div>
      </section>

      <div className="mt-16 pt-16 border-t border-outline-variant/60">
        <KeyboardAdBanner />
      </div>
    </div>
  );
}
