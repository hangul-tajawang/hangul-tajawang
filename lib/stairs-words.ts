// 글자 계단(StairsGame) 전용 출제 로직
// 공용 단어 풀(lib/game-words.ts)은 건드리지 않고 import만 해서,
// 층수 구간별 자모 워밍업·테마 단어 혼합을 이 파일에서 담당합니다.

import { EASY_WORDS, MEDIUM_WORDS, HARD_WORDS, IDIOMS } from "./game-words";

// 1~10층: 단어 대신 자모 하나 (타자 워밍업 구간)
export const JAMO = [
  'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ', 'ㅐ', 'ㅔ',
];

// 테마: 과일 (초반 구간에 혼합)
export const FRUIT_WORDS = ['사과', '바나나', '포도', '딸기', '수박', '참외', '복숭아', '자두', '감', '배', '귤', '키위', '망고', '체리', '블루베리', '파인애플', '오렌지', '레몬', '라임', '석류', '무화과', '살구', '멜론', '한라봉', '용과'];

// 테마: 한국사 (중후반 구간에 혼합)
export const HISTORY_WORDS = ['고조선', '고구려', '백제', '신라', '가야', '발해', '고려', '조선', '세종대왕', '훈민정음', '이순신', '거북선', '임진왜란', '광개토대왕', '을지문덕', '강감찬', '팔만대장경', '직지심체요절', '삼국사기', '삼국유사', '단군왕검', '선덕여왕', '장보고', '김유신', '측우기', '앙부일구', '경국대전', '병자호란', '대한제국', '독립운동'];

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

// 기본 풀 + 테마 풀 혼합 (테마 단어가 40% 확률로 섞임)
const mixPick = (base: string[], theme: string[]) =>
  Math.random() < 0.4 ? pick(theme) : pick(base);

/**
 * 층수별 출제 단어를 반환합니다.
 *  1~10층   자모 하나
 * 11~40층   EASY + 과일
 * 41~90층   MEDIUM + 한국사
 * 91~150층  HARD + 한국사
 * 151층~    HARD + 사자성어
 * avoid(직전 계단 단어)와 같은 값은 재추첨해 연속 중복을 막습니다.
 */
export function getStairWord(floor: number, avoid = ''): string {
  const draw = () => {
    if (floor <= 10) return pick(JAMO);
    if (floor <= 40) return mixPick(EASY_WORDS, FRUIT_WORDS);
    if (floor <= 90) return mixPick(MEDIUM_WORDS, HISTORY_WORDS);
    if (floor <= 150) return mixPick(HARD_WORDS, HISTORY_WORDS);
    return mixPick(HARD_WORDS, IDIOMS);
  };
  let w = draw();
  let attempts = 0;
  while (w === avoid && attempts < 8) { w = draw(); attempts++; }
  return w;
}
