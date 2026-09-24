"use client";

import React from "react";
import type { JourneyVizProps } from "./JourneyViz";

/**
 * 사자성어 코스(ui:'idiom') 시각화 — 족자처럼 한자 네 글자를 세로로 크게 걸어 두고,
 * 오른쪽에서 뜻을 보며 따라 쓰게 한다. (노선도 대신 "지금 외우는 한 개"가 주인공)
 * - 이동 중: 한자만 보이고 한글 음은 가림 → 초성과 한자로 떠올리기
 * - 도착: 글자마다 음이 붙고 뜻·풀이가 펼쳐짐 → 뜻 따라 쓰기
 * - 아래: 주제별 진행도(10개 주제 × 10개)
 */
export const JourneyIdiomBoard: React.FC<JourneyVizProps & { fill?: boolean }> = ({ course, stations, currentIndex, phase, finished, showAllNames, variant, fill }) => {
  const current = stations[Math.min(currentIndex, stations.length - 1)];
  const done = finished ? stations.length : currentIndex;
  const revealed = finished || showAllNames || phase === "arrived";
  const hanja = Array.from(current?.reading || "");
  const hangul = Array.from(current?.name || "");
  const groupLabel = course.groups?.find((g) => g.id === current?.group)?.label;
  const accent = course.lines[0]?.color || "#b45309";

  if (variant === "strip") {
    return (
      <div className="relative w-full rounded-2xl bg-[#f7efdf] border border-amber-900/20 px-3 py-3 flex flex-col items-center gap-1">
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold tabular-nums">
          {done} / {stations.length}
        </div>
        {groupLabel && <span className="text-[10px] font-bold" style={{ color: accent }}>{groupLabel}</span>}
        <div className="flex items-end gap-2" key={current?.id}>
          {hanja.map((ch, i) => (
            <div key={i} className="flex flex-col items-center animate-in zoom-in duration-300">
              <span className="font-serif font-black text-4xl leading-none text-zinc-900">{ch}</span>
              <span className={`mt-1 text-xs font-bold transition-opacity ${revealed ? "opacity-100" : "opacity-0"}`} style={{ color: accent }}>
                {hangul[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 주제별 진행: groups 순서대로 [완료 수 / 전체]
  const groupStats = (course.groups || []).map((g) => {
    const idxs = stations.map((s, i) => (s.group === g.id ? i : -1)).filter((i) => i >= 0);
    return { ...g, total: idxs.length, done: idxs.filter((i) => i < done).length, active: current?.group === g.id && !finished };
  });

  return (
    <div className={`flex flex-col gap-4 ${fill ? "h-full" : ""}`}>
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-amber-900/15 shadow-inner ${fill ? "flex-1 flex flex-col justify-center" : ""}`}
        style={{ background: "radial-gradient(ellipse at 30% 20%, #fffaf0 0%, #f5ead3 60%, #eadcbc 100%)" }}
      >
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold tabular-nums">
          {finished ? `완주! ${stations.length}개` : `${done} / ${stations.length}`}
        </div>

        {finished ? (
          <div className="min-h-[340px] flex flex-col items-center justify-center gap-2">
            <p className="text-5xl">📜</p>
            <p className="text-2xl font-bold text-amber-900">사자성어 100개 완주!</p>
          </div>
        ) : (
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-6 md:gap-10 p-6 md:p-8 min-h-[340px] md:min-h-[400px]" key={current?.id}>
            {/* 족자: 한자 세로 */}
            <div className="relative flex flex-col items-center">
              <div className={`h-2.5 rounded-full bg-amber-900/80 ${fill ? "w-36 2xl:w-40" : "w-28 md:w-32"}`} />
              <div className={`${fill ? "w-28 2xl:w-32 gap-4" : "w-24 md:w-28"} flex-1 bg-[#fffdf7] border-x border-amber-900/20 shadow-md flex flex-col items-center justify-center gap-2 md:gap-3 py-4`}>
                {hanja.map((ch, i) => (
                  <div key={i} className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-500" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}>
                    <span className={`font-serif font-black leading-none text-zinc-900 ${fill ? "text-6xl 2xl:text-7xl" : "text-5xl md:text-6xl"}`}>{ch}</span>
                  </div>
                ))}
              </div>
              <div className={`h-2.5 rounded-full bg-amber-900/80 ${fill ? "w-36 2xl:w-40" : "w-28 md:w-32"}`} />
              {/* 낙관 */}
              <div className="absolute bottom-6 -right-3 w-7 h-7 rounded-sm bg-red-700/85 text-[9px] text-white font-bold flex items-center justify-center rotate-6">
                타자
              </div>
            </div>

            {/* 음·뜻 */}
            <div className="flex flex-col justify-center gap-4 min-w-0">
              {groupLabel && (
                <span className="self-start px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: accent }}>
                  {groupLabel}
                </span>
              )}
              <div className="flex gap-2 md:gap-3">
                {hangul.map((ch, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold transition-all ${
                      revealed ? "bg-white text-zinc-900 shadow" : "bg-amber-900/10 text-transparent"
                    }`}
                  >
                    {revealed ? ch : "?"}
                  </div>
                ))}
              </div>
              {revealed ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="text-[11px] font-bold tracking-widest text-amber-800/70 mb-1">뜻</p>
                  <p className="text-2xl md:text-3xl font-bold leading-snug text-zinc-900 break-keep">{current?.fact}</p>
                  {current?.detail && <p className="mt-3 text-sm text-zinc-600 leading-relaxed break-keep">{current.detail}</p>}
                </div>
              ) : (
                <p className="text-base md:text-lg font-bold text-amber-900/70 leading-relaxed break-keep">
                  한자와 초성을 보고
                  <br />
                  어떤 사자성어인지 떠올려 입력하세요.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 주제별 진행도 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {groupStats.map((g) => (
          <div
            key={g.id}
            className={`rounded-xl px-3 py-2 text-xs font-bold border ${
              g.active ? "border-amber-600 bg-amber-50 text-amber-900" : g.done === g.total ? "border-transparent bg-emerald-50 text-emerald-700" : "border-transparent bg-surface-low text-secondary"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="truncate">{g.label}</span>
              <span className="tabular-nums shrink-0">
                {g.done}/{g.total}
              </span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-black/10 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(g.done / Math.max(1, g.total)) * 100}%`, backgroundColor: g.done === g.total ? "#059669" : accent }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
