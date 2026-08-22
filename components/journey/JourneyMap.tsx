"use client";

import React, { useMemo } from "react";
import type { JourneyCourse, JourneyLine, JourneyStation } from "@/lib/journey-data";

/**
 * 지하철 노선도 스타일의 여정 지도 (순수 SVG — 라이브러리 없음).
 *
 * - full: 데스크톱용 지그재그(boustrophedon) 노선도. 니모닉 그룹이 있으면
 *   그룹 = 한 행으로 배치해 "태정태세문단세"가 행 라벨이 된다.
 *   멀티라인 코스(삼국 계보 등)는 라인(왕국)별로 섹션을 나눠
 *   각자의 이름 헤더와 고유 색으로 렌더한다.
 * - strip: 모바일 풀스크린 셸용 가로 스트립. 열차가 화면 중앙에 고정되고
 *   노선이 옆으로 흘러간다.
 */

interface JourneyMapProps {
  course: JourneyCourse;
  stations: JourneyStation[];
  /** 현재 목표 역 인덱스 (전체 코스 기준 전역 인덱스) */
  currentIndex: number;
  phase: "traveling" | "arrived";
  finished?: boolean;
  /** 이름 보기 토글 — 미래 역 이름까지 공개 */
  showAllNames: boolean;
  variant: "full" | "strip";
}

const CELL_W = 108;
const CELL_H = 118;
const LEFT_X = 76;
const TOP_Y = 64;
const U_EXT = 44; // U턴이 마지막 역 밖으로 뻗는 길이
const U_RAD = 26; // U턴 코너 반경

/** 행 분할: 니모닉 그룹이 있으면 그룹 = 행, 없으면 7개씩 */
function chunkRows(stations: JourneyStation[]): number[][] {
  const grouped = stations.length > 0 && stations.every((s) => s.group);
  const rows: number[][] = [];
  if (grouped) {
    let current: number[] = [];
    stations.forEach((s, i) => {
      if (current.length > 0 && stations[current[current.length - 1]].group !== s.group) {
        rows.push(current);
        current = [];
      }
      current.push(i);
    });
    if (current.length) rows.push(current);
  } else {
    for (let i = 0; i < stations.length; i += 7) {
      rows.push(Array.from({ length: Math.min(7, stations.length - i) }, (_, j) => i + j));
    }
  }
  return rows;
}

function computeFullLayout(stations: JourneyStation[]) {
  const rows = chunkRows(stations);
  const cols = Math.max(...rows.map((r) => r.length));
  const positions: { x: number; y: number }[] = new Array(stations.length);
  const rowMeta: { y: number; firstIndex: number; dir: 1 | -1 }[] = [];

  rows.forEach((row, r) => {
    const dir: 1 | -1 = r % 2 === 0 ? 1 : -1;
    const y = TOP_Y + r * CELL_H;
    row.forEach((stationIdx, j) => {
      const slot = dir === 1 ? j : cols - 1 - j;
      positions[stationIdx] = { x: LEFT_X + slot * CELL_W, y };
    });
    rowMeta.push({ y, firstIndex: row[0], dir });
  });

  // 노선 path: 행 내부는 직선, 행 전환은 마지막 역 밖으로 뻗는 둥근 U턴
  let d = `M ${positions[0].x} ${positions[0].y}`;
  rows.forEach((row, r) => {
    const last = positions[row[row.length - 1]];
    d += ` L ${last.x} ${last.y}`;
    if (r < rows.length - 1) {
      const dir = r % 2 === 0 ? 1 : -1;
      const ux = last.x + dir * U_EXT;
      const nextY = last.y + CELL_H;
      d += ` L ${ux - dir * U_RAD} ${last.y}`;
      d += ` Q ${ux} ${last.y} ${ux} ${last.y + U_RAD}`;
      d += ` L ${ux} ${nextY - U_RAD}`;
      d += ` Q ${ux} ${nextY} ${ux - dir * U_RAD} ${nextY}`;
      const nextFirst = positions[rows[r + 1][0]];
      d += ` L ${nextFirst.x} ${nextFirst.y}`;
    }
  });

  const width = LEFT_X * 2 + (cols - 1) * CELL_W;
  const height = TOP_Y + (rows.length - 1) * CELL_H + 72;
  return { positions, pathD: d, width, height, rowMeta, rows };
}

/** 이름 공개 규칙: 완료·도착·전체 공개 토글이면 이름, 현재 역은 ???, 미래는 숨김 */
function nameFor(
  idx: number,
  station: JourneyStation,
  currentIndex: number,
  phase: "traveling" | "arrived",
  finished: boolean,
  showAllNames: boolean
): string | null {
  if (finished || showAllNames || idx < currentIndex) return station.name;
  if (idx === currentIndex) return phase === "arrived" ? station.name : "???";
  return null;
}

interface LineSection {
  line: JourneyLine;
  /** 이 라인 첫 역의 전역 인덱스 */
  offset: number;
  layout: ReturnType<typeof computeFullLayout>;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({
  course,
  stations,
  currentIndex,
  phase,
  finished = false,
  showAllNames,
  variant,
}) => {
  const groupLabel = (id?: string) => course.groups?.find((g) => g.id === id)?.label;

  // 라인(왕국)별 섹션 — 전역 인덱스 오프셋을 함께 계산
  const sections = useMemo<LineSection[]>(() => {
    let offset = 0;
    return course.lines.map((line) => {
      const section = { line, offset, layout: computeFullLayout(line.stations) };
      offset += line.stations.length;
      return section;
    });
  }, [course]);
  const multiLine = sections.length > 1;

  // ── 열차 위치: 도착/완주 = 현재 역 위, 이동 중 = 직전 역 위 (첫 역 이전은 출발 게이트)
  const markerIndex = finished ? stations.length - 1 : phase === "arrived" ? currentIndex : currentIndex - 1;
  const sectionOf = (globalIdx: number) =>
    sections.find((sec) => globalIdx >= sec.offset && globalIdx < sec.offset + sec.line.stations.length);
  const currentColor = sectionOf(Math.max(0, Math.min(currentIndex, stations.length - 1)))?.line.color || "#7c3aed";

  if (variant === "strip") {
    // 모바일 스트립: 열차가 중앙 고정, 노선이 흘러간다 (라인 색은 현재 왕국 기준)
    const SPACING = 88;
    const LINE_Y = 40;
    const posX = (i: number) => (i < 0 ? -SPACING * 0.6 : i * SPACING);
    const offset = 180 - posX(markerIndex);
    const color = currentColor;
    return (
      <svg viewBox="0 0 360 108" className="w-full h-auto select-none" aria-hidden>
        <g style={{ transform: `translateX(${offset}px)`, transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)" }}>
          <line x1={-SPACING} y1={LINE_Y} x2={(stations.length - 1) * SPACING + SPACING * 0.6} y2={LINE_Y} stroke={color} strokeWidth={7} strokeLinecap="round" />
          {stations.map((s, i) => {
            const done = finished || i < currentIndex || (i === currentIndex && phase === "arrived");
            const isCurrent = !finished && i === currentIndex;
            const name = nameFor(i, s, currentIndex, phase, finished, showAllNames);
            return (
              <g key={s.id}>
                <circle cx={posX(i)} cy={LINE_Y} r={10} fill={done ? color : "#18181b"} stroke={done ? color : isCurrent ? color : "#3f3f46"} strokeWidth={4} />
                {done && <text x={posX(i)} y={LINE_Y + 4} textAnchor="middle" className="fill-white text-[10px] font-bold">✓</text>}
                {!done && <text x={posX(i)} y={LINE_Y + 3.5} textAnchor="middle" className="fill-zinc-500 text-[9px] font-bold">{i + 1}</text>}
                <text x={posX(i)} y={LINE_Y + 32} textAnchor="middle" className={`text-[12px] font-bold ${isCurrent ? "fill-white" : "fill-zinc-400"}`}>
                  {name ?? ""}
                </text>
              </g>
            );
          })}
          {/* 열차 */}
          <g style={{ transform: `translateX(${posX(markerIndex)}px)`, transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)" }}>
            <text x={0} y={LINE_Y - 18} textAnchor="middle" className="text-[20px]">🚃</text>
          </g>
        </g>
        {/* 중앙 고정 하이라이트 (열차 아래 위치 표시) */}
        <text x={180} y={100} textAnchor="middle" className="fill-zinc-500 text-[9px] font-bold">
          {finished
            ? "완주!"
            : `${currentIndex + 1}번째 ${course.unitLabel || "항목"} ${phase === "arrived" ? "도착" : "이동 중"}`}
        </text>
      </svg>
    );
  }

  // ── full (데스크톱): 라인(왕국)별 섹션을 세로로 쌓는다
  return (
    <div className="w-full flex flex-col gap-1">
      {sections.map(({ line, offset, layout }) => {
        const { positions, pathD, width, height, rowMeta, rows } = layout;
        const color = line.color;
        const lineDone = finished || currentIndex >= offset + line.stations.length;
        const lineActive = !finished && currentIndex >= offset && currentIndex < offset + line.stations.length;
        const markerLocal = markerIndex - offset;
        const markerInLine = markerLocal >= 0 && markerLocal < line.stations.length;
        const markerPos = markerInLine ? positions[markerLocal] : { x: LEFT_X - 54, y: TOP_Y };
        // 코스 시작 전 게이트 마커는 첫 라인에만
        const showGateMarker = markerIndex < 0 && offset === 0;

        return (
          <div key={line.id}>
            {/* 라인(왕국) 헤더 — 멀티라인 코스에서만 */}
            {multiLine && line.name && (
              <div className="flex items-center gap-2.5 pl-2 pt-1">
                <span
                  className="px-3 py-1 rounded-full text-[13px] font-bold text-white tracking-widest"
                  style={{ backgroundColor: color, opacity: lineActive || lineDone ? 1 : 0.45 }}
                >
                  {line.name}
                </span>
                <span className="text-[11px] font-bold" style={{ color }}>
                  {line.stations.length}대
                  {lineDone && " · 정복 완료 ✓"}
                  {lineActive && ` · ${currentIndex - offset + 1}번째 진행 중`}
                </span>
              </div>
            )}
            {/* 모바일: 축소로 글자가 뭉개지지 않게 최소 폭을 지키고 가로 스크롤 */}
            <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[560px] h-auto select-none" aria-hidden>
              {/* 노선 */}
              <path d={pathD} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" opacity={lineActive || lineDone ? 0.9 : 0.35} />

              {/* 니모닉 그룹 행 라벨 */}
              {course.groups &&
                rows.map((row, r) => {
                  const label = groupLabel(line.stations[row[0]].group);
                  if (!label) return null;
                  const meta = rowMeta[r];
                  const x = positions[row[0]].x;
                  return (
                    <text
                      key={r}
                      x={x}
                      y={meta.y - 36}
                      textAnchor={meta.dir === 1 ? "start" : "end"}
                      className="text-[13px] font-bold tracking-[0.2em]"
                      fill={color}
                      opacity={0.55}
                    >
                      {label}
                    </text>
                  );
                })}

              {/* 역 */}
              {line.stations.map((s, i) => {
                const gi = offset + i; // 전역 인덱스
                const done = finished || gi < currentIndex || (gi === currentIndex && phase === "arrived");
                const isCurrent = !finished && gi === currentIndex;
                const { x, y } = positions[i];
                const name = nameFor(gi, s, currentIndex, phase, finished, showAllNames);
                return (
                  <g key={s.id}>
                    {isCurrent && <circle cx={x} cy={y} r={12} fill="none" stroke={color} strokeWidth={4} className="animate-ping origin-center" style={{ transformBox: "fill-box" }} />}
                    <circle
                      cx={x}
                      cy={y}
                      r={12}
                      fill={done ? color : undefined}
                      stroke={done || isCurrent ? color : undefined}
                      strokeWidth={5}
                      className={done ? "" : isCurrent ? "fill-surface-lowest" : "fill-surface-lowest stroke-surface-highest"}
                    />
                    {done ? (
                      <text x={x} y={y + 4.5} textAnchor="middle" className="fill-white text-[11px] font-bold">✓</text>
                    ) : (
                      <text x={x} y={y + 4} textAnchor="middle" className="fill-secondary text-[10px] font-bold" opacity={0.7}>{i + 1}</text>
                    )}
                    <text
                      x={x}
                      y={y + 34}
                      textAnchor="middle"
                      className={`text-[14px] font-bold ${
                        isCurrent ? "fill-on-surface" : name ? "fill-secondary" : "fill-surface-highest"
                      }`}
                    >
                      {name ?? "·"}
                    </text>
                    {name && s.year && (
                      <text x={x} y={y + 50} textAnchor="middle" className="fill-secondary text-[10px] font-bold" opacity={0.6}>
                        {s.year}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* 열차 마커 — 열차가 있는 라인에만 */}
              {(markerInLine || showGateMarker) && (
                <g style={{ transform: `translate(${markerPos.x}px, ${markerPos.y}px)`, transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)" }}>
                  <text x={0} y={-19} textAnchor="middle" className="text-[26px] drop-shadow">🚃</text>
                </g>
              )}
            </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};
