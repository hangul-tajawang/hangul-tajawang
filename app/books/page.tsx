import { permanentRedirect } from "next/navigation";

/**
 * 책방 폐지 — 라우트 차원의 영구 리다이렉트.
 * next.config redirects만으로는 R2에 남은 ISR 캐시(SWR)가 구버전을 계속 서빙하므로,
 * 라우트를 살려 재검증 시 캐시가 리다이렉트로 교체되게 한다.
 */
export default function BooksRedirect() {
  permanentRedirect("/transcription");
}
