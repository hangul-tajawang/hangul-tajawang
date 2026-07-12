"use client";

import { useEffect, useState } from "react";
import { PILSA_SERIES, getSeriesEpisodes } from "@/lib/long-text-data";
import { getLibrary } from "@/lib/pilsa-library";

export type SeriesProgress = {
  readonly done: number;
  readonly published: number;
  readonly allDone: boolean;
  readonly started: boolean;
  /** 이어 새길 화 — 진행 중인 화 > 첫 미완주 화. 완필이면 null. */
  readonly nextEpisodeId: string | null;
  readonly nextEpisodeNumber: number;
  /** 진행 중 화의 저장된 진행률 (부분 저장이 없으면 0) */
  readonly inProgressPercent: number;
};

export type SeriesProgressById = Readonly<Record<string, SeriesProgress>>;

const EMPTY: SeriesProgressById = {};

/**
 * 서가(책방) 카드용 시리즈별 진행 상태.
 * SSR에서는 빈 상태(순수 진열)로 렌더하고, 마운트 후 로컬 서재 기록을 입힌다.
 * (SeriesTOC와 동일한 판정 규칙)
 */
export function useSeriesProgress(): SeriesProgressById {
  const [progress, setProgress] = useState<SeriesProgressById>(EMPTY);

  useEffect(() => {
    const lib = getLibrary();
    const byId = new Map(lib.filter((r) => r.sourceType === "work").map((r) => [r.sourceId, r]));

    const next: Record<string, SeriesProgress> = {};
    for (const series of PILSA_SERIES) {
      const episodes = getSeriesEpisodes(series.id);
      let done = 0;
      let inProgressId: string | null = null;
      let inProgressNumber = 0;
      let inProgressPercent = 0;
      let firstUndoneId: string | null = null;
      let firstUndoneNumber = 0;
      for (const ep of episodes) {
        const rec = byId.get(ep.id);
        if (rec && rec.completions.length > 0) {
          done++;
          continue;
        }
        if (rec?.progress && !inProgressId) {
          inProgressId = ep.id;
          inProgressNumber = ep.episode || 0;
          inProgressPercent = rec.progress.percent;
        }
        if (!firstUndoneId) {
          firstUndoneId = ep.id;
          firstUndoneNumber = ep.episode || 0;
        }
      }
      const allDone = episodes.length > 0 && done === episodes.length;
      next[series.id] = {
        done,
        published: episodes.length,
        allDone,
        started: done > 0 || inProgressId !== null,
        nextEpisodeId: allDone ? null : inProgressId || firstUndoneId,
        nextEpisodeNumber: allDone ? 0 : inProgressId ? inProgressNumber : firstUndoneNumber,
        inProgressPercent: Math.round(inProgressPercent),
      };
    }
    setProgress(next);
  }, []);

  return progress;
}
