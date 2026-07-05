"use client";

import { useCallback, useEffect, useState } from "react";
import { useVirtualKeyboard } from "./useVirtualKeyboard";

/**
 * 타자 게임(산성비/블록팝/레이스) 공통 모바일 "풀스크린 몰입 모드" 로직.
 *
 * 모바일에서는 헤더·광고 등 사이트 크롬과 가상 자판이 화면을 다 먹어서
 * 게임을 페이지 안에 두면 성립하지 않는다. 플레이 중에는 게임 전체를
 * document.body 포털의 fixed 오버레이로 띄우고(MobileGameShell),
 * 오버레이의 top/height를 visualViewport 실측값에 동기화한다.
 * → iOS에서 자판이 떠 있어도 "실제로 보이는 영역"에 정확히 맞는다.
 *
 *  1) 터치 모바일 판정 (SSR/초기 렌더는 항상 false → hydration mismatch 방지)
 *  2) overlayStyle: 풀스크린 오버레이에 인라인 적용할 top/height
 *  3) 플레이 중 body 스크롤 잠금
 *  4) 입력창 포커스 이탈 = 일시정지 (document 레벨 focusin/out — 입력창이
 *     포털로 이동하며 리마운트되어도 동작)
 */
export function useMobileGamePlay(opts: {
  /** gameState === "playing" 여부 */
  playing: boolean;
  /** 게임 입력창 ref (blur 감지 + 재개 시 재포커스에 사용) */
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { keyboardHeight, viewportHeight } = useVirtualKeyboard();
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);
  const [overlay, setOverlay] = useState<{ top: number; height: number } | null>(null);

  // 1) 터치 모바일 판정 — 마운트 후에만 true가 될 수 있다.
  useEffect(() => {
    const check = () =>
      window.matchMedia("(max-width: 1023px)").matches &&
      window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(check());
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = () => setIsMobile(check());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isMobilePlaying = isMobile && opts.playing;

  // 2) 오버레이 지오메트리: visualViewport의 보이는 영역에 정확히 맞춘다.
  useEffect(() => {
    if (!isMobilePlaying) {
      setOverlay(null);
      return;
    }
    const recalc = () => {
      const vv = window.visualViewport;
      setOverlay({
        top: vv ? vv.offsetTop : 0,
        height: Math.floor(vv ? vv.height : window.innerHeight),
      });
    };
    recalc();
    const raf = requestAnimationFrame(recalc); // 자판 애니메이션 직후 값 반영
    const vv = window.visualViewport;
    vv?.addEventListener("resize", recalc);
    vv?.addEventListener("scroll", recalc);
    window.addEventListener("resize", recalc);
    return () => {
      cancelAnimationFrame(raf);
      vv?.removeEventListener("resize", recalc);
      vv?.removeEventListener("scroll", recalc);
      window.removeEventListener("resize", recalc);
    };
  }, [isMobilePlaying, keyboardHeight, viewportHeight]);

  // 오버레이 진입 직후 입력창 포커스 (포털 이동으로 input이 리마운트되므로 한 틱 뒤)
  useEffect(() => {
    if (!isMobilePlaying) return;
    const t = setTimeout(() => opts.inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobilePlaying]);

  // 3) 플레이 중 body 스크롤 잠금 (오버레이 밖 터치 스크롤 방지)
  useEffect(() => {
    if (!isMobilePlaying) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevOverscroll = body.style.overscrollBehavior;
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    return () => {
      body.style.overflow = prevOverflow;
      body.style.overscrollBehavior = prevOverscroll;
    };
  }, [isMobilePlaying]);

  // 4) 입력창 포커스 이탈 = 일시정지 / 재포커스 = 재개
  //    (document 레벨 위임 — 입력창이 포털로 리마운트되어도 안전)
  //    blur 후 300ms 유예: 명령 버튼 탭처럼 "blur → 즉시 재포커스" 흐름에서
  //    일시정지 오버레이가 깜빡이는 것을 방지한다.
  useEffect(() => {
    if (!isMobilePlaying) {
      setPaused(false);
      return;
    }
    let pauseTimer: ReturnType<typeof setTimeout> | null = null;
    const onFocusOut = (e: FocusEvent) => {
      if (e.target !== opts.inputRef.current) return;
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => setPaused(true), 300);
    };
    const onFocusIn = (e: FocusEvent) => {
      if (e.target !== opts.inputRef.current) return;
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = null;
      setPaused(false);
    };
    document.addEventListener("focusout", onFocusOut);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      if (pauseTimer) clearTimeout(pauseTimer);
      document.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("focusin", onFocusIn);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobilePlaying]);

  // 오버레이 탭 → 입력창 재포커스 (focusin 핸들러가 paused=false 처리)
  const resume = useCallback(() => {
    opts.inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    /** 터치 모바일 여부 (마운트 후에만 true) */
    isMobile,
    /** 모바일 + 플레이 중 → 풀스크린 셸로 렌더해야 함 */
    isMobilePlaying,
    /** 포커스 이탈로 일시정지된 상태 */
    paused,
    /** 풀스크린 셸에 적용할 지오메트리 (모바일 플레이 중이 아니면 null) */
    overlay,
    /** 일시정지 오버레이 탭 시 호출 */
    resume,
  };
}
