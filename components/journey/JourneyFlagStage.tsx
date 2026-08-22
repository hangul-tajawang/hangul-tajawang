"use client";

import React from "react";
import type { JourneyVizProps } from "./JourneyViz";

/**
 * 국기 퀴즈(ui:'flags') 시각화 — 성문방어처럼 스테이지 중앙에 현재 국기를 크게 박는다.
 * (기존 국기 칩 그리드 대신 문제 자체를 주인공으로. 애드센스가 있는 일반 레이아웃 유지)
 */
export const JourneyFlagStage: React.FC<JourneyVizProps> = ({
  course,
  stations,
  currentIndex,
  finished,
  variant,
}) => {
  const current = stations[Math.min(currentIndex, stations.length - 1)];
  const done = finished ? stations.length : currentIndex;
  const isStrip = variant === "strip";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-sky-900 via-slate-900 to-indigo-950 border border-slate-700 flex items-center justify-center ${
        isStrip ? "h-32" : "min-h-[280px] md:min-h-[380px] shadow-inner"
      }`}
    >
      {/* 은은한 그리드 배경 (성문방어 전장과 동일 무드) */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.12) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      {/* 중앙 국기 */}
      {!finished && current && (
        <div className="relative z-10 flex flex-col items-center gap-3 p-4">
          <div className="rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-4 ring-white/15 animate-in zoom-in duration-300" key={current.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://flagcdn.com/w320/${current.id}.png`}
              alt="어느 나라의 국기일까요?"
              width={isStrip ? 120 : 280}
              height={isStrip ? 80 : 187}
              className={`block object-cover ${isStrip ? "w-[120px]" : "w-[220px] md:w-[280px]"}`}
            />
          </div>
          {!isStrip && (
            <p className="text-slate-300 text-xs font-bold tracking-widest uppercase">
              {course.ui === "flags" ? "이 국기의 나라는?" : current.name}
            </p>
          )}
        </div>
      )}
      {finished && (
        <p className="relative z-10 text-3xl font-bold text-yellow-300">🏁 전부 정복!</p>
      )}

      {/* 진행 배지 */}
      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/55 text-white text-[10px] font-bold tabular-nums backdrop-blur-sm">
        {finished ? `완주! ${stations.length}개국` : `${done} / ${stations.length}개국`}
      </div>
    </div>
  );
};
