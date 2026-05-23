'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';

interface Props {
  content: string;
}

export function MarkdownRenderer({ content }: Props) {
  // <script> 태그 제거 (보안)
  const sanitized = content.replace(/<script[\s\S]*?<\/script>/gi, '');

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // ── Headings ────────────────────────────────────────────────────────
        h1: ({ children }) => (
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 mt-14 mb-6 leading-tight break-keep border-b border-zinc-100 dark:border-zinc-800 pb-4">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-200 mt-12 mb-5 leading-snug break-keep">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-700 dark:text-zinc-300 mt-10 mb-4 break-keep">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-bold text-zinc-700 dark:text-zinc-300 mt-8 mb-3">
            {children}
          </h4>
        ),

        // ── Paragraph ───────────────────────────────────────────────────────
        p: ({ children }) => (
          <p className="mb-6 text-zinc-600 dark:text-zinc-400 leading-loose text-lg font-medium break-keep">
            {children}
          </p>
        ),

        // ── Links ────────────────────────────────────────────────────────────
        a: ({ href, children }) => {
          const isInternal = href?.startsWith('/');
          if (isInternal) {
            return (
              <Link prefetch={false}
                href={href!}
                className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-full text-base hover:bg-blue-700 transition-all shadow-md hover:scale-105 no-underline"
              >
                {children}
              </Link>
            );
          }
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-2 hover:text-blue-800 transition-colors"
            >
              {children}
            </a>
          );
        },

        // ── Lists ────────────────────────────────────────────────────────────
        ul: ({ children }) => (
          <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
            {children}
          </li>
        ),

        // ── Emphasis ─────────────────────────────────────────────────────────
        strong: ({ children }) => (
          <strong className="font-extrabold text-zinc-900 dark:text-zinc-100">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-zinc-700 dark:text-zinc-300">{children}</em>
        ),

        // ── Code ─────────────────────────────────────────────────────────────
        code: ({ children, className }) => {
          const isBlock = className?.includes('language-');
          if (isBlock) {
            return (
              <code className="block bg-zinc-900 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto">
                {children}
              </code>
            );
          }
          return (
            <code className="bg-zinc-100 dark:bg-zinc-800 text-red-500 px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="mb-6 overflow-x-auto">{children}</pre>
        ),

        // ── Blockquote ────────────────────────────────────────────────────────
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500 pl-5 py-1 my-6 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl">
            {children}
          </blockquote>
        ),

        // ── Divider ──────────────────────────────────────────────────────────
        hr: () => (
          <hr className="my-10 border-zinc-200 dark:border-zinc-700" />
        ),

        // ── Images ───────────────────────────────────────────────────────────
        img: ({ src, alt }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || ''}
            className="w-full rounded-2xl my-6 shadow-md"
          />
        ),

        // ── HTML 요소 패스스루 (rehype-raw로 처리된 것) ──────────────────────
        div: ({ children, ...props }) => (
          <div {...props} className="my-8 flex justify-center">
            {children}
          </div>
        ),
      }}
    >
      {sanitized}
    </ReactMarkdown>
  );
}
