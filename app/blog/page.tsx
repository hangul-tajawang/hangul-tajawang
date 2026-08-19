import React from "react";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "블로그 | 한글타자왕",
  description: "타자와 개발, 그리고 사람 중심의 이야기를 담은 한글타자왕의 블로그입니다.",
  alternates: {
    canonical: 'https://www.hangul-tajawang.com/blog',
  },
  openGraph: {
    title: "한글타자왕 블로그 - 타자와 성장의 이야기",
    description: "단순한 연습을 넘어 인사이트를 나누는 블로그입니다.",
    url: "https://www.hangul-tajawang.com/blog",
  }
};

// 카테고리별 표지색 — 그라데이션/이모지 대신 타이포 표지 (책방 표지 문법)
const CATEGORY_TONE: Record<string, string> = {
  '가이드': 'bg-primary',
  '맞춤법': 'bg-success',
  '게임': 'bg-on-surface',
  '필사': 'bg-tertiary',
  '장비': 'bg-zinc-600',
  '지식': 'bg-blue-800',
  '생산성': 'bg-zinc-800',
};
const DEFAULT_TONE = 'bg-zinc-700';

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-14 text-left">
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-3">Blog</p>
          <h1 className="serif-display text-3xl sm:text-5xl font-bold text-on-surface mb-4">
            한글타자왕 블로그
          </h1>
          <p className="text-zinc-600 text-lg max-w-2xl break-keep leading-relaxed">
            단순한 타자 연습을 넘어, 당신의 개발 능률과 정서적 만족을 극대화하는 깊이 있는 인사이트를 나눕니다.
          </p>
          <div className="rule-divider mt-8" />
        </header>

        <div className="divide-y divide-outline-variant">
          {[...blogPosts].sort((a, b) => b.date.localeCompare(a.date)).map((post) => {
            const tone = CATEGORY_TONE[post.category] || DEFAULT_TONE;
            return (
            <Link href={`/blog/${post.id}`} key={post.id} prefetch={false} className="group flex flex-col md:flex-row gap-6 py-8 px-1 hover:bg-surface-low transition-colors">
              {/* 타이포 표지 — 제목 첫머리를 활자로 새긴 잉크 표지 */}
              <div className={`shrink-0 w-full md:w-40 h-28 md:h-auto md:self-stretch rounded-xl ${tone} text-white p-4 flex flex-col justify-between overflow-hidden`}>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">{post.category}</span>
                <span className="serif-display text-lg leading-snug line-clamp-3 break-keep">
                  {post.title.split(':')[0]}
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex items-baseline gap-3 mb-3 text-xs font-semibold text-zinc-500">
                  <span className="text-primary">{post.category}</span>
                  <span aria-hidden>·</span>
                  <span>{post.date}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors leading-snug break-keep">
                  {post.title}
                </h2>
                <p className="text-zinc-600 line-clamp-2 leading-relaxed">
                  {post.description}
                </p>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
