/**
 * 지식타자 — "순서 있는 지식"을 코스처럼 깔고
 * 역 하나씩 타자로 정복하며 암기하는 코스 데이터.
 *
 * 코스 추가 = 이 파일에 JourneyCourse 하나 추가가 전부다.
 * (라우트는 generateStaticParams, 사이트맵/허브는 JOURNEY_COURSES를 순회)
 */

export interface JourneyStation {
  id: string;
  /** 타이핑 대상 1 — 역 이름 (왕 이름, 역명, 원소명 등) */
  name: string;
  /** 타이핑 대상 2 — 도착 후 공개되는 한 줄 지식. TypingUtils.normalize 친화적으로 작성 */
  fact: string;
  /** 보조 힌트 (주기율표 기호, 로마자 등 미래 코스용) — 표시만, 타이핑 X */
  reading?: string;
  /** 재위/연도 등 — 표시만, 타이핑 X */
  year?: string;
  /** 부가 설명 한 줄 — 도착 카드에 표시만, 타이핑 X */
  detail?: string;
  /** 니모닉 그룹 id (JourneyCourse.groups 참조) */
  group?: string;
  /** 그리드형 UI(주기율표 등)에서의 배치 좌표 — row=주기, col=족(1~18) */
  row?: number;
  col?: number;
}

export interface JourneyLine {
  id: string;
  /** 멀티라인 코스(삼국 계보 등)에서의 노선 이름 */
  name?: string;
  /** SVG에 직접 쓰는 hex 색 (Tailwind 동적 클래스 회피) */
  color: string;
  /** 순환선 여부 — 렌더러 지원은 추후 */
  loop?: boolean;
  stations: JourneyStation[];
}

export interface JourneyCourse {
  /** URL slug: /journey/[id] */
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: '역사' | '지리' | '과학' | '상식';
  emoji: string;
  /** 시각화 UI — 미지정 시 지하철 노선도(subway). 코스 컨셉별 전용 UI 선택 */
  ui?: 'subway' | 'worldmap' | 'periodic';
  /** 코스별 SEO 키워드 */
  keywords: string[];
  /** 니모닉 청크 (태정태세문단세 등) — 노선도 행 라벨로 사용 */
  groups?: { id: string; label: string }[];
  /** MVP는 항상 1개. 삼국(3라인) 등 멀티라인 대비 배열 */
  lines: JourneyLine[];
}

export const JOURNEY_COURSES: JourneyCourse[] = [
  {
    id: 'joseon-kings',
    title: '조선 왕조 27대',
    subtitle: '태조부터 순종까지, 태정태세문단세',
    description:
      '조선 왕 27명의 순서를 노선처럼 한 역씩 타자로 정복하며 외웁니다. 왕 이름을 입력해 다음 역으로 이동하고, 도착하면 공개되는 핵심 업적 한 줄까지 타이핑해야 출발할 수 있습니다.',
    category: '역사',
    emoji: '👑',
    keywords: [
      '태정태세문단세',
      '조선 왕조 계보',
      '조선왕 순서 외우기',
      '조선 왕조 27대',
      '한국사 암기',
      '조선왕조 타자 게임',
      '역사 암기 게임',
    ],
    groups: [
      { id: 'g1', label: '태정태세문단세' },
      { id: 'g2', label: '예성연중인명선' },
      { id: 'g3', label: '광인효현숙경영' },
      { id: 'g4', label: '정순헌철고순' },
    ],
    lines: [
      {
        id: 'main',
        color: '#7c3aed', // violet-600 — 왕조의 보라
        stations: [
          { id: 'taejo', name: '태조', year: '1392~1398', fact: '조선을 건국하고 한양으로 천도하다', detail: '이성계. 위화도 회군으로 고려를 무너뜨렸다.', group: 'g1' },
          { id: 'jeongjong', name: '정종', year: '1398~1400', fact: '개경으로 잠시 수도를 옮기다', detail: '1차 왕자의 난 이후 즉위, 동생 이방원에게 양위했다.', group: 'g1' },
          { id: 'taejong', name: '태종', year: '1400~1418', fact: '호패법을 실시하고 왕권을 강화하다', detail: '이방원. 사병을 혁파하고 6조 직계제를 시행했다.', group: 'g1' },
          { id: 'sejong', name: '세종', year: '1418~1450', fact: '훈민정음을 창제하다', detail: '측우기와 앙부일구 등 과학 기구도 이 시대에 나왔다.', group: 'g1' },
          { id: 'munjong', name: '문종', year: '1450~1452', fact: '고려사를 완성하다', detail: '세종의 맏아들. 병약해 재위 2년 만에 승하했다.', group: 'g1' },
          { id: 'danjong', name: '단종', year: '1452~1455', fact: '열두 살에 즉위한 비운의 왕', detail: '숙부 수양대군에게 왕위를 빼앗기고 영월로 유배됐다.', group: 'g1' },
          { id: 'sejo', name: '세조', year: '1455~1468', fact: '계유정난으로 왕위에 오르다', detail: '수양대군. 경국대전 편찬을 시작했다.', group: 'g1' },
          { id: 'yejong', name: '예종', year: '1468~1469', fact: '재위 1년 만에 승하하다', detail: '세조의 둘째 아들. 남이 장군의 옥사가 있었다.', group: 'g2' },
          { id: 'seongjong', name: '성종', year: '1469~1494', fact: '경국대전을 완성해 반포하다', detail: '조선의 통치 체제를 완성한 왕으로 평가받는다.', group: 'g2' },
          { id: 'yeonsangun', name: '연산군', year: '1494~1506', fact: '무오사화와 갑자사화를 일으키다', detail: '조선 최초로 반정으로 쫓겨난 왕. 묘호가 없어 군으로 불린다.', group: 'g2' },
          { id: 'jungjong', name: '중종', year: '1506~1544', fact: '중종반정으로 즉위하고 조광조를 등용하다', detail: '기묘사화로 조광조의 개혁은 좌절됐다.', group: 'g2' },
          { id: 'injong', name: '인종', year: '1544~1545', fact: '재위 8개월의 가장 짧은 치세', detail: '조선 왕 중 재위 기간이 가장 짧다.', group: 'g2' },
          { id: 'myeongjong', name: '명종', year: '1545~1567', fact: '을사사화가 일어나다', detail: '문정왕후의 수렴청정 시기. 임꺽정이 활동했다.', group: 'g2' },
          { id: 'seonjo', name: '선조', year: '1567~1608', fact: '임진왜란을 겪다', detail: '이순신과 의병의 활약으로 나라를 지켜냈다.', group: 'g2' },
          { id: 'gwanghaegun', name: '광해군', year: '1608~1623', fact: '명과 후금 사이 중립 외교를 펼치다', detail: '대동법 시행, 동의보감 완성. 인조반정으로 폐위됐다.', group: 'g3' },
          { id: 'injo', name: '인조', year: '1623~1649', fact: '병자호란으로 삼전도의 굴욕을 겪다', detail: '남한산성에서 47일을 버티다 청 태종에게 항복했다.', group: 'g3' },
          { id: 'hyojong', name: '효종', year: '1649~1659', fact: '청을 치자는 북벌을 추진하다', detail: '봉림대군. 청에 볼모로 잡혀갔던 원한이 있었다.', group: 'g3' },
          { id: 'hyeonjong', name: '현종', year: '1659~1674', fact: '예송논쟁이 벌어지다', detail: '상복 입는 기간을 두고 서인과 남인이 대립했다.', group: 'g3' },
          { id: 'sukjong', name: '숙종', year: '1674~1720', fact: '환국 정치로 왕권을 강화하다', detail: '장희빈과 인현왕후의 이야기가 이 시대다.', group: 'g3' },
          { id: 'gyeongjong', name: '경종', year: '1720~1724', fact: '장희빈의 아들로 재위 4년에 그치다', detail: '병약해 후사 없이 승하, 동생 연잉군이 뒤를 이었다.', group: 'g3' },
          { id: 'yeongjo', name: '영조', year: '1724~1776', fact: '탕평책을 펼치고 균역법을 실시하다', detail: '재위 52년 최장수 왕. 아들 사도세자를 뒤주에 가뒀다.', group: 'g3' },
          { id: 'jeongjo', name: '정조', year: '1776~1800', fact: '수원 화성을 짓고 규장각을 세우다', detail: '사도세자의 아들. 정약용 등 실학자를 등용했다.', group: 'g4' },
          { id: 'sunjo', name: '순조', year: '1800~1834', fact: '세도 정치가 시작되다', detail: '안동 김씨가 권력을 장악, 홍경래의 난이 일어났다.', group: 'g4' },
          { id: 'heonjong', name: '헌종', year: '1834~1849', fact: '여덟 살에 즉위한 어린 왕', detail: '조선 왕 중 가장 어린 나이에 즉위했다.', group: 'g4' },
          { id: 'cheoljong', name: '철종', year: '1849~1863', fact: '강화도령으로 불리다 왕이 되다', detail: '강화도에서 농사짓다 하루아침에 왕이 됐다.', group: 'g4' },
          { id: 'gojong', name: '고종', year: '1863~1907', fact: '대한제국을 선포하고 황제가 되다', detail: '흥선대원군의 아들. 헤이그 특사 사건으로 강제 퇴위됐다.', group: 'g4' },
          { id: 'sunjong', name: '순종', year: '1907~1910', fact: '조선의 마지막 왕이 되다', detail: '1910년 경술국치로 나라를 잃었다.', group: 'g4' },
        ],
      },
    ],
  },

  // ── 세계 수도 (지도형 UI) ──────────────────────────────────────────────
  {
    id: 'world-capitals',
    title: '세계 수도 27',
    subtitle: '대륙별로 짚어가는 주요국 수도',
    description:
      '아시아부터 오세아니아까지, 대륙을 옮겨가며 주요 나라의 수도를 한 나라씩 타자로 정복합니다. 나라 이름을 입력해 이동하고, 도착하면 그 나라의 수도를 타이핑해야 다음으로 넘어갑니다.',
    category: '지리',
    emoji: '🌍',
    ui: 'worldmap',
    keywords: ['세계 수도 외우기', '나라별 수도', '세계지리 암기', '수도 퀴즈', '한글타자왕'],
    groups: [
      { id: 'asia', label: '아시아' },
      { id: 'europe', label: '유럽' },
      { id: 'americas', label: '아메리카' },
      { id: 'africa', label: '아프리카' },
      { id: 'oceania', label: '오세아니아' },
    ],
    lines: [
      {
        id: 'main',
        color: '#0ea5e9',
        stations: [
          { id: 'kr', name: '대한민국', fact: '서울', detail: '한반도 남쪽의 나라, 수도는 서울', group: 'asia' },
          { id: 'jp', name: '일본', fact: '도쿄', detail: '섬나라, 수도는 도쿄', group: 'asia' },
          { id: 'cn', name: '중국', fact: '베이징', detail: '인구가 가장 많은 나라 중 하나, 수도는 베이징', group: 'asia' },
          { id: 'in', name: '인도', fact: '뉴델리', detail: '남아시아의 대국, 수도는 뉴델리', group: 'asia' },
          { id: 'th', name: '태국', fact: '방콕', detail: '동남아시아, 수도는 방콕', group: 'asia' },
          { id: 'vn', name: '베트남', fact: '하노이', detail: '수도는 하노이(최대 도시는 호찌민)', group: 'asia' },
          { id: 'gb', name: '영국', fact: '런던', detail: '수도는 런던', group: 'europe' },
          { id: 'fr', name: '프랑스', fact: '파리', detail: '수도는 파리', group: 'europe' },
          { id: 'de', name: '독일', fact: '베를린', detail: '수도는 베를린', group: 'europe' },
          { id: 'it', name: '이탈리아', fact: '로마', detail: '수도는 로마', group: 'europe' },
          { id: 'es', name: '스페인', fact: '마드리드', detail: '수도는 마드리드', group: 'europe' },
          { id: 'ru', name: '러시아', fact: '모스크바', detail: '세계에서 가장 넓은 나라, 수도는 모스크바', group: 'europe' },
          { id: 'us', name: '미국', fact: '워싱턴', detail: '수도는 워싱턴 D.C.(최대 도시는 뉴욕)', group: 'americas' },
          { id: 'ca', name: '캐나다', fact: '오타와', detail: '수도는 오타와', group: 'americas' },
          { id: 'mx', name: '멕시코', fact: '멕시코시티', detail: '수도는 멕시코시티', group: 'americas' },
          { id: 'br', name: '브라질', fact: '브라질리아', detail: '남미 최대국, 수도는 브라질리아', group: 'americas' },
          { id: 'ar', name: '아르헨티나', fact: '부에노스아이레스', detail: '수도는 부에노스아이레스', group: 'americas' },
          { id: 'pe', name: '페루', fact: '리마', detail: '수도는 리마', group: 'americas' },
          { id: 'eg', name: '이집트', fact: '카이로', detail: '수도는 카이로', group: 'africa' },
          { id: 'za', name: '남아프리카공화국', fact: '프리토리아', detail: '행정 수도는 프리토리아', group: 'africa' },
          { id: 'ke', name: '케냐', fact: '나이로비', detail: '수도는 나이로비', group: 'africa' },
          { id: 'ng', name: '나이지리아', fact: '아부자', detail: '수도는 아부자(최대 도시는 라고스)', group: 'africa' },
          { id: 'ma', name: '모로코', fact: '라바트', detail: '수도는 라바트', group: 'africa' },
          { id: 'et', name: '에티오피아', fact: '아디스아바바', detail: '수도는 아디스아바바', group: 'africa' },
          { id: 'au', name: '오스트레일리아', fact: '캔버라', detail: '수도는 캔버라(최대 도시는 시드니)', group: 'oceania' },
          { id: 'nz', name: '뉴질랜드', fact: '웰링턴', detail: '수도는 웰링턴', group: 'oceania' },
          { id: 'fj', name: '피지', fact: '수바', detail: '남태평양 섬나라, 수도는 수바', group: 'oceania' },
        ],
      },
    ],
  },

  // ── 주기율표 1~20 (그리드형 UI) ────────────────────────────────────────
  {
    id: 'periodic-table',
    title: '주기율표 1~20',
    subtitle: '수소부터 칼슘까지, 원소 순서 정복',
    description:
      '수소(H)부터 칼슘(Ca)까지 원자번호 순으로 원소를 한 칸씩 타자로 정복합니다. 원소 이름을 입력해 이동하고, 도착하면 그 원소의 핵심 한 줄을 타이핑합니다. 원소기호는 각 칸에 함께 표시됩니다.',
    category: '과학',
    emoji: '🧪',
    ui: 'periodic',
    keywords: ['주기율표 외우기', '원소 순서', '원소기호', '화학 암기', '수헬리베붕탄질산', '한글타자왕'],
    lines: [
      {
        id: 'main',
        color: '#10b981',
        stations: [
          { id: 'h', name: '수소', reading: 'H', fact: '우주에서 가장 가벼운 원소', row: 1, col: 1 },
          { id: 'he', name: '헬륨', reading: 'He', fact: '풍선을 띄우는 비활성 기체', row: 1, col: 18 },
          { id: 'li', name: '리튬', reading: 'Li', fact: '배터리에 쓰이는 가장 가벼운 금속', row: 2, col: 1 },
          { id: 'be', name: '베릴륨', reading: 'Be', fact: '가볍고 단단한 금속', row: 2, col: 2 },
          { id: 'b', name: '붕소', reading: 'B', fact: '유리를 강하게 만드는 준금속', row: 2, col: 13 },
          { id: 'c', name: '탄소', reading: 'C', fact: '모든 생명체의 뼈대가 되는 원소', row: 2, col: 14 },
          { id: 'n', name: '질소', reading: 'N', fact: '공기의 약 78%를 차지하는 기체', row: 2, col: 15 },
          { id: 'o', name: '산소', reading: 'O', fact: '호흡에 꼭 필요한 원소', row: 2, col: 16 },
          { id: 'f', name: '플루오린', reading: 'F', fact: '치약에 들어가는 반응성 큰 원소', row: 2, col: 17 },
          { id: 'ne', name: '네온', reading: 'Ne', fact: '네온사인을 밝히는 기체', row: 2, col: 18 },
          { id: 'na', name: '나트륨', reading: 'Na', fact: '소금을 이루는 금속', row: 3, col: 1 },
          { id: 'mg', name: '마그네슘', reading: 'Mg', fact: '불꽃놀이의 밝은 흰빛을 내는 금속', row: 3, col: 2 },
          { id: 'al', name: '알루미늄', reading: 'Al', fact: '캔과 포일에 쓰이는 가벼운 금속', row: 3, col: 13 },
          { id: 'si', name: '규소', reading: 'Si', fact: '반도체의 핵심 재료', row: 3, col: 14 },
          { id: 'p', name: '인', reading: 'P', fact: '성냥과 DNA에 들어가는 원소', row: 3, col: 15 },
          { id: 's', name: '황', reading: 'S', fact: '노란색을 띠고 화산에서 볼 수 있는 원소', row: 3, col: 16 },
          { id: 'cl', name: '염소', reading: 'Cl', fact: '수돗물 소독에 쓰이는 기체', row: 3, col: 17 },
          { id: 'ar', name: '아르곤', reading: 'Ar', fact: '공기 중 세 번째로 많은 기체', row: 3, col: 18 },
          { id: 'k', name: '칼륨', reading: 'K', fact: '바나나에 많이 든 원소', row: 4, col: 1 },
          { id: 'ca', name: '칼슘', reading: 'Ca', fact: '뼈와 이를 이루는 원소', row: 4, col: 2 },
        ],
      },
    ],
  },
];

export const getJourneyCourse = (id: string): JourneyCourse | undefined =>
  JOURNEY_COURSES.find((c) => c.id === id);

/** 멀티라인 코스에서도 안전한 전체 역 목록 */
export const getCourseStations = (course: JourneyCourse): JourneyStation[] =>
  course.lines.flatMap((l) => l.stations);
