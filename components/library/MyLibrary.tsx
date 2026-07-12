"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Download, Feather, Library as LibraryIcon, X, ChevronLeft } from "lucide-react";
import { getLibrary, getLibraryStats, syncLibraryWithServer, PilsaRecord } from "@/lib/pilsa-library";
import { LONG_TEXT_DB, PILSA_SERIES, getSeriesEpisodes, PilsaSeries } from "@/lib/long-text-data";
import { supabase } from "@/lib/supabase";
import { BookCoverArt } from "@/components/books/BookCoverArt";

/** 이 기록이 연재 시리즈 소속이면 시리즈 ID 반환 */
function seriesIdOf(r: PilsaRecord): string | undefined {
  if (r.sourceType !== "work") return undefined;
  return LONG_TEXT_DB.find((t) => t.id === r.sourceId)?.seriesId;
}

interface SeriesGroup {
  series: PilsaSeries;
  records: PilsaRecord[];
  doneCount: number;
}

// 카테고리별 책 표지 색 (이미지 없이 감성 표지를 자동 생성)
const COVER_STYLES: Record<string, { bg: string; band: string }> = {
  "시": { bg: "from-indigo-700 to-indigo-950", band: "bg-indigo-400" },
  "동화": { bg: "from-amber-600 to-amber-900", band: "bg-amber-300" },
  "수필": { bg: "from-emerald-700 to-emerald-950", band: "bg-emerald-400" },
  "명언": { bg: "from-purple-700 to-purple-950", band: "bg-purple-400" },
  "소설": { bg: "from-rose-700 to-rose-950", band: "bg-rose-400" },
  "칼럼": { bg: "from-cyan-700 to-cyan-950", band: "bg-cyan-400" },
};
const CHALLENGE_COVER = { bg: "from-zinc-700 to-zinc-900", band: "bg-yellow-400" };

function coverStyle(record: PilsaRecord) {
  if (record.sourceType === "challenge") return CHALLENGE_COVER;
  return COVER_STYLES[record.category] || CHALLENGE_COVER;
}

function contentOf(record: PilsaRecord): string {
  if (record.content) return record.content;
  return LONG_TEXT_DB.find((t) => t.id === record.sourceId)?.content || "";
}

function practiceHref(record: PilsaRecord) {
  return record.sourceType === "challenge"
    ? `/challenge/${record.sourceId}`
    : `/transcription/${record.sourceId}`;
}

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
};

// ── 문장 카드 캔버스 (1080×1350, 인스타 4:5 · 원고지 감성) ────────────────
function drawSentenceCard(sentence: string, record: PilsaRecord): HTMLCanvasElement | null {
  const c = document.createElement("canvas");
  c.width = 1080; c.height = 1350;
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  // 크림색 종이 배경 + 은은한 격자(원고지 느낌)
  ctx.fillStyle = "#faf6ec";
  ctx.fillRect(0, 0, 1080, 1350);
  ctx.strokeStyle = "rgba(190, 120, 120, 0.10)";
  ctx.lineWidth = 1;
  for (let x = 60; x < 1080; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1350); ctx.stroke(); }
  for (let y = 60; y < 1350; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke(); }
  // 테두리
  ctx.strokeStyle = "rgba(160, 82, 82, 0.35)";
  ctx.lineWidth = 3;
  ctx.strokeRect(50, 50, 980, 1250);

  ctx.textAlign = "center";
  ctx.fillStyle = "#a05252";
  ctx.font = "700 30px serif";
  ctx.fillText("오늘 새긴 문장", 540, 160);

  // 본문 (자동 줄바꿈, 세리프)
  ctx.fillStyle = "#2f2a24";
  ctx.font = "700 52px serif";
  const maxWidth = 820;
  const lines: string[] = [];
  let line = "";
  for (const ch of sentence) {
    if (ctx.measureText(line + ch).width > maxWidth) { lines.push(line); line = ch; }
    else line += ch;
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, 8);
  const lineHeight = 92;
  const startY = 675 - ((shown.length - 1) * lineHeight) / 2;
  shown.forEach((l, i) => ctx.fillText(l, 540, startY + i * lineHeight));

  // 출처 + 기록
  ctx.fillStyle = "#6b5d4f";
  ctx.font = "700 34px serif";
  ctx.fillText(`— ${record.title}, ${record.author}`, 540, 1130);
  ctx.fillStyle = "#a89a8a";
  ctx.font = "500 26px sans-serif";
  const latest = record.completions[record.completions.length - 1];
  ctx.fillText(`${latest ? fmtDate(latest.date) : ""} · 키보드로 새김 · 한글타자왕`, 540, 1190);
  return c;
}

// ── 책 표지 ─────────────────────────────────────────────────────────────────
function BookCover({ record, onClick }: { record: PilsaRecord; onClick: () => void }) {
  const style = coverStyle(record);
  const done = record.completions.length > 0;
  const editions = record.completions.length;

  return (
    <button
      onClick={onClick}
      className={`group relative aspect-[3/4] w-full text-left rounded-r-xl rounded-l-sm overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all bg-gradient-to-br ${style.bg} ${done ? "" : "opacity-80"}`}
    >
      {/* 책등 */}
      <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/30" />
      <div className={`absolute left-2.5 top-0 bottom-0 w-0.5 ${style.band} opacity-60`} />
      {/* 표지 텍스트 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pl-6 text-center">
        <span className={`w-8 h-1 ${style.band} rounded-full mb-4 opacity-80`} />
        <h3 className="font-serif font-black text-white text-base sm:text-lg leading-snug break-keep line-clamp-3">{record.title}</h3>
        <p className="mt-2 text-[11px] font-bold text-white/60">{record.author}</p>
        <span className={`w-8 h-1 ${style.band} rounded-full mt-4 opacity-80`} />
      </div>
      {/* 상태 배지 */}
      {done && editions > 1 && (
        <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/40 text-yellow-300 text-[10px] font-black rounded-full">{editions}쇄</span>
      )}
      {!done && record.progress && (
        <div className="absolute inset-x-0 bottom-0 bg-black/50 px-3 py-2">
          <div className="flex justify-between items-center text-[10px] font-black text-white/90 mb-1">
            <span>필사 중</span><span>{Math.round(record.progress.percent)}%</span>
          </div>
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400" style={{ width: `${record.progress.percent}%` }} />
          </div>
        </div>
      )}
    </button>
  );
}

// ── 책 상세 (판권 간지 + 본문 + 문장 카드) ─────────────────────────────────
function BookDetail({ record, onClose }: { record: PilsaRecord; onClose: () => void }) {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  // 본문이 로컬에 없으면 서버에서 로드 — 챌린지(typing_contents) / DB 전용 책방 화(book_episodes)
  const [fetchedContent, setFetchedContent] = useState("");
  useEffect(() => {
    if (record.sourceType === "challenge" && !record.content) {
      supabase.from("typing_contents").select("content").eq("id", record.sourceId).maybeSingle()
        .then(({ data }) => setFetchedContent(data?.content || ""));
    } else if (record.sourceType === "work" && !contentOf(record)) {
      supabase.from("book_episodes").select("content").eq("id", record.sourceId).maybeSingle()
        .then(({ data }) => setFetchedContent(data?.content || ""));
    }
  }, [record]);
  const content = contentOf(record) || fetchedContent;
  const lines = useMemo(() => content.split("\n"), [content]);
  const style = coverStyle(record);
  const done = record.completions.length > 0;
  const first = record.completions[0];
  const bestKpm = Math.max(0, ...record.completions.map((c) => c.kpm));

  const downloadCard = () => {
    if (!selectedLine) return;
    const canvas = drawSentenceCard(selectedLine, record);
    if (!canvas) return;
    (window as any).dataLayer?.push({ event: "pilsa_card_download", work: record.title });
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `필사카드_${record.title}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-start justify-center overflow-y-auto bg-zinc-950/80 backdrop-blur-md p-4 py-8 md:py-16">
      <div className="relative w-full max-w-2xl bg-[#faf6ec] dark:bg-zinc-900 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* 표지 헤더 */}
        <div className={`relative bg-gradient-to-br ${style.bg} px-6 md:px-10 py-8 md:py-12 text-center`}>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 text-white/80 flex items-center justify-center hover:bg-black/50 transition-colors" aria-label="닫기"><X size={18} /></button>
          <h2 className="font-serif font-black text-white text-2xl md:text-3xl break-keep">{record.title}</h2>
          <p className="mt-2 text-sm font-bold text-white/60">{record.author} · {record.category}</p>
        </div>

        {/* 판권 간지 — 나의 기록 */}
        <div className="px-6 md:px-10 py-6 border-b border-[#e5dcc8] dark:border-zinc-800 text-center">
          {done ? (
            <p className="text-sm font-medium text-[#6b5d4f] dark:text-zinc-400 leading-relaxed">
              {first && <>초판 · {fmtDate(first.date)} 새김<br /></>}
              {record.completions.length > 1 && <>총 {record.completions.length}쇄 · </>}
              최고 {bestKpm}타 · 정확도 {Math.max(...record.completions.map((c) => c.accuracy))}%
            </p>
          ) : (
            <p className="text-sm font-medium text-[#6b5d4f] dark:text-zinc-400">아직 새기는 중인 책입니다 ({Math.round(record.progress?.percent || 0)}%)</p>
          )}
          <div className="mt-4 flex justify-center gap-3">
            <Link prefetch={false} href={practiceHref(record)} className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-black rounded-full hover:scale-105 transition-transform flex items-center gap-1.5">
              <Feather size={14} /> {done ? "다시 새기기" : "이어서 새기기"}
            </Link>
          </div>
        </div>

        {/* 본문 — 문장을 탭하면 카드로 만들 수 있음 */}
        <div className="px-6 md:px-10 py-8">
          <p className="text-[11px] font-black text-[#a05252] uppercase tracking-widest mb-4 flex items-center gap-1.5"><BookOpen size={13} /> 본문 · 문장을 누르면 카드로 간직할 수 있어요</p>
          <div className="font-serif text-[17px] leading-loose text-[#2f2a24] dark:text-zinc-200">
            {lines.map((l, i) =>
              l.trim() ? (
                <p key={i} onClick={() => setSelectedLine(l.trim())}
                  className={`cursor-pointer rounded-lg px-2 -mx-2 transition-colors break-keep ${selectedLine === l.trim() ? "bg-[#a05252]/15 ring-1 ring-[#a05252]/30" : "hover:bg-[#a05252]/5"}`}>
                  {l}
                </p>
              ) : <br key={i} />
            )}
          </div>
        </div>

        {/* 문장 카드 저장 바 */}
        {selectedLine && (
          <div className="sticky bottom-0 bg-[#faf6ec]/95 dark:bg-zinc-900/95 backdrop-blur border-t border-[#e5dcc8] dark:border-zinc-800 px-6 py-4 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
            <p className="flex-1 text-sm font-bold text-[#2f2a24] dark:text-zinc-200 truncate">"{selectedLine}"</p>
            <button onClick={downloadCard} className="shrink-0 px-5 py-2.5 bg-[#a05252] text-white text-sm font-black rounded-full flex items-center gap-1.5 hover:scale-105 transition-transform">
              <Download size={14} /> 문장 카드 저장
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 서재 본체 ────────────────────────────────────────────────────────────────
export const MyLibrary: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [records, setRecords] = useState<PilsaRecord[]>([]);
  const [selected, setSelected] = useState<PilsaRecord | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<SeriesGroup | null>(null);

  // 연재 시리즈 소속 기록은 "한 권의 책"으로 묶는다
  const seriesGroups = useMemo<SeriesGroup[]>(() =>
    PILSA_SERIES.map((series) => {
      const recs = records.filter((r) => seriesIdOf(r) === series.id);
      return { series, records: recs, doneCount: recs.filter((r) => r.completions.length > 0).length };
    }).filter((g) => g.records.length > 0),
  [records]);

  const standalone = useMemo(() => records.filter((r) => !seriesIdOf(r)), [records]);

  useEffect(() => {
    setMounted(true);
    setRecords(getLibrary());
    // 로그인 상태면 서버와 병합 (다른 기기 기록 내려받기 + 로컬 기록 백필)
    syncLibraryWithServer().then(() => setRecords(getLibrary()));
  }, []);

  const stats = useMemo(() => (mounted ? getLibraryStats() : { books: 0, totalCompletions: 0, bestKpm: 0, inProgress: 0 }), [mounted, records]);
  const done = standalone.filter((r) => r.completions.length > 0);
  const inProgress = standalone.filter((r) => r.completions.length === 0 && r.progress);
  // 연재는 완간해야 "새긴 책", 그 전엔 "새기는 중"
  const seriesDone = seriesGroups.filter((g) => g.doneCount >= g.series.totalEpisodes);
  const seriesInProgress = seriesGroups.filter((g) => g.doneCount < g.series.totalEpisodes);
  const bookCount = done.length + seriesDone.length;

  if (!mounted) return <div className="min-h-[50vh]" />;

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-20 h-20 bg-surface-low rounded-[2rem] flex items-center justify-center text-primary mb-8"><LibraryIcon size={36} /></div>
        <h2 className="text-2xl font-black mb-3">아직 서재가 비어 있어요</h2>
        <p className="text-zinc-500 font-medium leading-relaxed mb-10 max-w-sm break-keep">
          필사를 완주하면 그 작품이 한 권의 책이 되어 이곳에 꽂힙니다. 키보드로 새긴 당신만의 서재를 채워보세요.
        </p>
        <Link prefetch={false} href="/transcription" className="px-8 py-4 primary-gradient text-white font-black rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
          첫 필사 시작하기 →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {selected && <BookDetail record={selected} onClose={() => { setSelected(null); setRecords(getLibrary()); }} />}
      {selectedSeries && <SeriesBookDetail group={selectedSeries} onClose={() => { setSelectedSeries(null); setRecords(getLibrary()); }} />}

      {/* 서재 현황 */}
      <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-10 md:mb-14">
        <div className="bg-surface-lowest px-5 py-3 rounded-2xl shadow-sm"><span className="text-2xl font-black text-primary">{bookCount}</span><span className="text-xs font-bold text-zinc-400 ml-1.5">권의 책</span></div>
        <div className="bg-surface-lowest px-5 py-3 rounded-2xl shadow-sm"><span className="text-2xl font-black text-on-surface">{stats.totalCompletions}</span><span className="text-xs font-bold text-zinc-400 ml-1.5">번의 완주</span></div>
        {stats.bestKpm > 0 && <div className="bg-surface-lowest px-5 py-3 rounded-2xl shadow-sm"><span className="text-2xl font-black text-green-600">{stats.bestKpm}</span><span className="text-xs font-bold text-zinc-400 ml-1.5">최고 타수</span></div>}
      </div>

      {/* 새기는 중 (이어하기) */}
      {(inProgress.length > 0 || seriesInProgress.length > 0) && (
        <section className="mb-12">
          <h2 className="text-lg font-black mb-5 flex items-center gap-2"><Feather size={18} className="text-primary" /> 새기는 중</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-5">
            {seriesInProgress.map((g) => <SeriesCover key={g.series.id} group={g} onClick={() => setSelectedSeries(g)} />)}
            {inProgress.map((r) => <BookCover key={`${r.sourceType}:${r.sourceId}`} record={r} onClick={() => setSelected(r)} />)}
          </div>
        </section>
      )}

      {/* 완주한 책장 */}
      {(done.length > 0 || seriesDone.length > 0) && (
        <section>
          <h2 className="text-lg font-black mb-5 flex items-center gap-2"><LibraryIcon size={18} className="text-primary" /> 내가 새긴 책들</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-5 p-4 md:p-6 bg-surface-low rounded-[2rem] border-b-8 border-[#c9a97a]/40">
            {seriesDone.map((g) => <SeriesCover key={g.series.id} group={g} onClick={() => setSelectedSeries(g)} />)}
            {done.map((r) => <BookCover key={`${r.sourceType}:${r.sourceId}`} record={r} onClick={() => setSelected(r)} />)}
          </div>
        </section>
      )}

      <div className="mt-12 text-center">
        <Link prefetch={false} href="/transcription" className="inline-flex items-center gap-2 text-sm font-black text-primary hover:underline underline-offset-4">
          <ChevronLeft size={16} /> 새로운 작품 필사하러 가기
        </Link>
      </div>
    </div>
  );
};

// ── 연재 시리즈 표지 (여러 화가 한 권으로 묶임) ─────────────────────────────
const SeriesCover: React.FC<{ group: SeriesGroup; onClick: () => void }> = ({ group, onClick }) => {
  const { series, doneCount } = group;
  const complete = doneCount >= series.totalEpisodes;
  const activeRecord = group.records
    .filter((record) => record.progress)
    .sort((a, b) => (b.progress?.updatedAt || "").localeCompare(a.progress?.updatedAt || ""))[0];
  const activeEpisode = activeRecord
    ? LONG_TEXT_DB.find((text) => text.id === activeRecord.sourceId)?.episode
    : undefined;
  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left transition-transform hover:-translate-y-2"
    >
      <BookCoverArt seriesId={series.id} title={series.title} author={series.author} cover={series.cover} />
      {complete ? (
        <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-400 text-yellow-950 text-[10px] font-black rounded-full">완간</span>
      ) : (
        <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-black/75 px-3 py-2 backdrop-blur-sm">
          <div className="flex justify-between items-center text-[10px] font-black text-white/90 mb-1">
            <span>{activeEpisode ? `${activeEpisode}화 새기는 중` : "다음 화 기다리는 중"}</span>
            <span>{activeRecord?.progress ? `${Math.round(activeRecord.progress.percent)}%` : `${doneCount}/${series.totalEpisodes}화`}</span>
          </div>
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400" style={{ width: `${activeRecord?.progress?.percent || (doneCount / series.totalEpisodes) * 100}%` }} />
          </div>
        </div>
      )}
    </button>
  );
};

// ── 연재 시리즈 상세 (판권 + 화별 기록 목차) ────────────────────────────────
const SeriesBookDetail: React.FC<{ group: SeriesGroup; onClose: () => void }> = ({ group, onClose }) => {
  const { series, records, doneCount } = group;
  const episodes = getSeriesEpisodes(series.id);
  const complete = doneCount >= series.totalEpisodes;
  const allCompletions = records.flatMap((r) => r.completions);
  const firstDate = allCompletions.map((c) => c.date).sort()[0];
  const bestKpm = Math.max(0, ...allCompletions.map((c) => c.kpm));

  return (
    <div className="fixed inset-0 z-[9000] flex items-start justify-center overflow-y-auto bg-zinc-950/80 backdrop-blur-md p-4 py-8 md:py-16">
      <div className="relative w-full max-w-2xl bg-[#faf6ec] dark:bg-zinc-900 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className="relative bg-gradient-to-br from-rose-700 to-rose-950 px-6 md:px-10 py-8 md:py-12 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 text-white/80 flex items-center justify-center hover:bg-black/50 transition-colors" aria-label="닫기"><X size={18} /></button>
          <span className="inline-block px-3 py-1 bg-white/15 text-white/90 text-[10px] font-black rounded-full mb-4 tracking-widest">한글타자왕 오리지널 연재</span>
          <h2 className="font-serif font-black text-white text-2xl md:text-3xl break-keep">{series.title}</h2>
          <p className="mt-2 text-sm font-bold text-white/60">{series.author} 지음 · 전 {series.totalEpisodes}화</p>
        </div>

        {/* 판권 간지 */}
        <div className="px-6 md:px-10 py-6 border-b border-[#e5dcc8] dark:border-zinc-800 text-center">
          <p className="text-sm font-medium text-[#6b5d4f] dark:text-zinc-400 leading-relaxed">
            {complete ? "완간" : `${doneCount}/${series.totalEpisodes}화 새김`}
            {firstDate && <> · {fmtDate(firstDate)}부터</>}
            {bestKpm > 0 && <> · 최고 {bestKpm}타</>}
          </p>
        </div>

        {/* 화별 목차 */}
        <div className="px-6 md:px-10 py-8">
          <p className="text-[11px] font-black text-[#a05252] uppercase tracking-widest mb-4 flex items-center gap-1.5"><BookOpen size={13} /> 목차</p>
          <ol className="space-y-1.5">
            {episodes.map((ep) => {
              const rec = records.find((r) => r.sourceId === ep.id);
              const epDone = !!rec && rec.completions.length > 0;
              const epProgress = rec?.progress;
              return (
                <li key={ep.id}>
                  <Link prefetch={false} href={`/transcription/${ep.id}`}
                    className="group flex items-center gap-3 px-3 py-2.5 -mx-3 rounded-xl hover:bg-[#a05252]/5 transition-colors">
                    <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black ${epDone ? "bg-green-100 text-green-600" : "bg-[#e5dcc8] dark:bg-zinc-800 text-zinc-400"}`}>{ep.episode}</span>
                    <span className={`flex-1 font-serif font-bold text-[15px] break-keep group-hover:text-[#a05252] transition-colors ${epDone ? "text-[#6b5d4f] dark:text-zinc-400" : "text-[#2f2a24] dark:text-zinc-200"}`}>{ep.title}</span>
                    {epDone ? (
                      <span className="text-[10px] font-black text-green-600">새김 ✓</span>
                    ) : epProgress ? (
                      <span className="text-[10px] font-black text-[#a05252]">{Math.round(epProgress.percent)}% · 이어 쓰기 →</span>
                    ) : (
                      <span className="text-[10px] font-black text-[#a05252]">새기러 가기 →</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
          <div className="mt-6 text-center">
            <Link prefetch={false} href={`/transcription/series/${series.id}`} className="text-xs font-black text-[#a05252] underline underline-offset-4">시리즈 소개 페이지 보기</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
