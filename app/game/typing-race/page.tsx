import { Metadata } from 'next';
import { TypingRaceGame } from '@/components/game/TypingRaceGame';
import {
  Flag,
  Gauge,
  Trophy,
  Target,
  Rabbit,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '타자 레이스 - 거북이·토끼·치타와 겨루는 한글 타자 경주 게임',
  description:
    '단어를 입력할 때마다 캐릭터가 달립니다! 분당 200타 거북이부터 500타 치타까지, AI 봇과 겨루는 500타 한글 타자 경주. 내 실제 타수를 레이스로 확인해보세요.',
  keywords: [
    '타자 레이스',
    '타자 경주 게임',
    '타자 속도 게임',
    '한글 타자 게임',
    '온라인 타자 게임',
    '무료 타자 게임',
    '한글타자왕 게임',
  ],
  alternates: {
    canonical: 'https://www.hangul-tajawang.com/game/typing-race',
  },
  openGraph: {
    title: '타자 레이스 - 한글타자왕',
    description:
      '거북이, 토끼, 치타와 500타 경주! 단어를 빠르게 입력해 결승선을 통과하세요.',
    url: 'https://www.hangul-tajawang.com/game/typing-race',
  },
};

export default function TypingRacePage() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <h1 className="sr-only">타자 레이스 한글 타자 경주 게임 - 온라인 랭킹 시스템</h1>

      {/* 게임 본체 */}
      <TypingRaceGame />

      {/* SEO 및 정보 섹션 */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-20">
        {/* 1. 게임 소개 */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-blue-600">
            <Flag size={28} />
            <h2 className="text-2xl font-black">타자 레이스 게임 소개</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            <strong className="text-zinc-900 dark:text-zinc-100">타자 레이스</strong>
            는 화면에 나오는 단어를 정확히 입력할 때마다 내 캐릭터가 앞으로
            달려나가는 경주형 타자 게임입니다. 상대는 각기 다른 속도로 달리는
            세 마리의 AI 봇. 총 500타 거리를 누가 먼저 완주하는지 겨룹니다.
          </p>
          <ul className="space-y-3 text-sm text-zinc-500">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✔</span>
              <span>
                <strong className="text-zinc-800 dark:text-zinc-200">타수 기반 전진:</strong>{' '}
                긴 단어를 칠수록 더 멀리 나아갑니다. 실제 자소 타수로 계산됩니다.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✔</span>
              <span>
                <strong className="text-zinc-800 dark:text-zinc-200">난이도 상승:</strong>{' '}
                레이스 후반으로 갈수록 단어가 길고 어려워집니다.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✔</span>
              <span>
                <strong className="text-zinc-800 dark:text-zinc-200">오타 페널티:</strong>{' '}
                틀린 입력은 콤보가 끊기고 정확도가 떨어집니다. 빠르기와 정확함을 함께 훈련하세요.
              </span>
            </li>
          </ul>
        </section>

        {/* 2. 상대 봇 소개 */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-pink-500">
            <Rabbit size={28} />
            <h2 className="text-2xl font-black">상대 봇 소개</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
              <div className="text-3xl mb-2">🐢</div>
              <h4 className="font-black mb-1">거북이</h4>
              <p className="text-xs text-zinc-500 leading-normal">분당 200타. 타자 입문자의 벽. 아직 자판을 보며 친다면 만만치 않습니다.</p>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
              <div className="text-3xl mb-2">🐰</div>
              <h4 className="font-black mb-1">토끼</h4>
              <p className="text-xs text-zinc-500 leading-normal">분당 350타. 대한민국 평균 직장인 수준. 토끼를 이기면 당신은 평균 이상!</p>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
              <div className="text-3xl mb-2">🐆</div>
              <h4 className="font-black mb-1">치타</h4>
              <p className="text-xs text-zinc-500 leading-normal">분당 500타. 숙련 타이피스트의 영역. 치타를 제치고 1등을 노려보세요.</p>
            </div>
          </div>
        </section>

        {/* 3. 랭킹 시스템 */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-yellow-500">
            <Trophy size={28} />
            <h2 className="text-2xl font-black">실시간 타수 랭킹</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            레이스를 완주하면 경주 중 기록한 평균 분당 타수가 점수로 기록됩니다.
            로그인 후 플레이하면 최고 타수와 완주 등수가 실시간 랭킹보드에
            자동으로 등록되어 다른 유저들과 순위를 겨룰 수 있습니다.
          </p>
        </section>

        {/* 4. 타자 연습 효과 */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-green-600">
            <Gauge size={28} />
            <h2 className="text-2xl font-black">타자 연습 효과</h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0 font-black text-green-600">01</div>
              <p className="text-sm text-zinc-500 pt-2">
                <strong className="text-zinc-800 dark:text-zinc-200">실전 속도 감각:</strong>{' '}
                내 타수가 200·350·500타와 실시간으로 비교되어 현재 실력이 직관적으로 보입니다.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0 font-black text-green-600">02</div>
              <p className="text-sm text-zinc-500 pt-2">
                <strong className="text-zinc-800 dark:text-zinc-200">한계 속도 훈련:</strong>{' '}
                눈앞에서 달리는 경쟁자가 평소보다 빠른 손놀림을 끌어냅니다. 정체기 돌파에 효과적입니다.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0 font-black text-green-600">03</div>
              <p className="text-sm text-zinc-500 pt-2">
                <strong className="text-zinc-800 dark:text-zinc-200">목표 기반 동기부여:</strong>{' '}
                "다음엔 토끼를 이기자"는 명확한 목표가 매일의 연습을 게임으로 바꿔줍니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
