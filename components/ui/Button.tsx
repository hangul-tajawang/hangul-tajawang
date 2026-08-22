import React from "react";
import Link from "next/link";

/**
 * 버튼 프리미티브 — 3위계 통일 (잉크 솔리드 / 괘선 아웃라인 / 텍스트).
 * 순수 presentational — onClick 등 기존 핸들러를 그대로 전달만 한다.
 */
const VARIANTS = {
  primary: "bg-primary text-white hover:bg-blue-700 active:scale-[0.98]",
  ink: "bg-on-surface text-white hover:bg-zinc-800 active:scale-[0.98]",
  secondary: "bg-surface-lowest text-on-surface border border-outline-variant hover:border-zinc-400 active:scale-[0.98]",
  text: "text-primary hover:underline underline-offset-4",
} as const;

const SIZES = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
} as const;

type CommonProps = {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${variant === "text" ? "" : SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all ${VARIANTS[variant]} ${variant === "text" ? "" : SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
