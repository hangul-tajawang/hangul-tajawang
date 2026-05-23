import React from "react";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";
import { Newspaper, Calendar, Hash, ArrowRight } from "lucide-react";

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

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-primary/10 rounded-2xl mb-6 shadow-sm border border-primary/20">
            <Newspaper className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-on-surface mb-4 tracking-tight">
            한글타자왕 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">블로그</span>
          </h1>
          <p className="text-zinc-500 text-lg sm:text-xl font-medium max-w-2xl mx-auto break-keep">
            단순한 타자 연습을 넘어, 당신의 개발 능률과 정서적 만족을 극대화하는 깊이 있는 인사이트를 나눕니다.
          </p>
        </header>

        <div className="grid gap-6 sm:gap-8">
          {blogPosts.map((post, index) => (
            <Link href={`/blog/${post.id}`} key={post.id} prefetch={false} className="group flex flex-col md:flex-row gap-6 p-6 sm:p-8 bg-surface-lowest hover:bg-surface-lowest/80 border border-outline-variant hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 rounded-3xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 overflow-hidden" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-wider text-primary">
                  <span className="flex items-center gap-1.5 bg-primary/10 py-1.5 px-3 rounded-full">
                    <Hash size={14} />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-800 mb-3 group-hover:text-primary transition-colors leading-snug break-keep">
                  {post.title}
                </h2>
                <p className="text-zinc-500 line-clamp-2 leading-relaxed mb-6">
                  {post.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all mt-auto">
                  아티클 읽기 <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
