import { ShieldAlert } from 'lucide-react';

/** 비관리자/비로그인 안내 — 현재 이메일을 보여줘서 ADMIN_EMAILS 설정을 돕는다 */
export function AdminDenied({ email }: { email: string | null }) {
  return (
    <div className="w-full max-w-md mx-auto py-24 px-6 text-center text-on-surface">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 mb-6">
        <ShieldAlert size={30} />
      </div>
      <h1 className="text-2xl font-black mb-3">관리자 전용 페이지입니다</h1>
      {email ? (
        <p className="text-sm text-zinc-500 font-medium leading-relaxed break-keep">
          현재 <strong className="text-on-surface">{email}</strong> 계정으로
          로그인감지 완료했습니다. 위험 접근으로 구분합니다.
        </p>
      ) : (
        <p className="text-sm text-zinc-500 font-medium leading-relaxed break-keep">
          먼저 카카오 로그인을 해주세요. 로그인 후 이메일이 관리자 목록에 있으면
          자동으로 열립니다.
        </p>
      )}
    </div>
  );
}
