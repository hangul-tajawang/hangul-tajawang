/**
 * 관리자 판별 (서버 전용)
 *
 * 카카오 로그인 세션의 이메일이 .env 의 ADMIN_EMAILS(쉼표 구분)에 있으면 관리자.
 * Vercel 환경변수에도 ADMIN_EMAILS 와 SUPABASE_SERVICE_ROLE_KEY 를 넣어야
 * 프로덕션 /admin 이 동작한다.
 */
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export interface AdminStatus {
  /** 로그인한 사용자 이메일 (비로그인 null) */
  email: string | null;
  isAdmin: boolean;
}

export async function getAdminStatus(): Promise<AdminStatus> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          /* 서버 컴포넌트에서는 쿠키를 쓰지 않는다 (미들웨어가 갱신 담당) */
        },
      },
    }
  );
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase() || null;
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return { email, isAdmin: !!email && admins.includes(email) };
}

/** 서버 액션 가드 — 관리자가 아니면 throw */
export async function assertAdmin(): Promise<void> {
  const { isAdmin } = await getAdminStatus();
  if (!isAdmin) throw new Error("관리자 권한이 없습니다.");
}
