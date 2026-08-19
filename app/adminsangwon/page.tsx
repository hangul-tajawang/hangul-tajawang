import Link from "next/link";
import { getAdminStatus } from "@/lib/admin-auth";
import { getAdminBooks, getAdminAuthors } from "@/lib/admin-db";
import { AdminDenied } from "@/components/admin/AdminDenied";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteBook, deleteAuthor } from "./actions";
import { BookOpen, PenLine, UserRound, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

const BOOKS_PER_PAGE = 20;

type Props = { searchParams: Promise<{ page?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  const status = await getAdminStatus();
  if (!status.isAdmin) return <AdminDenied email={status.email} />;

  const [allBooks, authors] = await Promise.all([getAdminBooks(), getAdminAuthors()]);
  const authorName = new Map(authors.map((a) => [a.id, a.name]));

  const { page: pageParam } = await searchParams;
  const totalPages = Math.max(1, Math.ceil(allBooks.length / BOOKS_PER_PAGE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const books = allBooks.slice((page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE);

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 md:px-6 text-on-surface">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <PenLine className="text-primary" /> 책방 관리
        </h1>
        <span className="text-xs font-bold text-zinc-400">{status.email}</span>
      </div>
      <p className="text-sm text-zinc-500 font-medium mb-8">
        게재·수정하면 웹은 즉시, 앱은 다음 조회부터 반영됩니다.
      </p>

      {/* 책 목록 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2"><BookOpen size={18} className="text-primary" /> 책 {allBooks.length}권</h2>
        <Link href="/adminsangwon/book" className="inline-flex items-center gap-1.5 px-4 py-2 primary-gradient text-white text-sm font-bold rounded-full hover:scale-105 transition-transform">
          <Plus size={15} /> 새 책 게재
        </Link>
      </div>
      <ul className="space-y-2 mb-12">
        {books.map((b) => (
          <li key={b.id} className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-surface-high bg-surface-lowest">
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">
                {b.title}
                <span className="ml-2 text-xs font-bold text-zinc-400">{b.id}</span>
              </p>
              <p className="text-xs font-bold text-zinc-500">
                {b.author_id ? authorName.get(b.author_id) || b.author : b.author}
                {" · "}
                {b.published_episodes >= b.total_episodes
                  ? `완결 · 전 ${b.total_episodes}화`
                  : `연재 중 ${b.published_episodes}/${b.total_episodes}화`}
              </p>
            </div>
            <Link href={`/transcription/series/${b.id}`} className="shrink-0 text-xs font-bold text-zinc-400 hover:text-primary" target="_blank">보기</Link>
            <Link href={`/adminsangwon/book?id=${b.id}`} className="shrink-0 px-3.5 py-2 rounded-full bg-surface-high text-xs font-bold hover:text-primary transition-colors">수정</Link>
            <DeleteButton id={b.id} label={`「${b.title}」을(를) 내릴까요? 화 본문도 삭제됩니다.`} action={deleteBook} />
          </li>
        ))}
        {books.length === 0 && <li className="text-sm text-zinc-500 font-medium">아직 게재된 책이 없습니다.</li>}
      </ul>

      {/* 책 목록 페이지네이션 */}
      {totalPages > 1 && (
        <nav className="mb-12 -mt-6 flex items-center justify-center gap-2" aria-label="책 목록 페이지">
          {page > 1 && <Link href={`/adminsangwon?page=${page - 1}`} className="px-4 py-2 rounded-full bg-surface-high text-sm font-bold text-zinc-500 hover:text-primary">← 이전</Link>}
          <span className="text-sm font-bold text-zinc-500">{page} / {totalPages}</span>
          {page < totalPages && <Link href={`/adminsangwon?page=${page + 1}`} className="px-4 py-2 rounded-full bg-surface-high text-sm font-bold text-zinc-500 hover:text-primary">다음 →</Link>}
        </nav>
      )}

      {/* 작가 목록 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2"><UserRound size={18} className="text-primary" /> 작가 {authors.length}명</h2>
        <Link href="/adminsangwon/author" className="inline-flex items-center gap-1.5 px-4 py-2 primary-gradient text-white text-sm font-bold rounded-full hover:scale-105 transition-transform">
          <Plus size={15} /> 새 작가 등록
        </Link>
      </div>
      <ul className="space-y-2">
        {authors.map((a) => (
          <li key={a.id} className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-surface-high bg-surface-lowest">
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{a.name} <span className="ml-2 text-xs font-bold text-zinc-400">{a.id}</span></p>
              {a.bio && <p className="text-xs font-bold text-zinc-500 truncate">{a.bio}</p>}
            </div>
            <Link href={`/authors/${a.id}`} className="shrink-0 text-xs font-bold text-zinc-400 hover:text-primary" target="_blank">보기</Link>
            <Link href={`/adminsangwon/author?id=${a.id}`} className="shrink-0 px-3.5 py-2 rounded-full bg-surface-high text-xs font-bold hover:text-primary transition-colors">수정</Link>
            <DeleteButton id={a.id} label={`작가 ${a.name}(${a.id})을(를) 삭제할까요?`} action={deleteAuthor} />
          </li>
        ))}
      </ul>
    </div>
  );
}
