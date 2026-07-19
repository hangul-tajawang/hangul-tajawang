"use client";

import React from "react";
import type { JourneyCourse, JourneyStation } from "@/lib/journey-data";
import { JourneyMap } from "./JourneyMap";
import { JourneyWorldMap } from "./JourneyWorldMap";
import { JourneyPeriodic } from "./JourneyPeriodic";

/**
 * 코스별 시각화 디스패처.
 * course.ui 값에 따라 컨셉에 맞는 시각화를 선택한다.
 *   - 'worldmap'  → 세계 수도(대륙별 지도형)
 *   - 'periodic'  → 주기율표(그리드형)
 *   - 그 외(기본) → 지하철 노선도(JourneyMap)
 * 세 컴포넌트 모두 동일한 props 계약을 따른다.
 */
export interface JourneyVizProps {
  course: JourneyCourse;
  stations: JourneyStation[];
  currentIndex: number;
  phase: "traveling" | "arrived";
  finished?: boolean;
  showAllNames: boolean;
  variant: "full" | "strip";
}

/** 공용 공개 규칙: 'name'(공개) | 'q'(현재·이동중 ???) | 'hidden'(미래) */
export function revealState(
  idx: number,
  currentIndex: number,
  phase: "traveling" | "arrived",
  finished: boolean,
  showAllNames: boolean
): "name" | "q" | "hidden" {
  if (finished || showAllNames || idx < currentIndex) return "name";
  if (idx === currentIndex) return phase === "arrived" ? "name" : "q";
  return "hidden";
}

export const JourneyViz: React.FC<JourneyVizProps> = (props) => {
  switch (props.course.ui) {
    case "worldmap":
    case "flags": // 국기 퀴즈도 국기 칩 시각화 재사용 (내부에서 course.ui로 분기)
      return <JourneyWorldMap {...props} />;
    case "periodic":
      return <JourneyPeriodic {...props} />;
    default:
      return <JourneyMap {...props} />;
  }
};
