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
  /** 정답으로 인정하는 별칭 (예: 미국↔미합중국). 미지정 시 fact만 정답 */
  aliases?: string[];
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
  ui?: 'subway' | 'worldmap' | 'periodic' | 'flags' | 'map';
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

/** 국기 퀴즈 스테이션 — 나라 이름이 곧 정답(fact) */
const F = (id: string, name: string, group: string): JourneyStation => ({ id, name, fact: name, group });

/** 국기 퀴즈 스테이션 목록 — 지도 퀴즈(map-quiz)도 이 목록을 필터해 재사용한다 */
const FLAG_STATIONS: JourneyStation[] = [
          // 아시아 (51)
          F('kr', '대한민국', 'asia'), F('kp', '북한', 'asia'), F('jp', '일본', 'asia'), F('cn', '중국', 'asia'),
          F('tw', '대만', 'asia'), F('hk', '홍콩', 'asia'), F('mo', '마카오', 'asia'), F('mn', '몽골', 'asia'),
          F('in', '인도', 'asia'), F('pk', '파키스탄', 'asia'), F('bd', '방글라데시', 'asia'), F('lk', '스리랑카', 'asia'),
          F('np', '네팔', 'asia'), F('bt', '부탄', 'asia'), F('mv', '몰디브', 'asia'), F('af', '아프가니스탄', 'asia'),
          F('ir', '이란', 'asia'), F('iq', '이라크', 'asia'), F('sa', '사우디아라비아', 'asia'), F('ae', '아랍에미리트', 'asia'),
          F('qa', '카타르', 'asia'), F('kw', '쿠웨이트', 'asia'), F('bh', '바레인', 'asia'), F('om', '오만', 'asia'),
          F('ye', '예멘', 'asia'), F('jo', '요르단', 'asia'), F('sy', '시리아', 'asia'), F('lb', '레바논', 'asia'),
          F('il', '이스라엘', 'asia'), F('ps', '팔레스타인', 'asia'), F('tr', '튀르키예', 'asia'), F('cy', '키프로스', 'asia'),
          F('ge', '조지아', 'asia'), F('am', '아르메니아', 'asia'), F('az', '아제르바이잔', 'asia'), F('kz', '카자흐스탄', 'asia'),
          F('uz', '우즈베키스탄', 'asia'), F('tm', '투르크메니스탄', 'asia'), F('kg', '키르기스스탄', 'asia'), F('tj', '타지키스탄', 'asia'),
          F('th', '태국', 'asia'), F('vn', '베트남', 'asia'), F('la', '라오스', 'asia'), F('kh', '캄보디아', 'asia'),
          F('mm', '미얀마', 'asia'), F('my', '말레이시아', 'asia'), F('sg', '싱가포르', 'asia'), F('id', '인도네시아', 'asia'),
          F('bn', '브루나이', 'asia'), F('ph', '필리핀', 'asia'), F('tl', '동티모르', 'asia'),
          // 유럽 (43)
          F('gb', '영국', 'europe'), F('ie', '아일랜드', 'europe'), F('fr', '프랑스', 'europe'), F('de', '독일', 'europe'),
          F('nl', '네덜란드', 'europe'), F('be', '벨기에', 'europe'), F('lu', '룩셈부르크', 'europe'), F('ch', '스위스', 'europe'),
          F('at', '오스트리아', 'europe'), F('li', '리히텐슈타인', 'europe'), F('es', '스페인', 'europe'), F('pt', '포르투갈', 'europe'),
          F('ad', '안도라', 'europe'), F('mc', '모나코', 'europe'), F('it', '이탈리아', 'europe'), F('sm', '산마리노', 'europe'),
          F('va', '바티칸', 'europe'), F('mt', '몰타', 'europe'), F('gr', '그리스', 'europe'), F('al', '알바니아', 'europe'),
          F('mk', '북마케도니아', 'europe'), F('rs', '세르비아', 'europe'), F('me', '몬테네그로', 'europe'), F('ba', '보스니아헤르체고비나', 'europe'),
          F('hr', '크로아티아', 'europe'), F('si', '슬로베니아', 'europe'), F('hu', '헝가리', 'europe'), F('sk', '슬로바키아', 'europe'),
          F('cz', '체코', 'europe'), F('pl', '폴란드', 'europe'), F('dk', '덴마크', 'europe'), F('no', '노르웨이', 'europe'),
          F('se', '스웨덴', 'europe'), F('fi', '핀란드', 'europe'), F('is', '아이슬란드', 'europe'), F('ee', '에스토니아', 'europe'),
          F('lv', '라트비아', 'europe'), F('lt', '리투아니아', 'europe'), F('by', '벨라루스', 'europe'), F('ua', '우크라이나', 'europe'),
          F('md', '몰도바', 'europe'), F('ro', '루마니아', 'europe'), F('bg', '불가리아', 'europe'),
          // 아메리카 (37)
          F('us', '미국', 'americas'), F('ca', '캐나다', 'americas'), F('mx', '멕시코', 'americas'), F('gt', '과테말라', 'americas'),
          F('bz', '벨리즈', 'americas'), F('sv', '엘살바도르', 'americas'), F('hn', '온두라스', 'americas'), F('ni', '니카라과', 'americas'),
          F('cr', '코스타리카', 'americas'), F('pa', '파나마', 'americas'), F('cu', '쿠바', 'americas'), F('jm', '자메이카', 'americas'),
          F('ht', '아이티', 'americas'), F('do', '도미니카공화국', 'americas'), F('pr', '푸에르토리코', 'americas'), F('bs', '바하마', 'americas'),
          F('bb', '바베이도스', 'americas'), F('tt', '트리니다드토바고', 'americas'), F('gd', '그레나다', 'americas'), F('lc', '세인트루시아', 'americas'),
          F('vc', '세인트빈센트그레나딘', 'americas'), F('ag', '앤티가바부다', 'americas'), F('kn', '세인트키츠네비스', 'americas'), F('dm', '도미니카연방', 'americas'),
          F('gl', '그린란드', 'americas'), F('co', '콜롬비아', 'americas'), F('ve', '베네수엘라', 'americas'), F('gy', '가이아나', 'americas'),
          F('sr', '수리남', 'americas'), F('ec', '에콰도르', 'americas'), F('pe', '페루', 'americas'), F('br', '브라질', 'americas'),
          F('bo', '볼리비아', 'americas'), F('py', '파라과이', 'americas'), F('uy', '우루과이', 'americas'), F('ar', '아르헨티나', 'americas'),
          F('cl', '칠레', 'americas'),
          // 아프리카 (54)
          F('eg', '이집트', 'africa'), F('ly', '리비아', 'africa'), F('tn', '튀니지', 'africa'), F('dz', '알제리', 'africa'),
          F('ma', '모로코', 'africa'), F('mr', '모리타니', 'africa'), F('ml', '말리', 'africa'), F('ne', '니제르', 'africa'),
          F('td', '차드', 'africa'), F('sd', '수단', 'africa'), F('ss', '남수단', 'africa'), F('er', '에리트레아', 'africa'),
          F('dj', '지부티', 'africa'), F('et', '에티오피아', 'africa'), F('so', '소말리아', 'africa'), F('ke', '케냐', 'africa'),
          F('ug', '우간다', 'africa'), F('rw', '르완다', 'africa'), F('bi', '부룬디', 'africa'), F('tz', '탄자니아', 'africa'),
          F('mz', '모잠비크', 'africa'), F('mw', '말라위', 'africa'), F('zm', '잠비아', 'africa'), F('zw', '짐바브웨', 'africa'),
          F('bw', '보츠와나', 'africa'), F('na', '나미비아', 'africa'), F('za', '남아프리카공화국', 'africa'), F('ls', '레소토', 'africa'),
          F('sz', '에스와티니', 'africa'), F('mg', '마다가스카르', 'africa'), F('mu', '모리셔스', 'africa'), F('sc', '세이셸', 'africa'),
          F('km', '코모로', 'africa'), F('cv', '카보베르데', 'africa'), F('sn', '세네갈', 'africa'), F('gm', '감비아', 'africa'),
          F('gw', '기니비사우', 'africa'), F('gn', '기니', 'africa'), F('sl', '시에라리온', 'africa'), F('lr', '라이베리아', 'africa'),
          F('ci', '코트디부아르', 'africa'), F('gh', '가나', 'africa'), F('tg', '토고', 'africa'), F('bj', '베냉', 'africa'),
          F('ng', '나이지리아', 'africa'), F('cm', '카메룬', 'africa'), F('cf', '중앙아프리카공화국', 'africa'), F('gq', '적도기니', 'africa'),
          F('ga', '가봉', 'africa'), F('cg', '콩고공화국', 'africa'), F('cd', '콩고민주공화국', 'africa'), F('ao', '앙골라', 'africa'),
          F('st', '상투메프린시페', 'africa'), F('bf', '부르키나파소', 'africa'),
          // 오세아니아 (15)
          F('au', '오스트레일리아', 'oceania'), F('nz', '뉴질랜드', 'oceania'), F('pg', '파푸아뉴기니', 'oceania'), F('fj', '피지', 'oceania'),
          F('sb', '솔로몬제도', 'oceania'), F('vu', '바누아투', 'oceania'), F('ws', '사모아', 'oceania'), F('to', '통가', 'oceania'),
          F('tv', '투발루', 'oceania'), F('ki', '키리바시', 'oceania'), F('nr', '나우루', 'oceania'), F('mh', '마셜제도', 'oceania'),
          F('fm', '미크로네시아', 'oceania'), F('pw', '팔라우', 'oceania'), F('nc', '뉴칼레도니아', 'oceania'),
        ];

/**
 * 세계지도(110m 해상도) 폴리곤이 존재하는 국가 코드 — scripts/build-world-map.mjs 산출 기준.
 * 지도 퀴즈는 이 목록과 FLAG_STATIONS의 교집합만 출제한다(소국·일부 지역은 국기 퀴즈로 커버).
 */
const MAP_CODES = new Set('ae,af,al,am,ao,ar,at,au,az,ba,bd,be,bf,bg,bi,bj,bn,bo,br,bs,bt,bw,by,bz,ca,cd,cf,cg,ch,ci,cl,cm,cn,co,cr,cu,cy,cz,de,dj,dk,do,dz,ec,ee,eg,er,es,et,fi,fj,fr,ga,gb,ge,gh,gl,gm,gn,gq,gr,gt,gw,gy,hn,hr,ht,hu,id,ie,il,in,iq,ir,is,it,jm,jo,jp,ke,kg,kh,kp,kr,kw,kz,la,lb,lk,lr,ls,lt,lu,lv,ly,ma,md,me,mg,mk,ml,mm,mn,mr,mw,mx,my,mz,na,nc,ne,ng,ni,nl,no,np,nz,om,pa,pe,pg,ph,pk,pl,pr,ps,pt,py,qa,ro,rs,ru,rw,sa,sb,sd,se,si,sk,sl,sn,so,sr,ss,sv,sy,sz,td,tf,tg,th,tj,tl,tm,tn,tr,tt,tw,tz,ua,ug,us,uy,uz,ve,vn,vu,ye,za,zm,zw'.split(','));

/** 지도 퀴즈 별칭 정답 — 통용 이름/구칭 허용 */
const MAP_ALIASES: Record<string, string[]> = {
  au: ['호주'],
  us: ['미합중국'],
  gb: ['그레이트브리튼', '영국연합왕국'],
  tr: ['터키'],
  nl: ['화란'],
  cz: ['체코공화국'],
  kp: ['조선민주주의인민공화국'],
  cd: ['민주콩고', '콩고민주'],
  za: ['남아공'],
  ae: ['아부다비연합', 'UAE'],
  do: ['도미니카 공화국'],
  cf: ['중앙아프리카 공화국'],
  mm: ['버마'],
  lk: ['실론'],
  kh: ['캄푸치아'],
};

/** 지도 퀴즈 스테이션 — 폴리곤이 있는 국가만, 별칭 병합 */
const MAP_STATIONS: JourneyStation[] = FLAG_STATIONS
  .filter((st) => MAP_CODES.has(st.id))
  .map((st) => (MAP_ALIASES[st.id] ? { ...st, aliases: MAP_ALIASES[st.id] } : st));

export const JOURNEY_COURSES: JourneyCourse[] = [
  {
    id: 'joseon-kings',
    title: '조선 왕조 27대',
    subtitle: '태조부터 순종까지, 태정태세문단세',
    description:
      '조선 왕 27명의 순서를 한 명씩 타자로 정복하며 외웁니다. 왕 이름을 입력해 다음 왕으로 이동하고, 도착하면 공개되는 핵심 업적 한 줄까지 타이핑해야 출발할 수 있습니다.',
    unitLabel: '왕',
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

  // ── 삼국 왕조 계보 (지하철 노선도 UI) ──────────────────────────────────
  {
    id: 'three-kingdoms',
    title: '삼국 왕조 계보',
    subtitle: '고구려 28대·백제 31대·신라 56대',
    description:
      '고구려 동명성왕부터 신라 경순왕까지, 삼국 왕 115명의 순서를 한 명씩 타자로 정복하며 외웁니다. 왕 이름을 입력해 이동하고, 도착하면 공개되는 핵심 지식 한 줄까지 타이핑해야 출발할 수 있습니다.',
    unitLabel: '왕',
    category: '역사',
    emoji: '⚔️',
    keywords: ['삼국시대 왕 순서', '고구려 왕 계보', '백제 왕 계보', '신라 왕 계보', '한국사 암기', '한글타자왕'],
    groups: [
      { id: 'g1', label: '고구려 1~7대' },
      { id: 'g2', label: '고구려 8~14대' },
      { id: 'g3', label: '고구려 15~21대' },
      { id: 'g4', label: '고구려 22~28대' },
      { id: 'b1', label: '백제 1~8대' },
      { id: 'b2', label: '백제 9~16대' },
      { id: 'b3', label: '백제 17~24대' },
      { id: 'b4', label: '백제 25~31대' },
      { id: 's1', label: '신라 1~7대' },
      { id: 's2', label: '신라 8~14대' },
      { id: 's3', label: '신라 15~21대' },
      { id: 's4', label: '신라 22~28대' },
      { id: 's5', label: '신라 29~35대' },
      { id: 's6', label: '신라 36~42대' },
      { id: 's7', label: '신라 43~49대' },
      { id: 's8', label: '신라 50~56대' },
    ],
    lines: [
      {
        id: 'goguryeo',
        name: '고구려',
        color: '#b91c1c',
        stations: [
          { id: 'gg1', name: '동명성왕', fact: '주몽, 고구려를 건국하다', group: 'g1' },
          { id: 'gg2', name: '유리왕', fact: '황조가를 남기다', group: 'g1' },
          { id: 'gg3', name: '대무신왕', fact: '부여를 공격해 세력을 넓히다', group: 'g1' },
          { id: 'gg4', name: '민중왕', fact: '고구려 4대 왕', group: 'g1' },
          { id: 'gg5', name: '모본왕', fact: '고구려 5대 왕', group: 'g1' },
          { id: 'gg6', name: '태조대왕', fact: '옥저를 정복하다', group: 'g1' },
          { id: 'gg7', name: '차대왕', fact: '고구려 7대 왕', group: 'g1' },
          { id: 'gg8', name: '신대왕', fact: '고구려 8대 왕', group: 'g2' },
          { id: 'gg9', name: '고국천왕', fact: '진대법을 실시하다', group: 'g2' },
          { id: 'gg10', name: '산상왕', fact: '고구려 10대 왕', group: 'g2' },
          { id: 'gg11', name: '동천왕', fact: '위나라 관구검의 침입을 겪다', group: 'g2' },
          { id: 'gg12', name: '중천왕', fact: '고구려 12대 왕', group: 'g2' },
          { id: 'gg13', name: '서천왕', fact: '고구려 13대 왕', group: 'g2' },
          { id: 'gg14', name: '봉상왕', fact: '고구려 14대 왕', group: 'g2' },
          { id: 'gg15', name: '미천왕', fact: '낙랑군을 몰아내다', group: 'g3' },
          { id: 'gg16', name: '고국원왕', fact: '백제와 싸우다 전사하다', group: 'g3' },
          { id: 'gg17', name: '소수림왕', fact: '불교 수용과 태학 설립', group: 'g3' },
          { id: 'gg18', name: '고국양왕', fact: '고구려 18대 왕', group: 'g3' },
          { id: 'gg19', name: '광개토대왕', fact: '영토를 크게 넓히다', group: 'g3' },
          { id: 'gg20', name: '장수왕', fact: '평양 천도와 남진 정책', group: 'g3' },
          { id: 'gg21', name: '문자명왕', fact: '고구려 최대 영토를 지키다', group: 'g3' },
          { id: 'gg22', name: '안장왕', fact: '고구려 22대 왕', group: 'g4' },
          { id: 'gg23', name: '안원왕', fact: '고구려 23대 왕', group: 'g4' },
          { id: 'gg24', name: '양원왕', fact: '고구려 24대 왕', group: 'g4' },
          { id: 'gg25', name: '평원왕', fact: '평강공주와 온달 설화의 왕', group: 'g4' },
          { id: 'gg26', name: '영양왕', fact: '을지문덕의 살수대첩', group: 'g4' },
          { id: 'gg27', name: '영류왕', fact: '고구려 27대 왕', group: 'g4' },
          { id: 'gg28', name: '보장왕', fact: '고구려의 마지막 왕', group: 'g4' },
        ],
      },
      {
        id: 'baekje',
        name: '백제',
        color: '#b45309',
        stations: [
          { id: 'bj1', name: '온조왕', fact: '백제를 건국하다', group: 'b1' },
          { id: 'bj2', name: '다루왕', fact: '백제 2대 왕', group: 'b1' },
          { id: 'bj3', name: '기루왕', fact: '백제 3대 왕', group: 'b1' },
          { id: 'bj4', name: '개루왕', fact: '백제 4대 왕', group: 'b1' },
          { id: 'bj5', name: '초고왕', fact: '백제 5대 왕', group: 'b1' },
          { id: 'bj6', name: '구수왕', fact: '백제 6대 왕', group: 'b1' },
          { id: 'bj7', name: '사반왕', fact: '백제 7대 왕', group: 'b1' },
          { id: 'bj8', name: '고이왕', fact: '관등과 공복을 정비하다', group: 'b1' },
          { id: 'bj9', name: '책계왕', fact: '백제 9대 왕', group: 'b2' },
          { id: 'bj10', name: '분서왕', fact: '백제 10대 왕', group: 'b2' },
          { id: 'bj11', name: '비류왕', fact: '백제 11대 왕', group: 'b2' },
          { id: 'bj12', name: '계왕', fact: '백제 12대 왕', group: 'b2' },
          { id: 'bj13', name: '근초고왕', fact: '백제의 전성기를 이끌다', group: 'b2' },
          { id: 'bj14', name: '근구수왕', fact: '백제 14대 왕', group: 'b2' },
          { id: 'bj15', name: '침류왕', fact: '불교를 받아들이다', group: 'b2' },
          { id: 'bj16', name: '진사왕', fact: '백제 16대 왕', group: 'b2' },
          { id: 'bj17', name: '아신왕', fact: '백제 17대 왕', group: 'b3' },
          { id: 'bj18', name: '전지왕', fact: '백제 18대 왕', group: 'b3' },
          { id: 'bj19', name: '구이신왕', fact: '백제 19대 왕', group: 'b3' },
          { id: 'bj20', name: '비유왕', fact: '백제 20대 왕', group: 'b3' },
          { id: 'bj21', name: '개로왕', fact: '한성을 잃고 전사하다', group: 'b3' },
          { id: 'bj22', name: '문주왕', fact: '웅진으로 천도하다', group: 'b3' },
          { id: 'bj23', name: '삼근왕', fact: '백제 23대 왕', group: 'b3' },
          { id: 'bj24', name: '동성왕', fact: '신라와 혼인 동맹을 맺다', group: 'b3' },
          { id: 'bj25', name: '무령왕', fact: '22담로를 설치하다', group: 'b4' },
          { id: 'bj26', name: '성왕', fact: '사비 천도, 국호 남부여', group: 'b4' },
          { id: 'bj27', name: '위덕왕', fact: '백제 27대 왕', group: 'b4' },
          { id: 'bj28', name: '혜왕', fact: '백제 28대 왕', group: 'b4' },
          { id: 'bj29', name: '법왕', fact: '백제 29대 왕', group: 'b4' },
          { id: 'bj30', name: '무왕', fact: '익산에 미륵사를 세우다', group: 'b4' },
          { id: 'bj31', name: '의자왕', fact: '백제의 마지막 왕', group: 'b4' },
        ],
      },
      {
        id: 'silla',
        name: '신라',
        color: '#0F766E',
        stations: [
          { id: 'sl1', name: '혁거세', fact: '신라를 건국하다', group: 's1' },
          { id: 'sl2', name: '남해', fact: '신라 2대 왕', group: 's1' },
          { id: 'sl3', name: '유리', fact: '신라 3대 왕', group: 's1' },
          { id: 'sl4', name: '탈해', fact: '석씨 최초의 왕', group: 's1' },
          { id: 'sl5', name: '파사', fact: '신라 5대 왕', group: 's1' },
          { id: 'sl6', name: '지마', fact: '신라 6대 왕', group: 's1' },
          { id: 'sl7', name: '일성', fact: '신라 7대 왕', group: 's1' },
          { id: 'sl8', name: '아달라', fact: '신라 8대 왕', group: 's2' },
          { id: 'sl9', name: '벌휴', fact: '신라 9대 왕', group: 's2' },
          { id: 'sl10', name: '내해', fact: '신라 10대 왕', group: 's2' },
          { id: 'sl11', name: '조분', fact: '신라 11대 왕', group: 's2' },
          { id: 'sl12', name: '첨해', fact: '신라 12대 왕', group: 's2' },
          { id: 'sl13', name: '미추', fact: '김씨 최초의 왕', group: 's2' },
          { id: 'sl14', name: '유례', fact: '신라 14대 왕', group: 's2' },
          { id: 'sl15', name: '기림', fact: '신라 15대 왕', group: 's3' },
          { id: 'sl16', name: '흘해', fact: '신라 16대 왕', group: 's3' },
          { id: 'sl17', name: '내물', fact: '김씨 왕위 세습을 확립하다', group: 's3' },
          { id: 'sl18', name: '실성', fact: '신라 18대 왕', group: 's3' },
          { id: 'sl19', name: '눌지', fact: '나제 동맹을 맺다', group: 's3' },
          { id: 'sl20', name: '자비', fact: '신라 20대 왕', group: 's3' },
          { id: 'sl21', name: '소지', fact: '신라 21대 왕', group: 's3' },
          { id: 'sl22', name: '지증왕', fact: '국호 신라, 우산국 정복', group: 's4' },
          { id: 'sl23', name: '법흥왕', fact: '불교 공인과 율령 반포', group: 's4' },
          { id: 'sl24', name: '진흥왕', fact: '한강 유역을 차지하다', group: 's4' },
          { id: 'sl25', name: '진지왕', fact: '신라 25대 왕', group: 's4' },
          { id: 'sl26', name: '진평왕', fact: '신라 26대 왕', group: 's4' },
          { id: 'sl27', name: '선덕여왕', fact: '최초의 여왕, 첨성대를 세우다', group: 's4' },
          { id: 'sl28', name: '진덕여왕', fact: '마지막 성골 왕', group: 's4' },
          { id: 'sl29', name: '무열왕', fact: '최초의 진골 출신 왕', group: 's5' },
          { id: 'sl30', name: '문무왕', fact: '삼국 통일을 완성하다', group: 's5' },
          { id: 'sl31', name: '신문왕', fact: '9주 5소경을 정비하다', group: 's5' },
          { id: 'sl32', name: '효소왕', fact: '신라 32대 왕', group: 's5' },
          { id: 'sl33', name: '성덕왕', fact: '신라 33대 왕', group: 's5' },
          { id: 'sl34', name: '효성왕', fact: '신라 34대 왕', group: 's5' },
          { id: 'sl35', name: '경덕왕', fact: '불국사와 석굴암을 세우다', group: 's5' },
          { id: 'sl36', name: '혜공왕', fact: '신라 36대 왕', group: 's6' },
          { id: 'sl37', name: '선덕왕', fact: '신라 37대 왕', group: 's6' },
          { id: 'sl38', name: '원성왕', fact: '독서삼품과를 실시하다', group: 's6' },
          { id: 'sl39', name: '소성왕', fact: '신라 39대 왕', group: 's6' },
          { id: 'sl40', name: '애장왕', fact: '신라 40대 왕', group: 's6' },
          { id: 'sl41', name: '헌덕왕', fact: '신라 41대 왕', group: 's6' },
          { id: 'sl42', name: '흥덕왕', fact: '장보고가 청해진을 설치하다', group: 's6' },
          { id: 'sl43', name: '희강왕', fact: '신라 43대 왕', group: 's7' },
          { id: 'sl44', name: '민애왕', fact: '신라 44대 왕', group: 's7' },
          { id: 'sl45', name: '신무왕', fact: '신라 45대 왕', group: 's7' },
          { id: 'sl46', name: '문성왕', fact: '신라 46대 왕', group: 's7' },
          { id: 'sl47', name: '헌안왕', fact: '신라 47대 왕', group: 's7' },
          { id: 'sl48', name: '경문왕', fact: '신라 48대 왕', group: 's7' },
          { id: 'sl49', name: '헌강왕', fact: '신라 49대 왕', group: 's7' },
          { id: 'sl50', name: '정강왕', fact: '신라 50대 왕', group: 's8' },
          { id: 'sl51', name: '진성여왕', fact: '신라의 마지막 여왕', group: 's8' },
          { id: 'sl52', name: '효공왕', fact: '신라 52대 왕', group: 's8' },
          { id: 'sl53', name: '신덕왕', fact: '신라 53대 왕', group: 's8' },
          { id: 'sl54', name: '경명왕', fact: '신라 54대 왕', group: 's8' },
          { id: 'sl55', name: '경애왕', fact: '포석정에서 최후를 맞다', group: 's8' },
          { id: 'sl56', name: '경순왕', fact: '고려에 항복한 마지막 왕', group: 's8' },
        ],
      },
    ],
  },

  // ── 국기 보고 나라 맞히기 (국기 퀴즈) ──────────────────────────────────
  {
    id: 'flag-quiz',
    title: '국기 보고 나라 맞히기',
    subtitle: '전 세계 국기 200개, 보고 바로 타자',
    description:
      '국기를 보고 어느 나라인지 초성 힌트와 함께 타자로 맞힙니다. 아시아부터 오세아니아까지 전 세계 200개 나라·지역의 국기를 정복해보세요.',
    category: '지리',
    emoji: '🚩',
    ui: 'flags',
    flow: 'quiz',
    unitLabel: '나라',
    keywords: ['국기 퀴즈', '세계 국기 맞추기', '나라 맞히기', '국기 이름', '세계지리 암기', '한글타자왕'],
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
        color: '#E11D48',
        stations: FLAG_STATIONS,
      },
    ],
  },
  {
    id: 'map-quiz',
    title: '지도 보고 나라 맞히기',
    subtitle: '세계지도에서 반짝이는 나라, 바로 타자',
    description:
      '세계지도 위에 하이라이트된 나라를 보고 이름을 한글 타자로 맞힙니다. 정답을 맞힐 때마다 지도가 초록색으로 채워지며, 대륙별로 세계지리 감각을 손으로 익힙니다.',
    category: '지리',
    emoji: '🗺️',
    ui: 'map',
    flow: 'quiz',
    unitLabel: '나라',
    keywords: ['세계지도 퀴즈', '지도 보고 나라 맞추기', '나라 위치 맞히기', '세계지리 게임', '지도 암기', '한글타자왕'],
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
        color: '#0891B2',
        stations: MAP_STATIONS,
      },
    ],
  },
];

export const getJourneyCourse = (id: string): JourneyCourse | undefined =>
  JOURNEY_COURSES.find((c) => c.id === id);

/** 멀티라인 코스에서도 안전한 전체 역 목록 */
export const getCourseStations = (course: JourneyCourse): JourneyStation[] =>
  course.lines.flatMap((l) => l.stations);
