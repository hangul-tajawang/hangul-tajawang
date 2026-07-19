"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export type BookMetrics = {
  readonly views: number;
  readonly likes: number;
  readonly comments: number;
};

export type BookMetricsById = Readonly<Record<string, BookMetrics>>;

const ZERO: BookMetrics = { views: 0, likes: 0, comments: 0 };

/** book_id 컬럼만 받아 클라이언트에서 개수를 센다 (책 수와 무관하게 쿼리 1개) */
function tally(rows: { book_id: string }[] | null): Map<string, number> {
  const map = new Map<string, number>();
  for (const r of rows || []) map.set(r.book_id, (map.get(r.book_id) || 0) + 1);
  return map;
}

export function useBookSocialMetrics(bookIds: readonly string[]): BookMetricsById {
  const empty = useMemo(
    () => Object.fromEntries(bookIds.map((id) => [id, ZERO])) as BookMetricsById,
    [bookIds]
  );
  const [metrics, setMetrics] = useState<BookMetricsById>(empty);

  useEffect(() => {
    let active = true;
    // 책 수와 무관하게 항상 쿼리 3개 (앱 fetchSocialCounts 와 동일 패턴)
    void Promise.all([
      supabase.from("book_views").select("book_id, views"),
      supabase.from("book_likes").select("book_id"),
      supabase.from("book_comments").select("book_id"),
    ]).then(([viewsResult, likesResult, commentsResult]) => {
      if (!active) return;
      const views = new Map((viewsResult.data || []).map((row) => [row.book_id, Number(row.views)]));
      const likes = tally(likesResult.data);
      const comments = tally(commentsResult.data);
      setMetrics(Object.fromEntries(bookIds.map((id) => [id, {
        views: views.get(id) || 0,
        likes: likes.get(id) || 0,
        comments: comments.get(id) || 0,
      }])));
    });
    return () => { active = false; };
  }, [bookIds]);

  return metrics;
}
