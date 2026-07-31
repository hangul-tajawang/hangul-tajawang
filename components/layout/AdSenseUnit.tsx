"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Keyboard, Sparkles, ArrowRight } from 'lucide-react';

const AD_CLIENT = 'ca-pub-6359187702715364'; // 블루커뮤니케이션즈
const AD_SLOT = '6851097346'; // 블루_한글타자왕_웹_디스플레이 (전 지면 공용)

interface AdSenseUnitProps {
  width: number;
  height: number;
  /** GA4 하우스배너 집계용 지면 이름 (예: "sidebar-left") */
  label: string;
  disabled?: boolean;
}

/**
 * 애드센스 미충족(unfilled) 폴백 하우스 배너.
 * 광고가 채워지지 않은 슬롯을 버리지 않고 쿠팡 파트너스 키보드 추천 페이지로
 * 연결되는 자체 배너로 회수한다. (애드핏 시절 폴백 구조 승계)
 */
const HouseAdFallback: React.FC<{ width: number; height: number; unit: string }> = ({ width, height, unit }) => {
  useEffect(() => {
    (window as any).dataLayer?.push({ event: 'house_ad_impression', ad_unit: unit, ad_size: `${width}x${height}` });
  }, [unit, width, height]);

  const handleClick = () => {
    (window as any).dataLayer?.push({ event: 'house_ad_click', ad_unit: unit, ad_size: `${width}x${height}` });
  };

  const isVertical = height > width * 1.5;   // 160x600 스카이스크래퍼
  const isThin = height <= 120;              // 320x100, 728x90 띠배너

  if (isVertical) {
    return (
      <Link prefetch={false} href="/recommend" onClick={handleClick}
        className="group flex flex-col items-center justify-between bg-gradient-to-b from-blue-600 to-indigo-700 text-white rounded-2xl p-5 text-center overflow-hidden relative hover:scale-[1.02] transition-transform"
        style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
      >
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-200">Sponsor</span>
        <div className="flex flex-col items-center gap-4">
          <Keyboard size={48} className="opacity-90 group-hover:-rotate-6 transition-transform" />
          <p className="font-black text-lg leading-snug break-keep">타자 실력,<br />장비가<br />완성합니다</p>
          <p className="text-[11px] text-blue-200 font-medium leading-relaxed break-keep">타건감 좋은<br />가성비 키보드<br />엄선 추천</p>
        </div>
        <span className="px-4 py-2 bg-white text-blue-700 rounded-full text-[11px] font-black flex items-center gap-1">
          추천 보기 <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </Link>
    );
  }

  if (isThin) {
    return (
      <Link prefetch={false} href="/recommend" onClick={handleClick}
        className="group flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl px-5 overflow-hidden relative hover:scale-[1.01] transition-transform"
        style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Keyboard size={28} className="shrink-0 opacity-90" />
          <p className="font-black text-sm leading-tight break-keep truncate">타자 연습엔 좋은 키보드 — 엄선 추천 컬렉션</p>
        </div>
        <span className="shrink-0 px-3 py-1.5 bg-white text-blue-700 rounded-full text-[10px] font-black flex items-center gap-1">
          보기 <ArrowRight size={11} />
        </span>
      </Link>
    );
  }

  // 사각형 (300x250 등)
  return (
    <Link prefetch={false} href="/recommend" onClick={handleClick}
      className="group flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 text-center overflow-hidden relative hover:scale-[1.02] transition-transform"
      style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
    >
      <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.3em] text-blue-200 flex items-center gap-1"><Sparkles size={10} /> Sponsor</span>
      <Keyboard size={40} className="opacity-90 group-hover:-rotate-6 transition-transform" />
      <p className="font-black text-lg leading-snug break-keep">내 타수를 올려줄<br />키보드는 따로 있다</p>
      <span className="px-4 py-2 bg-white text-blue-700 rounded-full text-[11px] font-black flex items-center gap-1">
        추천 키보드 보기 <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
};

export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({ width, height, label, disabled = false }) => {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // React Strict Mode 이중 실행 방지 + disabled 모드
    if (disabled || pushedRef.current || !insRef.current) return;
    pushedRef.current = true;

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      setFailed(true);
      return;
    }

    // 애드센스는 채움 결과를 ins의 data-ad-status 속성으로 알려준다 → unfilled면 하우스 배너로 회수
    const ins = insRef.current;
    const check = () => {
      if (ins.getAttribute('data-ad-status') === 'unfilled') {
        setFailed(true);
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[adsense] unfilled slot at ${label} → house ad fallback`);
        }
        return true;
      }
      return false;
    };
    if (check()) return;
    const observer = new MutationObserver(() => { if (check()) observer.disconnect(); });
    observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
    return () => observer.disconnect();
  }, [disabled, label]);

  if (disabled) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-surface-high border-2 border-dashed border-outline-variant text-zinc-400 text-sm font-bold rounded-2xl p-4 text-center my-4"
        style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
      >
        <span>AdSense 영역</span>
        <span className="text-xs font-normal mt-1 opacity-70">{width} x {height}</span>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="flex items-center justify-center w-full my-4 overflow-hidden" style={{ minHeight: `${height}px` }}>
        <HouseAdFallback width={width} height={height} unit={label} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full my-4 overflow-hidden" style={{ minHeight: `${height}px` }}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'inline-block', width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
      ></ins>
    </div>
  );
};
