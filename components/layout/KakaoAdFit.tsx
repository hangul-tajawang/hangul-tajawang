"use client";

import React, { useEffect, useRef } from 'react';

interface KakaoAdFitProps {
  unit: string;
  width: number;
  height: number;
  disabled?: boolean;
}

export const KakaoAdFit: React.FC<KakaoAdFitProps> = ({ unit, width, height, disabled = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<boolean>(false);
  const onFailName = `adfitNoAd_${unit.replace(/[^a-zA-Z0-9_]/g, "_")}`;

  useEffect(() => {
    // Prevent rendering in disabled mode or double rendering in React Strict Mode
    if (disabled || adRef.current) return;

    const adFitWindow = window as unknown as Window & Record<string, ((element: HTMLModElement) => void) | undefined>;
    adFitWindow[onFailName] = (element: HTMLModElement) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[adfit] no ad returned for ${unit}`, element);
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
