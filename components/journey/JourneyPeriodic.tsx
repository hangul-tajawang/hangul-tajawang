"use client";

import React from "react";
import type { JourneyVizProps } from "./JourneyViz";
import { revealState } from "./JourneyViz";

/**
 * 주기율표 코스 — 그리드형 시각화.
 * station.row(주기) × station.col(족, 1~18) 좌표로 원소를 격자에 배치한다.
 * 원소기호(reading)는 항상 표시되고, 원소 이름(name)만 공개 규칙을 따른다.
 */
export const JourneyPeriodic: React.FC<JourneyVizProps> = ({
  course,
  stations,
  currentIndex,
  phase,
  finished = false,
  showAllNames,
  variant,
}) => {
  const color = course.lines[0]?.color || "#10b981";
  const maxRow = stations.reduce((m, s) => Math.max(m, s.row || 1), 1);

  const cell = (station: (typeof stations)[number], idx: number, compact: boolean) => {
    const state = revealState(idx, currentIndex, phase, finished, showAllNames);
    const isCurrent = idx === currentIndex && !finished;
    const revealed = state === "name";
    return (
      <div
        key={station.id}
        className={`flex flex-col items-center justify-center rounded-lg border aspect-square transition-all ${
          compact ? "min-w-[52px]" : ""
        } ${
          isCurrent
            ? "border-transparent text-white shadow-lg scale-105 z-10"
            : revealed
            ? "border-outline-variant/50 bg-surface-lowest text-on-surface"
            : "border-dashed border-outline-variant/50 bg-surface-low text-secondary"
        }`}
        style={isCurrent ? { backgroundColor: color } : undefined}
        title={revealed ? `${idx + 1}. ${station.name}` : `${idx + 1}`}
      >
        <span className={`${compact ? "text-[8px]" : "text-[9px]"} font-bold leading-none opacity-70 self-start ml-1 mt-1`}>
          {idx + 1}
        </span>
        {/* 원소기호 — 배경과의 대비가 무너지지 않게 항상 라인 색으로 명시 */}
        <span
          className={`${compact ? "text-sm" : "text-base"} font-black leading-none -mt-1`}
          style={!isCurrent ? { color } : undefined}
        >
          {station.reading}
        </span>
        <span className={`${compact ? "text-[8px]" : "text-[9px]"} font-bold leading-tight mb-1 truncate max-w-full px-0.5`}>
          {revealed ? station.name : state === "q" ? "???" : ""}
        </span>
      </div>
    );
  };

  // ── 모바일 스트립: 원소 셀 가로 스크롤 ──
  if (variant === "strip") {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="text-2xl">{course.emoji}</span>
          <span className="text-xs font-black text-zinc-300 uppercase tracking-widest">{course.title}</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
          {stations.map((station, idx) => (
            <div key={station.id} className="snap-center shrink-0">
              {cell(station, idx, true)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── 데스크톱: 18열 주기율표 격자 ──
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-3xl">{course.emoji}</span>
        <h3 className="editorial-heading text-xl">{course.title}</h3>
      </div>
      <div className="overflow-x-auto pb-2">
        <div
          className="grid gap-1 min-w-[560px]"
          style={{
            gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
            gridTemplateRows: `repeat(${maxRow}, minmax(0, 1fr))`,
          }}
        >
          {stations.map((station, idx) => (
            <div key={station.id} style={{ gridColumn: station.col, gridRow: station.row }}>
              {cell(station, idx, false)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
