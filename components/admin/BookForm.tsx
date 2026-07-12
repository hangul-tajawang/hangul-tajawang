"use client";

import React, { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseManuscript } from "@/lib/manuscript";
import { saveBook } from "@/app/adminsangwon/actions";
import { ArrowLeft, BookOpen, CheckCircle2, Loader2 } from "lucide-react";

const PALETTES = ["rose", "indigo", "emerald", "amber", "ink", "plum"];
const PATTERNS = ["grid", "wave", "dots", "diag"];

export interface BookFormInitial {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  logline: string;
  description: string;
  category: string;
  totalEpisodes: number;
  sortOrder: number;
  coverPalette: string;
  coverPattern: string;
  coverImageUrl: string | null;
  manuscript: string;
}

const field = "w-full px-4 py-3 rounded-xl border border-surface-high bg-surface-lowest font-medium text-sm focus:outline-none focus:border-primary/60";
const label = "block text-xs font-black text-zinc-500 mb-1.5 mt-5";

export function BookForm({
  authors,
  initial,
}: {
  authors: { id: string; name: string }[];
  initial: BookFormInitial | null;
}) {
  const editing = !!initial;
  const [manuscript, setManuscript] = useState(initial?.manuscript || "");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const parsed = useMemo(() => parseManuscript(manuscript), [manuscript]);
  const totalChars = parsed.reduce((a, e) => a + e.wordCount, 0);

  const onSubmit = (formData: FormData) => {
    setResult(null);
    startTransition(async () => {
      const r = await saveBook(formData);
      setResult(r);
      if (r.ok) router.refresh();
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 md:px-6 text-on-surface">
      <Link href="/adminsangwon" className="inline-flex items-center gap-1.5 text-xs font-black text-zinc-400 hover:text-primary mb-6">
        <ArrowLeft size={14} /> 책방 관리로
      </Link>
      <h1 className="text-2xl font-black mb-8 flex items-center gap-2">
        <BookOpen className="text-primary" /> {editing ? `책 수정 — ${initial!.title}` : "새 책 게재"}
      </h1>

      <form action={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <div>
            <label className={label}>아이디 (URL·영문 소문자, 게재 후 변경 금지)</label>
            <input name="id" defaultValue={initial?.id} readOnly={editing} required
              placeholder="예: winterletter"
              className={`${field} ${editing ? "opacity-60" : ""}`} />
          </div>
          <div>
            <label className={label}>제목</label>
            <input name="title" defaultValue={initial?.title} required placeholder="책 제목" className={field} />
          </div>
          <div>
            <label className={label}>작가 (등록된 작가 연결)</label>
            <select name="authorId" defaultValue={initial?.authorId || ""} className={field}>
              <option value="">— 연결 안 함 —</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name} ({a.id})</option>
              ))}
            </select>
            <p className="mt-1 text-[11px] font-bold text-zinc-400">
              새 작가는 <Link href="/adminsangwon/author" className="text-primary underline">작가 등록</Link> 먼저.
            </p>
          </div>
          <div>
            <label className={label}>작가 표기명 (연결 없이 이름만 쓸 때)</label>
            <input name="authorName" defaultValue={initial?.authorName} placeholder="예: 한이음" className={field} />
          </div>
          <div>
            <label className={label}>분류</label>
            <select name="category" defaultValue={initial?.category || "소설"} className={field}>
              <option value="소설">소설</option>
              <option value="동화">동화</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>예정 화수 (연재용, 0=자동)</label>
              <input name="totalEpisodes" type="number" min={0} defaultValue={initial?.totalEpisodes || 0} className={field} />
            </div>
            <div>
              <label className={label}>진열 순서 (낮을수록 앞)</label>
              <input name="sortOrder" type="number" min={0} defaultValue={initial?.sortOrder || 0} className={field} />
            </div>
          </div>
        </div>

        <label className={label}>로그라인 (카드·공유 문구, 한두 문장)</label>
        <textarea name="logline" defaultValue={initial?.logline} rows={2} required className={field} />

        <label className={label}>소개 (시리즈 페이지, 비우면 로그라인 사용)</label>
        <textarea name="description" defaultValue={initial?.description} rows={3} className={field} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5">
          <div>
            <label className={label}>표지 팔레트 (일러스트 없을 때)</label>
            <select name="coverPalette" defaultValue={initial?.coverPalette || "rose"} className={field}>
              {PALETTES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>표지 패턴</label>
            <select name="coverPattern" defaultValue={initial?.coverPattern || "grid"} className={field}>
              {PATTERNS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>표지 일러스트 (3:4 JPG, 선택)</label>
            <input name="coverFile" type="file" accept="image/jpeg,image/png,image/webp" className={`${field} !py-2.5`} />
            {initial?.coverImageUrl && (
              <p className="mt-1 text-[11px] font-bold text-zinc-400 truncate">현재: {initial.coverImageUrl}</p>
            )}
          </div>
        </div>
        <input type="hidden" name="existingCoverUrl" value={initial?.coverImageUrl || ""} />

        <label className={label}>원고 전문 — 화 구분은 &quot;## 1화. 제목&quot; 형식, 문단 구분은 빈 줄</label>
        <textarea
          name="manuscript"
          value={manuscript}
          onChange={(e) => setManuscript(e.target.value)}
          rows={16}
          required
          placeholder={"## 1화. 첫 화 제목\n\n본문 첫 문단...\n\n다음 문단...\n\n## 2화. 두 번째 화 제목\n\n..."}
          className={`${field} font-mono text-[13px] leading-relaxed`}
        />

        {/* 화 분할 미리보기 */}
        <div className="mt-4 p-4 rounded-xl bg-surface-low border border-surface-high">
          <p className="text-xs font-black text-zinc-500 mb-2">
            화 분할 미리보기 — {parsed.length}화 · 총 {totalChars.toLocaleString()}자(공백 제외)
          </p>
          {parsed.length > 0 ? (
            <ol className="space-y-1 max-h-40 overflow-y-auto">
              {parsed.map((ep) => (
                <li key={ep.episode} className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                  {ep.episode}화. {ep.title} <span className="text-zinc-400">· {ep.wordCount.toLocaleString()}자</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-xs font-bold text-red-400">화를 찾지 못했습니다. &quot;## 1화. 제목&quot; 마커를 확인하세요.</p>
          )}
        </div>

        {result && (
          <div className={`mt-5 px-4 py-3 rounded-xl text-sm font-black ${result.ok ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-900/20 text-red-600"}`}>
            {result.ok && <CheckCircle2 size={15} className="inline mr-1.5 -mt-0.5" />}
            {result.message}
            {result.ok && (
              <Link href={`/transcription/series/${initial?.id || ""}`} className="ml-2 underline" target="_blank">페이지 보기 →</Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={pending || parsed.length === 0}
          className="mt-6 w-full py-4 primary-gradient text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {pending && <Loader2 size={16} className="animate-spin" />}
          {pending ? "게재 중..." : editing ? "수정 사항 게재 (웹·앱 즉시 반영)" : "게재하기 (웹·앱 즉시 반영)"}
        </button>
      </form>
    </div>
  );
}
