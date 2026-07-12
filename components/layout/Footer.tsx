"use client";

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="py-10 md:py-16 text-sm text-zinc-400 w-full bg-surface-lowest mt-20 md:mt-32">
      <div className="container mx-auto max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm">한</div>
          <span className="font-medium">© 2026 한글타자왕 Web Edition.</span>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-center sm:flex sm:gap-8">
          <Link href="/guide" prefetch={false} className="hover:text-primary transition-colors font-medium">이용 가이드</Link>
          <Link href="/terms" prefetch={false} className="hover:text-primary transition-colors font-medium">이용약관</Link>
          <Link href="/privacy" prefetch={false} className="hover:text-primary transition-colors font-medium">개인정보처리방침</Link>
          <Link href="/contact" prefetch={false} className="hover:text-primary transition-colors font-medium">문의하기</Link>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-8 mt-8 pt-8 border-t border-outline-variant/40">
        <p className="text-xs text-zinc-400/80 leading-relaxed break-keep text-center md:text-left">
          이 사이트는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.
        </p>
      </div>
    </footer>
  );
};
