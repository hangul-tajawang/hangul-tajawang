import React from "react";

/**
 * 게임 페이지용 schema.org VideoGame 구조화 데이터.
 * 검색엔진에게 "이 페이지는 무료 웹 게임"임을 알려 리치 결과 노출에 유리하게 한다.
 */
export function GameJsonLd({
  name,
  alternateName,
  url,
  description,
  genre,
  inLanguage = "ko",
  publisherName = "한글타자왕",
  priceCurrency = "KRW",
}: {
  name: string;
  alternateName?: string;
  url: string;
  description: string;
  genre: string[];
  inLanguage?: string | string[];
  publisherName?: string;
  priceCurrency?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name,
    ...(alternateName ? { alternateName } : {}),
    url,
    description,
    inLanguage,
    genre,
    gamePlatform: ["Web Browser", "PC", "Mobile Web"],
    applicationCategory: "Game",
    operatingSystem: "Any",
    playMode: "SinglePlayer",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency },
    publisher: { "@type": "Organization", name: publisherName },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
