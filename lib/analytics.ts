import { supabase } from './supabase';

// 필사 리텐션(D1/D7, 완주율) 측정용 최소 계측.
// 로그인 없이도 재방문을 추적할 수 있도록 localStorage 기반 익명 방문자 ID를 사용한다.
// usage_events 테이블 생성 SQL과 분석 쿼리는 scripts/usage-events.sql 참고.

const VISITOR_KEY = 'htw_visitor_id';

function getVisitorId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return null; // 시크릿 모드 등 localStorage 불가 환경
  }
}

export type UsageEventName = 'pilsa_start' | 'pilsa_complete';

// 계측 실패가 사용자 경험을 해치지 않도록 항상 조용히 무시한다.
export function track(
  event: UsageEventName,
  props: Record<string, string | number | boolean | null> = {}
): void {
  // GTM dataLayer에도 전달 — GTM에서 맞춤 이벤트 트리거를 만들면 GA4에서도 조회 가능
  try {
    (window as any).dataLayer?.push({ event, ...props });
  } catch {
    /* noop */
  }

  const visitorId = getVisitorId();
  if (!visitorId) return;
  supabase
    .from('usage_events')
    .insert({
      visitor_id: visitorId,
      event,
      props,
      path: window.location.pathname,
    })
    .then(({ error }) => {
      if (error && process.env.NODE_ENV === 'development') {
        console.warn('[analytics] track 실패:', error.message);
      }
    });
}
