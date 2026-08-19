import React from "react";

/**
 * 페이지 헤더 프리미티브 — "디지털 문방" 에디토리얼 패턴.
 * 좌측 정렬 세리프(고운바탕) 타이틀 + 한 줄 설명 + 괘선 디바이더.
 * 순수 presentational — 어떤 로직도 없음.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  align = "left",
  className = "",
}: {
  /** 타이틀 위 작은 라벨 (예: "타자 테스트") */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 우측 정렬 액션 영역 (버튼 등) */
  actions?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <header className={`w-full ${centered ? "text-center" : "text-left"} ${className}`}>
      <div className={`flex flex-wrap items-end gap-4 ${centered ? "justify-center" : "justify-between"}`}>
        <div className={centered ? "mx-auto" : "min-w-0"}>
          {eyebrow && (
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">{eyebrow}</p>
          )}
          <h1 className="serif-display text-3xl md:text-4xl font-bold text-on-surface leading-snug">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-base md:text-lg text-zinc-600 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      <div className="rule-divider mt-8" />
    </header>
  );
}
