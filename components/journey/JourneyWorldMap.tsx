"use client";

import React from "react";
import { MapPin } from "lucide-react";
import type { JourneyVizProps } from "./JourneyViz";
import { revealState } from "./JourneyViz";

/**
 * 세계 수도 코스 — 국기 기반 시각화.
 * station.id 가 ISO 3166-1 alpha-2 코드라 flagcdn 국기 이미지를 그대로 쓴다.
 * - full(데스크톱): 문제로 나온 나라의 큰 국기 히어로 + 대륙별 국기 칩 그리드.
 *   정복한 나라는 국기+수도가 남고, 아직 안 나온 나라는 흐린 국기만 보인다.
 * - strip(모바일): 국기 칩 가로 스트립.
 */

const flagUrl = (id: string, w: 40 | 80 | 160 = 40) => `https://flagcdn.com/w${w}/${id}.png`;

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
  const indexed = stations.map((station, idx) => ({ station, idx }));
  const current = stations[Math.min(currentIndex, stations.length - 1)];
  const solvedCount = Math.min(currentIndex, stations.length);
  // 국기 퀴즈: 나라 이름이 곧 정답이므로 문제(현재) 나라의 이름은 숨긴다
  const isFlagQuiz = course.ui === "flags";

  const chip = (station: (typeof stations)[number], idx: number, compact: boolean) => {
    const state = revealState(idx, currentIndex, phase, finished, showAllNames);
    const isCurrent = idx === currentIndex && !finished;
    const revealed = state === "name" || (isCurrent && !isFlagQuiz);
    return (
      <div
        key={station.id}
        className={`flex flex-col items-center justify-center rounded-2xl border text-center transition-all ${
          compact ? "px-2.5 py-2 min-w-[84px]" : "px-2.5 py-2 w-[92px]"
        } ${
          isCurrent
            ? "border-transparent text-white shadow-lg scale-105"
            : revealed
            ? "border-outline-variant/50 bg-surface-lowest text-on-surface"
            : "border-dashed border-outline-variant/50 bg-surface-low"
        }`}
        style={isCurrent ? { backgroundColor: color } : undefined}
        title={state === "name" ? `${station.name} — ${station.fact}` : undefined}
      >
        {/* 국기 — 아직 안 나온 나라는 흐리게 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={flagUrl(station.id, 40)}
          alt={revealed ? `${station.name} 국기` : "국기"}
          width={30}
          height={20}
          loading="lazy"
          className={`rounded-[3px] shadow-sm ${revealed || isCurrent ? "" : "opacity-30 grayscale"}`}
        />
        <span className={`mt-1 font-black ${compact ? "text-[11px]" : "text-xs"} leading-tight ${revealed ? "" : isCurrent ? "" : "text-secondary/30"}`}>
          {revealed ? station.name : isCurrent ? "???" : "?"}
        </span>
        {state === "name" && !isCurrent && station.fact !== station.name && (
          <span className={`flex items-center gap-0.5 ${compact ? "text-[9px]" : "text-[10px]"} font-bold text-primary`}>
            <MapPin size={8} /> {station.fact}
          </span>
        )}
      </div>
    );
  };

  // ── 모바일 스트립: 국기 칩 가로 스크롤 ──
  if (variant === "strip") {
    const currentGroup = groups.find((g) => g.id === current?.group);
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

  // ── 데스크톱: 현재 나라 국기 히어로 + 대륙별 국기 그리드 ──
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{course.emoji}</span>
          <h3 className="editorial-heading text-xl">{course.title}</h3>
        </div>
        <span className="text-xs font-black text-secondary/70">
          {solvedCount}/{stations.length}개국 정복
        </span>
      </div>

      {/* 문제로 나온 나라 — 큰 국기 히어로 */}
      {!finished && current && (
        <div
          className="mb-5 flex items-center justify-center gap-4 p-5 rounded-[1.5rem] border"
          style={{ borderColor: color, backgroundColor: `${color}14` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={flagUrl(current.id, 160)}
            alt={`${current.name} 국기`}
            width={96}
            height={64}
            className="rounded-lg shadow-lg"
          />
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color }}>
              {isFlagQuiz ? "이 국기의 나라는?" : "지금 이 나라!"}
            </p>
            <p className="editorial-heading text-2xl">{isFlagQuiz ? "???" : current.name}</p>
          </div>
        </div>
      )}

      {/* 대륙별 국기 그리드 */}
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
