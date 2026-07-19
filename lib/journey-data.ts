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
  /** 진행 방식 — 기본은 순서 암기(이름→지식 2단계). 'quiz'는 질문(name)→정답(fact) 1단계 */
  flow?: 'quiz';
  /** quiz 질문 접미사 — name 뒤에 붙는다 (예: '의 수도는?') */
  questionSuffix?: string;
  /** 항목 단위 표기 (역/나라/원소) — 안내 문구에 사용 */
  unitLabel?: string;
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
    title: '세계 수도 정복',
    subtitle: '대륙별로 짚어가는 세계 각국의 수도',
    description:
      '아시아부터 오세아니아까지 70여 개 나라의 수도를 문제로 풀며 외웁니다. "대한민국의 수도는?" 질문에 초성 힌트를 보고 수도를 타자로 입력하면 지도에서 다음 나라로 넘어갑니다.',
    category: '지리',
    emoji: '🌍',
    ui: 'worldmap',
    flow: 'quiz',
    questionSuffix: '의 수도는?',
    unitLabel: '나라',
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
          // 아시아
          { id: 'kr', name: '대한민국', fact: '서울', group: 'asia' },
          { id: 'jp', name: '일본', fact: '도쿄', group: 'asia' },
          { id: 'cn', name: '중국', fact: '베이징', group: 'asia' },
          { id: 'mn', name: '몽골', fact: '울란바토르', group: 'asia' },
          { id: 'in', name: '인도', fact: '뉴델리', group: 'asia' },
          { id: 'th', name: '태국', fact: '방콕', group: 'asia' },
          { id: 'vn', name: '베트남', fact: '하노이', group: 'asia' },
          { id: 'ph', name: '필리핀', fact: '마닐라', group: 'asia' },
          { id: 'id', name: '인도네시아', fact: '자카르타', group: 'asia' },
          { id: 'my', name: '말레이시아', fact: '쿠알라룸푸르', group: 'asia' },
          { id: 'sg', name: '싱가포르', fact: '싱가포르', group: 'asia' },
          { id: 'sa', name: '사우디아라비아', fact: '리야드', group: 'asia' },
          { id: 'tr', name: '튀르키예', fact: '앙카라', group: 'asia' },
          { id: 'ir', name: '이란', fact: '테헤란', group: 'asia' },
          { id: 'ae', name: '아랍에미리트', fact: '아부다비', group: 'asia' },
          { id: 'qa', name: '카타르', fact: '도하', group: 'asia' },
          { id: 'uz', name: '우즈베키스탄', fact: '타슈켄트', group: 'asia' },
          { id: 'kz', name: '카자흐스탄', fact: '아스타나', group: 'asia' },
          { id: 'np', name: '네팔', fact: '카트만두', group: 'asia' },
          { id: 'pk', name: '파키스탄', fact: '이슬라마바드', group: 'asia' },
          { id: 'bd', name: '방글라데시', fact: '다카', group: 'asia' },
          { id: 'kh', name: '캄보디아', fact: '프놈펜', group: 'asia' },
          { id: 'la', name: '라오스', fact: '비엔티안', group: 'asia' },
          // 유럽
          { id: 'gb', name: '영국', fact: '런던', group: 'europe' },
          { id: 'fr', name: '프랑스', fact: '파리', group: 'europe' },
          { id: 'de', name: '독일', fact: '베를린', group: 'europe' },
          { id: 'it', name: '이탈리아', fact: '로마', group: 'europe' },
          { id: 'es', name: '스페인', fact: '마드리드', group: 'europe' },
          { id: 'pt', name: '포르투갈', fact: '리스본', group: 'europe' },
          { id: 'nl', name: '네덜란드', fact: '암스테르담', group: 'europe' },
          { id: 'be', name: '벨기에', fact: '브뤼셀', group: 'europe' },
          { id: 'ch', name: '스위스', fact: '베른', group: 'europe' },
          { id: 'at', name: '오스트리아', fact: '빈', group: 'europe' },
          { id: 'gr', name: '그리스', fact: '아테네', group: 'europe' },
          { id: 'se', name: '스웨덴', fact: '스톡홀름', group: 'europe' },
          { id: 'no', name: '노르웨이', fact: '오슬로', group: 'europe' },
          { id: 'dk', name: '덴마크', fact: '코펜하겐', group: 'europe' },
          { id: 'fi', name: '핀란드', fact: '헬싱키', group: 'europe' },
          { id: 'pl', name: '폴란드', fact: '바르샤바', group: 'europe' },
          { id: 'cz', name: '체코', fact: '프라하', group: 'europe' },
          { id: 'hu', name: '헝가리', fact: '부다페스트', group: 'europe' },
          { id: 'ru', name: '러시아', fact: '모스크바', group: 'europe' },
          { id: 'ua', name: '우크라이나', fact: '키이우', group: 'europe' },
          { id: 'ie', name: '아일랜드', fact: '더블린', group: 'europe' },
          { id: 'ro', name: '루마니아', fact: '부쿠레슈티', group: 'europe' },
          // 아메리카
          { id: 'us', name: '미국', fact: '워싱턴', group: 'americas' },
          { id: 'ca', name: '캐나다', fact: '오타와', group: 'americas' },
          { id: 'mx', name: '멕시코', fact: '멕시코시티', group: 'americas' },
          { id: 'br', name: '브라질', fact: '브라질리아', group: 'americas' },
          { id: 'ar', name: '아르헨티나', fact: '부에노스아이레스', group: 'americas' },
          { id: 'cl', name: '칠레', fact: '산티아고', group: 'americas' },
          { id: 'pe', name: '페루', fact: '리마', group: 'americas' },
          { id: 'co', name: '콜롬비아', fact: '보고타', group: 'americas' },
          { id: 'cu', name: '쿠바', fact: '아바나', group: 'americas' },
          { id: 've', name: '베네수엘라', fact: '카라카스', group: 'americas' },
          { id: 'uy', name: '우루과이', fact: '몬테비데오', group: 'americas' },
          { id: 'bo', name: '볼리비아', fact: '라파스', group: 'americas' },
          // 아프리카
          { id: 'eg', name: '이집트', fact: '카이로', group: 'africa' },
          { id: 'za', name: '남아프리카공화국', fact: '프리토리아', group: 'africa' },
          { id: 'ke', name: '케냐', fact: '나이로비', group: 'africa' },
          { id: 'ng', name: '나이지리아', fact: '아부자', group: 'africa' },
          { id: 'ma', name: '모로코', fact: '라바트', group: 'africa' },
          { id: 'et', name: '에티오피아', fact: '아디스아바바', group: 'africa' },
          { id: 'gh', name: '가나', fact: '아크라', group: 'africa' },
          { id: 'tz', name: '탄자니아', fact: '도도마', group: 'africa' },
          { id: 'dz', name: '알제리', fact: '알제', group: 'africa' },
          { id: 'tn', name: '튀니지', fact: '튀니스', group: 'africa' },
          // 오세아니아
          { id: 'au', name: '오스트레일리아', fact: '캔버라', group: 'oceania' },
          { id: 'nz', name: '뉴질랜드', fact: '웰링턴', group: 'oceania' },
          { id: 'fj', name: '피지', fact: '수바', group: 'oceania' },
          { id: 'pg', name: '파푸아뉴기니', fact: '포트모르즈비', group: 'oceania' },
        ],
      },
    ],
  },

  // ── 주기율표 1~20 (그리드형 UI) ────────────────────────────────────────
  {
    id: 'periodic-table',
    title: '주기율표 1~80',
    subtitle: '수소부터 수은까지, 원소 순서 정복',
    description:
      '수소(H)부터 수은(Hg)까지 원자번호 순으로 원소 80개를 한 칸씩 타자로 정복합니다. 원소기호를 힌트 삼아 원소 이름을 입력해 이동하고, 도착하면 그 원소의 핵심 한 줄을 타이핑합니다.',
    category: '과학',
    emoji: '🧪',
    ui: 'periodic',
    unitLabel: '원소',
    keywords: ['주기율표 외우기', '원소 순서', '원소기호', '화학 암기', '수헬리베붕탄질산', '한글타자왕'],
    lines: [
      {
        id: 'main',
        color: '#10b981',
        stations: [
          { id: 'h', name: '수소', reading: 'H', fact: '가장 가벼운 원소', row: 1, col: 1 },
          { id: 'he', name: '헬륨', reading: 'He', fact: '풍선을 띄우는 기체', row: 1, col: 18 },
          { id: 'li', name: '리튬', reading: 'Li', fact: '배터리의 금속', row: 2, col: 1 },
          { id: 'be', name: '베릴륨', reading: 'Be', fact: '가볍고 단단한 금속', row: 2, col: 2 },
          { id: 'b', name: '붕소', reading: 'B', fact: '유리를 강하게 한다', row: 2, col: 13 },
          { id: 'c', name: '탄소', reading: 'C', fact: '생명의 뼈대', row: 2, col: 14 },
          { id: 'n', name: '질소', reading: 'N', fact: '공기의 78퍼센트', row: 2, col: 15 },
          { id: 'o', name: '산소', reading: 'O', fact: '호흡에 필수', row: 2, col: 16 },
          { id: 'f', name: '플루오린', reading: 'F', fact: '치약 속 원소', row: 2, col: 17 },
          { id: 'ne', name: '네온', reading: 'Ne', fact: '네온사인의 기체', row: 2, col: 18 },
          { id: 'na', name: '나트륨', reading: 'Na', fact: '소금의 금속', row: 3, col: 1 },
          { id: 'mg', name: '마그네슘', reading: 'Mg', fact: '밝은 흰빛 불꽃', row: 3, col: 2 },
          { id: 'al', name: '알루미늄', reading: 'Al', fact: '캔의 재료', row: 3, col: 13 },
          { id: 'si', name: '규소', reading: 'Si', fact: '반도체의 핵심', row: 3, col: 14 },
          { id: 'p', name: '인', reading: 'P', fact: '성냥과 DNA', row: 3, col: 15 },
          { id: 's', name: '황', reading: 'S', fact: '화산의 노란 원소', row: 3, col: 16 },
          { id: 'cl', name: '염소', reading: 'Cl', fact: '수돗물 소독', row: 3, col: 17 },
          { id: 'ar', name: '아르곤', reading: 'Ar', fact: '공기 속 비활성 기체', row: 3, col: 18 },
          { id: 'k', name: '칼륨', reading: 'K', fact: '바나나에 많다', row: 4, col: 1 },
          { id: 'ca', name: '칼슘', reading: 'Ca', fact: '뼈와 이를 만든다', row: 4, col: 2 },
          { id: 'sc', name: '스칸듐', reading: 'Sc', fact: '가벼운 희소 금속', row: 4, col: 3 },
          { id: 'ti', name: '타이타늄', reading: 'Ti', fact: '가볍고 강한 금속', row: 4, col: 4 },
          { id: 'v', name: '바나듐', reading: 'V', fact: '강철을 단단하게', row: 4, col: 5 },
          { id: 'cr', name: '크로뮴', reading: 'Cr', fact: '도금에 쓰인다', row: 4, col: 6 },
          { id: 'mn', name: '망가니즈', reading: 'Mn', fact: '건전지 속 금속', row: 4, col: 7 },
          { id: 'fe', name: '철', reading: 'Fe', fact: '지구 핵의 금속', row: 4, col: 8 },
          { id: 'co', name: '코발트', reading: 'Co', fact: '파란 안료의 금속', row: 4, col: 9 },
          { id: 'ni', name: '니켈', reading: 'Ni', fact: '동전의 금속', row: 4, col: 10 },
          { id: 'cu', name: '구리', reading: 'Cu', fact: '전선의 금속', row: 4, col: 11 },
          { id: 'zn', name: '아연', reading: 'Zn', fact: '도금과 영양제', row: 4, col: 12 },
          { id: 'ga', name: '갈륨', reading: 'Ga', fact: '손에서 녹는 금속', row: 4, col: 13 },
          { id: 'ge', name: '저마늄', reading: 'Ge', fact: '초기 반도체 재료', row: 4, col: 14 },
          { id: 'as', name: '비소', reading: 'As', fact: '독성으로 유명', row: 4, col: 15 },
          { id: 'se', name: '셀레늄', reading: 'Se', fact: '복사기에 쓰였다', row: 4, col: 16 },
          { id: 'br', name: '브로민', reading: 'Br', fact: '상온 액체 비금속', row: 4, col: 17 },
          { id: 'kr', name: '크립톤', reading: 'Kr', fact: '숨겨진 기체', row: 4, col: 18 },
          { id: 'rb', name: '루비듐', reading: 'Rb', fact: '원자시계에 쓰인다', row: 5, col: 1 },
          { id: 'sr', name: '스트론튬', reading: 'Sr', fact: '붉은 불꽃놀이', row: 5, col: 2 },
          { id: 'y', name: '이트륨', reading: 'Y', fact: 'LED 형광체', row: 5, col: 3 },
          { id: 'zr', name: '지르코늄', reading: 'Zr', fact: '원자로 피복재', row: 5, col: 4 },
          { id: 'nb', name: '나이오븀', reading: 'Nb', fact: '초전도 합금', row: 5, col: 5 },
          { id: 'mo', name: '몰리브데넘', reading: 'Mo', fact: '강철 합금 원소', row: 5, col: 6 },
          { id: 'tc', name: '테크네튬', reading: 'Tc', fact: '최초의 인공 원소', row: 5, col: 7 },
          { id: 'ru', name: '루테늄', reading: 'Ru', fact: '백금족 금속', row: 5, col: 8 },
          { id: 'rh', name: '로듐', reading: 'Rh', fact: '가장 비싼 귀금속', row: 5, col: 9 },
          { id: 'pd', name: '팔라듐', reading: 'Pd', fact: '자동차 촉매', row: 5, col: 10 },
          { id: 'ag', name: '은', reading: 'Ag', fact: '최고의 전기 전도체', row: 5, col: 11 },
          { id: 'cd', name: '카드뮴', reading: 'Cd', fact: '니카드 전지', row: 5, col: 12 },
          { id: 'in2', name: '인듐', reading: 'In', fact: '터치스크린 전극', row: 5, col: 13 },
          { id: 'sn', name: '주석', reading: 'Sn', fact: '청동의 재료', row: 5, col: 14 },
          { id: 'sb', name: '안티모니', reading: 'Sb', fact: '활자 합금', row: 5, col: 15 },
          { id: 'te', name: '텔루륨', reading: 'Te', fact: '반도체 소재', row: 5, col: 16 },
          { id: 'i', name: '아이오딘', reading: 'I', fact: '소독약의 원소', row: 5, col: 17 },
          { id: 'xe', name: '제논', reading: 'Xe', fact: '자동차 전조등', row: 5, col: 18 },
          { id: 'cs', name: '세슘', reading: 'Cs', fact: '1초의 기준', row: 6, col: 1 },
          { id: 'ba', name: '바륨', reading: 'Ba', fact: '엑스레이 조영제', row: 6, col: 2 },
          { id: 'la', name: '란타넘', reading: 'La', fact: '란타넘족의 시작', row: 7, col: 3 },
          { id: 'ce', name: '세륨', reading: 'Ce', fact: '라이터 돌', row: 7, col: 4 },
          { id: 'pr', name: '프라세오디뮴', reading: 'Pr', fact: '초록 유리 착색', row: 7, col: 5 },
          { id: 'nd', name: '네오디뮴', reading: 'Nd', fact: '강력한 자석', row: 7, col: 6 },
          { id: 'pm', name: '프로메튬', reading: 'Pm', fact: '방사성 희토류', row: 7, col: 7 },
          { id: 'sm', name: '사마륨', reading: 'Sm', fact: '자석과 원자로', row: 7, col: 8 },
          { id: 'eu', name: '유로퓸', reading: 'Eu', fact: '지폐 형광 물질', row: 7, col: 9 },
          { id: 'gd', name: '가돌리늄', reading: 'Gd', fact: 'MRI 조영제', row: 7, col: 10 },
          { id: 'tb', name: '터븀', reading: 'Tb', fact: '녹색 형광체', row: 7, col: 11 },
          { id: 'dy', name: '디스프로슘', reading: 'Dy', fact: '자석의 내열성', row: 7, col: 12 },
          { id: 'ho', name: '홀뮴', reading: 'Ho', fact: '가장 강한 자성', row: 7, col: 13 },
          { id: 'er', name: '어븀', reading: 'Er', fact: '광섬유 증폭', row: 7, col: 14 },
          { id: 'tm', name: '툴륨', reading: 'Tm', fact: '희토류 중 희소', row: 7, col: 15 },
          { id: 'yb', name: '이터븀', reading: 'Yb', fact: '원자시계 연구', row: 7, col: 16 },
          { id: 'lu', name: '루테튬', reading: 'Lu', fact: '란타넘족의 끝', row: 7, col: 17 },
          { id: 'hf', name: '하프늄', reading: 'Hf', fact: '원자로 제어봉', row: 6, col: 4 },
          { id: 'ta', name: '탄탈럼', reading: 'Ta', fact: '휴대폰 콘덴서', row: 6, col: 5 },
          { id: 'w', name: '텅스텐', reading: 'W', fact: '가장 높은 녹는점', row: 6, col: 6 },
          { id: 're', name: '레늄', reading: 'Re', fact: '제트엔진 합금', row: 6, col: 7 },
          { id: 'os', name: '오스뮴', reading: 'Os', fact: '가장 무거운 금속', row: 6, col: 8 },
          { id: 'ir', name: '이리듐', reading: 'Ir', fact: '운석의 증거', row: 6, col: 9 },
          { id: 'pt', name: '백금', reading: 'Pt', fact: '촉매의 왕', row: 6, col: 10 },
          { id: 'au', name: '금', reading: 'Au', fact: '영원한 귀금속', row: 6, col: 11 },
          { id: 'hg', name: '수은', reading: 'Hg', fact: '상온 액체 금속', row: 6, col: 12 },
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
