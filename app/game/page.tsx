import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CloudRain, Trophy, Brain, Boxes, Flag, BookOpenText, HelpCircle } from "lucide-react";

const GAME_FAQ = [
  {
    q: '게임으로 타자 연습이 정말 되나요?',
    a: '네. 떨어지는 단어를 입력하거나 봇과 경주하는 게임은 정해진 시간 안에 정확히 쳐야 하는 압박을 만들어, 지루한 반복 없이도 순간 반응 속도와 타수를 끌어올립니다. 재미 덕분에 자연스럽게 연습 시간이 길어지는 것도 큰 장점입니다.',
  },
  {
    q: '어떤 게임부터 하면 좋나요?',
    a: '타자가 익숙하지 않다면 속도 부담이 적은 타자 레이스로 시작하고, 익숙해지면 산성비·블록 팝핑처럼 시간 압박이 있는 게임으로 넘어가세요. 성문방어와 기억력 타자는 전략·기억까지 더해져 난이도가 높은 편입니다.',
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
  alternates: {
    canonical: 'https://www.hangul-tajawang.com/game',
  },
  openGraph: {
    title: "한글 게임 모음 - 한글타자왕",
    description: "게임처럼 즐기는 타자 연습! 다양한 한글 게임에 도전해 보세요.",
    url: "https://www.hangul-tajawang.com/game",
  }
};

export default function GameHubPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black mb-4">한글 게임 센터</h1>
        <p className="text-zinc-500 font-medium text-lg">타자 연습을 게임처럼 신나게 즐겨보세요!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 1. 산성비 */}
        <GameCard
          href="/game/acid-rain"
          icon={
            <div className="relative w-16 h-16 flex items-center justify-center">
              <CloudRain size={44} className="text-blue-500 drop-shadow" />
              <span className="absolute bottom-0 left-1 text-[11px] font-black text-sky-400 rotate-6">가</span>
              <span className="absolute bottom-1 right-0 text-xs font-black text-blue-500 -rotate-6">비</span>
            </div>
          }
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
          icon={<Brain size={40} className="text-purple-500" />}
          title="기억력 타자"
          description="카드의 뒷면을 타자로 뒤집어 <br/>똑같은 짝을 찾아 맞춰보세요!"
          difficulty="Hard"
          color="purple"
        />

        <GameCard
          href="/game/block-pop"
          icon={<Boxes size={40} className="text-rose-500" />}
          title="블록 팝핑"
          description="아래에서 차오르는 단어 블록을 <br/>천장에 닿기 전에 터뜨리세요!"
          difficulty="Medium"
          color="rose"
        />

        <GameCard
          href="/game/typing-race"
          icon={<Flag size={40} className="text-blue-500" />}
          title="타자 레이스"
          description="거북이, 토끼, 치타와 경주! <br/>단어를 입력해 결승선을 통과하세요!"
          difficulty="Easy"
          color="blue"
        />
      </div>

      {/* 실시간 랭킹 유도 섹션 */}
      <div className="mt-20 p-10 bg-linear-to-br from-blue-600 to-indigo-700 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
            <Trophy size={180} />
        </div>
        <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl font-black mb-3">내 게임 실력은 몇 등일까?</h2>
            <p className="text-blue-100 font-medium">산성비, 성문방어, 블록 팝핑 최고 점수에 도전하고 <br className="hidden sm:block" />다른 유저들과 랭킹을 겨뤄보세요.</p>
        </div>
        <Link prefetch={false} 
            href="/game/acid-rain" 
            className="px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:scale-105 transition-all flex items-center gap-2 shadow-xl"
        >
            게임 시작하기 <ChevronRight size={20} />
        </Link>
      </div>

      {/* SEO 및 정보 섹션 — 타자 게임 안내 */}
      <div className="mt-24 border-t border-zinc-200 dark:border-zinc-800 pt-16 space-y-16 text-left">
        <section className="space-y-5">
          <div className="flex items-center gap-3 text-blue-600">
            <BookOpenText size={28} />
            <h2 className="text-2xl md:text-3xl font-black">게임처럼 즐기는 한글 타자 연습</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-loose font-medium break-keep">
            반복되는 연습이 지루하다면 게임이 답입니다. 한글타자왕의 타자 게임은 하늘에서 떨어지는 단어를 막고,
            AI 봇과 속도를 겨루고, 명령어로 성문을 지키는 다양한 방식으로 <strong className="text-on-surface">순간 반응 속도와 타수</strong>를
            끌어올립니다. 재미가 붙는 만큼 연습 시간도 자연스럽게 길어지고, 실시간 랭킹이 더 높은 점수에 도전하게 만듭니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['산성비 · 블록 팝핑', '시간 안에 단어를 쳐야 하는 압박형. 순간 판단력과 손 속도를 집중적으로 훈련합니다.'],
              ['타자 레이스', 'AI 봇과의 경주형. 내 타수가 200·350·500타와 실시간으로 비교되어 실력이 한눈에 보입니다.'],
              ['성문방어', '적의 단어를 타이핑해 화살로 막는 타워 디펜스형. 웨이브가 오를수록 보스까지 등장해 순발력과 정확도를 함께 요구합니다.'],
              ['기억력 타자', '카드를 타자로 뒤집어 짝을 맞추는 두뇌형. 타이핑과 집중력을 동시에 자극합니다.'],
            ].map(([t, d]) => (
              <div key={t} className="p-6 bg-surface-low rounded-2xl border border-surface-high">
                <h3 className="font-black mb-2 text-on-surface">{t}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed break-keep">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-3 text-blue-500">
            <HelpCircle size={28} />
            <h2 className="text-2xl md:text-3xl font-black">자주 묻는 질문</h2>
          </div>
          <div className="space-y-4">
            {GAME_FAQ.map((f) => (
              <details key={f.q} className="group bg-surface-low rounded-2xl border border-surface-high p-6 open:pb-6">
                <summary className="cursor-pointer list-none font-black text-on-surface flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-primary transition-transform group-open:rotate-45 text-xl leading-none shrink-0">+</span>
                </summary>
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-loose break-keep">{f.a}</p>
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
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600",
    rose: "bg-rose-50 dark:bg-rose-900/20 text-rose-600",
    slate: "bg-slate-100 dark:bg-slate-800 text-slate-600",
  };

  return (
    <Link prefetch={false} 
      href={href}
      className="group bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 hover:border-blue-500 hover:shadow-2xl transition-all flex flex-col items-center text-center"
    >
      <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="inline-flex px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-[9px] font-black rounded uppercase mb-4 tracking-widest">Difficulty: {difficulty}</div>
      <h3 className="text-2xl font-black mb-4 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-zinc-500 font-medium leading-relaxed mb-8 text-sm" dangerouslySetInnerHTML={{ __html: description }}></p>
      <div className="flex items-center gap-1 text-sm font-black text-blue-600">
        플레이하기 <ChevronRight size={16} />
      </div>
    </Link>
  );
}
