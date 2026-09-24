import { Metadata } from 'next';
import { TypingFightGame } from '@/components/game/TypingFightGame';
import { GameJsonLd } from '@/components/seo/GameJsonLd';
import { Shield, Swords, Trophy, Zap } from 'lucide-react';
import { FIGHT_BOSSES } from '@/lib/typing-fight';

const URL = 'https://www.hangul-tajawang.com/game/typing-fight';

export const metadata: Metadata = {
  title: '타자 격투 - 보스와 싸우는 한글 타자 대전 게임',
  description:
    '단어를 쳐서 공격하고, 방어 단어로 보스의 공격을 막는 무료 한글 타자 격투 게임. 입문부터 마스터까지 5단계 보스를 차례로 쓰러뜨리고 사자성어 필살기로 마무리하세요.',
  keywords: ['타자 격투', '타자 대전 게임', '한글 타자 게임', '타자 싸움 게임', '무료 타자 게임', '보스전 타자', '한글타자왕'],
  alternates: { canonical: URL },
  openGraph: {
    title: '타자 격투 - 한글타자왕',
    description: '단어로 때리고 방어 단어로 막는다! 5단계 보스와 겨루는 한글 타자 격투.',
    url: URL,
  },
};

export default function TypingFightPage() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <GameJsonLd
        name="타자 격투"
        url={URL}
        description="단어를 입력해 공격하고 방어 단어로 보스의 공격을 막는 무료 온라인 한글 타자 격투 게임."
        genre={['격투', '타자 연습', '액션']}
      />
      <h1 className="sr-only">타자 격투 - 보스와 싸우는 한글 타자 대전 게임</h1>

      <TypingFightGame />

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-200 pt-16 pb-20">
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-amber-600">
            <Swords size={28} />
            <h2 className="text-2xl font-bold">타자 격투 게임 소개</h2>
          </div>
          <p className="text-zinc-600 leading-relaxed font-medium">
            <strong className="text-zinc-900">타자 격투</strong>는 5단계 보스와 1:1로 맞붙는 한글 타자 게임입니다.
            화면의 공격 단어를 정확히 치면 내 캐릭터가 달려들어 공격하고, 긴 단어일수록·콤보가 이어질수록
            데미지가 커집니다.
          </p>
          <ul className="space-y-3 text-sm text-zinc-500">
            <li className="flex items-start gap-2">
              <Shield size={16} className="text-sky-500 mt-0.5 shrink-0" />
              <span><strong className="text-zinc-800">방어:</strong> 보스가 공격 자세를 잡으면 빨간 방어 단어가 뜹니다. 제한 시간 안에 입력하면 막고 반격까지 합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap size={16} className="text-amber-500 mt-0.5 shrink-0" />
              <span><strong className="text-zinc-800">필살기:</strong> 공격과 방어로 게이지를 채우면 다음 공격 단어가 사자성어로 바뀝니다. 뜻을 보며 치면 큰 한 방!</span>
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-rose-500">
            <Trophy size={28} />
            <h2 className="text-2xl font-bold">5단계 보스</h2>
          </div>
          <ul className="space-y-2">
            {FIGHT_BOSSES.map((b) => (
              <li key={b.stage} className="flex items-center justify-between gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-sm">
                <span className="font-bold text-zinc-800">
                  {b.stage}. {b.name} <span className="text-xs text-zinc-400 font-medium">{b.title}</span>
                </span>
                <span className="text-xs text-zinc-500 shrink-0">
                  {b.grade} · 체력 {b.hp} · 방어 {b.window}초
                </span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-zinc-500 leading-relaxed">
            보스를 이길 때마다 다음 보스가 열립니다. 로그인 후 플레이하면 점수가 타자 격투 랭킹에 올라갑니다.
          </p>
        </section>
      </div>
    </div>
  );
}
