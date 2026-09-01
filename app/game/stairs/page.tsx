import { localeAlternates } from '@/lib/i18n/alternates';
import { Metadata } from 'next';
import { StairsGame } from '@/components/game/StairsGame';
import { GameJsonLd } from '@/components/seo/GameJsonLd';
import {
  Target,
  Gauge,
  Trophy,
  ShieldCheck,
  MousePointer2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '타자 계단 게임 - 무한 타자 연습 | 글자 계단',
  description:
    '글자 계단은 끝없이 이어지는 계단을 한 글자, 한 단어씩 정확히 입력하며 오르는 무한 타자 게임입니다. 자음·모음 워밍업부터 과일·한국사 테마 단어까지, 한글 타자 연습과 실시간 층수 랭킹을 무료로 즐기세요.',
  keywords: [
    '타자 계단 게임',
    '무한 타자',
    '글자 계단',
    '타자 게임',
    '한글 타자 연습',
    '타자 연습 게임',
    '계단 오르기 게임',
    '무료 타자 게임',
    '한글타자왕 게임',
  ],
  alternates: localeAlternates('/game/stairs', 'ko'),
  openGraph: {
    title: '글자 계단 - 타자 계단 게임 | 한글타자왕',
    description:
      '단어를 칠수록 높아지는 짜릿함! 끝없이 이어지는 계단을 오르는 무한 타자 게임으로 손끝 순발력을 끌어올리세요.',
    url: 'https://www.hangul-tajawang.com/game/stairs',
  },
};

export default function StairsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <GameJsonLd name="글자 계단" url="https://www.hangul-tajawang.com/game/stairs" description="단어를 쳐서 병아리와 함께 끝없이 계단을 오르는 무료 온라인 타자 게임." genre={["러너", "타자 연습", "캐주얼"]} />
      <h1 className="sr-only">글자 계단 - 무한 타자 계단 한글 타자 연습 게임</h1>

      {/* 게임 본체 */}
      <StairsGame />

      {/* SEO 및 정보 섹션 */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-200 pt-16 pb-20">
        {/* 1. 게임 소개 및 플레이 방법 (AEO: 질문형 소제목) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-emerald-600">
            <Target size={28} />
            <h2 className="text-2xl font-bold">타자 계단 게임이란?</h2>
          </div>
          <p className="text-zinc-600 leading-relaxed font-medium break-keep">
            <strong className="text-zinc-900">
              글자 계단
            </strong>
            은 끝없이 이어지는 계단을 한 글자, 한 단어씩 정확히 입력하며 오르는{' '}
            <strong className="text-zinc-900">
              무한 타자 게임
            </strong>
            입니다. 지그재그로 뻗은 계단 위에 단어가 놓여 있고, 다음 계단의
            단어를 완성하면 캐릭터가 한 칸씩 점프해 올라갑니다. 층수가 곧
            점수이므로, 게이지가 바닥나 추락하기 전까지 최대한 높이 오르는 것이
            목표인 타자 연습 게임입니다.
          </p>
          <ul className="space-y-3 text-sm text-zinc-500">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">✔</span>
              <span>
                <strong className="text-zinc-800">
                  자모 워밍업:
                </strong>{' '}
                처음 10층은 자음·모음 한 글자만 입력하는 워밍업 구간이라 타자
                초보자도 부담 없이 시작할 수 있습니다.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">✔</span>
              <span>
                <strong className="text-zinc-800">
                  시간 게이지:
                </strong>{' '}
                게이지가 계속 줄어들며 정확히 입력할 때마다 회복됩니다. 층이
                높아질수록 감소 속도가 빨라집니다.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">✔</span>
              <span>
                <strong className="text-zinc-800">
                  테마 단어:
                </strong>{' '}
                층이 오를수록 과일·한국사 같은 테마 단어가 섞이고, 최고
                구간에서는 사자성어까지 등장합니다.
              </span>
            </li>
          </ul>
        </section>

        {/* 2. 난이도·연출 설명 (AEO: 질문형 소제목) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-amber-500">
            <Gauge size={28} />
            <h2 className="text-2xl font-bold">몇 층까지 올라갈 수 있나요?</h2>
          </div>
          <p className="text-zinc-600 leading-relaxed font-medium break-keep text-sm">
            층수 제한은 없습니다. 계단은 무한히 이어지며, 오직 시간 게이지와 타자
            실력만이 도달 층수를 결정합니다. 높이 오를수록 배경과 단어가 함께
            변합니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                ⏳ 시간 게이지
              </h4>
              <p className="text-xs text-zinc-500 leading-normal">
                남은 양에 따라 초록·노랑·빨강으로 바뀌며, 바닥나는 순간 캐릭터가
                추락합니다.
              </p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                🌌 층별 배경
              </h4>
              <p className="text-xs text-zinc-500 leading-normal">
                지상(하늘) → 노을 → 밤하늘 → 우주로, 오를수록 배경이 부드럽게
                전환됩니다.
              </p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                🚩 마일스톤
              </h4>
              <p className="text-xs text-zinc-500 leading-normal">
                50층 단위마다 깃발과 돌파 배너가 나타나 지금까지 얼마나
                올라왔는지 한눈에 보여줍니다.
              </p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                ✨ 다음 단어 강조
              </h4>
              <p className="text-xs text-zinc-500 leading-normal">
                다음에 쳐야 할 단어는 크게 강조되고, 그 위 단어는 흐리게
                미리보기로 표시됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* 3. 데이터 저장 및 랭킹 시스템 */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-yellow-500">
            <Trophy size={28} />
            <h2 className="text-2xl font-bold">실시간 층수 랭킹</h2>
          </div>
          <p className="text-zinc-600 leading-relaxed font-medium break-keep">
            한글타자왕은 실시간 데이터베이스 기술을 활용하여 전 세계 유저들의
            최고 도달 층수를 투명하게 관리합니다.
          </p>
          <div className="flex items-start gap-4 p-5 bg-yellow-50 rounded-2xl border border-yellow-100">
            <ShieldCheck className="text-yellow-600 shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-yellow-700 text-sm mb-1">
                안전한 데이터 보존
              </h4>
              <p className="text-xs text-yellow-600/80 leading-normal">
                로그인 후 플레이하시면 본인의 최고 도달 층수와 최대 콤보 기록이
                서버에 영구적으로 보관되며, 실시간 랭킹보드에 본인의 닉네임과
                프로필이 자동으로 등록됩니다.
              </p>
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 font-bold mt-4 text-center italic">
            * 로그인을 하시면 나만의 소중한 기록을 실시간 랭킹에 남길 수 있습니다.
          </p>
        </section>

        {/* 4. 타자 연습 효과 */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-green-600">
            <MousePointer2 size={28} />
            <h2 className="text-2xl font-bold">타자 연습 효과</h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 font-bold text-green-600">
                01
              </div>
              <p className="text-sm text-zinc-500 pt-2">
                <strong className="text-zinc-800">
                  순발력 향상:
                </strong>{' '}
                줄어드는 게이지의 압박 속에서 다음 단어를 빠르게 인지하고 치는
                무한 타자 훈련이 됩니다.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 font-bold text-green-600">
                02
              </div>
              <p className="text-sm text-zinc-500 pt-2">
                <strong className="text-zinc-800">
                  정확도 개선:
                </strong>{' '}
                단어를 정확히 완성해야만 올라갈 수 있어 오타 없는 타건 습관을 기를
                수 있습니다.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 font-bold text-green-600">
                03
              </div>
              <p className="text-sm text-zinc-500 pt-2">
                <strong className="text-zinc-800">
                  어휘력 증진:
                </strong>{' '}
                자음·모음부터 과일·한국사 테마 단어, 사자성어까지 층수에 따라
                난이도별로 구성된 단어를 자연스럽게 익힙니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
