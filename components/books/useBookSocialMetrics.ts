"use client";

import { useEffect, useState } from "react";
import { PILSA_SERIES } from "@/lib/long-text-data";
import { supabase } from "@/lib/supabase";

export type BookMetrics = {
  readonly views: number;
  readonly likes: number;
  readonly comments: number;
};

export type BookMetricsById = Readonly<Record<string, BookMetrics>>;

const EMPTY_METRICS = Object.fromEntries(
  PILSA_SERIES.map((series) => [series.id, { views: 0, likes: 0, comments: 0 }])
) satisfies Record<string, BookMetrics>;

async function countRows(table: "book_likes" | "book_comments", bookId: string): Promise<number> {
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("book_id", bookId);
  return count || 0;
}

export function useBookSocialMetrics(): BookMetricsById {
  const [metrics, setMetrics] = useState<BookMetricsById>(EMPTY_METRICS);

  useEffect(() => {
    let active = true;
    void Promise.all([
      supabase.from("book_views").select("book_id, views"),
      Promise.all(PILSA_SERIES.map((series) => countRows("book_likes", series.id))),
      Promise.all(PILSA_SERIES.map((series) => countRows("book_comments", series.id))),
    ]).then(([viewsResult, likeCounts, commentCounts]) => {
      if (!active) return;
      const views = new Map((viewsResult.data || []).map((row) => [row.book_id, Number(row.views)]));
      setMetrics(Object.fromEntries(PILSA_SERIES.map((series, index) => [series.id, {
        views: views.get(series.id) || 0,
        likes: likeCounts[index],
        comments: commentCounts[index],
      }])));
    });
    return () => { active = false; };
  }, []);

  return metrics;
}
