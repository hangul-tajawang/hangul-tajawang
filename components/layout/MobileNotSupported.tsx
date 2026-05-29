"use client";

import React from "react";
import { Monitor } from "lucide-react";

export const MobileNotSupported: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-24 px-4 text-center animate-in fade-in duration-700">
      <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
        <Monitor size={48} />
      </div>
      <h2 className="text-3xl font-black mb-4 tracking-tight">PC에서 접속해 주세요!</h2>
      <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-sm">
        한글타자왕의 모든 타자 연습 기능은 정확한 측정을 위해 <br/>
        <strong>물리 키보드가 있는 PC 환경</strong>에 최적화되어 있습니다. <br/>
        나중에 PC에서 다시 방문해 주세요!
      </p>
    </div>
  );
};
