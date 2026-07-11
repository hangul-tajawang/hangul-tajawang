import React from "react";
import { Feather, Bluetooth, Zap, ArrowRight, Info, CheckCircle2, ChevronLeft, BadgeCheck, Ruler } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "한성 GK868B 무접점 키보드 3년 실사용 후기 - 개발자의 솔직 리뷰 | 한글타자왕",
  description: "매일 6시간씩 3년을 함께한 한성 GK868B 무접점 키보드 실사용 후기. 35g 키압의 장점, 보글보글 타건음, 그리고 솔직한 단점(블루투스, 맥 백틱)까지 전부 담았습니다.",
  keywords: ["한성 GK868B", "GK868B 후기", "무접점 키보드 추천", "무접점 키보드", "텐키리스 키보드", "35g 키압", "한성 무접점"],
  alternates: {
    canonical: 'https://www.hangul-tajawang.com/recommend/hansung-gk868b',
  }
};

export default function HansungGk868bPage() {
  const coupangLink = "https://link.coupang.com/a/fhNhtEcHpQ";

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
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">3-Year Daily Driver</span>
          <h1 className="display-lg text-on-surface mb-8 leading-tight tracking-[-0.02em]">
            한성 GK868B: <br />
            <span className="text-primary italic">3년을 함께한</span> 첫 무접점
          </h1>
          <p className="text-zinc-500 font-medium text-lg max-w-2xl mb-12 leading-relaxed">
            리뷰용으로 잠깐 만져본 게 아닙니다. 개발자로 일하며 매일 6시간 이상,
            3년을 두드리고 쓰는 진짜 사용기입니다.
          </p>
        </div>

        {/* Hero Image: 실사용 사진 */}
        <div className="relative group max-w-4xl mx-auto w-full">
          <div className="bg-on-surface rounded-[3rem] md:rounded-[4rem] p-4 shadow-2xl overflow-hidden relative">
            <div className="aspect-video bg-zinc-900 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative">
              <Image
                src="/keyboard/gk868b-1.jpg"
                alt="한성 GK868B 무접점 키보드 3년 실사용 모습"
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                priority
              />
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-full shadow-xl flex items-center gap-3">
            <BadgeCheck size={18} className="text-primary" />
            <span className="text-on-surface font-black text-[10px] uppercase tracking-widest whitespace-nowrap">2022년부터 실사용 중인 제 키보드입니다</span>
          </div>
        </div>
      </section>

      {/* Story / Rationale */}
      <section className="bg-on-surface py-32 md:py-48 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
          <Feather size={400} />
        </div>
        <div className="container mx-auto max-w-4xl px-4 md:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-8 block underline decoration-4 decoration-primary/20 underline-offset-8">Why Topre-style</span>
          <h2 className="display-lg !text-3xl md:!text-5xl mb-12 leading-tight tracking-[-0.02em]">
            &apos;무접점&apos;이라는 단어에 <br className="hidden md:block" />
            이끌린 건 정답이었습니다
          </h2>

          <div className="space-y-16 text-zinc-400 font-medium text-lg md:text-xl leading-relaxed tracking-[-0.01em]">
            <p>
              시작은 선배 개발자의 한마디였습니다.<br className="hidden md:block" />
              축이 뭔지도 모르던 시절, <span className="text-white font-bold">&apos;무접점&apos;</span>이라는 단어와<br /><br />
              <span className="text-primary font-bold">보글보글</span> 끓는 듯한 특유의 타건음에<br className="hidden md:block" />
              이끌려 선택했습니다.
            </p>
            <p>
              3년이 지난 지금 가장 잘한 선택은 <span className="text-white font-bold">35g 키압</span>입니다.<br className="hidden md:block" />
              깃털처럼 가볍게 눌리는 키는<br /><br />
              하루 6시간 이상의 타이핑에서도<br className="hidden md:block" />
              손가락과 손목의 피로를 확실히 줄여줍니다.
            </p>
            <p>
              숫자패드가 없는 텐키리스 배열은<br className="hidden md:block" />
              마우스까지의 거리를 줄여서,<br /><br />
              어깨와 팔의 이동 동선이 짧아지고<br className="hidden md:block" />
              장시간 작업의 피로가 눈에 띄게 덜합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            <RationaleCard icon={<Feather />} label="35g 키압" desc="깃털 같은 가벼움, 적은 피로" />
            <RationaleCard icon={<Zap />} label="무접점 타건감" desc="보글보글 특유의 타건음" />
            <RationaleCard icon={<Ruler />} label="텐키리스" desc="짧아진 마우스 동선" />
          </div>
        </div>
      </section>

      {/* Product Details & Conversion */}
      <section className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-32 md:py-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Product Image */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-square bg-surface-low rounded-[4rem] relative overflow-hidden shadow-inner group transition-all hover:scale-[1.02]">
              <Image
                src="/keyboard/gk868b-2.jpg"
                alt="한성 GK868B 키보드 키캡 클로즈업"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 primary-gradient opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
            </div>
            <div className="mt-12 space-y-4 text-center lg:text-left">
              <h3 className="editorial-heading text-2xl">Grey & Beige</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                3년을 써도 질리지 않는 회색·베이지 투톤. <br />
                주변에서 예쁘다는 말을 가장 많이 들은 키보드입니다.
              </p>
            </div>
          </div>

          {/* Features & CTA */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Product Spotlight</span>
              <h2 className="display-lg !text-4xl lg:!text-6xl mb-8 leading-tight tracking-[-0.02em]">한성 GK868B <br className="lg:hidden" />무접점</h2>
              <div className="flex flex-wrap gap-3 mb-10">
                <Badge label="무접점 (Topre-style)" />
                <Badge label="35g 키압" />
                <Badge label="Tenkeyless" />
                <Badge label="USB-C / Bluetooth" />
              </div>
              <p className="text-zinc-500 font-medium text-xl leading-relaxed tracking-tight">
                &quot;3년을 매일 6시간씩 쓰고 내리는 결론.&quot; <br />
                가볍게 오래 치는 것이 목적이라면, 35g 무접점은 다른 방식으로 돌아가기 어렵게 만듭니다.
                기계식과는 또 다른 세계를 경험해 보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-low p-8 rounded-[2.5rem]">
                <h4 className="text-primary font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                  <CheckCircle2 size={16} /> 3년 실사용 장점
                </h4>
                <ul className="space-y-4 text-on-surface text-sm font-bold">
                  <li>• 보글보글한 무접점 특유의 타건음과 부드러운 키감</li>
                  <li>• 35g 저키압 — 장시간 타이핑에도 손목 피로가 적음</li>
                  <li>• 텐키리스로 짧아진 마우스 동선, 어깨 피로 감소</li>
                  <li>• 질리지 않는 회색·베이지 톤 디자인</li>
                </ul>
              </div>
              <div className="bg-surface-highest p-8 rounded-[2.5rem]">
                <h4 className="text-zinc-400 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Info size={16} /> 솔직한 단점
                </h4>
                <ul className="space-y-4 text-zinc-400 text-sm font-bold">
                  <li>• 맥 사용자는 백틱(`) 등 일부 키 맵핑 설정 필요</li>
                  <li>• 여러 기기를 오가면 블루투스 재연동이 번거로움 (한 곳 고정 사용 추천)</li>
                  <li>• 무접점 입문 가격대가 기계식보다 높은 편</li>
                </ul>
              </div>
            </div>

            {/* Bluetooth honest note */}
            <div className="bg-surface-low/60 rounded-[2.5rem] p-8 flex items-start gap-4">
              <Bluetooth size={20} className="text-primary shrink-0 mt-1" />
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                <span className="text-on-surface font-bold">블루투스 팁</span> — 한 장소에 고정해두고 쓰면 전원만 켜도 바로 연결되어 편합니다.
                다만 회사·집을 오가며 기기를 바꿔 페어링했더니 재연동이 번거로웠어요.
                저는 결국 USB-C 유선으로 정착했고, 배터리 걱정 없이 오히려 마음이 편합니다.
              </p>
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
