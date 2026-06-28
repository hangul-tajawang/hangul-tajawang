import { Metadata } from "next";
import { TypingDefenseGame } from "@/components/game/TypingDefenseGame";
import { Castle, Crosshair, Heart, Shield, Sparkles, Trophy, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "한글 타자 게임 - 성문방어 무료 온라인 게임",
  description:
    "한글 타자 게임 성문방어를 무료로 플레이하세요. 발사, 방패, 번개, 수리 명령어를 빠르게 입력해 60초 동안 성문을 지키는 온라인 타자 디펜스 게임입니다.",
  keywords: [
    "한글 타자 게임",
    "무료 한글 타자 게임",
    "온라인 타자 게임",
    "한글 타자 성문방어",
    "성문방어 게임",
    "타자 디펜스",
    "명령어 타자 게임",
    "한글타자왕",
  ],
  alternates: {
    canonical: "https://www.hangul-tajawang.com/game/castle-defense",
  },
  openGraph: {
    title: "한글 타자 게임 - 성문방어 | 한글타자왕",
    description: "발사, 방패, 번개, 수리 명령으로 성문을 지키는 무료 온라인 한글 타자 게임.",
    url: "https://www.hangul-tajawang.com/game/castle-defense",
  },
};

export default function CastleDefensePage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <h1 className="sr-only">한글 타자 게임 성문방어 - 무료 온라인 명령어 타자 디펜스</h1>

      <TypingDefenseGame />

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-20">
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-blue-600">
            <Castle size={28} />
            <h2 className="text-2xl font-black">한글 타자 게임 성문방어 소개</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            성문방어는 한글 타자 게임을 디펜스 장르로 풀어낸 온라인 무료 게임입니다.
            무작위 단어를 치는 방식이 아니라, 상황에 맞는 명령어를 빠르게 입력해 성문을 지킵니다. 화면의
            적을 보며 <strong className="text-zinc-900 dark:text-zinc-100">발사</strong>,{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">방패</strong>,{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">번개</strong>,{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">수리</strong> 중 알맞은
            명령을 선택하고 정확하게 입력해야 합니다.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-orange-500">
            <Crosshair size={28} />
            <h2 className="text-2xl font-black">명령어와 효과</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard icon={<Crosshair size={18} />} title="발사" text="성문에 가장 가까운 적 1명을 제거합니다." />
            <InfoCard icon={<Shield size={18} />} title="방패" text="다음 성문 피해를 1회 막습니다. 최대 2개까지 준비됩니다." />
            <InfoCard icon={<Zap size={18} />} title="번개" text="적이 가장 많이 모인 라인 전체를 한 번에 정리합니다." />
            <InfoCard icon={<Heart size={18} />} title="수리" text="성문 체력을 1 회복합니다. 최대 체력에서는 사용할 수 없습니다." />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-yellow-500">
            <Trophy size={28} />
            <h2 className="text-2xl font-black">점수와 랭킹</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            적을 연속으로 막으면 콤보가 올라가고 추가 점수를 얻습니다. 오입력은
            점수를 깎고 콤보를 끊기 때문에, 빠른 입력만큼 정확한 판단도 중요합니다.
            로그인 후 플레이하면 점수와 최고 콤보가 랭킹에 저장됩니다.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-green-600">
            <Sparkles size={28} />
            <h2 className="text-2xl font-black">타자 연습 효과</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            같은 네 가지 명령어를 반복 입력하지만, 적의 위치와 성문 상태에 따라
            매번 선택이 달라집니다. 손가락 반응 속도, 한글 단어 정확도, 상황 판단을
            동시에 훈련할 수 있는 짧고 밀도 높은 타자 게임입니다.
          </p>
        </section>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
      <h4 className="font-black mb-2 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
        {icon} {title}
      </h4>
      <p className="text-xs text-zinc-500 leading-normal">{text}</p>
    </div>
  );
}
