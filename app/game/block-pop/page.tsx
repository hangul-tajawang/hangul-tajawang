import { Metadata } from 'next';
import { BlockPopGame } from '@/components/game/BlockPopGame';
import { GameJsonLd } from '@/components/seo/GameJsonLd';
import {
  Zap,
  ShieldCheck,
  Trophy,
  Target,
  MousePointer2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '블록 팝핑 - 한글 단어 블록 터뜨리기 타자 게임',
  description:
    '아래에서 차오르는 한글 단어 블록을 정확하게 입력해 터뜨리세요! 블록이 천장에 닿기 전에 빠르게 타이핑하는 신개념 한글 타자 게임. 실시간 랭킹과 폭탄·황금 블록 기믹을 지원합니다.',
  keywords: [
    '블록 팝핑',
    '블록 터뜨리기 게임',
    '한글 단어 게임',
    '타자 게임',
    '온라인 타자 게임',
    '무료 타자 게임',
    '한글타자왕 게임',
  ],
  alternates: {
    canonical: 'https://www.hangul-tajawang.com/game/block-pop',
  },
  openGraph: {
    title: '블록 팝핑 - 한글타자왕',
    description:
      '차오르는 단어 블록을 타이핑으로 터뜨려라! 블록 팝핑으로 순발력과 타자 실력을 동시에 키워보세요.',
    url: 'https://www.hangul-tajawang.com/game/block-pop',
  },
};

export default function BlockPopPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <GameJsonLd name="블록 팝핑" url="https://www.hangul-tajawang.com/game/block-pop" description="아래에서 차오르는 단어 블록을 천장에 닿기 전에 터뜨리는 무료 온라인 타자 게임." genre={["아케이드", "타자 연습", "캐주얼"]} />
      <h1 className="sr-only">블록 팝핑 한글 타자 게임 - 온라인 랭킹 시스템</h1>

      {/* 게임 본체 */}
      <BlockPopGame />

      {/* SEO 및 정보 섹션 */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-20">
        {/* 1. 게임 소개 및 플레이 방법 */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-rose-600">
            <Target size={28} />
            <h2 className="text-2xl font-black">블록 팝핑 게임 소개</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            <strong className="text-zinc-900 dark:text-zinc-100">블록 팝핑</strong>
            은 아래에서 한 줄씩 차오르는 한글 단어 블록을 입력해 터뜨리는 신개념
            타자 게임입니다. 블록 더미가 천장에 닿기 전에 단어를 정확히 입력해
            제거하세요. 레벨이 올라갈수록 단어가 어려워지고 블록이 차오르는 속도가
            빨라져 긴장감이 더해집니다.
          </p>
          <ul className="space-y-3 text-sm text-zinc-500">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 mt-1">✔</span>
              <span>
                <strong className="text-zinc-800 dark:text-zinc-200">
                  차오르는 블록:
                </strong>{' '}
                일정 시간마다 새 단어 줄이 바닥에서 생성되어 위로 쌓입니다.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 mt-1">✔</span>
              <span>
                <strong className="text-zinc-800 dark:text-zinc-200">
                  레벨업:
                </strong>{' '}
                500점 단위로 레벨이 상승하며 단어 난이도와 차오름 속도가 빨라집니다.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 mt-1">✔</span>
              <span>
                <strong className="text-zinc-800 dark:text-zinc-200">
                  콤보 보너스:
                </strong>{' '}
                연속해서 블록을 터뜨리면 콤보 보너스 점수가 추가됩니다.
              </span>
            </li>
          </ul>
        </section>

        {/* 2. 아이템 및 기믹 설명 */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-orange-500">
            <Zap size={28} />
            <h2 className="text-2xl font-black">특수 블록 기믹</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <h4 className="font-black mb-2 flex items-center gap-2">
                💣 폭탄 블록
              </h4>
              <p className="text-xs text-zinc-500 leading-normal">
                &lsquo;폭탄&rsquo;을 입력하면 가장 위험한 맨 윗 줄을 통째로
                제거하고 점수를 획득합니다.
              </p>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <h4 className="font-black mb-2 flex items-center gap-2">
                ✨ 황금 블록
              </h4>
              <p className="text-xs text-zinc-500 leading-normal">
                일반 블록보다 10배 높은 점수를 주는 희귀한 보너스 블록입니다.
              </p>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <h4 className="font-black mb-2 flex items-center gap-2">
                🧱 스택 게이지
              </h4>
              <p className="text-xs text-zinc-500 leading-normal">
                현재 쌓인 블록 높이를 표시합니다. 천장에 가까워지면 경고가
                울립니다.
              </p>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <h4 className="font-black mb-2 flex items-center gap-2">
                🔥 콤보 시스템
              </h4>
              <p className="text-xs text-zinc-500 leading-normal">
                블록을 끊김 없이 연속으로 터뜨릴수록 더 큰 보너스를 얻습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 3. 데이터 저장 및 랭킹 시스템 */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-yellow-500">
            <Trophy size={28} />
            <h2 className="text-2xl font-black">실시간 랭킹 시스템</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            한글타자왕은 실시간 데이터베이스 기술을 활용하여 전 세계 유저들의
            점수를 투명하게 관리합니다.
          </p>
          <div className="flex items-start gap-4 p-5 bg-yellow-50 dark:bg-yellow-900/10 rounded-[2rem] border border-yellow-100 dark:border-yellow-900/20">
            <ShieldCheck className="text-yellow-600 shrink-0" size={24} />
            <div>
              <h4 className="font-black text-yellow-700 dark:text-yellow-500 text-sm mb-1">
                안전한 데이터 보존
              </h4>
              <p className="text-xs text-yellow-600/80 dark:text-yellow-500/60 leading-normal">
                로그인 후 플레이하시면 본인의 최고 점수, 최고 레벨, 최대 콤보
                기록이 서버에 영구적으로 보관되며, 실시간 랭킹보드에 본인의
                닉네임과 프로필이 자동으로 등록됩니다.
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
            <h2 className="text-2xl font-black">타자 연습 효과</h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0 font-black text-green-600">
                01
              </div>
              <p className="text-sm text-zinc-500 pt-2">
                <strong className="text-zinc-800 dark:text-zinc-200">
                  상황 판단력:
                </strong>{' '}
                여러 블록 중 가장 급한 단어를 빠르게 선택해 입력하는 훈련이 됩니다.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0 font-black text-green-600">
                02
              </div>
              <p className="text-sm text-zinc-500 pt-2">
                <strong className="text-zinc-800 dark:text-zinc-200">
                  정확도 개선:
                </strong>{' '}
                정확히 일치해야 블록이 터지므로 정확한 타건 습관을 기를 수 있습니다.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0 font-black text-green-600">
                03
              </div>
              <p className="text-sm text-zinc-500 pt-2">
                <strong className="text-zinc-800 dark:text-zinc-200">
                  어휘력 증진:
                </strong>{' '}
                기초 단어부터 사자성어까지 난이도별로 구성된 풍부한 단어 데이터를
                익힐 수 있습니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
