"use client";

import React from "react";
import { KakaoAdFit } from "./KakaoAdFit";

export const TopAdBanner: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center bg-surface-lowest border-b border-outline-variant py-1.5">
      <KakaoAdFit unit="DAN-h8SPjWplFDoELa1Q" width={728} height={90} />
    </div>
  );
};
