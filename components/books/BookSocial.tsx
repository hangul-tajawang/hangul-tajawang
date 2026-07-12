"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Heart, MessageSquare, Eye, Send, Trash2, Loader2 } from "lucide-react";
import { supabase, SupabaseService } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// 책 소셜 (조회수 · 좋아요 · 댓글)
//   supabase/book_social.sql 로 만든 테이블을 사용한다.
//   테이블이 없거나 조회가 실패하면 조용히 숨긴다(기능 없이도 페이지 정상).
//   book_id 는 시리즈 ID(예: 'novel7').
// ─────────────────────────────────────────────────────────────────────────────

type Comment = {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  profiles?: { nickname?: string | null; avatar_url?: string | null } | null;
};

export function BookSocial({ bookId }: { bookId: string }) {
  const [available, setAvailable] = useState(true);
  const [ready, setReady] = useState(false);

  const [user, setUser] = useState<{ id: string } | null>(null);
  const [views, setViews] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const viewCounted = useRef(false);

  const load = useCallback(async () => {
    // 현재 사용자
    const currentUser = await SupabaseService.getCurrentUser();

    // 마운트 1회 조회수 증가 (실패는 무시)
    if (!viewCounted.current) {
      viewCounted.current = true;
      await supabase.rpc("increment_book_view", { b_id: bookId });
    }

    const [viewsRes, likesRes, commentsRes] = await Promise.all([
      supabase.from("book_views").select("views").eq("book_id", bookId).maybeSingle(),
      supabase.from("book_likes").select("user_id").eq("book_id", bookId),
      supabase
        .from("book_comments")
        .select("*, profiles(nickname, avatar_url)")
        .eq("book_id", bookId)
        .order("created_at", { ascending: false }),
    ]);

    // 테이블 미생성/권한 오류 등 → 기능 숨김
    if (viewsRes.error || likesRes.error || commentsRes.error) {
      setAvailable(false);
      setReady(true);
      return;
    }

    setUser(currentUser ? { id: currentUser.id } : null);
    setViews(viewsRes.data?.views ?? 0);
    const likes = (likesRes.data as { user_id: string }[]) || [];
    setLikeCount(likes.length);
    setLiked(!!currentUser && likes.some((l) => l.user_id === currentUser.id));
    setComments((commentsRes.data as Comment[]) || []);
    setReady(true);
  }, [bookId]);

  useEffect(() => {
    load().catch(() => {
      setAvailable(false);
      setReady(true);
    });
  }, [load]);

  const toggleLike = async () => {
    if (!user) {
      alert("로그인 후 좋아요를 누를 수 있어요.");
      return;
    }
    if (liked) {
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
      await supabase.from("book_likes").delete().match({ user_id: user.id, book_id: bookId });
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      await supabase.from("book_likes").insert({ user_id: user.id, book_id: bookId });
    }
  };

  const addComment = async () => {
    if (!user) {
      alert("로그인 후 댓글을 남길 수 있어요.");
      return;
    }
    const body = text.trim();
    if (!body) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("book_comments")
        .insert({ book_id: bookId, user_id: user.id, comment: body });
      if (!error) {
        setText("");
        const { data } = await supabase
          .from("book_comments")
          .select("*, profiles(nickname, avatar_url)")
          .eq("book_id", bookId)
          .order("created_at", { ascending: false });
        setComments((data as Comment[]) || []);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    await supabase.from("book_comments").delete().eq("id", id).eq("user_id", user?.id || "");
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  // 준비 전이거나 사용할 수 없으면 아무것도 렌더링하지 않음
  if (!ready || !available) return null;

  return (
    <section className="mt-14 pt-10 border-t border-surface-high">
      {/* 지표 */}
      <div className="flex items-center gap-4 mb-6">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-500">
          <Eye size={16} /> {views.toLocaleString()}
        </span>
        <button
          onClick={toggleLike}
          aria-pressed={liked}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-black transition-all active:scale-95 ${
            liked
              ? "bg-rose-500/15 text-rose-500"
              : "bg-surface-lowest text-zinc-500 border border-surface-high hover:text-rose-500"
          }`}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} /> {likeCount.toLocaleString()}
        </button>
      </div>

      {/* 댓글 */}
      <h3 className="flex items-center gap-2 text-lg font-black mb-5">
        <MessageSquare size={18} className="text-primary" /> 댓글
        <span className="text-primary/40">{comments.length}</span>
      </h3>

      <div className="relative mb-8">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addComment()}
          placeholder={user ? "이 작품을 필사한 소감을 남겨주세요" : "로그인 후 댓글을 남길 수 있어요"}
          disabled={!user || submitting}
          className="w-full rounded-2xl bg-surface-lowest border border-surface-high px-5 py-4 pr-16 text-base font-medium outline-none focus:border-primary/50 transition-colors disabled:opacity-60"
        />
        <button
          onClick={addComment}
          disabled={!user || !text.trim() || submitting}
          aria-label="댓글 등록"
          className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-primary text-white font-black flex items-center justify-center hover:scale-105 disabled:opacity-40 transition-all"
        >
          {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </div>

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="flex gap-4 group/comment">
              <div className="w-11 h-11 shrink-0 rounded-2xl bg-surface-high flex items-center justify-center overflow-hidden font-black text-primary/40">
                {c.profiles?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{c.profiles?.nickname?.[0] || "?"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="font-black text-on-surface break-keep">
                    {c.profiles?.nickname || "익명"}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-bold text-zinc-400">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                    {user?.id === c.user_id && (
                      <button
                        onClick={() => deleteComment(c.id)}
                        aria-label="댓글 삭제"
                        className="text-red-400 opacity-0 group-hover/comment:opacity-100 transition-all hover:scale-110"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-zinc-500 leading-relaxed break-keep whitespace-pre-wrap">
                  {c.comment}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-10 text-zinc-400 font-bold">
            첫 댓글을 남겨보세요.
          </p>
        )}
      </div>
    </section>
  );
}

export default BookSocial;
