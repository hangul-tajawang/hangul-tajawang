import { permanentRedirect } from "next/navigation";

/** 책방 폐지 — 투고 페이지도 원고지 필사로 영구 이동 (ISR 캐시 자가 치유용 라우트) */
export default function BooksSubmitRedirect() {
  permanentRedirect("/transcription");
}
