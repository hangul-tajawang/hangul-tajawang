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
];

export const getJourneyCourse = (id: string): JourneyCourse | undefined =>
  JOURNEY_COURSES.find((c) => c.id === id);

/** 멀티라인 코스에서도 안전한 전체 역 목록 */
export const getCourseStations = (course: JourneyCourse): JourneyStation[] =>
  course.lines.flatMap((l) => l.stations);
