import type { Metadata } from 'next';
import { ENGLISH_OPEN_GRAPH } from '@/lib/i18n/english-metadata';
import { TypingRaceGame } from '@/components/game/TypingRaceGame';
import { GameJsonLd } from '@/components/seo/GameJsonLd';
import { GamePageShell } from '../GamePageShell';
import { localeAlternates } from '@/lib/i18n/alternates';

export const metadata: Metadata = {
  title: 'Typing Race - Korean Typing Speed Race Game (Free)',
  description:
    'Play Typing Race free online: race a snail, rabbit, rhino, and bluebird by typing Korean sentences. See your real CPM compared live — the friendliest Korean typing game for beginners.',
  keywords: ['korean typing game', 'typing race game', 'typing speed game', 'hangul typing game for beginners'],
  alternates: localeAlternates('/game/typing-race', 'en'),
  openGraph: {
    ...ENGLISH_OPEN_GRAPH,
    title: 'Typing Race - Korean Typing Speed Race',
    description: 'Type Korean sentences to outrun four animal racers and see how your typing speed stacks up.',
    url: 'https://www.hangul-tajawang.com/en/game/typing-race',
    locale: 'en_US',
    siteName: 'Hangul Tajawang',
  },
};

export default function EnTypingRacePage() {
  return (
    <>
      <GameJsonLd
        name="Korean Typing Race"
        alternateName="타자 레이스"
        url="https://www.hangul-tajawang.com/en/game/typing-race"
        description="Race animal runners at fixed speeds by typing Korean sentences — a beginner-friendly way to benchmark your CPM."
        genre={['Racing', 'Typing Practice', 'Casual']}
        inLanguage={["en", "ko"]}
        publisherName="Hangul Tajawang"
        priceCurrency="USD"
      />
      <GamePageShell
        eyebrow="Korean Typing Game"
        title="Typing Race"
        tagline="Snail, rabbit, rhino, or bluebird — which one can your typing speed actually beat?"
        howTo={[
          'Type the Korean sentence shown to run your frog toward the finish line — a typo trips you until you fix it.',
          'The snail, rabbit, rhino, and bluebird run at fixed speeds (200, 350, 500, and 750 CPM).',
          'Beat an animal and you know your real typing level — no test anxiety required.',
          'The friendliest place to start if time-pressure games feel stressful.',
        ]}
      >
        <TypingRaceGame />
      </GamePageShell>
    </>
  );
}
