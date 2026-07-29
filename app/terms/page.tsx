import React from "react";
import Link from "next/link";
import { ChevronLeft, Scale, Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | 한글타자왕",
  description: "한글타자왕의 서비스 이용약관입니다. 서비스 이용에 필요한 권리와 의무를 확인하세요.",
  alternates: {
    canonical: 'https://www.hangul-tajawang.com/terms',
  }
};

// 매시간 재생성(ISR) → 2026-09-01 00:00(KST) 이후 재생성 시점에 개정판으로 자동 전환
export const revalidate = 3600;

const TRANSFER_DATE = new Date("2026-09-01T00:00:00+09:00");

export default function TermsOfService() {
  // 영업양도 시행일(2026-09-01) 이후 여부 — 운영자 정의·문의처·시행일자가 바뀐다
  const transferred = new Date() >= TRANSFER_DATE;
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans py-12 px-4">
      <div className="container mx-auto max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex flex-col items-center text-center">
          <Link prefetch={false} href="/" className="mb-6 self-start flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-blue-600 transition-colors">
            <ChevronLeft size={16} /> 홈으로 돌아가기
          </Link>
          <Scale size={48} className="text-blue-600 mb-4" />
          <h1 className="text-3xl font-black mb-2">이용약관</h1>
          <p className="text-zinc-500 text-sm font-medium">시행일자: {transferred ? "2026. 09. 01" : "2026. 07. 12"}</p>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-12 text-zinc-700 dark:text-zinc-300 leading-relaxed break-keep">
          {!transferred && (
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl p-5 text-sm text-blue-900 dark:text-blue-200">
              <strong>[개정 예고]</strong> 2026년 9월 1일자로 서비스 운영 주체가 블루커뮤니케이션즈 주식회사로
              변경(영업 양도)됨에 따라 본 약관의 운영자·문의처가 개정될 예정입니다. 자세한 내용은{" "}
              <Link prefetch={false} href="/notice/transfer" className="underline font-bold hover:text-blue-600 dark:hover:text-blue-300">
                운영 주체 변경 안내
              </Link>
              를 확인해 주세요.
            </div>
          )}
          <section>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              제1조 (목적)
            </h2>
            <p>
              본 약관은 '한글타자왕'(이하 "서비스")이 제공하는 타자 연습 및 관련 제반 서비스의 이용과 관련하여, 운영자와 이용자 간의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              {transferred && <> 본 약관에서 "운영자"란 서비스를 운영하는 블루커뮤니케이션즈 주식회사를 말합니다.</>}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              제2조 (서비스의 구성)
            </h2>
            <p className="mb-4">서비스는 다음과 같은 기능으로 구성되며, 운영자는 필요에 따라 기능을 추가·변경할 수 있습니다.</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>타자 연습:</strong> 자리·낱말·긴글 등 한글 타자 연습 기능</li>
              <li><strong>게임:</strong> 타자 실력을 겨루는 게임 및 점수 기록</li>
              <li><strong>필사·서재:</strong> 글을 따라 쓰는 필사 기능과 개인 서재(필사 기록) 보관</li>
              <li><strong>챌린지:</strong> 이용자가 직접 글·댓글·좋아요 등을 등록하는 참여형 콘텐츠</li>
              <li><strong>책방·오리지널 콘텐츠:</strong> 운영자가 제공하거나 투고를 통해 게재되는 읽기·필사용 콘텐츠</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              제3조 (계정 및 회원 가입)
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>이용자는 로그인 없이도 서비스의 주요 기능을 이용할 수 있으며, 카카오·구글 소셜 로그인을 통해 회원으로 가입할 수 있습니다.</li>
              <li>회원 가입 시 이용 기록(타자 기록·게임 점수·서재 기록 등)이 계정과 연동되어 저장됩니다.</li>
              <li>이용자는 언제든지 서비스 내 설정 또는 문의를 통해 탈퇴할 수 있으며, 탈퇴 시 개인정보는 개인정보 처리방침에 따라 처리됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              제4조 (이용자 생성 콘텐츠, UGC)
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>이용자가 챌린지 등에 직접 작성·등록한 글, 댓글 등(이하 "게시물")의 <strong>저작권은 작성자 본인에게 귀속</strong>됩니다.</li>
              <li>이용자는 서비스 내 노출·운영을 위하여 필요한 범위에서 게시물을 이용(게재·복제·전송)하는 것을 서비스에 허락합니다.</li>
              <li>이용자는 타인의 저작권·초상권 등 권리를 침해하거나 불법·명예훼손·혐오 표현 등 부적절한 내용을 게시할 수 없습니다.</li>
              <li>게시물에 대한 모든 법적 책임은 이를 등록한 이용자 본인에게 있습니다.</li>
              <li>서비스는 권리 침해 신고가 있거나 신고가 누적되는 등 부적절하다고 판단되는 게시물에 대해 노출 제한(블라인드) 또는 삭제 조치를 할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              제5조 (오리지널 콘텐츠 및 원고 투고)
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>이용자(작가)는 이메일을 통해 서비스에 원고를 투고할 수 있으며, <strong>투고작의 저작권은 작가에게 귀속</strong>됩니다.</li>
              <li>서비스는 작가의 게재 허락에 기반하여 선정된 원고를 서비스 내에 게재합니다.</li>
              <li>선정 시 필명이 함께 게재되며, 작가가 동의한 경우에 한하여 SNS·블로그 링크가 함께 표기될 수 있습니다.</li>
              <li>작가의 요청이 있을 경우 서비스는 해당 콘텐츠의 게재를 중단합니다.</li>
              <li>미선정 원고는 외부에 공개하거나 별도의 용도로 이용하지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              제6조 (서비스의 지적재산권)
            </h2>
            <p>서비스가 제공하는 디자인, UI/UX, 소프트웨어, 상표 및 운영자가 제작한 콘텐츠 등에 대한 지적재산권은 운영자에게 귀속됩니다. 이용자는 서비스를 이용함으로써 얻은 정보를 운영자 또는 권리자의 사전 승낙 없이 복제·송신·출판·배포할 수 없습니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              제7조 (광고 및 제휴 마케팅)
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>서비스는 운영을 위하여 카카오 애드핏(AdFit) 등을 통한 광고를 게재할 수 있습니다.</li>
              <li>
                서비스 내 일부 상품 추천 페이지는 쿠팡 파트너스 활동의 일환으로 운영되며,
                <strong> 이에 따른 일정액의 수수료를 제공받을 수 있습니다.</strong> 이는 이용자의 구매 가격에 영향을 주지 않습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              제8조 (면책조항)
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>서비스는 무료로 제공되며, "있는 그대로(AS-IS)" 제공됩니다.</li>
              <li>시스템 오류, 접속 장애, 데이터 손실 등으로 기록이 유실될 수 있으며, 서비스는 이로 인해 발생한 직·간접적 손해에 대하여 관련 법령이 허용하는 범위 내에서 책임을 지지 않습니다.</li>
              <li>운영자는 운영상·기술상의 필요에 따라 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              제9조 (약관의 변경)
            </h2>
            <p>운영자는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있으며, 약관을 변경할 경우 변경 사항의 시행 7일 전부터 서비스 내 공지를 통하여 고지합니다. 이용자에게 불리한 중요한 변경의 경우에는 최소 30일 전에 고지합니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              제10조 (준거법 및 관할)
            </h2>
            <p>본 약관은 대한민국 법령에 따라 규율되고 해석됩니다. 서비스 이용과 관련하여 분쟁이 발생할 경우, 운영자와 이용자는 상호 협의하여 해결하며, 협의가 이루어지지 않을 경우 관계 법령 및 상관례에 따릅니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              문의처
            </h2>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-700">
              <p className="text-sm mb-4 font-medium">이용약관, 저작권 신고 및 서비스 관련 문의는 아래 이메일로 연락해 주시기 바랍니다.</p>
              <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100 font-bold">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                  <Mail size={20} />
                </div>
                {transferred ? "bluecomms.ailab@gmail.com" : "withanalog@gmail.com"}
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 text-center flex justify-center gap-6 text-sm font-bold text-zinc-400">
          <Link prefetch={false} href="/privacy" className="hover:text-zinc-600 transition-colors">개인정보처리방침</Link>
          <span>·</span>
          <span>© 2026 {transferred ? "블루커뮤니케이션즈 주식회사" : "한글타자왕"}</span>
        </div>
      </div>
    </div>
  );
}
