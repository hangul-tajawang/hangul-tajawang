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

async function countRows(table: "book_likes" | "book_comments", bookId: string): Promise<number> {
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("book_id", bookId);
  return count || 0;
}

export function useBookSocialMetrics(bookIds: readonly string[]): BookMetricsById {
  const empty = useMemo(
    () => Object.fromEntries(bookIds.map((id) => [id, ZERO])) as BookMetricsById,
    [bookIds]
  );
  const [metrics, setMetrics] = useState<BookMetricsById>(empty);

  useEffect(() => {
    let active = true;
    void Promise.all([
      supabase.from("book_views").select("book_id, views"),
      Promise.all(bookIds.map((id) => countRows("book_likes", id))),
      Promise.all(bookIds.map((id) => countRows("book_comments", id))),
    ]).then(([viewsResult, likeCounts, commentCounts]) => {
      if (!active) return;
      const views = new Map((viewsResult.data || []).map((row) => [row.book_id, Number(row.views)]));
      setMetrics(Object.fromEntries(bookIds.map((id, index) => [id, {
        views: views.get(id) || 0,
        likes: likeCounts[index],
        comments: commentCounts[index],
      }])));
    });
    return () => { active = false; };
  }, [bookIds]);

  return metrics;
}
