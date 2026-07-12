import { PILSA_SERIES } from "@/lib/long-text-data";

export const BOOK_SORT_OPTIONS = [
  { key: "editorial", label: "기본순" },
  { key: "views", label: "조회순" },
  { key: "likes", label: "좋아요순" },
  { key: "comments", label: "댓글순" },
] as const;

export type BookSortKey = (typeof BOOK_SORT_OPTIONS)[number]["key"];

export const BOOK_EDITORIAL_ORDER = new Map(
  PILSA_SERIES.map((series, index) => [series.id, index]),
);
