import React from "react";
import Link from "next/link";
import { ChevronLeft, Building2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 운영 주체 변경(영업 양도)에 따른 개인정보 이전 안내",
  description: "한글타자왕 서비스의 운영 주체가 블루커뮤니케이션즈 주식회사로 변경됨에 따른 개인정보 이전 안내입니다.",
  alternates: {
    canonical: "https://www.hangul-tajawang.com/notice/transfer",
  },
};

// 개인정보 보호법 제27조에 따른 법정 고지 페이지 — 이전일(2026-08-29) 이후에도 30일 이상 게재 유지
export default function TransferNoticePage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-zinc-900 font-sans py-12 px-4">
      <div className="container mx-auto max-w-3xl bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden">
        <div className="p-8 border-b border-zinc-100 bg-zinc-50/50 flex flex-col items-center text-center">
          <Link prefetch={false} href="/" className="mb-6 self-start flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-blue-600 transition-colors">
            <ChevronLeft size={16} /> 홈으로 돌아가기
          </Link>
          <Building2 size={48} className="text-blue-600 mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold mb-2 break-keep">
            서비스 운영 주체 변경(영업 양도)에 따른<br />개인정보 이전 안내
          </h1>
          <p className="text-zinc-500 text-sm font-medium">게시일: 2026. 07. 29 · 이전일: 2026. 08. 29</p>
        </div>

        <div className="p-8 md:p-12 space-y-10 text-zinc-700 leading-relaxed break-keep">
          <section>
            <p>
              안녕하세요, 한글타자왕입니다. 그동안 개인 개발자가 운영해 온 한글타자왕 웹사이트 및 모바일 앱(한글타자왕) 서비스가
              <strong> 2026년 8월 29일(예정)자로 블루커뮤니케이션즈 주식회사에 양도</strong>되어 운영 주체가 변경될 예정입니다. 기존 개발자는 블루커뮤니케이션즈 주식회사 소속 개발자로 합류하여 지금과 동일하게 서비스 개발과 운영을 계속 이어갑니다.
            </p>
            <p className="mt-3">
              이에 「개인정보 보호법」 제27조에 따라 회원님의 개인정보 이전에 관한 사항을 아래와 같이 안내드립니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              1. 개인정보가 이전된다는 사실
            </h2>
            <p>
              서비스가 보유한 회원 정보(이메일, 닉네임, 프로필 이미지)와 서비스 이용 기록(타자 연습 기록, 게임 점수,
              필사 서재 기록, 게시글·댓글 등)은 <strong>이전 예정일(2026년 8월 29일 예정)자로 아래 양수인에게 이전</strong>됩니다.
              이전 이후에도 회원님의 계정과 기록은 그대로 유지되며, 서비스는 동일하게 이용하실 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              2. 개인정보를 이전받는 자
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>상호:</strong> 블루커뮤니케이션즈 주식회사</li>
              <li><strong>주소:</strong> 경기도 의정부시 둔야로33번길 12, 동부빌딩 2층</li>
              <li><strong>전화번호:</strong> 010-4756-2618</li>
              <li><strong>이메일:</strong> bluecomms.ailab@gmail.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              3. 이전을 원하지 않으시는 경우
            </h2>
            <p>
              개인정보 이전을 원하지 않으시는 회원님께서는 <strong>이전일 전까지</strong> 아래 방법으로
              동의를 철회(회원 탈퇴)하실 수 있습니다. 탈퇴 시 회원님의 개인정보는 이전 대상에서 제외되며,
              개인정보 처리방침에 따라 파기됩니다.
            </p>
            <ul className="list-disc ml-6 space-y-2 mt-3">
              <li>서비스 내 <strong>마이페이지 → 회원 탈퇴</strong></li>
              <li>이메일 요청: <strong>bluecomms.ailab@gmail.com</strong></li>
            </ul>
          </section>

          <section className="pt-2 border-t border-zinc-100">
            <p className="text-sm text-zinc-500">
              운영 주체 변경 이후 개인정보 처리방침과 이용약관은 변경 시행일에 맞추어 개정·공지됩니다.
              본 안내와 관련하여 궁금하신 점은 위 이메일로 문의해 주시기 바랍니다. 그동안 한글타자왕을
              아껴주셔서 감사드리며, 더 나은 서비스로 보답하겠습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
