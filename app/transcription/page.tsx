import { Metadata } from "next";
import { localeAlternates } from '@/lib/i18n/alternates';
import { LONG_TEXT_DB } from "@/lib/long-text-data";
import { getDailyPilsa, getKstDateString, getPilsaExcerpt } from "@/lib/daily-pilsa";
import Link from "next/link";
import { BookOpen, Edit3, Keyboard, CalendarDays, ArrowRight, Store } from "lucide-react";

// 오늘의 필사가 매일 갱신되도록 정적 캐시를 1시간마다 재검증
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "온라인 필사 - 한국 문학을 타이핑으로 필사하는 무료 필사 사이트",
  description:
    "윤동주, 김소월, 이육사 등 한국 문학 명작을 전문(全文) 그대로 타이핑 필사할 수 있는 무료 온라인 필사 사이트입니다. 원고지 감성 화면에서 필사하며 타수와 정확도 기록이 쌓입니다.",
  keywords: [
    "필사 사이트",
    "온라인 필사",
    "타이핑 필사",
    "디지털 필사",
    "필사 하기 좋은 글",
    "긴 글 타자 연습",
    "감성 필사",
    "무료 필사",
  ],
  alternates: localeAlternates('/transcription', 'ko'),
  openGraph: {
    title: "온라인 필사 - 한국 문학 타이핑 필사 | 한글타자왕",
    description:
      "원고지에 써내려가는 명문. 한국 문학 전문을 필사하고 나만의 기록을 쌓아보세요.",
    url: "https://www.hangul-tajawang.com/transcription",
  },
};

const PILSA_FAQ = [
  {
    q: "온라인 필사(타이핑 필사)란 무엇인가요?",
    a: "좋은 글을 키보드로 한 글자씩 따라 치는 필사입니다. 손글씨 필사처럼 문장을 천천히 곱씹으며 읽게 되는 것은 같지만, 손이 아프지 않고 타수·정확도·완필 기록이 데이터로 남는 것이 장점입니다. 한글타자왕에서는 원고지·한지 배경과 명조체 등 아날로그 감성 화면에서 필사할 수 있습니다.",
  },
  {
    q: "필사는 무료인가요?",
    a: "네, 모든 작품을 회원가입 없이 무료로 필사할 수 있습니다. 구글/카카오 로그인을 하면 필사 기록과 타자 속도 변화를 저장할 수 있습니다.",
  },
  {
    q: "어떤 글을 필사할 수 있나요?",
    a: "윤동주 '별 헤는 밤'·'서시', 김소월 '진달래꽃', 이육사 '광야', 한용운 '님의 침묵' 등 한국 문학 명작을 발췌가 아닌 전문(全文) 그대로 필사할 수 있습니다. 시·수필·소설·동화·명언 카테고리 55편이 준비되어 있고, 필사 챌린지에서는 다른 사용자가 올린 글로도 필사할 수 있습니다.",
  },
  {
    q: "타이핑 필사도 손글씨 필사만큼 효과가 있나요?",
    a: "필사의 핵심 효과인 '문장을 천천히 정독하며 문장 구조와 어휘를 몸에 익히는 것'은 타이핑 필사에서도 동일하게 일어납니다. 여기에 타자 실력 향상과 기록 축적이라는 타이핑만의 장점이 더해집니다. 손글씨 필사와 병행하면 더욱 좋습니다.",
  },
];

export default function TranscriptionPage() {
  const daily = getDailyPilsa();
  const dailyDate = getKstDateString();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PILSA_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="text-center mb-12 animate-in slide-in-from-bottom duration-700">
        <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-3">Transcription</p>
        <h1 className="serif-display text-4xl md:text-5xl font-bold mb-6">온라인 필사</h1>
        <p className="text-zinc-400 font-medium text-xl leading-relaxed">
          한국 문학 명작을 전문 그대로, 원고지 감성으로 필사하세요.{" "}
          <br className="hidden md:block" />
          필사할수록 타수와 정확도, 완필 기록이 쌓입니다.
        </p>
      </div>

      {/* 오늘의 필사 */}
      <Link
        prefetch={false}
        href={`/transcription/${daily.id}`}
        className="group block mb-14 p-8 md:p-10 rounded-2xl border border-primary/30 bg-surface-low hover:border-primary/60 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,74,198,0.12)] relative overflow-hidden"
      >
        <div className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
          <CalendarDays size={16} />
          <span>오늘의 필사 · {dailyDate}</span>
        </div>
        <h2 className="text-3xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
          {daily.title}
        </h2>
        <p className="text-sm font-bold text-zinc-400 flex items-center gap-2 mb-6">
          <BookOpen size={14} /> {daily.author} · {daily.wordCount}자
        </p>
        <p className="text-lg font-medium text-zinc-500 leading-loose line-clamp-2">
          {getPilsaExcerpt(daily)}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 font-bold text-primary">
          지금 필사하기 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>


      {/* 코어 유도 — 필사 오는 사람에게 지식타자 소개 */}
      <Link
        prefetch={false}
        href="/journey"
        className="group flex items-center gap-4 mb-10 px-6 py-5 rounded-2xl bg-surface-low border border-surface-high hover:border-primary/50 transition-all"
      >
        <div className="shrink-0 w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl" aria-hidden>🌏</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-on-surface break-keep">외우면서 치는 타자도 있어요 — 지식타자</p>
          <p className="text-sm font-medium text-zinc-500 break-keep">
            조선 왕조·세계 수도·주기율표를 타자로 정복하며 외웁니다.
          </p>
        </div>
        <ArrowRight size={18} className="shrink-0 text-primary group-hover:translate-x-1 transition-transform" />
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 연재(책방) 화는 책방에서만 진열 — 여기는 단편·시·수필만 */}
        {LONG_TEXT_DB.filter((text) => !text.seriesId).map((text, i) => (
          <Link prefetch={false}
            key={text.id}
            href={`/transcription/${text.id}`}
            className="group flex flex-col bg-surface-low p-8 rounded-2xl border border-surface-high hover:border-primary/50 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,74,198,0.1)] relative overflow-hidden"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 group-hover:scale-110">
              <Edit3 size={100} />
            </div>

            <div className="flex justify-between items-start mb-6 relative z-10">
              <span className="text-[11px] font-bold px-4 py-1.5 bg-surface-high text-zinc-300 rounded-full">{text.category}</span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 bg-surface-lowest px-3 py-1.5 rounded-full"><Keyboard size={12}/> {text.wordCount}자</span>
            </div>

            <h2 className="text-2xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors relative z-10">{text.title}</h2>
            <p className="text-sm font-bold text-zinc-400 flex items-center gap-2 mb-8 relative z-10"><BookOpen size={14}/> {text.author}</p>

            <div className="mt-auto pt-6 border-t border-surface-high text-sm font-medium text-zinc-500 line-clamp-3 leading-loose relative z-10">
              {text.content}
            </div>
          </Link>
        ))}
      </div>

      {/* 필사 안내 + FAQ (서버 렌더링, 크롤러와 사용자 모두에게 노출) */}
      <section className="mt-24 text-on-surface">
        <h2 className="text-3xl font-bold mb-6 tracking-tight">
          기록이 남는 필사, 한글타자왕
        </h2>
        <p className="text-lg text-zinc-600 leading-relaxed mb-12 max-w-3xl">
          한글타자왕의 온라인 필사는 한국 문학 명작을 <strong>발췌가 아닌 전문(全文)</strong>으로
          제공합니다. 원고지·한지 배경과 명조체 글꼴로 아날로그 감성을 살렸고, 필사하는 동안
          <strong> 타수와 정확도</strong>가 실시간으로 측정되어 나의 필사 기록이 차곡차곡 쌓입니다.
          매일 바뀌는 <strong>오늘의 필사</strong>로 필사 습관을 만들어 보세요. 다른 사람이 올린
          글로 필사하고 싶다면 <Link href="/challenge" className="text-primary font-bold hover:underline">필사 챌린지</Link>에
          참여할 수 있습니다.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold mb-8 tracking-tight">필사 자주 묻는 질문</h2>
        <dl className="space-y-6">
          {PILSA_FAQ.map((item) => (
            <div
              key={item.q}
              className="bg-surface-low p-6 md:p-8 rounded-2xl border border-surface-high"
            >
              <dt className="text-lg md:text-xl font-bold mb-3">{item.q}</dt>
              <dd className="text-zinc-600 leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
