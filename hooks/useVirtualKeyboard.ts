"use client";

import { useEffect, useState } from "react";

/**
 * 모바일 가상 키보드 감지 훅
 *
 * - keyboardHeight: 가상 키보드가 차지하는 높이(px). 데스크톱/키보드 없음 = 0
 * - keyboardOpen: 키보드가 열려 있는지 여부
 * - isTouch: 터치 기기 여부 (마우스 없는 coarse pointer)
 * - viewportHeight: 실제로 보이는 영역 높이 (visualViewport 기준)
 *
 * 안드로이드 크롬은 viewport meta의 interactive-widget=resizes-content로
 * 레이아웃 자체가 줄어들지만, iOS 사파리는 레이아웃이 유지된 채
 * visualViewport만 줄어들기 때문에 이 훅으로 감지해 UI를 조정한다.
 */
export function useVirtualKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);

    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      // 레이아웃 뷰포트와 비주얼 뷰포트의 차이 = 키보드(+브라우저 UI) 높이
      const diff = Math.max(0, window.innerHeight - vv.height);
      // 80px 이하의 차이는 브라우저 주소창 변화로 보고 무시
      setKeyboardHeight(diff > 80 ? diff : 0);
      setViewportHeight(vv.height);
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return { keyboardHeight, keyboardOpen: keyboardHeight > 0, isTouch, viewportHeight };
}

/** 입력창 포커스 시 해당 요소가 키보드에 가리지 않게 화면 중앙으로 스크롤 */
export function scrollIntoViewOnFocus(el: HTMLElement | null) {
  if (!el) return;
  setTimeout(() => {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 300); // 키보드 애니메이션이 끝난 뒤 스크롤
}
