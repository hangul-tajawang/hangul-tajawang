"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Keyboard, Sparkles, ArrowRight } from 'lucide-react';

interface KakaoAdFitProps {
  unit: string;
  width: number;
  height: number;
  disabled?: boolean;
}

/**
 * 애드핏 NO-AD 폴백 하우스 배너.
 * 애드핏이 광고를 채우지 못한 슬롯(fill rate 미달분)을 버리지 않고
 * 쿠팡 파트너스 키보드 추천 페이지로 연결되는 자체 배너로 회수한다.
 * 슬롯 비율에 따라 세로형(160x600) / 사각형(300x250) / 가로형(320x100)으로 렌더링.
 */
const HouseAdFallback: React.FC<{ width: number; height: number; unit: string }> = ({ width, height, unit }) => {
  useEffect(() => {
    // GTM으로 폴백 노출 집계 (GA4에서 하우스배너 성과 추적용)
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

export const KakaoAdFit: React.FC<KakaoAdFitProps> = ({ unit, width, height, disabled = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<boolean>(false);
  const [failed, setFailed] = useState(false);
  // 같은 유닛이 한 페이지에 두 번 실릴 수 있으므로 인스턴스별 고유 콜백 이름 사용
  const onFailName = useRef(
    `adfitNoAd_${unit.replace(/[^a-zA-Z0-9_]/g, "_")}_${Math.random().toString(36).slice(2, 8)}`
  ).current;

  useEffect(() => {
    // Prevent rendering in disabled mode or double rendering in React Strict Mode
    if (disabled || adRef.current) return;

    const adFitWindow = window as unknown as Window & Record<string, ((element: HTMLModElement) => void) | undefined>;
    // 애드핏 광고 미수신(NO-AD) → 하우스 배너로 전환해 노출 낭비를 회수
    adFitWindow[onFailName] = () => {
      setFailed(true);
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[adfit] no ad returned for ${unit} → house ad fallback`);
      }
    };

    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kas/static/ba.min.js';
    script.async = true;
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    containerRef.current?.appendChild(script);

    adRef.current = true;
  }, [disabled, onFailName, unit]);

  if (disabled) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-surface-high border-2 border-dashed border-outline-variant text-zinc-400 text-sm font-bold rounded-2xl p-4 text-center my-4"
        style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
      >
        <span>Kakao AdFit 영역</span>
        <span className="text-xs font-normal mt-1 opacity-70">{width} x {height}</span>
        <span className="text-xs font-normal mt-1 opacity-70 break-all">{unit}</span>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="flex items-center justify-center w-full my-4 overflow-hidden" style={{ minHeight: `${height}px` }}>
        <HouseAdFallback width={width} height={height} unit={unit} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex items-center justify-center w-full my-4 overflow-hidden" style={{ minHeight: `${height}px` }}>
      <ins
        className="kakao_ad_area"
        style={{ display: 'none', width: '100%' }}
        data-ad-unit={unit}
        data-ad-width={width}
        data-ad-height={height}
        data-ad-onfail={onFailName}
      ></ins>
    </div>
  );
};
