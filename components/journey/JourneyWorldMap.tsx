"use client";

import React from "react";
import { MapPin } from "lucide-react";
import type { JourneyVizProps } from "./JourneyViz";
import { revealState } from "./JourneyViz";

/**
 * 세계 수도 코스 — 대륙별 구역(지도형) 시각화.
 * course.groups(대륙)를 구역으로 나누고, 각 나라를 칩으로 배치한다.
 * 도착/공개된 나라는 수도(fact)를 함께 보여준다.
 */
export const JourneyWorldMap: React.FC<JourneyVizProps> = ({
  course,
  stations,
  currentIndex,
  phase,
  finished = false,
  showAllNames,
  variant,
}) => {
  const color = course.lines[0]?.color || "#0ea5e9";
  const groups = course.groups || [];

  // 전역 인덱스를 유지한 채 대륙별로 묶기
  const indexed = stations.map((station, idx) => ({ station, idx }));

  const chip = (station: (typeof stations)[number], idx: number, compact: boolean) => {
    const state = revealState(idx, currentIndex, phase, finished, showAllNames);
    const isCurrent = idx === currentIndex && !finished;
    // 퀴즈 방식: 문제로 나온 나라는 이름을 항상 공개하고 지도에서 하이라이트, 수도(fact)만 정답 후 공개
    const label = state === "hidden" ? "•" : station.name;
    const showCapital = state === "name" && !isCurrent;
    return (
      <div
        key={station.id}
        className={`flex flex-col items-center justify-center rounded-2xl border text-center transition-all ${
          compact ? "px-3 py-2 min-w-[76px]" : "px-3 py-2.5"
        } ${
          isCurrent
            ? "border-transparent text-white shadow-lg scale-105"
            : state === "hidden"
            ? "border-dashed border-outline-variant/60 bg-surface-low text-secondary/40"
            : "border-outline-variant/50 bg-surface-lowest text-on-surface"
        }`}
        style={isCurrent ? { backgroundColor: color } : undefined}
      >
        <span className={`font-black ${compact ? "text-xs" : "text-sm"} leading-tight`}>{label}</span>
        {showCapital && (
          <span className={`mt-0.5 flex items-center gap-0.5 ${compact ? "text-[9px]" : "text-[10px]"} font-bold ${isCurrent ? "text-white/90" : "text-primary"}`}>
            <MapPin size={compact ? 8 : 9} /> {station.fact}
          </span>
        )}
      </div>
    );
  };

  // ── 모바일 스트립: 대륙 라벨 + 국가 칩 가로 스크롤 ──
  if (variant === "strip") {
    const currentGroup = groups.find((g) => g.id === stations[Math.min(currentIndex, stations.length - 1)]?.group);
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="text-2xl">{course.emoji}</span>
          <span className="text-xs font-black text-zinc-300 uppercase tracking-widest">
            {currentGroup?.label || "세계 수도"}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
          {indexed.map(({ station, idx }) => (
            <div key={station.id} className="snap-center shrink-0">
              {chip(station, idx, true)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── 데스크톱: 대륙 구역 격자 ──
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-3xl">{course.emoji}</span>
        <h3 className="editorial-heading text-xl">{course.title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((g) => {
          const items = indexed.filter(({ station }) => station.group === g.id);
          if (items.length === 0) return null;
          return (
            <section key={g.id} className="rounded-[1.5rem] bg-surface-low border border-outline-variant/40 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <h4 className="text-sm font-black text-on-surface">{g.label}</h4>
                <span className="text-[10px] font-bold text-secondary/60">{items.length}개국</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map(({ station, idx }) => chip(station, idx, false))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
