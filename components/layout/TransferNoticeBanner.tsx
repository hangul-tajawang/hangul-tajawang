"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, X } from "lucide-react";

// 개인정보 보호법 제27조 고지용 배너 — 이전일 + 30일(2026-09-29)까지 게재 유지 후 제거
const HIDE_AFTER = new Date("2026-09-29T00:00:00+09:00");
const DISMISS_KEY = "transfer-notice-dismissed";

export function TransferNoticeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 닫기는 세션 단위로만 기억 → 재방문 시 다시 노출 (법정 게재 취지 유지)
    if (new Date() < HIDE_AFTER && !sessionStorage.getItem(DISMISS_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="w-full bg-blue-50 border-b border-blue-200">
      <div className="container mx-auto px-4 py-2.5 flex items-center gap-3 text-sm">
        <Megaphone size={16} className="shrink-0 text-blue-600" />
        <p className="flex-1 min-w-0 text-blue-900 break-keep">
          <strong>[안내]</strong> 2026년 8월 29일(예정)부터 한글타자왕의 운영 주체가 <strong>블루커뮤니케이션즈 주식회사</strong>로 변경됩니다.{" "}
          <Link prefetch={false} href="/notice/transfer" className="underline font-bold hover:text-blue-600">
            자세히 보기
          </Link>
        </p>
        <button
          type="button"
          aria-label="안내 닫기"
          onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, "1");
            setVisible(false);
          }}
          className="shrink-0 p-1 rounded text-blue-400 hover:text-blue-600"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
