"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Feather, Play, ChevronRight } from "lucide-react";
import { getLibrary } from "@/lib/pilsa-library";

interface EpisodeItem {
  id: string;
  title: string;
  episode: number;
  wordCount: number;
}

/**
 * 연재 시리즈 목차 + 내 진행 상황.
 * SSR에서는 순수 목차(크롤러용 링크)만 렌더하고,
 * 마운트 후 로컬 서재 기록으로 완주 체크/이어하기 배지를 입힌다.
 */
export const SeriesTOC: React.FC<{ episodes: EpisodeItem[] }> = ({ episodes }) => {
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [inProgressId, setInProgressId] = useState<string | null>(null);
  const [inProgressPercent, setInProgressPercent] = useState(0);

  useEffect(() => {
    const lib = getLibrary();
    const done = new Set<string>();
    let progressing: string | null = null;
    let progressingPercent = 0;
    for (const ep of episodes) {
      const rec = lib.find((r) => r.sourceType === "work" && r.sourceId === ep.id);
      if (rec && rec.completions.length > 0) done.add(ep.id);
      else if (rec?.progress && !progressing) {
        progressing = ep.id;
        progressingPercent = rec.progress.percent;
      }
    }
    setDoneIds(done);
    setInProgressId(progressing);
    setInProgressPercent(progressingPercent);
  }, [episodes]);

  // 이어서 새길 화: 진행 중인 화 > 첫 미완주 화
  const nextEpisode = useMemo(() => {
    if (inProgressId) return episodes.find((e) => e.id === inProgressId) || null;
    return episodes.find((e) => !doneIds.has(e.id)) || null;
  }, [episodes, doneIds, inProgressId]);

  const allDone = doneIds.size === episodes.length && episodes.length > 0;

  return (
    <div>
      {/* 이어서 새기기 CTA */}
      <div className="mb-8">
        {allDone ? (
          <div className="flex items-center gap-3 px-6 py-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40 rounded-2xl">
            <CheckCircle2 className="text-green-600 shrink-0" size={22} />
            <p className="font-black text-green-700 dark:text-green-400">완간을 새기셨습니다. 이 책은 내 서재에 꽂혀 있어요.</p>
          </div>
        ) : nextEpisode ? (
          <Link
            prefetch={false}
            href={`/transcription/${nextEpisode.id}`}
            className="inline-flex items-center gap-3 px-8 py-4 primary-gradient text-white font-black rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Play size={18} fill="currentColor" />
            {doneIds.size === 0 && !inProgressId ? "1화부터 새기기 시작" : `${nextEpisode.episode}화 ${inProgressId ? `${Math.round(inProgressPercent)}%부터 이어` : ""} 새기기`}
            <ChevronRight size={18} />
          </Link>
        ) : null}
        {doneIds.size > 0 && !allDone && (
          <p className="mt-3 text-sm font-bold text-zinc-500">지금까지 {doneIds.size}/{episodes.length}화를 새겼어요</p>
        )}
      </div>

      {/* 목차 */}
      <ol className="space-y-2">
        {episodes.map((ep) => {
          const done = doneIds.has(ep.id);
          const progressing = inProgressId === ep.id;
          return (
            <li key={ep.id}>
              <Link
                prefetch={false}
                href={`/transcription/${ep.id}`}
                className={`group flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all hover:border-primary/50 hover:-translate-y-0.5 ${done ? "bg-surface-low border-surface-high" : "bg-surface-lowest border-surface-high"}`}
              >
                <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-black ${done ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-surface-high text-zinc-400"}`}>
                  {done ? <CheckCircle2 size={16} /> : ep.episode}
                </span>
                <span className={`flex-1 font-bold group-hover:text-primary transition-colors break-keep ${done ? "text-zinc-400" : "text-on-surface"}`}>
                  {ep.title}
                </span>
                {progressing && (
                  <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full"><Feather size={11} /> {Math.round(inProgressPercent)}% 저장됨</span>
                )}
                <span className="hidden sm:block shrink-0 text-xs font-bold text-zinc-400">{ep.wordCount}자 · 약 10분</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
