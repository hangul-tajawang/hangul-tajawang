import React from "react";
import { ShieldCheck, Volume2, ShoppingCart, Zap, ArrowRight, Info, CheckCircle2, ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AULA 독거미 유선 기계식 키보드 리뷰 - 가성비 기계식의 표준 | 한글타자왕",
  description: "'독거미'라는 별명으로 국민 가성비 기계식이 된 AULA 키보드 리뷰. 타자 연습에서 기계식 타건감이 왜 무기가 되는지, 어떤 분에게 맞는지 정리했습니다.",
  keywords: ["AULA 독거미", "독거미 키보드", "가성비 기계식 키보드", "타자연습 키보드", "KTT 스위치", "기계식 키보드 추천"],
  alternates: {
    canonical: 'https://www.hangul-tajawang.com/recommend/aula-dokgeomi',
  }
};

export default function AulaDokgeomiPage() {
  const coupangLink = "https://link.coupang.com/a/fhiFpe5kwS";

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
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">The People&apos;s Mechanical</span>
          <h1 className="display-lg text-on-surface mb-12 leading-tight tracking-[-0.02em]">
            AULA 독거미: <br />
            <span className="text-primary italic">국민 가성비 기계식</span>의 이유
          </h1>
        </div>

        {/* Hero Image: 실사용 사진 */}
        <div className="relative group max-w-4xl mx-auto w-full">
          <div className="bg-on-surface rounded-[3rem] md:rounded-[4rem] p-4 shadow-2xl overflow-hidden relative">
            <div className="aspect-video bg-zinc-900 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative">
              <Image
                src="/keyboard/aura.jpg"
                alt="AULA 독거미 기계식 키보드 실사용 모습"
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                priority
              />
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-full shadow-xl flex items-center gap-3">
            <Sparkles size={18} className="text-primary" />
            <span className="text-on-surface font-black text-[10px] uppercase tracking-widest whitespace-nowrap">직접 쓰고 있는 실사용 컷</span>
          </div>
        </div>
      </section>

      {/* Educational Rationale */}
      <section className="bg-on-surface py-32 md:py-48 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
          <Zap size={400} />
        </div>
        <div className="container mx-auto max-w-4xl px-4 md:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-8 block underline decoration-4 decoration-primary/20 underline-offset-8">Why Mechanical</span>
          <h2 className="display-lg !text-3xl md:!text-5xl mb-12 leading-tight tracking-[-0.02em]">
            타자 연습이 즐거워지는 순간은 <br className="hidden md:block" />
            &apos;타건감&apos;이 바뀔 때 옵니다
          </h2>

          <div className="space-y-16 text-zinc-400 font-medium text-lg md:text-xl leading-relaxed tracking-[-0.01em]">
            <p>
              연습을 습관으로 만드는 데 가장 중요한 건<br className="hidden md:block" />
              의지가 아니라 <span className="text-white font-bold">&apos;치는 맛&apos;</span>입니다.<br /><br />
              키 하나하나가 명확하게 끊어지는 기계식 특유의 피드백은<br className="hidden md:block" />
              같은 30분 연습도 다른 경험으로 만들어줍니다.
            </p>
            <p>
              &apos;독거미&apos;라는 별명으로 불리는 AULA 시리즈는<br className="hidden md:block" />
              커뮤니티에서 <span className="text-primary font-bold">가성비 기계식의 표준</span>처럼 자리잡았습니다.<br /><br />
              이 모델은 그중에서도 군더더기를 덜어낸 <span className="text-white font-bold">유선 버전</span>이라<br className="hidden md:block" />
              지연 걱정 없이 자리에 두고 쓰는 연습용으로 잘 맞습니다.
            </p>
            <p>
              한글 정각 키캡이라 자판을 익히는 단계에서도 부담이 없고,<br className="hidden md:block" />
              부드럽게 눌리는 KTT 스위치는<br /><br />
              장시간 타이핑에서도 손가락 피로를<br className="hidden md:block" />
              크게 줄여줍니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            <RationaleCard icon={<Zap />} label="타건감" desc="명확한 키 피드백의 기계식" />
            <RationaleCard icon={<ShieldCheck />} label="유선 안정성" desc="입력 지연 걱정 없는 연결" />
            <RationaleCard icon={<Volume2 />} label="치는 맛" desc="연습을 습관으로 만드는 소리" />
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
                src="/keyboard/aura.jpg"
                alt="AULA 독거미 기계식 키보드"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 primary-gradient opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
            </div>
            <div className="mt-12 space-y-4 text-center lg:text-left">
              <h3 className="editorial-heading text-2xl">Solid & Classic</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                화이트·네이비 투톤의 클래식한 배색. <br />
                책상 위에 올려두는 것만으로 연습할 이유가 하나 늘어납니다.
              </p>
            </div>
          </div>

          {/* Features & CTA */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Product Spotlight</span>
              <h2 className="display-lg !text-4xl lg:!text-6xl mb-8 leading-tight tracking-[-0.02em]">AULA 독거미 <br className="lg:hidden" />유선 기계식</h2>
              <div className="flex flex-wrap gap-3 mb-10">
                <Badge label="Mechanical" />
                <Badge label="KTT Switch" />
                <Badge label="한글 정각" />
                <Badge label="Wired" />
              </div>
              <p className="text-zinc-500 font-medium text-xl leading-relaxed tracking-tight">
                &quot;기계식은 비싸다는 편견을 부순 키보드.&quot; <br />
                멤브레인에서 넘어와 처음 기계식을 경험하기에 가장 부담 없는 선택지입니다.
                타자 연습의 재미가 달라지는 걸 손끝으로 느껴보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-low p-8 rounded-[2.5rem]">
                <h4 className="text-primary font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Key Merits
                </h4>
                <ul className="space-y-4 text-on-surface text-sm font-bold">
                  <li>• 이 가격대에서 만나기 힘든 기계식 타건감</li>
                  <li>• 부드럽고 피로가 적은 KTT 스위치</li>
                  <li>• 자판 학습에 유리한 한글 정각 키캡</li>
                  <li>• 유선 연결의 안정적인 입력 반응</li>
                </ul>
              </div>
              <div className="bg-surface-highest p-8 rounded-[2.5rem]">
                <h4 className="text-zinc-400 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Info size={16} /> The Trade-off
                </h4>
                <ul className="space-y-4 text-zinc-400 text-sm font-bold">
                  <li>• 멤브레인 대비 또렷한 타건음</li>
                  <li>• 무선을 원한다면 상위 모델 고려</li>
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
