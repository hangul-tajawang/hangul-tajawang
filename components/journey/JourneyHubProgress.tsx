"use client";

import React, { useEffect, useState } from "react";
import { getJourneySummary } from "@/lib/journey-progress";

/**
 * 허브 카드의 진행 배지 — 카드 자체는 서버 렌더, 이 배지만 localStorage에서 hydrate.
 */
export const JourneyHubProgress: React.FC<{ courseId: string; totalStations: number }> = ({
  courseId,
  totalStations,
}) => {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const summary = getJourneySummary()[courseId];
    if (!summary) return;
    if (summary.resumeStation !== null) {
      setLabel(`${summary.resumeStation}/${totalStations} · 이어가기`);
    } else if (summary.completions > 0) {
      setLabel(`완주 ${summary.completions}회 · 최고 ${summary.bestKpm}타`);
    }
  }, [courseId, totalStations]);

  if (!label) return null;
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-black">
      {label}
    </span>
  );
};
