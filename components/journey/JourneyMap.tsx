"use client";

import React, { useMemo } from "react";
import type { JourneyCourse, JourneyStation } from "@/lib/journey-data";

/**
 * 지하철 노선도 스타일의 여정 지도 (순수 SVG — 라이브러리 없음).
 *
 * - full: 데스크톱용 지그재그(boustrophedon) 노선도. 니모닉 그룹이 있으면
 *   그룹 = 한 행으로 배치해 "태정태세문단세"가 행 라벨이 된다.
 * - strip: 모바일 풀스크린 셸용 가로 스트립. 열차가 화면 중앙에 고정되고
 *   노선이 옆으로 흘러간다.
 */

interface JourneyMapProps {
  course: JourneyCourse;
  stations: JourneyStation[];
  /** 현재 목표 역 인덱스 */
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

export const JourneyMap: React.FC<JourneyMapProps> = ({
  course,
  stations,
  currentIndex,
  phase,
  finished = false,
  showAllNames,
  variant,
}) => {
  const color = course.lines[0]?.color || "#7c3aed";
  const groupLabel = (id?: string) => course.groups?.find((g) => g.id === id)?.label;

  const full = useMemo(() => computeFullLayout(stations), [stations]);

  // ── 열차 위치: 도착/완주 = 현재 역 위, 이동 중 = 직전 역 위 (첫 역 이전은 출발 게이트)
  const markerIndex = finished ? stations.length - 1 : phase === "arrived" ? currentIndex : currentIndex - 1;

  if (variant === "strip") {
    // 모바일 스트립: 열차가 중앙 고정, 노선이 흘러간다
    const SPACING = 88;
    const LINE_Y = 40;
    const posX = (i: number) => (i < 0 ? -SPACING * 0.6 : i * SPACING);
    const offset = 180 - posX(markerIndex);
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
                {done && <text x={posX(i)} y={LINE_Y + 4} textAnchor="middle" className="fill-white text-[10px] font-black">✓</text>}
                {!done && <text x={posX(i)} y={LINE_Y + 3.5} textAnchor="middle" className="fill-zinc-500 text-[9px] font-black">{i + 1}</text>}
                <text x={posX(i)} y={LINE_Y + 32} textAnchor="middle" className={`text-[12px] font-black ${isCurrent ? "fill-white" : "fill-zinc-400"}`}>
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
        <text x={180} y={100} textAnchor="middle" className="fill-zinc-500 text-[9px] font-black">
          {finished ? "종착역 도착" : `${currentIndex + 1}번째 역 ${phase === "arrived" ? "도착" : "으로 이동 중"}`}
        </text>
      </svg>
    );
  }

  // ── full (데스크톱 지그재그)
  const { positions, pathD, width, height, rowMeta, rows } = full;
  const markerPos = markerIndex < 0 ? { x: LEFT_X - 54, y: TOP_Y } : positions[markerIndex];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none" aria-hidden>
      {/* 노선 */}
      <path d={pathD} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" opacity={0.9} />

      {/* 니모닉 그룹 행 라벨 */}
      {course.groups &&
        rows.map((row, r) => {
          const label = groupLabel(stations[row[0]].group);
          if (!label) return null;
          const meta = rowMeta[r];
          const x = positions[row[0]].x;
          return (
            <text
              key={r}
              x={x}
              y={meta.y - 36}
              textAnchor={meta.dir === 1 ? "start" : "end"}
              className="text-[13px] font-black tracking-[0.2em]"
              fill={color}
              opacity={0.55}
            >
              {label}
            </text>
          );
        })}

      {/* 역 */}
      {stations.map((s, i) => {
        const done = finished || i < currentIndex || (i === currentIndex && phase === "arrived");
        const isCurrent = !finished && i === currentIndex;
        const { x, y } = positions[i];
        const name = nameFor(i, s, currentIndex, phase, finished, showAllNames);
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
              <text x={x} y={y + 4.5} textAnchor="middle" className="fill-white text-[11px] font-black">✓</text>
            ) : (
              <text x={x} y={y + 4} textAnchor="middle" className="fill-secondary text-[10px] font-black" opacity={0.7}>{i + 1}</text>
            )}
            <text
              x={x}
              y={y + 34}
              textAnchor="middle"
              className={`text-[14px] font-black ${
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

      {/* 열차 마커 */}
      <g style={{ transform: `translate(${markerPos.x}px, ${markerPos.y}px)`, transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)" }}>
        <text x={0} y={-19} textAnchor="middle" className="text-[26px] drop-shadow">🚃</text>
      </g>
    </svg>
  );
};
