// 한글 게임 공용 단어 풀
// 산성비(WordGame), 블록 팝핑(BlockPopGame) 등 여러 게임이 공유합니다.

export const EASY_WORDS = ['안녕', '감사', '사랑', '행복', '가족', '친구', '학교', '책', '연필', '공부', '숙제', '시험', '점심', '저녁', '아침', '물', '음식', '과일', '야채', '고기', '생선', '우유', '빵', '집', '차', '버스', '봄', '여름', '가을', '겨울', '엄마', '아빠', '형', '누나', '동생', '숫자', '하나', '둘', '셋', '넷', '다섯'];
export const MEDIUM_WORDS = ['선생님', '학생', '지하철', '비행기', '날씨', '컴퓨터', '스마트폰', '텔레비전', '냉장고', '에어컨', '운동', '영화', '음악', '여행', '요리', '도서관', '박물관', '미술관', '운동장', '수영장', '놀이공원', '할머니', '할아버지', '통일', '평화', '자유', '민주주의', '인권', '정의', '평등', '사회', '문화', '경제', '정치', '교육', '과학', '미래', '발전', '변화', '혁신', '창의', '아이디어'];
export const HARD_WORDS = ['인공지능', '가상현실', '블록체인', '사물인터넷', '빅데이터', '클라우드컴퓨팅', '머신러닝', '딥러닝', '양자컴퓨터', '사이버보안', '로봇공학', '나노기술', '생명공학', '신재생에너지', '우주탐사', '환경보호', '지속가능발전', '글로벌화', '다문화사회', '심리학', '사회학', '인류학', '생태학', '유전학', '천문학', '지구과학', '기후변화', '물리학', '화학'];
export const IDIOMS = ['일석이조', '사면초가', '동분서주', '천변만화', '고진감래', '금상첨화', '막상막하', '부화뇌동', '수구초심', '역지사지', '온고지신', '우공이산', '일거양득', '전화위복', '주객전도', '천우신조', '호시탐탐', '화룡점정', '괄목상대', '노심초사', '각골난망', '결초보은', '고장난명', '군계일학', '다다익선', '대기만성', '새옹지마'];

// 레벨에 따라 단어 풀을 골라 무작위 단어 하나를 반환합니다.
export function getWordForLevel(currentLevel: number): string {
  if (currentLevel <= 2) return EASY_WORDS[Math.floor(Math.random() * EASY_WORDS.length)];
  if (currentLevel <= 4) return MEDIUM_WORDS[Math.floor(Math.random() * MEDIUM_WORDS.length)];
  if (currentLevel <= 6) return HARD_WORDS[Math.floor(Math.random() * HARD_WORDS.length)];
  return Math.random() > 0.5
    ? HARD_WORDS[Math.floor(Math.random() * HARD_WORDS.length)]
    : IDIOMS[Math.floor(Math.random() * IDIOMS.length)];
}
