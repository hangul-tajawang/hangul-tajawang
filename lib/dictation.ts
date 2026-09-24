/**
 * 받아쓰기 게임 — 문제 데이터 + 채점/점수 규칙 (UI 무관 순수 로직).
 *
 * 소리만 듣고 쓰는 게임이라 동음이의어(가치/같이, 낫다/낮다)는 단독으로 내면
 * 정답이 둘이 된다. 그런 단어는 반드시 짧은 구절로 문맥을 붙여 출제한다.
 */

export type DictationLevel = 'easy' | 'medium' | 'hard';

/** 한 문제에 쓸 수 있는 최대 도전 횟수 — 모두 틀려야 목숨이 줄어든다 */
export const DICTATION_MAX_TRIES = 3;

export interface DictationItem {
  text: string;
  /** 오답·결과 화면에 보여줄 맞춤법/발음 해설 */
  note?: string;
}

export interface DictationLevelConfig {
  label: string;
  desc: string;
  /** 한 판 문제 수 */
  count: number;
  /** 문제당 제한 시간(초). null이면 무제한 */
  timeLimit: number | null;
  /** 다시 듣기 가능 횟수(첫 재생 제외). null이면 무제한 */
  replays: number | null;
  /** 음성 속도 */
  rate: number;
  /** 정답 기본 점수 */
  base: number;
  /** 랭킹 level 컬럼에 저장할 숫자 */
  rank: number;
}

export const DICTATION_LEVELS: Record<DictationLevel, DictationLevelConfig> = {
  easy: { label: '쉬움', desc: '소리 나는 대로 쓰는 쉬운 낱말 · 다시 듣기 무제한', count: 15, timeLimit: null, replays: null, rate: 0.85, base: 100, rank: 1 },
  medium: { label: '보통', desc: '소리와 글자가 다른 말 · 다시 듣기 3번 · 20초', count: 15, timeLimit: 20, replays: 3, rate: 0.95, base: 150, rank: 2 },
  hard: { label: '어려움', desc: '속담·문장 받아쓰기 · 다시 듣기 1번 · 30초', count: 12, timeLimit: 30, replays: 1, rate: 1, base: 250, rank: 3 },
};

export const DICTATION_ITEMS: Record<DictationLevel, DictationItem[]> = {
  easy: [
    '바다', '나무', '하늘', '구름', '우유', '사과', '포도', '모자', '가방', '시계', '거울', '우산',
    '의자', '기차', '나비', '토끼', '여우', '고래', '바지', '치마', '두부', '라면', '노래', '그림',
    '사진', '편지', '연필', '지우개', '공책', '가위', '수건', '비누', '피자', '다리', '호수', '바위',
    '모래', '소나무', '무지개', '해바라기', '자전거', '고구마', '거미', '개미', '오리', '기러기', '코끼리',
    '아기', '가수', '의사', '요리사', '도서관', '운동화', '냉장고', '비행기', '주머니', '허수아비', '미끄럼틀',
  ].map((text) => ({ text })),
  medium: [
    { text: '친구와 같이', note: '같이 → [가치]로 소리 나지만 ‘같이’로 씁니다 (구개음화).' },
    { text: '굳이 가야 해', note: '굳이 → [구지]로 소리 나지만 ‘굳이’로 씁니다 (구개음화).' },
    { text: '새해 해돋이', note: '해돋이 → [해도지]. ‘돋다’에서 온 말이라 ‘돋이’로 씁니다.' },
    { text: '문이 닫히다', note: '닫히다 → [다치다]로 소리 나지만 ‘닫히다’로 씁니다.' },
    { text: '우표를 붙이다', note: '붙이다 → [부치다]. 맞닿게 할 때는 ‘붙이다’, 편지를 보낼 때는 ‘부치다’입니다.' },
    { text: '국물이 맛있다', note: '국물 → [궁물]로 소리 납니다 (비음화).' },
    { text: '신라의 왕', note: '신라 → [실라]로 소리 납니다 (유음화).' },
    { text: '설날 아침', note: '설날 → [설랄]로 소리 납니다 (유음화).' },
    { text: '꽃잎이 지다', note: '꽃잎 → [꼰닙]으로 소리 나지만 ‘꽃잎’으로 씁니다.' },
    { text: '책을 읽다', note: '읽다 → [익따]. 겹받침 ㄺ을 그대로 씁니다.' },
    { text: '의자에 앉다', note: '앉다 → [안따]. 겹받침 ㄵ을 그대로 씁니다.' },
    { text: '방이 넓다', note: '넓다 → [널따]. 겹받침 ㄼ을 그대로 씁니다.' },
    { text: '발을 밟다', note: '밟다 → [밥따]. ‘밟다’는 예외적으로 [밥]으로 읽습니다.' },
    { text: '닭고기 요리', note: '닭고기 → [닥꼬기]. 겹받침 ㄺ을 그대로 씁니다.' },
    { text: '값이 싸다', note: '값이 → [갑씨]. 겹받침 ㅄ을 그대로 씁니다.' },
    { text: '시를 읊다', note: '읊다 → [읍따]. 겹받침 ㄿ을 그대로 씁니다.' },
    { text: '밝은 햇살', note: '밝은 → [발근]. 겹받침 ㄺ을 그대로 씁니다.' },
    { text: '끓는 물', note: '끓는 → [끌른]. 겹받침 ㅀ을 그대로 씁니다.' },
    { text: '젊은이', note: '젊은이 → [절므니]. 겹받침 ㄻ을 그대로 씁니다.' },
    { text: '며칠 동안', note: '‘몇 일’이 아니라 ‘며칠’이 표준어입니다.' },
    { text: '설거지를 하다', note: '‘설겆이’가 아니라 ‘설거지’가 표준어입니다.' },
    { text: '깨끗이 씻다', note: '‘깨끗히’가 아니라 ‘깨끗이’로 씁니다.' },
    { text: '곰곰이 생각하다', note: '‘곰곰히’가 아니라 ‘곰곰이’로 씁니다.' },
    { text: '틈틈이 공부하다', note: '‘틈틈히’가 아니라 ‘틈틈이’로 씁니다.' },
    { text: '일찍이 떠나다', note: '‘일찌기’가 아니라 ‘일찍이’로 씁니다.' },
    { text: '희한한 일', note: '‘희안한’이 아니라 ‘희한한’으로 씁니다.' },
    { text: '웬일이야', note: '‘왠일’이 아니라 ‘웬일’입니다. ‘왠’은 ‘왠지’에만 씁니다.' },
    { text: '왠지 좋아', note: '‘왜인지’의 준말이라 ‘왠지’로 씁니다.' },
    { text: '금세 끝났다', note: '‘금시에’의 준말이라 ‘금새’가 아니라 ‘금세’입니다.' },
    { text: '오랜만에 만나다', note: '‘오랫만에’가 아니라 ‘오랜만에’입니다.' },
    { text: '역할을 맡다', note: '‘역활’이 아니라 ‘역할’입니다.' },
    { text: '어떡해', note: '‘어떻게 해’의 준말이라 ‘어떡해’로 씁니다.' },
    { text: '마음이 설레다', note: '‘설레이다’가 아니라 ‘설레다’가 표준어입니다.' },
    { text: '위험을 무릅쓰다', note: '‘무릎쓰다’가 아니라 ‘무릅쓰다’입니다.' },
    { text: '숟가락과 젓가락', note: '숟가락은 ㄷ 받침, 젓가락은 ㅅ 받침입니다.' },
    { text: '푹신한 베개', note: '‘배개’가 아니라 ‘베개’입니다.' },
    { text: '김치찌개', note: '‘찌게’가 아니라 ‘찌개’입니다.' },
    { text: '매콤한 육개장', note: '‘육계장’이 아니라 ‘육개장’입니다.' },
    { text: '떡볶이', note: '‘떡볶기’가 아니라 ‘떡볶이’입니다.' },
    { text: '눈곱을 떼다', note: '‘눈꼽’이 아니라 ‘눈곱’으로 씁니다.' },
    { text: '어이없는 실수', note: '‘어의없다’가 아니라 ‘어이없다’입니다.' },
    { text: '처음 뵙겠습니다', note: '‘뵈다’의 높임 ‘뵙다’ → ‘뵙겠습니다’로 씁니다.' },
  ],
  hard: [
    { text: '가는 말이 고와야 오는 말이 곱다' },
    { text: '낮말은 새가 듣고 밤말은 쥐가 듣는다', note: '낮말 → [난말]로 소리 납니다.' },
    { text: '원숭이도 나무에서 떨어진다' },
    { text: '발 없는 말이 천 리 간다', note: '없는 → [엄는], 천 리 → [철리]로 소리 납니다.' },
    { text: '세 살 버릇 여든까지 간다' },
    { text: '고래 싸움에 새우 등 터진다' },
    { text: '천 리 길도 한 걸음부터', note: '천 리 → [철리]로 소리 납니다.' },
    { text: '등잔 밑이 어둡다', note: '밑이 → [미치]로 소리 납니다 (구개음화).' },
    { text: '빈 수레가 요란하다' },
    { text: '소 잃고 외양간 고친다', note: '잃고 → [일코]. 겹받침 ㅀ을 그대로 씁니다.' },
    { text: '아니 땐 굴뚝에 연기 날까' },
    { text: '백지장도 맞들면 낫다', note: '병이 낫다·더 낫다는 ‘낫다’, 높이가 낮다는 ‘낮다’입니다.' },
    { text: '하룻강아지 범 무서운 줄 모른다' },
    { text: '구슬이 서 말이라도 꿰어야 보배' },
    { text: '돌다리도 두들겨 보고 건너라' },
    { text: '믿는 도끼에 발등 찍힌다', note: '믿는 → [민는]으로 소리 납니다.' },
    { text: '열 번 찍어 안 넘어가는 나무 없다' },
    { text: '며칠 동안 설거지를 못 했다', note: '‘며칠’, ‘설거지’가 표준어입니다.' },
    { text: '오랜만에 친구와 같이 떡볶이를 먹었다', note: '오랜만에 · 같이[가치] · 떡볶이' },
    { text: '웬일로 이렇게 일찍 왔어', note: '‘왠일’이 아니라 ‘웬일’입니다.' },
    { text: '금세 비가 그쳤다', note: '‘금새’가 아니라 ‘금세’입니다.' },
    { text: '어떡해 버스를 놓쳤어', note: '‘어떻게 해’의 준말은 ‘어떡해’입니다.' },
    { text: '숙제를 깨끗이 끝냈다', note: '‘깨끗히’가 아니라 ‘깨끗이’입니다.' },
    { text: '그는 곰곰이 생각에 잠겼다', note: '‘곰곰히’가 아니라 ‘곰곰이’입니다.' },
    { text: '희한한 일이 다 있네', note: '‘희안한’이 아니라 ‘희한한’입니다.' },
    { text: '마음이 설레서 잠이 안 온다', note: '‘설레여서’가 아니라 ‘설레서’입니다.' },
    { text: '우표를 붙여서 편지를 부쳤다', note: '붙이다(맞닿게 하다)와 부치다(보내다)를 구분합니다.' },
    { text: '왠지 오늘은 잘될 것 같아', note: '‘왜인지’의 준말 ‘왠지’, 일이 잘 풀린다는 뜻의 ‘잘되다’는 붙여 씁니다.' },
    { text: '김치찌개가 끓고 있다', note: '‘찌게’가 아니라 ‘찌개’, 끓고 → [끌코]입니다.' },
    { text: '위험을 무릅쓰고 뛰어들었다', note: '‘무릎쓰고’가 아니라 ‘무릅쓰고’입니다.' },
    { text: '닭고기 국물이 참 맛있다', note: '닭고기[닥꼬기] · 국물[궁물]' },
    { text: '문이 저절로 닫혔다', note: '닫혔다 → [다쳗따]로 소리 납니다.' },
  ],
};

/** 채점용 정규화: 앞뒤 공백·문장부호 제거, 연속 공백을 하나로 */
export function normalizeDictation(text: string): string {
  return text
    .normalize('NFC')
    .replace(/[.,!?~…·'"“”‘’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface DictationGrade {
  correct: boolean;
  /** 글자는 맞았지만 띄어쓰기가 다름 */
  spacingMiss: boolean;
}

/** 글자가 모두 맞으면 정답. 띄어쓰기만 다르면 정답이되 spacingMiss로 알린다 */
export function gradeDictation(answer: string, input: string): DictationGrade {
  const a = normalizeDictation(answer);
  const b = normalizeDictation(input);
  if (a === b) return { correct: true, spacingMiss: false };
  if (a.replace(/ /g, '') === b.replace(/ /g, '')) return { correct: true, spacingMiss: true };
  return { correct: false, spacingMiss: false };
}

/**
 * 정답 1문제 점수.
 * 기본 점수 + 남은 시간 보너스(제한 시간 없는 단계는 빨리 쓸수록) + 콤보 − 다시 듣기 감점.
 * 띄어쓰기가 틀리면 절반, 다시 도전해서 맞히면 2번째 60%·3번째 30%.
 */
export function scoreDictation(opts: {
  level: DictationLevel;
  seconds: number;
  replaysUsed: number;
  combo: number;
  spacingMiss: boolean;
  /** 앞서 틀린 횟수 (0이면 첫 시도에 맞힘) */
  wrongTries?: number;
}): number {
  const cfg = DICTATION_LEVELS[opts.level];
  const timeBonus = cfg.timeLimit
    ? Math.max(0, Math.round((cfg.timeLimit - opts.seconds) * 5))
    : Math.max(0, Math.round(50 - opts.seconds * 5));
  const raw = cfg.base + timeBonus + opts.combo * 10 - opts.replaysUsed * 20;
  const retryRate = [1, 0.6, 0.3][Math.min(opts.wrongTries ?? 0, 2)];
  const score = Math.max(10, Math.round(raw * retryRate));
  return opts.spacingMiss ? Math.round(score / 2) : score;
}

/** 한 판 문제 뽑기 — 중복 없이 무작위 */
export function pickDictationItems(level: DictationLevel, random: () => number = Math.random): DictationItem[] {
  const pool = [...DICTATION_ITEMS[level]];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, DICTATION_LEVELS[level].count);
}
