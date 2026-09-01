import type { Metadata } from 'next';

// /en 서브트리 공통 메타 — 루트 레이아웃의 한국어 타이틀 템플릿("%s | 한글타자왕")을 영어로 교체한다.
export const metadata: Metadata = {
  title: {
    default: 'Korean Typing Practice - Learn to Type Hangul Free',
    template: '%s | Hangul Tajawang',
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        루트 레이아웃이 <html lang="ko">를 렌더하므로 /en에서는 lang을 교정한다.
        구글은 lang 속성 대신 본문 언어·hreflang으로 판정하므로 색인에는 영향 없고,
        스크린리더·번역 UI를 위한 보정이다. (루트 분리 리팩터링 없이 최소 침습)
      */}
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='en'" }} />
      {children}
    </>
  );
}
