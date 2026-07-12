import type { Metadata } from "next";

// 관리자 영역 — 검색엔진 색인 금지
export const metadata: Metadata = {
  title: "책방 관리",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
