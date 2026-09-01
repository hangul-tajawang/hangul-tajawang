// Header/Footer 등 공통 크롬의 로케일 사전.
// ko가 기준 사전이며, en에 키가 빠지면 스프레드 폴백으로 ko 문자열이 노출된다(빈 화면·빌드 실패 방지).
// 연습 지문·콘텐츠 데이터는 여기 넣지 않는다 — 로케일 무관하게 한글 그대로.

import type { Locale } from './routes';

const ko = {
  menu: '메뉴',
  tools: '도구',
  toolsSection: '도구',
  login: '시작하기',
  loginLong: '3초 만에 시작하기',
  logout: '로그아웃',
  mypage: '마이페이지',
  defaultNickname: '필사 작가',
  languageSwitch: 'English',
  mainNavAria: '주요 메뉴',
  footerCopyright: '© 2026 한글타자왕 · 블루커뮤니케이션즈 주식회사',
  footerGuide: '이용 가이드',
  footerTerms: '이용약관',
  footerPrivacy: '개인정보처리방침',
  footerContact: '문의하기',
};

const en: typeof ko = {
  menu: 'Menu',
  tools: 'More',
  toolsSection: 'Tools',
  login: 'Sign in',
  loginLong: 'Sign in with Kakao',
  logout: 'Sign out',
  mypage: 'My Account',
  defaultNickname: 'Typist',
  languageSwitch: '한국어',
  mainNavAria: 'Main menu',
  footerCopyright: '© 2026 Hangul Tajawang · Bluecommunications Inc.',
  footerGuide: 'Typing Guide',
  footerTerms: 'Terms',
  footerPrivacy: 'Privacy',
  footerContact: 'Contact',
};

export type ChromeDict = typeof ko;

export function getChromeDict(locale: Locale): ChromeDict {
  // en에 누락 키가 생겨도 ko로 폴백되도록 스프레드 병합
  return locale === 'en' ? { ...ko, ...en } : ko;
}

/** 내비 항목 — 로케일별로 노출 메뉴 자체가 다르다(en은 /en 버전이 존재하는 메뉴만 노출) */
export interface NavItem {
  href: string;
  label: string;
  highlight?: boolean;
}

export const NAV_ITEMS: Record<Locale, { main: NavItem[]; tools: NavItem[] }> = {
  ko: {
    main: [
      { href: '/journey', label: '지식타자', highlight: true },
      { href: '/challenge', label: '필사 챌린지', highlight: true },
      { href: '/game', label: '한글 게임', highlight: true },
    ],
    tools: [
      { href: '/test', label: '1분 타자 테스트' },
      { href: '/practice', label: '타자 연습장' },
      { href: '/transcription', label: '원고지 필사' },
      { href: '/quiz', label: '맞춤법 퀴즈' },
      { href: '/blog', label: '블로그' },
    ],
  },
  en: {
    main: [
      { href: '/en/game', label: 'Typing Games', highlight: true },
      { href: '/en/test', label: 'Typing Test', highlight: true },
      { href: '/en/practice', label: 'Practice', highlight: true },
    ],
    tools: [{ href: '/en/guide', label: 'How to Type in Korean' }],
  },
};
