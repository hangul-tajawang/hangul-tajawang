import { localeAlternates } from '@/lib/i18n/alternates';
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Trophy, BookOpenText, HelpCircle } from "lucide-react";

const GAME_FAQ = [
  {
    q: '게임으로 타자 연습이 정말 되나요?',
    a: '네. 떨어지는 단어를 입력하거나 봇과 경주하는 게임은 정해진 시간 안에 정확히 쳐야 하는 압박을 만들어, 지루한 반복 없이도 순간 반응 속도와 타수를 끌어올립니다. 재미 덕분에 자연스럽게 연습 시간이 길어지는 것도 큰 장점입니다.',
  },
  {
    q: '어떤 게임부터 하면 좋나요?',
    a: '타자가 익숙하지 않다면 속도 부담이 적은 타자 레이스로 시작하고, 익숙해지면 산성비·블록 팝핑처럼 시간 압박이 있는 게임으로 넘어가세요. 성문방어·기억력 타자·타자 격투는 전략·기억·반응까지 더해져 난이도가 높은 편이고, 맞춤법까지 챙기고 싶다면 받아쓰기를 추천합니다.',
  },
  {
    q: '게임 점수가 랭킹에 반영되나요?',
    a: '로그인 후 플레이하면 게임별 최고 점수가 실시간 랭킹보드에 자동 등록되어 다른 유저들과 순위를 겨룰 수 있습니다. 목표 점수가 생기면 연습 동기도 훨씬 강해집니다.',
  },
];

export const metadata: Metadata = {
  title: "한글 게임 모음 - 재미있는 타자 연습 게임",
  description: "산성비 게임부터 향후 추가될 다양한 타자 게임까지! 한글타자왕에서 제공하는 재미있는 한글 게임들을 만나보세요.",
  keywords: ["한글 게임", "타자 게임", "산성비", "단어 맞추기", "온라인 타자 게임", "무료 게임"],
  alternates: localeAlternates('/game', 'ko'),
  openGraph: {
    title: "한글 게임 모음 - 한글타자왕",
    description: "게임처럼 즐기는 타자 연습! 다양한 한글 게임에 도전해 보세요.",
    url: "https://www.hangul-tajawang.com/game",
  }
};

export default function GameHubPage() {
  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-3">Games</p>
        <h1 className="serif-display text-4xl md:text-5xl font-bold mb-4">한글 타자 게임 센터</h1>
        <p className="text-zinc-500 font-medium text-lg">타자 연습을 게임처럼 신나게 즐겨보세요!</p>
      </div>

      <div className="hub-panel grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. 산성비 */}
        <GameCard
          href="/game/acid-rain"
          icon={<span className="text-5xl" aria-hidden>🌧️</span>}
          title="산성비 게임"
          description="하늘에서 떨어지는 단어들을 <br/>바닥에 닿기 전에 입력하세요!"
          difficulty="Medium"
          color="blue"
        />

        {/* 2. 글자 계단 */}
        <GameCard
          href="/game/stairs"
          icon={
            // 이미지 변형 과금 방지로 next/image 대신 일반 img 사용
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/game/stairs/card-chick.png" alt="계단 오르는 병아리" width={64} height={64} draggable={false} className="w-16 h-16 object-contain select-none pointer-events-none drop-shadow" />
          }
          title="글자 계단"
          description="끝없이 이어지는 타자 계단! <br/>단어를 쳐서 한 칸씩 올라가세요!"
          difficulty="Medium"
          color="emerald"
        />

        {/* 3. 성문방어 */}
        <GameCard
          href="/game/castle-defense"
          icon={
            // 실제 게임 픽셀 성문 스프라이트 (알아보기 쉽게)
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/game/castle-defense/castle.png" alt="픽셀아트 성문" width={64} height={64} draggable={false} className="cd-pixel w-16 h-16 object-contain select-none pointer-events-none drop-shadow-lg" />
          }
          title="성문방어 타자 게임"
          description="적의 단어를 타이핑해 화살을 쏘고 <br/>밀려오는 웨이브를 막아내세요!"
          difficulty="Hard"
          color="slate"
        />

        <GameCard
          href="/game/card-flip"
          icon={<span className="text-5xl" aria-hidden>🃏</span>}
          title="기억력 타자"
          description="카드의 뒷면을 타자로 뒤집어 <br/>똑같은 짝을 찾아 맞춰보세요!"
          difficulty="Hard"
          color="purple"
        />

        <GameCard
          href="/game/block-pop"
          icon={<span className="text-5xl" aria-hidden>🧱</span>}
          title="블록 팝핑"
          description="아래에서 차오르는 단어 블록을 <br/>천장에 닿기 전에 터뜨리세요!"
          difficulty="Medium"
          color="rose"
        />

        <GameCard
          href="/game/typing-fight"
          icon={<span className="text-5xl" aria-hidden>🥊</span>}
          title="타자 격투"
          description="단어로 때리고 방어 단어로 막아라! <br/>5단계 보스를 쓰러뜨리세요!"
          difficulty="Hard"
          color="rose"
        />

        <GameCard
          href="/game/dictation"
          icon={<span className="text-5xl" aria-hidden>👂</span>}
          title="받아쓰기"
          description="들려주는 말을 듣고 <br/>맞춤법에 맞게 써 보세요!"
          difficulty="Easy"
          color="purple"
        />

        <GameCard
          href="/game/typing-race"
          icon={<span className="text-5xl" aria-hidden>🏁</span>}
          title="타자 레이스"
          description="달팽이·토끼·코뿔소·파랑새와 <br/>문장으로 달리는 경주!"
          difficulty="Easy"
          color="blue"
        />
      </div>

      {/* 실시간 랭킹 유도 섹션 */}
      <div className="mt-20 p-10 bg-on-surface rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Trophy size={180} />
        </div>
        <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-3">내 게임 실력은 몇 등일까?</h2>
            <p className="text-blue-100 font-medium">산성비, 성문방어, 타자 격투, 받아쓰기 최고 점수에 도전하고 <br className="hidden sm:block" />다른 유저들과 랭킹을 겨뤄보세요.</p>
        </div>
        <Link prefetch={false} 
            href="/game/acid-rain" 
            className="relative z-10 px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:scale-105 transition-all flex items-center gap-2 shadow-xl"
        >
            게임 시작하기 <ChevronRight size={20} />
        </Link>
      </div>

      {/* SEO 및 정보 섹션 — 타자 게임 안내 */}
      <div className="mt-24 border-t border-zinc-200 pt-16 space-y-16 text-left">
        <section className="space-y-5">
          <div className="flex items-center gap-3 text-blue-600">
            <BookOpenText size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">게임처럼 즐기는 한글 타자 연습</h2>
          </div>
          <p className="text-zinc-600 leading-loose font-medium break-keep">
            반복되는 연습이 지루하다면 게임이 답입니다. 한글타자왕의 타자 게임은 하늘에서 떨어지는 단어를 막고,
            보스와 격투하고, 소리만 듣고 받아쓰고, 명령어로 성문을 지키는 다양한 방식으로 <strong className="text-on-surface">순간 반응 속도와 타수</strong>를
            끌어올립니다. 재미가 붙는 만큼 연습 시간도 자연스럽게 길어지고, 실시간 랭킹이 더 높은 점수에 도전하게 만듭니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['산성비', '하늘에서 떨어지는 단어를 바닥에 닿기 전에 입력하는 압박형. 순간 판단력과 손 속도를 집중적으로 훈련합니다.'],
              ['글자 계단', '단어를 칠 때마다 한 칸씩 오르는 무한 계단. 끊기지 않고 이어 치는 리듬감과 지구력을 기릅니다.'],
              ['성문방어', '적의 단어를 타이핑해 화살로 막는 타워 디펜스형. 웨이브가 오를수록 보스까지 등장해 순발력과 정확도를 함께 요구합니다.'],
              ['기억력 타자', '카드를 타자로 뒤집어 짝을 맞추는 두뇌형. 타이핑과 집중력을 동시에 자극합니다.'],
              ['블록 팝핑', '아래에서 차오르는 단어 블록을 천장에 닿기 전에 터뜨리는 지구전. 후반으로 갈수록 한계 속도를 끌어올립니다.'],
              ['타자 격투', '단어로 공격하고 방어 단어로 막는 격투형. 5단계 보스를 이길 때마다 다음 보스가 열리고, 게이지가 차면 사자성어 필살기가 나갑니다.'],
              ['받아쓰기', '글자 없이 소리만 듣고 쓰는 맞춤법형. 같이[가치]처럼 소리와 글자가 다른 말을 3단계 난이도로 익히고 오답 노트로 복습합니다.'],
              ['타자 레이스', '문장을 쳐서 달리는 경주형. 달팽이·토끼·코뿔소·파랑새(200·350·500·750타)를 추월하며 내 실력이 한눈에 보이고, 오타가 나면 넘어져 정확도까지 훈련됩니다.'],
            ].map(([t, d]) => (
              <div key={t} className="p-6 bg-surface-low rounded-2xl border border-surface-high">
                <h3 className="font-bold mb-2 text-on-surface">{t}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed break-keep">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-3 text-blue-500">
            <HelpCircle size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">자주 묻는 질문</h2>
          </div>
          <div className="space-y-4">
            {GAME_FAQ.map((f) => (
              <details key={f.q} className="group bg-surface-low rounded-2xl border border-surface-high p-6 open:pb-6">
                <summary className="cursor-pointer list-none font-bold text-on-surface flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-primary transition-transform group-open:rotate-45 text-xl leading-none shrink-0">+</span>
                </summary>
                <p className="mt-4 text-sm text-zinc-600 leading-loose break-keep">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: GAME_FAQ.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
    </div>
  );
}

interface GameCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  difficulty: string;
  color: "blue" | "purple" | "emerald" | "rose" | "slate";
}

function GameCard({ href, icon, title, description, difficulty, color }: GameCardProps) {
  const colorMap: Record<GameCardProps["color"], string> = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    slate: "bg-slate-100 text-slate-600",
  };

  void colorMap; // 키캡/제품 아트로 대체되어 색 매핑은 미사용 (시그니처 유지)
  return (
    <Link prefetch={false}
      href={href}
      className="group keycap-card p-6 flex flex-col"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-16 h-16 flex items-center justify-center">{icon}</div>
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pt-1">{difficulty}</span>
      </div>
      <h3 className="serif-display text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      {/* 4열 카드는 폭이 좁아 고정 줄바꿈(<br/>)을 빼고 어절 단위로 자연스럽게 감싼다 */}
      <p className="text-zinc-600 leading-relaxed mb-6 text-sm break-keep" dangerouslySetInnerHTML={{ __html: description.replace(/<br\s*\/?>/g, " ") }}></p>
      <div className="mt-auto flex items-center gap-1 text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
        플레이하기 <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
