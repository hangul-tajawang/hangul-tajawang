import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts, BlogPost } from '@/lib/blog-data';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { Calendar, Hash, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

// 빌드 타임에 모든 블로그 포스트 경로 생성
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id,
  }));
}

// 각 포스트별 SEO 맞춤형 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);
  
  if (!post) {
    return {
      title: 'Post Not Found | 한글타자왕',
    };
  }

  return {
    title: `${post.title} | 한글타자왕 블로그`,
    description: post.description,
    keywords: post.keyword + ", 한글타자왕, 타자, 생산성, 개발자 타자",
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['한글타자왕'],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  // JSON-LD 스키마 데이터 생성
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: '한글타자왕'
    },
    publisher: {
      '@type': 'Organization',
      name: '한글타자왕',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hangul-tajawang.com/favicon.ico' // 임시 로고 URL
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://hangul-tajawang.com/blog/${post.id}`
    }
  };

  return (
    <>
      {/* SEO를 위한 JSON-LD 스키마 주입 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-surface py-12 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          {/* 뒤로 가기 링크 */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary font-bold mb-8 transition-colors">
            <ArrowLeft size={18} /> 목록으로 돌아가기
          </Link>

          {/* 블로그 헤더 */}
          <header className="mb-12 border-b border-outline-variant pb-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
                <Hash size={14} />
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-zinc-400 text-sm font-semibold">
                <Calendar size={14} />
                {post.date}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-on-surface leading-tight break-keep mb-6">
              {post.title}
            </h1>
            
            <p className="text-xl text-zinc-500 leading-relaxed font-medium">
              {post.description}
            </p>
          </header>

          {/* 마크다운 콘텐츠 렌더링 영역 */}
          <main className="animate-in fade-in slide-in-from-bottom-8 duration-700 bg-surface-lowest p-6 sm:p-10 rounded-3xl shadow-sm border border-outline-variant">
            <MarkdownRenderer content={post.content} />
          </main>
        </div>
      </div>
    </>
  );
}
