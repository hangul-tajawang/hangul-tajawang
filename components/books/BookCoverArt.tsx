import React from "react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// 토큰 표지 (BookCoverArt)
//   팔레트(색) × 패턴(무늬)을 조합해 SVG 로 절차 생성한 장편 표지.
//   외부 이미지·폰트 없이 자족적으로 그려지며, 제목·작가를 세리프로 오버레이한다.
//   md 메타의 `- **표지**: rose / grid` 토큰이 { palette, pattern } 으로 들어온다.
// ─────────────────────────────────────────────────────────────────────────────

type Palette = {
  from: string; // 그라디언트 시작
  to: string; // 그라디언트 끝
  accent: string; // 무늬·강조선 색
  fg: string; // 글자 색
};

// 팔레트 5종+ (rose / indigo / emerald / amber / ink / plum)
const PALETTES: Record<string, Palette> = {
  rose: { from: "#9f1239", to: "#4c0519", accent: "#fda4af", fg: "#fff5f5" },
  indigo: { from: "#3730a3", to: "#1e1b4b", accent: "#a5b4fc", fg: "#eef2ff" },
  emerald: { from: "#065f46", to: "#022c22", accent: "#6ee7b7", fg: "#ecfdf5" },
  amber: { from: "#92400e", to: "#451a03", accent: "#fcd34d", fg: "#fffbeb" },
  ink: { from: "#334155", to: "#020617", accent: "#fbbf24", fg: "#f8fafc" },
  plum: { from: "#6b21a8", to: "#3b0764", accent: "#d8b4fe", fg: "#faf5ff" },
};

const PATTERNS = ["grid", "wave", "dots", "diag"] as const;
type Pattern = (typeof PATTERNS)[number];

const palette = (name?: string): Palette => PALETTES[name || ""] || PALETTES.rose;
const patternName = (name?: string): Pattern =>
  (PATTERNS.includes(name as Pattern) ? name : "grid") as Pattern;

// props 로부터 안정적인(서버/클라 동일) 고유 id 생성 — useId 없이 SSR 안전
function stableId(seed: string): string {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  return "bca" + h.toString(36);
}

function PatternDef({ id, kind, accent }: { id: string; kind: Pattern; accent: string }) {
  switch (kind) {
    case "wave": // 물결
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="40" height="24">
          <path d="M0 12 Q10 2 20 12 T40 12" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.16" />
        </pattern>
      );
    case "dots": // 점묘
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="22" height="22">
          <circle cx="4" cy="4" r="1.7" fill={accent} opacity="0.22" />
        </pattern>
      );
    case "diag": // 사선
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="18" height="18" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="18" stroke={accent} strokeWidth="2" opacity="0.15" />
        </pattern>
      );
    case "grid": // 격자
    default:
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="26" height="26">
          <path d="M26 0 H0 V26" fill="none" stroke={accent} strokeWidth="1" opacity="0.18" />
        </pattern>
      );
  }
}

export function BookCoverArt({
  seriesId,
  imageUrl,
  title,
  author,
  cover,
  badge = "연재소설",
  priority = false,
  className = "",
}: {
  seriesId?: string;
  /** 일러스트 표지 URL — 명시하면 이것을 사용(null이면 절차 생성 표지), 생략하면 seriesId 규칙 경로 */
  imageUrl?: string | null;
  title: string;
  author: string;
  cover?: { palette: string; pattern: string };
  badge?: string;
  priority?: boolean;
  className?: string;
}) {
  const artUrl =
    imageUrl !== undefined ? imageUrl : seriesId ? `/images/book-covers/${seriesId}.jpg` : null;
  const p = palette(cover?.palette);
  const kind = patternName(cover?.pattern);
  const uid = stableId(`${cover?.palette}-${cover?.pattern}-${title}`);
  const gradId = `${uid}-g`;
  const patId = `${uid}-p`;
  const glowId = `${uid}-r`;

  return (
    <div
      className={`group/cover relative aspect-[3/4] w-full overflow-hidden rounded-r-xl rounded-l-sm shadow-lg ${className}`}
    >
      {/* 배경 아트 */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 300 400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={p.from} />
            <stop offset="100%" stopColor={p.to} />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="30%" r="75%">
            <stop offset="0%" stopColor={p.accent} stopOpacity="0.18" />
            <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
          </radialGradient>
          <PatternDef id={patId} kind={kind} accent={p.accent} />
        </defs>
        <rect width="300" height="400" fill={`url(#${gradId})`} />
        <rect width="300" height="400" fill={`url(#${patId})`} />
        <rect width="300" height="400" fill={`url(#${glowId})`} />
        {/* 상·하단 프레임 라인 */}
        <rect x="18" y="18" width="264" height="364" fill="none" stroke={p.accent} strokeOpacity="0.35" strokeWidth="1" />
      </svg>

      {artUrl && (
        <Image
          src={artUrl}
          alt=""
          fill
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 220px"
          className="object-cover transition-transform duration-500 group-hover/cover:scale-[1.025]"
        />
      )}

      {artUrl && <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/5 to-black/85" />}

      {/* 책등(spine) 그림자 */}
      <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/30" />
      <div
        className="absolute left-2.5 top-0 bottom-0 w-0.5 opacity-60"
        style={{ backgroundColor: p.accent }}
      />

      {/* 제목·작가 오버레이 */}
      <div
        className={`absolute inset-0 flex flex-col items-center px-4 pl-6 text-center ${artUrl ? "justify-end pb-6 sm:pb-8" : "justify-center"}`}
        style={{ color: artUrl ? "#fff" : p.fg }}
      >
        {badge && (
          <span
            className="mb-3 rounded-full px-2 py-0.5 text-[8px] font-black tracking-widest backdrop-blur-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            {badge}
          </span>
        )}
        <span
          className="mb-3 h-1 w-8 rounded-full opacity-80"
          style={{ backgroundColor: p.accent }}
        />
        <h3 className="font-serif text-base font-black leading-snug break-keep text-balance line-clamp-3 sm:text-lg drop-shadow">
          {title}
        </h3>
        <p className="mt-2 text-[11px] font-bold text-white/70">
          {author}
        </p>
        <span
          className="mt-3 h-1 w-8 rounded-full opacity-80"
          style={{ backgroundColor: p.accent }}
        />
      </div>
    </div>
  );
}

export default BookCoverArt;
