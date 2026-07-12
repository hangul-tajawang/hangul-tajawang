"use client";

import React, { useState } from "react";
import { Mail, Copy, Check, Gift, BookOpen, Feather, ShieldCheck, Megaphone } from "lucide-react";

// 투고 접수 이메일 — 여기 한 곳만 바꾸면 페이지 전체에 반영됩니다.
const SUBMIT_EMAIL = "withanalog@gmail.com";

const MAIL_SUBJECT = "[한글타자왕 투고] 작품 제목 - 필명";
const MAIL_BODY = `1. 작품 제목:
2. 필명(게재용):
3. 분류: 단편 / 연재 (하나 선택)
4. 한 줄 소개(로그라인):
5. 본인 창작물이며 다른 곳에 게재된 적 없는 원고인가요?: 예 / 아니오
6. 작품과 함께 실을 내 SNS/블로그 링크 (선택):
7. 원고: (본문을 붙여넣거나 파일로 첨부해 주세요)
`;

/**
 * 원고 투고 안내 — 이메일 접수 방식.
 * 접수량이 적은 초기에는 받은편지함이 곧 검토함이므로 폼/DB 없이 운영한다.
 */
export const ManuscriptSubmit: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formCopied, setFormCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUBMIT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard 미지원 시 무시 */ }
  };

  // PC 등 mailto가 동작하지 않는 환경용: 양식 전문 복사
  const copyForm = async () => {
    try {
      await navigator.clipboard.writeText(`제목: ${MAIL_SUBJECT}\n\n${MAIL_BODY}`);
      setFormCopied(true);
      setTimeout(() => setFormCopied(false), 1500);
    } catch { /* clipboard 미지원 시 무시 */ }
  };

  const mailtoHref = `mailto:${SUBMIT_EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-6 pb-16">
      {/* 약속 */}
      <div className="bg-surface-lowest rounded-[2rem] p-6 md:p-8 mb-6 border border-surface-high">
        <h2 className="text-lg font-black mb-5 flex items-center gap-2"><Feather size={18} className="text-primary" /> 선정되면 이렇게 됩니다</h2>
        <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <li className="flex gap-3"><BookOpen size={18} className="text-primary shrink-0 mt-0.5" /><span>당신의 글이 <strong className="text-on-surface">한글타자왕 오리지널</strong>로, 작가 필명과 함께 책방에 정식 게재됩니다. 독자들이 당신의 문장을 한 글자씩 손끝으로 새기고, 완주한 책은 독자의 서재에 꽂힙니다.</span></li>
          <li className="flex gap-3"><Megaphone size={18} className="text-primary shrink-0 mt-0.5" /><span>원하시면 <strong className="text-on-surface">작가님의 SNS·블로그 링크를 작품과 함께 게재</strong>합니다. 매달 한글타자왕을 찾는 수천 명의 독자에게 작가님의 공간이 소개됩니다.</span></li>
          <li className="flex gap-3"><Gift size={18} className="text-primary shrink-0 mt-0.5" /><span>큰 원고료를 드리지 못하는 작은 서비스라, 감사의 마음으로 <strong className="text-on-surface">스타벅스 기프티콘</strong>을 보내드립니다. 서비스가 자라면 보상도 함께 자라도록 하겠습니다.</span></li>
          <li className="flex gap-3"><ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" /><span><strong className="text-on-surface">저작권은 언제나 작가에게 있습니다.</strong> 저희는 게재만 허락받으며, 원하시면 언제든 내릴 수 있습니다. 게재 전 반드시 이메일로 최종 확인을 드립니다.</span></li>
        </ul>
      </div>

      {/* 투고 방법 */}
      <div className="bg-surface-lowest rounded-[2rem] p-6 md:p-8 mb-6 border border-surface-high">
        <h2 className="text-lg font-black mb-5 flex items-center gap-2"><Mail size={18} className="text-primary" /> 투고 방법</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
          아래 주소로 원고를 보내주세요. 메일 제목은 <strong className="text-on-surface">[한글타자왕 투고] 작품 제목 - 필명</strong> 형식으로 부탁드립니다.
        </p>
        <div className="flex items-center gap-2 mb-6">
          <code className="flex-1 px-4 py-3 bg-surface-low rounded-xl font-bold text-sm text-on-surface break-all">{SUBMIT_EMAIL}</code>
          <button onClick={copyEmail} className="shrink-0 px-4 py-3 bg-surface-low rounded-xl text-sm font-black hover:text-primary transition-colors flex items-center gap-1.5">
            {copied ? <><Check size={14} className="text-green-600" /> 복사됨</> : <><Copy size={14} /> 복사</>}
          </button>
        </div>
        <div className="text-xs text-zinc-500 leading-relaxed space-y-1.5 mb-6">
          <p className="font-black text-zinc-600 dark:text-zinc-400">메일에 담아주세요</p>
          <p>· 작품 제목 / 게재용 필명 / 분류(단편·연재) / 한 줄 소개</p>
          <p>· 원고 본문 (붙여넣기 또는 파일 첨부) — 단편 5,000자 이상, 연재는 화당 800~2,000자 호흡 권장</p>
          <p>· 본인 창작물 확인 (표절·타 플랫폼 기게재 원고는 게재할 수 없습니다)</p>
        </div>
        {/* 양식 미리보기 + 복사 (PC에서 mailto가 안 열리는 경우 대비) */}
        <div className="mb-6 rounded-2xl border border-surface-high bg-surface-low overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-high">
            <span className="text-xs font-black text-zinc-500">메일 양식 미리보기</span>
            <button onClick={copyForm} className="text-xs font-black text-primary flex items-center gap-1 hover:underline underline-offset-2">
              {formCopied ? <><Check size={12} className="text-green-600" /> 복사됨</> : <><Copy size={12} /> 양식 복사</>}
            </button>
          </div>
          <pre className="px-4 py-3.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap font-medium">{`제목: ${MAIL_SUBJECT}\n\n${MAIL_BODY}`}</pre>
        </div>

        <a href={mailtoHref} className="block w-full py-4 primary-gradient text-white text-center font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
          ✉️ 양식이 채워진 메일로 투고하기
        </a>
        <p className="mt-2 text-center text-[11px] text-zinc-400 font-medium">버튼이 동작하지 않으면 위 양식을 복사해 메일로 보내주세요.</p>
      </div>

      {/* 검토 안내 */}
      <p className="text-center text-xs text-zinc-400 font-medium leading-relaxed">
        보내주신 모든 원고는 정성껏 읽고, <strong>2주 안에</strong> 선정 여부를 회신드립니다.<br />
        선정되지 않아도 원고는 외부에 공개되거나 사용되지 않습니다.
      </p>
    </div>
  );
};
