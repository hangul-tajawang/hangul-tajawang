"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { JourneyVizProps } from "./JourneyViz";

/**
 * 지도 퀴즈(ui:'map') 시각화 — 실제 세계지도 위에서 현재 문제 국가를 하이라이트.
 *
 * 데이터: public/journey/world-map.json (scripts/build-world-map.mjs 산출물, 정적 커밋).
 * 국가별 <path>를 그대로 그리며 런타임 지도 라이브러리 의존성이 없다.
 *  - 미출제: 중립색 / 정답 완료: 초록 틴트 / 현재 문제: 강조색 + 펄스
 *  - 자동 줌: 현재 국가의 사전계산 bbox로 <g> transform 애니메이션 (소국 식별용)
 */

interface WorldMapData {
  viewBox: string;
  countries: { code: string; d: string; bbox: [number, number, number, number] }[];
}

// 모듈 레벨 캐시 — 코스 재시작/재방문 시 재요청 없음
let mapDataCache: WorldMapData | null = null;
let mapDataPromise: Promise<WorldMapData> | null = null;

function loadMapData(): Promise<WorldMapData> {
  if (mapDataCache) return Promise.resolve(mapDataCache);
  if (!mapDataPromise) {
    mapDataPromise = fetch("/journey/world-map.json")
      .then((res) => res.json())
      .then((data: WorldMapData) => {
        mapDataCache = data;
        return data;
      });
  }
  return mapDataPromise;
}

const VIEW_W = 1000;
const VIEW_H = 520;

export const JourneyGeoMap: React.FC<JourneyVizProps> = ({
  stations,
  currentIndex,
  finished,
  variant,
}) => {
  const [data, setData] = useState<WorldMapData | null>(mapDataCache);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data) loadMapData().then(setData).catch(() => {});
  }, [data]);

  const current = stations[currentIndex];
  const doneCodes = useMemo(() => {
    const done = new Set<string>();
    for (let i = 0; i < stations.length; i++) {
      if (finished || i < currentIndex) done.add(stations[i].id);
    }
    return done;
  }, [stations, currentIndex, finished]);

  // 현재 국가 bbox → 줌 transform 계산 (여백 패딩 + 최대 줌 클램프)
  const transform = useMemo(() => {
    if (!data || finished || !current) return "translate(0px,0px) scale(1)";
    const entry = data.countries.find((c) => c.code === current.id);
    if (!entry) return "translate(0px,0px) scale(1)";
    const [x, y, w, h] = entry.bbox;
    const pad = Math.max(w, h) * 1.6 + 30; // 주변 맥락이 보이도록 넉넉한 패딩
    const bw = w + pad * 2;
    const bh = h + pad * 2;
    const scale = Math.min(6, Math.min(VIEW_W / bw, VIEW_H / bh)); // 최대 6배 줌
    if (scale <= 1.05) return "translate(0px,0px) scale(1)";
    const cx = x + w / 2;
    const cy = y + h / 2;
    const tx = VIEW_W / 2 - cx * scale;
    const ty = VIEW_H / 2 - cy * scale;
    // CSS transform은 SVG 속성과 달리 px 단위 필수 (viewBox 좌표계 기준 px)
    return `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${scale.toFixed(2)})`;
  }, [data, current, finished]);

  const isStrip = variant === "strip";

  if (!data) {
    return (
      <div className={`w-full flex items-center justify-center bg-slate-100 rounded-2xl ${isStrip ? "h-28" : "h-48 md:h-64"}`}>
        <span className="text-xs font-bold text-zinc-400 animate-pulse">세계지도 불러오는 중…</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl bg-sky-50 border border-sky-100 ${isStrip ? "" : "shadow-inner"}`}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className={`w-full h-auto ${isStrip ? "max-h-32" : "max-h-[46vh]"}`}
        role="img"
        aria-label="세계지도 — 하이라이트된 나라를 맞혀보세요"
      >
        <g style={{ transform, transformOrigin: "0 0", transition: "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
          {data.countries.map((c) => {
            const isCurrent = !finished && current?.id === c.code;
            const isDone = doneCodes.has(c.code);
            return (
              <path
                key={c.code}
                d={c.d}
                fill={isCurrent ? "#f59e0b" : isDone ? "#34d399" : "#cbd5e1"}
                stroke={isCurrent ? "#b45309" : "#ffffff"}
                strokeWidth={isCurrent ? 1.2 : 0.5}
                style={isCurrent ? { animation: "journey-map-pulse 1.4s ease-in-out infinite" } : undefined}
              />
            );
          })}
        </g>
      </svg>

      {/* 진행 현황 배지 */}
      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/55 text-white text-[10px] font-bold tabular-nums backdrop-blur-sm">
        {finished ? `완주! ${stations.length}개국` : `${doneCodes.size} / ${stations.length}개국`}
      </div>

      {/* StairsGame 패턴과 동일한 인라인 keyframe (styled-jsx 미사용) */}
      <style>{`
        @keyframes journey-map-pulse {
          0%, 100% { fill: #f59e0b; }
          50% { fill: #fbbf24; }
        }
      `}</style>
    </div>
  );
};
