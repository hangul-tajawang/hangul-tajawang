"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveAuthor } from "@/app/adminsangwon/actions";
import { ArrowLeft, UserRound, CheckCircle2, Loader2 } from "lucide-react";

export interface AuthorFormInitial {
  id: string;
  name: string;
  bio: string;
  snsUrl: string;
  blogUrl: string;
  imageUrl: string | null;
}

const field = "w-full px-4 py-3 rounded-xl border border-surface-high bg-surface-lowest font-medium text-sm focus:outline-none focus:border-primary/60";
const label = "block text-xs font-bold text-zinc-500 mb-1.5 mt-5";

export function AuthorForm({ initial }: { initial: AuthorFormInitial | null }) {
  const editing = !!initial;
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = (formData: FormData) => {
    setResult(null);
    startTransition(async () => {
      const r = await saveAuthor(formData);
      setResult(r);
      if (r.ok) router.refresh();
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto py-10 px-4 md:px-6 text-on-surface">
      <Link href="/adminsangwon" className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-primary mb-6">
        <ArrowLeft size={14} /> 책방 관리로
      </Link>
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <UserRound className="text-primary" /> {editing ? `작가 수정 — ${initial!.name}` : "새 작가 등록"}
      </h1>

      <form action={onSubmit}>
        <label className={label}>아이디 (URL 슬러그 · 영문 소문자, 등록 후 변경 금지)</label>
        <input name="id" defaultValue={initial?.id} readOnly={editing} required
          placeholder="예: haneum → /authors/haneum" className={`${field} ${editing ? "opacity-60" : ""}`} />

        <label className={label}>필명</label>
        <input name="name" defaultValue={initial?.name} required placeholder="예: 한이음" className={field} />

        <label className={label}>한 줄 소개 (선택)</label>
        <textarea name="bio" defaultValue={initial?.bio} rows={2} className={field} />

        <label className={label}>SNS 링크 (선택)</label>
        <input name="snsUrl" defaultValue={initial?.snsUrl} type="url" placeholder="https://instagram.com/..." className={field} />

        <label className={label}>블로그 링크 (선택)</label>
        <input name="blogUrl" defaultValue={initial?.blogUrl} type="url" placeholder="https://blog.naver.com/..." className={field} />

        <label className={label}>프로필 사진 (정사각형 권장, 선택)</label>
        <input name="imageFile" type="file" accept="image/jpeg,image/png,image/webp" className={`${field} !py-2.5`} />
        {initial?.imageUrl && (
          <p className="mt-1 text-[11px] font-bold text-zinc-400 truncate">현재: {initial.imageUrl}</p>
        )}
        <input type="hidden" name="existingImageUrl" value={initial?.imageUrl || ""} />

        {result && (
          <div className={`mt-5 px-4 py-3 rounded-xl text-sm font-bold ${result.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
            {result.ok && <CheckCircle2 size={15} className="inline mr-1.5 -mt-0.5" />}
            {result.message}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full py-4 primary-gradient text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {pending && <Loader2 size={16} className="animate-spin" />}
          {pending ? "저장 중..." : "저장 (웹·앱 즉시 반영)"}
        </button>
      </form>
    </div>
  );
}
