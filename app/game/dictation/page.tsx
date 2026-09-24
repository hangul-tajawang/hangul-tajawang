import { Metadata } from 'next';
import { DictationGame } from '@/components/game/DictationGame';
import { GameJsonLd } from '@/components/seo/GameJsonLd';
import { Ear, Layers, Lightbulb, Trophy } from 'lucide-react';

const URL = 'https://www.hangul-tajawang.com/game/dictation';

export const metadata: Metadata = {
  title: '받아쓰기 게임 - 듣고 쓰는 한글 맞춤법 타자 연습',
  description:
    '들려주는 말을 듣고 맞춤법에 맞게 타자로 쓰는 무료 받아쓰기 게임. 쉬운 낱말부터 같이·굳이·며칠처럼 소리와 글자가 다른 말, 속담 문장까지 3단계로 도전하고 오답 노트로 복습하세요.',
  keywords: ['받아쓰기', '받아쓰기 게임', '온라인 받아쓰기', '맞춤법 받아쓰기', '한글 받아쓰기 연습', '맞춤법 게임', '한글타자왕'],
  alternates: { canonical: URL },
  openGraph: {
    title: '받아쓰기 게임 - 한글타자왕',
    description: '듣고 쓰는 맞춤법 받아쓰기! 쉬움·보통·어려움 3단계와 오답 노트.',
    url: URL,
  },
};

export default function DictationPage() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <GameJsonLd
        name="받아쓰기"
        url={URL}
        description="들려주는 말을 듣고 맞춤법에 맞게 타자로 입력하는 무료 온라인 받아쓰기 게임."
        genre={['교육', '타자 연습', '맞춤법']}
      />
      <h1 className="sr-only">받아쓰기 게임 - 듣고 쓰는 한글 맞춤법 타자 연습</h1>

      <DictationGame />

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-200 pt-16 pb-20">
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-violet-600">
            <Ear size={28} />
            <h2 className="text-2xl font-bold">받아쓰기 게임 소개</h2>
          </div>
          <p className="text-zinc-600 leading-relaxed font-medium">
            <strong className="text-zinc-900">받아쓰기</strong>는 화면에 글자를 보여주지 않고 소리만 들려주는
            타자 게임입니다. 들은 말을 맞춤법에 맞게 입력하고 Enter를 누르면 바로 채점되고, 틀린 문제는
            왜 그렇게 쓰는지 해설이 나옵니다. 빈 칸에서 Enter를 누르면 한 번 더 들을 수 있어요.
          </p>
          <p className="text-zinc-600 leading-relaxed font-medium">
            소리를 켤 수 없는 곳에서는 <strong className="text-zinc-900">소리 없이 하기</strong>를 켜 보세요.
            글자가 잠깐 나타났다 사라지면 기억해서 쓰는 방식으로 진행됩니다.
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-pink-500">
            <Layers size={28} />
            <h2 className="text-2xl font-bold">난이도 3단계</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <h3 className="font-bold mb-1">쉬움</h3>
              <p className="text-xs text-zinc-500 leading-normal">바다·무지개처럼 소리 나는 대로 쓰는 낱말. 다시 듣기 무제한.</p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <h3 className="font-bold mb-1">보통</h3>
              <p className="text-xs text-zinc-500 leading-normal">같이[가치]·국물[궁물]처럼 소리와 글자가 다른 말과 헷갈리는 맞춤법.</p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <h3 className="font-bold mb-1">어려움</h3>
              <p className="text-xs text-zinc-500 leading-normal">속담과 문장 받아쓰기. 다시 듣기 1번, 문제당 30초.</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-amber-500">
            <Lightbulb size={28} />
            <h2 className="text-2xl font-bold">채점 방식</h2>
          </div>
          <ul className="space-y-3 text-sm text-zinc-500">
            <li className="flex items-start gap-2">
              <span className="text-violet-500 mt-1">✔</span>
              <span><strong className="text-zinc-800">글자가 모두 맞으면 정답:</strong> 마침표·물음표 같은 문장부호는 채점하지 않습니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-500 mt-1">✔</span>
              <span><strong className="text-zinc-800">띄어쓰기:</strong> 글자는 맞고 띄어쓰기만 다르면 정답으로 치되 점수가 절반입니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-500 mt-1">✔</span>
              <span><strong className="text-zinc-800">한 문제에 3번 도전:</strong> 틀리면 바로 다시 쓸 수 있고, 3번 모두 틀리거나 시간이 지나면 목숨(3개)이 하나 줄어듭니다. 다시 도전해서 맞히면 점수는 조금 줄어요.</span>
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-yellow-500">
            <Trophy size={28} />
            <h2 className="text-2xl font-bold">점수와 랭킹</h2>
          </div>
          <p className="text-zinc-600 leading-relaxed font-medium">
            어려운 단계일수록 기본 점수가 높고, 빨리 쓸수록·연속으로 맞힐수록 보너스가 붙습니다. 다시 듣기를
            쓰면 조금 감점돼요. 로그인 후 플레이하면 최고 점수가 받아쓰기 랭킹에 올라갑니다.
          </p>
        </section>
      </div>
    </div>
  );
}
