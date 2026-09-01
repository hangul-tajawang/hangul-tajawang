import { localeAlternates } from '@/lib/i18n/alternates';
import { Metadata } from "next";
import { TypingDefenseGame } from "@/components/game/TypingDefenseGame";
import { KeyboardAdBanner } from "@/components/layout/KeyboardAdBanner";
import { Castle, Keyboard, Shield, Sparkles, Swords, Trophy, Wrench, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "한글 타자 게임 - 성문방어 무료 온라인 타워 디펜스",
  description:
    "한글 타자 게임 성문방어를 무료로 플레이하세요. 밀려오는 적의 단어를 정확히 타이핑해 화살을 쏘고, 점점 강해지는 웨이브를 막아내는 픽셀아트 타워 디펜스 타자 게임입니다.",
  keywords: [
    "한글 타자 게임",
    "무료 한글 타자 게임",
    "온라인 타자 게임",
    "단어 타자 게임",
    "타워 디펜스 타자",
    "한글 타자 성문방어",
    "웨이브 디펜스 게임",
    "한글타자왕",
  ],
  alternates: localeAlternates('/game/castle-defense', 'ko'),
  openGraph: {
    title: "한글 타자 게임 - 성문방어 | 한글타자왕",
    description: "적의 단어를 타이핑해 화살을 쏘고 웨이브를 막아내는 무료 온라인 한글 타자 디펜스 게임.",
    url: "https://www.hangul-tajawang.com/game/castle-defense",
    images: [{ url: "https://www.hangul-tajawang.com/ogimage-castle-defense.png", width: 1200, height: 630, alt: "한글 타자 성문방어" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "한글 타자 게임 - 성문방어 | 한글타자왕",
    description: "적의 단어를 타이핑해 화살을 쏘고 웨이브·보스를 막아내는 무료 타자 디펜스 게임.",
    images: ["https://www.hangul-tajawang.com/ogimage-castle-defense.png"],
  },
};

const GAME_JSONLD = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "한글 타자 성문방어",
  alternateName: "성문방어 타자 게임",
  url: "https://www.hangul-tajawang.com/game/castle-defense",
  description:
    "적의 머리 위 한글 단어를 정확히 타이핑해 화살을 쏘고, 점점 강해지는 웨이브와 보스를 막아내는 무료 온라인 타워 디펜스 타자 게임.",
  inLanguage: "ko",
  genre: ["타워 디펜스", "타자 연습", "캐주얼"],
  gamePlatform: ["Web Browser", "PC", "Mobile Web"],
  applicationCategory: "Game",
  operatingSystem: "Any",
  playMode: "SinglePlayer",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  publisher: { "@type": "Organization", name: "한글타자왕" },
};

export default function CastleDefensePage() {
  return (
    <div className="w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(GAME_JSONLD) }} />
      <h1 className="sr-only">한글 타자 게임 성문방어 - 무료 온라인 단어 타이핑 타워 디펜스</h1>

      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 pt-4">
        <TypingDefenseGame />
      </div>

      {/* 본문 배너 광고 (게임과 설명 사이 자연스러운 지면 · 미충족 시 하우스배너 폴백) */}
      <KeyboardAdBanner />

      <div className="max-w-4xl mx-auto px-4">
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-200 pt-16 pb-20">
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-blue-600">
              <Castle size={28} />
              <h2 className="text-2xl font-bold">한글 타자 게임 성문방어 소개</h2>
            </div>
            <p className="text-zinc-600 leading-relaxed font-medium">
              성문방어는 한글 타자 연습을 타워 디펜스 장르로 풀어낸 온라인 무료 게임입니다.
              세 갈래 길을 따라 적들이 성문으로 밀려오고, 각 적의 머리 위에는{" "}
              <strong className="text-zinc-900">한글 단어</strong>가 떠 있습니다.
              그 단어를 정확히 타이핑하면 성에서 화살이 날아가 적을 격파합니다. 웨이브가 오를수록 적은 더 빠르고 많아지고,
              단어도 어려워집니다.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 text-orange-500">
              <Keyboard size={28} />
              <h2 className="text-2xl font-bold">플레이 방법과 스킬</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard icon={<Keyboard size={18} />} title="단어 발사" text="적의 단어를 그대로 입력하면 가장 가까운 해당 적에게 화살을 쏴 격파합니다." />
              <InfoCard icon={<Zap size={18} />} title="번개" text="적이 가장 많이 모인 라인 전체를 한 번에 정리합니다. (쿨다운)" />
              <InfoCard icon={<Shield size={18} />} title="방패" text="다음 성문 피해를 막습니다. 최대 3개까지 준비됩니다. (쿨다운)" />
              <InfoCard icon={<Wrench size={18} />} title="수리" text="성문 체력을 2 회복합니다. (쿨다운)" />
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-600">
              <Swords size={28} />
              <h2 className="text-2xl font-bold">웨이브 서바이벌</h2>
            </div>
            <p className="text-zinc-600 leading-relaxed font-medium">
              정해진 시간이 아니라 웨이브로 승부합니다. 한 웨이브의 적을 모두 막으면 잠시 숨을 고르고 다음 웨이브가 시작됩니다.
              성문 체력이 0이 되면 게임이 끝나며, 몇 번째 웨이브까지 버텼는지가 곧 실력입니다. 위급할 때 스킬을 아껴 쓰는 운영이 관건입니다.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 text-yellow-500">
              <Trophy size={28} />
              <h2 className="text-2xl font-bold">점수·콤보와 랭킹</h2>
            </div>
            <p className="text-zinc-600 leading-relaxed font-medium">
              적을 연속으로 격파하면 콤보가 쌓여 점수 배율이 커지고, 긴 단어일수록 더 높은 점수를 줍니다.
              오입력은 점수를 깎고 콤보를 끊습니다. 로그인 후 플레이하면 최고 점수·도달 웨이브·최고 콤보가 랭킹에 저장됩니다.
              타격감 있는 사운드와 이펙트로 <Sparkles className="inline" size={14} /> 타자 치는 맛을 살렸습니다.
            </p>
          </section>
        </div>

        <p className="text-center text-[11px] text-zinc-400 pb-12">
          아트: Tiny Swords by Pixel Frog (무료 상업적 사용 가능)
        </p>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
      <h4 className="font-bold mb-2 flex items-center gap-2 text-zinc-900">
        {icon} {title}
      </h4>
      <p className="text-xs text-zinc-500 leading-normal">{text}</p>
    </div>
  );
}
