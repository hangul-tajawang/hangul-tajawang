"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useVirtualKeyboard } from "./useVirtualKeyboard";

/**
 * 타자 게임(산성비/블록팝/레이스) 공통 모바일 플레이 로직.
 *
 * 세 게임이 반복하던 아래 4가지를 한 훅으로 묶는다.
 *  1) 터치 모바일 판정 (SSR/초기 렌더는 항상 false → 데스크톱 마크업으로 hydration mismatch 방지)
 *  2) 뷰포트 실측 높이 고정 (visualViewport 기반) — 자판이 떠도 입력창이 자판 바로 위에 보이게
 *  3) 플레이 중 스크롤 잠금 (터치무브 방지 포함)
 *  4) 입력창 포커스 이탈 = 일시정지 (자판이 내려가면 게임이 그대로 죽는 문제 방지)
 *
 * useVirtualKeyboard 자체는 수정하지 않고 조합해서 사용한다.
 */
export function useMobileGamePlay(opts: {
  /** gameState === "playing" 여부 */
  playing: boolean;
  /** 게임 입력창 ref (blur 감지 + 재개 시 재포커스에 사용) */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** 래퍼 상단~게임영역 사이의 여유 높이(px). 게임영역 최소 확보용 하한 등에 사용 */
  minWrapperHeight?: number;
}) {
  const { keyboardHeight, viewportHeight } = useVirtualKeyboard();
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);
  const [wrapperHeight, setWrapperHeight] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const minH = opts.minWrapperHeight ?? 320;

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

  // 2) 뷰포트 실측 높이 고정 — 자판 높이(keyboardHeight)/뷰포트 높이 변화마다 재계산
  useEffect(() => {
    if (!isMobilePlaying) {
      setWrapperHeight(null);
      return;
    }
    const recalc = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const vv = window.visualViewport;
      const vh = vv ? vv.height : window.innerHeight;
      const offsetTop = vv ? vv.offsetTop : 0;
      // 래퍼 상단까지의 헤더 오프셋 = getBoundingClientRect().top + visualViewport.offsetTop
      const headerOffset = el.getBoundingClientRect().top + offsetTop;
      const h = Math.floor(vh - headerOffset) - 4; // 하단 4px 여유
      setWrapperHeight(Math.max(minH, h));
    };
    recalc();
    // 두 번의 rAF로 자판 애니메이션 도중/직후 값도 반영
    const raf = requestAnimationFrame(recalc);
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
  }, [isMobilePlaying, keyboardHeight, viewportHeight, minH]);

  // 3) 플레이 중 스크롤 잠금 (+ 터치무브로 인한 페이지 스크롤 방지)
  useEffect(() => {
    if (!isMobilePlaying) return;
    window.scrollTo(0, 0);
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevOverscroll = body.style.overscrollBehavior;
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    const preventTouch = (e: TouchEvent) => {
      // 입력창 내부(캐럿 이동 등)는 허용, 그 외 페이지 스크롤은 차단
      if (opts.inputRef.current && opts.inputRef.current.contains(e.target as Node)) return;
      e.preventDefault();
    };
    document.addEventListener("touchmove", preventTouch, { passive: false });
    return () => {
      body.style.overflow = prevOverflow;
      body.style.overscrollBehavior = prevOverscroll;
      document.removeEventListener("touchmove", preventTouch);
    };
    // inputRef는 안정적인 ref 객체이므로 deps에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobilePlaying]);

  // 4) 입력창 포커스 이탈 = 일시정지 / 재포커스 = 재개
  useEffect(() => {
    if (!isMobilePlaying) {
      setPaused(false);
      return;
    }
    const input = opts.inputRef.current;
    if (!input) return;
    const onBlur = () => setPaused(true);
    const onFocus = () => setPaused(false);
    input.addEventListener("blur", onBlur);
    input.addEventListener("focus", onFocus);
    return () => {
      input.removeEventListener("blur", onBlur);
      input.removeEventListener("focus", onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobilePlaying]);

  // 오버레이 탭 → 입력창 재포커스 (onFocus 핸들러가 paused=false 처리)
  const resume = useCallback(() => {
    opts.inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    /** 터치 모바일 여부 (마운트 후에만 true) */
    isMobile,
    /** 모바일 + 플레이 중 */
    isMobilePlaying,
    /** 포커스 이탈로 일시정지된 상태 */
    paused,
    /** 래퍼에 붙일 ref */
    wrapperRef,
    /** 모바일 플레이 중 래퍼에 인라인으로 적용할 실측 높이(px). 그 외에는 null */
    wrapperHeight: isMobilePlaying ? wrapperHeight : null,
    /** 일시정지 오버레이 탭 시 호출 */
    resume,
  };
}
