"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Feather,
  X,
  PenLine,
  Sparkles,
  ArrowRight,
  ScrollText,
  Eye,
  Heart,
  MessageSquare,
} from "lucide-react";
import type { ShelfBook } from "@/lib/books-db";
import { BookCoverArt } from "@/components/books/BookCoverArt";
import { BOOK_SORT_OPTIONS, type BookSortKey } from "@/components/books/bookSort";
import { useBookSocialMetrics } from "@/components/books/useBookSocialMetrics";
import type { BookMetrics } from "@/components/books/useBookSocialMetrics";
import { useSeriesProgress } from "@/components/books/useSeriesProgress";
import type { SeriesProgress } from "@/components/books/useSeriesProgress";

// ── 연재 상태: 공개 화수가 예정 화수에 못 미치면 "연재 중" ──────────────────
function seriesStatus(book: ShelfBook): { completed: boolean; published: number } {
  return { completed: book.publishedEpisodes >= book.totalEpisodes, published: book.publishedEpisodes };
}

// ── 진열 표지 (토큰 표지 + 미리보기 진입) ────────────────────────────────────
function SeriesShelfCover({
  series,
  metrics,
  progress,
  onPreview,
}: {
  series: ShelfBook;
  metrics: BookMetrics;
  progress?: SeriesProgress;
  onPreview: () => void;
}) {
  const status = seriesStatus(series);
  const reading = !!progress?.started && !progress.allDone;
  return (
    // SEO: 실제 <a> 링크(크롤 가능). JS 사용자는 미리보기 오버레이로 진입.
    <Link
      prefetch={false}
      href={`/transcription/series/${series.id}`}
      onClick={(e) => {
        e.preventDefault();
        onPreview();
      }}
      className="group block text-left transition-transform hover:-translate-y-2"
    >
      <div className="relative">
        <BookCoverArt
          imageUrl={series.coverImageUrl}
          title={series.title}
          author={series.author}
          cover={series.cover}
          className="group-hover:shadow-2xl"
        />
        {/* 내 진행 리본 (마운트 후 로컬 서재 기록 기준) */}
        {progress?.allDone && (
          <span className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-full bg-green-600/90 px-2 py-1 text-[10px] font-bold text-white shadow-lg backdrop-blur-sm">
            <CheckCircle2 size={11} /> 완필
          </span>
        )}
        {reading && (
          <span className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-[10px] font-bold text-white shadow-lg backdrop-blur-sm">
            <Feather size={11} />
            {progress.inProgressPercent > 0
              ? `${progress.nextEpisodeNumber}화 · ${progress.inProgressPercent}%`
              : `다음 ${progress.nextEpisodeNumber}화`}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 px-1 text-[11px] font-bold text-zinc-500">
        <span>
          전 {series.totalEpisodes}화
          {status.completed ? (
            <span className="text-zinc-400"> · 완결</span>
          ) : (
            <span className="text-primary"> · 연재 중 {status.published}화까지</span>
          )}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-2 px-1 text-[10px] font-bold text-zinc-400">
        <span aria-label={`조회수 ${metrics.views.toLocaleString()}회`} className="inline-flex items-center gap-1">
          <Eye size={11} /> {metrics.views.toLocaleString()}
        </span>
        <span aria-label={`좋아요 ${metrics.likes.toLocaleString()}개`} className="inline-flex items-center gap-1">
          <Heart size={11} /> {metrics.likes.toLocaleString()}
        </span>
        <span aria-label={`댓글 ${metrics.comments.toLocaleString()}개`} className="inline-flex items-center gap-1">
          <MessageSquare size={11} /> {metrics.comments.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}

// ── 미리보기 오버레이 (연재) ─────────────────────────────────────────────────
function SeriesPreview({ series, metrics, progress, onClose }: { series: ShelfBook; metrics: BookMetrics; progress?: SeriesProgress; onClose: () => void }) {
  const firstEp = series.episodesMeta[0];
  const status = seriesStatus(series);
  const reading = !!progress?.started && !progress.allDone && !!progress.nextEpisodeId;

  return (
    <div className="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center overflow-y-auto bg-zinc-950/80 backdrop-blur-md sm:p-4">
      <div className="relative w-full sm:max-w-lg bg-[#faf6ec] rounded-t-[1.5rem] sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 overflow-hidden max-h-[92vh] flex flex-col">
        <div className="relative bg-gradient-to-br from-rose-700 to-rose-950 px-6 md:px-10 py-8 md:py-10 text-center shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 text-white/80 flex items-center justify-center hover:bg-black/50 transition-colors"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
          <span className="inline-block px-3 py-1 bg-white/15 text-white/90 text-[10px] font-bold rounded-full mb-4 tracking-widest">
            한글타자왕 오리지널 연재
          </span>
          <h2 className="font-serif font-bold text-white text-2xl md:text-3xl break-keep">
            {series.title}
          </h2>
          <p className="mt-2 text-sm font-bold text-white/60">
            {series.author} 지음 · 전 {series.totalEpisodes}화 · {status.completed ? "완결" : `연재 중 (${status.published}화까지 공개)`}
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs font-bold text-white/70">
            <span className="inline-flex items-center gap-1.5" aria-label={`조회수 ${metrics.views.toLocaleString()}회`}><Eye size={14} /> {metrics.views.toLocaleString()}</span>
            <span className="inline-flex items-center gap-1.5" aria-label={`좋아요 ${metrics.likes.toLocaleString()}개`}><Heart size={14} /> {metrics.likes.toLocaleString()}</span>
            <span className="inline-flex items-center gap-1.5" aria-label={`댓글 ${metrics.comments.toLocaleString()}개`}><MessageSquare size={14} /> {metrics.comments.toLocaleString()}</span>
          </div>
        </div>

        <div className="px-6 md:px-10 py-8 overflow-y-auto">
          <p className="text-[11px] font-bold text-[#a05252] uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <BookOpen size={13} /> 이런 이야기예요
          </p>
          <p className="font-serif text-[16px] leading-loose text-[#2f2a24] break-keep [overflow-wrap:anywhere] mb-6">
            {series.logline}
          </p>
          <p className="text-sm font-medium text-[#6b5d4f] leading-relaxed break-keep">
            {series.description}
          </p>
          {firstEp && series.previewExcerpt && (
            <div className="relative mt-6 pt-6 border-t border-[#e5dcc8]">
              <p className="text-[11px] font-bold text-[#a05252] uppercase tracking-widest mb-3">
                1화 · {firstEp.title.replace(/^1화\.\s*/, "")}
              </p>
              <p className="font-serif text-[15px] leading-loose text-[#2f2a24] whitespace-pre-wrap break-keep [overflow-wrap:anywhere] line-clamp-4">
                {series.previewExcerpt.slice(0, 200)}
                <span className="text-[#a05252]/60">…</span>
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-[#faf6ec]/95 backdrop-blur border-t border-[#e5dcc8] px-6 py-4 shrink-0">
          {reading ? (
            <Link
              prefetch={false}
              href={`/transcription/${progress!.nextEpisodeId}`}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#a05252] text-white text-base font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <Feather size={18} /> {progress!.nextEpisodeNumber}화{progress!.inProgressPercent > 0 ? ` ${progress!.inProgressPercent}%부터` : "부터"} 이어 새기기 →
            </Link>
          ) : progress?.allDone ? (
            <Link
              prefetch={false}
              href={`/transcription/series/${series.id}`}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-700 text-white text-base font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <CheckCircle2 size={18} /> 완필한 책 · 목차 다시 보기 →
            </Link>
          ) : (
            <Link
              prefetch={false}
              href={`/transcription/series/${series.id}`}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#a05252] text-white text-base font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <Feather size={18} /> 1화부터 새기기 →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// 한 페이지에 진열하는 책 수 (2·3·4열 그리드 공배수)
const SHELF_PAGE_SIZE = 12;

// ── 책방 본체 (장편 전용) — 서버에서 DB로 읽은 books 를 받는다 ────────────────
export const BookStore: React.FC<{ books: ShelfBook[] }> = ({ books }) => {
  const [previewSeries, setPreviewSeries] = useState<ShelfBook | null>(null);
  const [sortKey, setSortKey] = useState<BookSortKey>("editorial");
  const [page, setPage] = useState(1);
  const bookIds = useMemo(() => books.map((b) => b.id), [books]);
  const metrics = useBookSocialMetrics(bookIds);
  const progressById = useSeriesProgress(books);

  // 기본순 = 서버가 내려준 진열 순서
  const editorialOrder = useMemo(() => new Map(books.map((b, i) => [b.id, i])), [books]);

  const sortedSeries = useMemo(() => [...books].sort((left, right) => {
    const editorialDifference = (editorialOrder.get(left.id) || 0) - (editorialOrder.get(right.id) || 0);
    if (sortKey === "editorial") return editorialDifference;
    return (metrics[right.id]?.[sortKey] || 0) - (metrics[left.id]?.[sortKey] || 0) || editorialDifference;
  }), [books, editorialOrder, metrics, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedSeries.length / SHELF_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedSeries = sortedSeries.slice((currentPage - 1) * SHELF_PAGE_SIZE, currentPage * SHELF_PAGE_SIZE);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
      {previewSeries && (
        <SeriesPreview series={previewSeries} metrics={metrics[previewSeries.id]} progress={progressById[previewSeries.id]} onClose={() => setPreviewSeries(null)} />
      )}

      {/* 장편 진열대 */}
      <section>
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
          <Sparkles size={18} className="text-primary" /> 한글타자왕 오리지널 장편
        </h2>
        <p className="text-sm text-zinc-500 font-medium mb-6 break-keep">
          하루 한 화씩, 며칠에 걸쳐 완필하는 오리지널 연재 장편만 모았습니다. 표지를 눌러 미리 읽어보세요.
        </p>
        <div className="mb-5 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="책방 정렬">
          {BOOK_SORT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={sortKey === option.key}
              onClick={() => { setSortKey(option.key); setPage(1); }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${sortKey === option.key ? "primary-gradient text-white" : "bg-surface-high text-zinc-500 hover:text-primary"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-7 p-4 md:p-7 bg-surface-low rounded-2xl border-b-8 border-[#c9a97a]/40">
          {pagedSeries.map((s) => (
            <SeriesShelfCover key={s.id} series={s} metrics={metrics[s.id]} progress={progressById[s.id]} onPreview={() => setPreviewSeries(s)} />
          ))}
        </div>

        {/* 서가 페이지네이션 */}
        {totalPages > 1 && (
          <nav className="mt-6 flex items-center justify-center gap-2" aria-label="서가 페이지">
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 rounded-full bg-surface-high text-sm font-bold text-zinc-500 hover:text-primary disabled:opacity-40 transition-colors"
            >
              ← 이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-current={n === currentPage ? "page" : undefined}
                onClick={() => setPage(n)}
                className={`w-9 h-9 rounded-full text-sm font-bold transition-colors ${n === currentPage ? "primary-gradient text-white" : "bg-surface-high text-zinc-500 hover:text-primary"}`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 rounded-full bg-surface-high text-sm font-bold text-zinc-500 hover:text-primary disabled:opacity-40 transition-colors"
            >
              다음 →
            </button>
          </nav>
        )}
      </section>

      {/* 단편·시 안내 */}
      <section className="mt-10">
        <Link
          prefetch={false}
          href="/transcription"
          className="group flex items-center gap-4 p-5 md:p-6 rounded-2xl border border-surface-high bg-surface-lowest hover:border-primary/40 transition-all"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary shrink-0">
            <ScrollText size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold break-keep">단편·시·수필은 긴 글 연습에서</p>
            <p className="text-sm text-zinc-500 font-medium break-keep">
              윤동주·김소월 등 명작 단편과 짧은 글은 ‘긴 글 연습’에서 <span className="whitespace-nowrap">한 편씩 필사할 수 있어요.</span>
            </p>
          </div>
          <ArrowRight
            size={18}
            className="text-primary shrink-0 group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </section>

      {/* 원고 투고 유도 */}
      <section className="mt-14">
        <Link
          prefetch={false}
          href="/books/submit"
          className="group block p-8 md:p-10 rounded-2xl border border-primary/30 bg-surface-low hover:border-primary/60 transition-all hover:-translate-y-1 text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-5">
            <PenLine size={26} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 break-keep">
            당신의 글이 다음 장편이 <span className="whitespace-nowrap">될 수 있어요</span>
          </h2>
          <p className="text-zinc-500 font-medium leading-relaxed max-w-lg mx-auto break-keep">
            내가 쓴 이야기를 책방에 올리고 싶다면, 원고를 투고해 주세요. 선정되면 한글타자왕
            오리지널 연재로 게재되어 누군가 당신의 문장을 한 자 한 자 새기게 됩니다.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 font-bold text-primary">
            원고 투고하기{" "}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </section>
    </div>
  );
};
