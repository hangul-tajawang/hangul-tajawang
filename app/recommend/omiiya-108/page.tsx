import React from "react";
import { ShieldCheck, VolumeX, Zap, ArrowRight, Info, CheckCircle2, ChevronLeft, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMIIYA 108키 멤브레인 저소음 키보드 리뷰 - 사무실 연습용 추천 | 한글타자왕",
  description: "사무실에서 눈치 보지 않고 타자 연습할 수 있는 OMIIYA 유선 108키 풀배열 멤브레인 저소음 키보드 리뷰. 조용한 환경에서 연습량을 쌓아야 하는 분들을 위한 선택.",
  keywords: ["OMIIYA 키보드", "저소음 키보드", "멤브레인 키보드 추천", "사무용 키보드", "타자연습 키보드", "풀배열 키보드"],
  alternates: {
    canonical: 'https://www.hangul-tajawang.com/recommend/omiiya-108',
  }
};

export default function Omiiya108Page() {
  const coupangLink = "https://link.coupang.com/a/fhiCb6oW6K";

  return (
    <div className="bg-surface overflow-x-hidden min-h-screen pb-24">
      {/* Header / Navigation Back */}
      <nav className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8">
        <Link prefetch={false} href="/recommend" className="inline-flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors font-black text-xs uppercase tracking-widest group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
        </Link>
      </nav>

      {/* Hero */}
      <section className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="flex flex-col items-center text-center">
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">The Silent Worker</span>
          <h1 className="display-lg text-on-surface mb-12 leading-tight tracking-[-0.02em]">
            OMIIYA 108: <br />
            <span className="text-primary italic">사무실의 정적</span>을 지키는 키보드
          </h1>
        </div>

        {/* Hero Image */}
        <div className="relative group max-w-4xl mx-auto w-full">
          <div className="bg-on-surface rounded-[3rem] md:rounded-[4rem] p-4 shadow-2xl overflow-hidden relative">
            <div className="aspect-video bg-surface-low rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative">
              <Image
                src="/keyboard/omiiya.png"
                alt="OMIIYA 유선 108키 풀배열 멤브레인 저소음 키보드"
                fill
                className="object-contain p-6 group-hover:scale-[1.03] transition-transform duration-700"
                priority
              />
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-full shadow-xl flex items-center gap-3">
            <VolumeX size={18} className="text-primary" />
            <span className="text-on-surface font-black text-[10px] uppercase tracking-widest whitespace-nowrap">옆자리가 모르는 저소음</span>
          </div>
        </div>
      </section>

      {/* Educational Rationale */}
      <section className="bg-on-surface py-32 md:py-48 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
          <Building2 size={400} />
        </div>
        <div className="container mx-auto max-w-4xl px-4 md:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-8 block underline decoration-4 decoration-primary/20 underline-offset-8">The Office Problem</span>
          <h2 className="display-lg !text-3xl md:!text-5xl mb-12 leading-tight tracking-[-0.02em]">
            연습량이 가장 많이 쌓이는 곳은 <br className="hidden md:block" />
            사실 &apos;사무실&apos;입니다
          </h2>

          <div className="space-y-16 text-zinc-400 font-medium text-lg md:text-xl leading-relaxed tracking-[-0.01em]">
            <p>
              하루 중 키보드를 가장 오래 만지는 시간은<br className="hidden md:block" />
              연습 시간이 아니라 <span className="text-white font-bold">업무 시간</span>입니다.<br /><br />
              그래서 사무실 키보드가 편해지면<br className="hidden md:block" />
              타자 실력은 저절로 쌓입니다.
            </p>
            <p>
              문제는 소리죠. 기계식의 경쾌한 타건음은<br className="hidden md:block" />
              조용한 사무실에서는 <span className="text-white font-bold">민폐</span>가 되기 쉽습니다.<br /><br />
              멤브레인 방식의 OMIIYA 108은 특유의 낮고 조용한 키음으로<br className="hidden md:block" />
              <span className="text-primary font-bold">옆자리 눈치 없이</span> 마음껏 칠 수 있게 해줍니다.
            </p>
            <p>
              숫자패드까지 갖춘 108키 풀배열이라<br className="hidden md:block" />
              엑셀 작업이 많은 사무 환경에 그대로 맞고,<br /><br />
              유선 연결이라 페어링이나 배터리 관리 없이<br className="hidden md:block" />
              꽂으면 바로 씁니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            <RationaleCard icon={<VolumeX />} label="저소음" desc="조용한 사무실에서도 부담 없는 키음" />
            <RationaleCard icon={<Building2 />} label="풀배열" desc="숫자패드 포함 108키 사무 표준" />
            <RationaleCard icon={<Zap />} label="간편함" desc="꽂으면 끝나는 유선 연결" />
          </div>
        </div>
      </section>

      {/* Product Details & Conversion */}
      <section className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-32 md:py-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Product Image */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-square bg-surface-low rounded-[4rem] p-12 relative overflow-hidden shadow-inner group transition-all hover:scale-[1.02]">
              <Image
                src="/keyboard/omiiya.png"
                alt="OMIIYA 108키 멤브레인 키보드"
                fill
                className="object-contain p-8 group-hover:rotate-3 transition-transform duration-700"
              />
              <div className="absolute inset-0 primary-gradient opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
            </div>
            <div className="mt-12 space-y-4 text-center lg:text-left">
              <h3 className="editorial-heading text-2xl">Quiet Confidence</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                블랙 베이스에 베이지·핑크 투톤 키캡. <br />
                소리는 조용하지만 디자인은 확실한 포인트가 됩니다.
              </p>
            </div>
          </div>

          {/* Features & CTA */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Product Spotlight</span>
              <h2 className="display-lg !text-4xl lg:!text-6xl mb-8 leading-tight tracking-[-0.02em]">OMIIYA 108 <br className="lg:hidden" />저소음 멤브레인</h2>
              <div className="flex flex-wrap gap-3 mb-10">
                <Badge label="Silent Membrane" />
                <Badge label="108 Full Layout" />
                <Badge label="Wired" />
                <Badge label="Office Ready" />
              </div>
              <p className="text-zinc-500 font-medium text-xl leading-relaxed tracking-tight">
                &quot;업무 시간이 곧 연습 시간이 되는 키보드.&quot; <br />
                화려한 기능 대신 조용함과 편안함에 집중한 실속형입니다.
                사무실 책상에서 하루 8시간, 가장 오래 쓰는 도구부터 바꿔보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-low p-8 rounded-[2.5rem]">
                <h4 className="text-primary font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Key Merits
                </h4>
                <ul className="space-y-4 text-on-surface text-sm font-bold">
                  <li>• 사무실에서 부담 없는 저소음 키음</li>
                  <li>• 숫자패드 포함 108키 풀배열</li>
                  <li>• 페어링·배터리 없는 유선의 간편함</li>
                  <li>• 부담 없는 가격의 실속형 구성</li>
                </ul>
              </div>
              <div className="bg-surface-highest p-8 rounded-[2.5rem]">
                <h4 className="text-zinc-400 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Info size={16} /> The Trade-off
                </h4>
                <ul className="space-y-4 text-zinc-400 text-sm font-bold">
                  <li>• 기계식의 명확한 클릭감은 없음</li>
                  <li>• 풀배열이라 좁은 책상엔 자리 차지</li>
                </ul>
              </div>
            </div>

            <div className="pt-12 border-t border-surface-high">
              <div className="flex flex-col gap-8">
                <a
                  href={coupangLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-12 py-7 primary-gradient text-white text-xl font-black rounded-full shadow-2xl shadow-primary/30 transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center justify-between w-full"
                >
                  <span>쿠팡 최저가 확인하기</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </a>
                <div className="text-center">
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest leading-relaxed">
                    💡 이 포스팅은 쿠팡 파트너스 활동의 일환으로,<br className="sm:hidden" /> 이에 따른 일정액의 수수료를 제공받습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function RationaleCard({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="p-8 bg-white/5 rounded-3xl text-center backdrop-blur-sm">
      <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h4 className="font-black text-lg mb-2">{label}</h4>
      <p className="text-zinc-500 text-sm font-medium">{desc}</p>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="px-4 py-2 bg-surface-low text-on-surface text-[10px] font-black rounded-xl uppercase tracking-widest border border-surface-high shadow-sm">
      {label}
    </span>
  );
}
