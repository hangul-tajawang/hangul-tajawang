import { ReactNode } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  content: string;
  keyword: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "ultimate-typing-guide",
    title: "독수리 타법 탈출부터 1,000타까지: 한글타자왕 제작자의 현실적인 연습 가이드",
    description: "단순한 반복을 넘어 손가락이 위치를 기억하게 만드는 진짜 타자 속도 올리는 법.",
    date: "2026-05-04",
    category: "가이드",
    keyword: "타자연습, 타자속도, 한글타자왕, 독수리타법, 근육기억",
    content: `
# 독수리 타법 탈출부터 1,000타까지: 현실적인 타자 연습 가이드

매일 화면을 보며 글을 쓰고, 코드를 짜고, 업무 메일을 보내다 보면 가끔 답답할 때가 있습니다. 머릿속 생각은 이미 문장을 다 완성했는데, 손가락이 그 속도를 못 따라와서 흐름이 끊기는 경험 다들 해보셨을 겁니다. 

타이핑은 머리로 하는 게 아니라 철저하게 '**근육 기억(Muscle Memory)**'으로 하는 겁니다. 자전거 타는 법을 한 번 몸에 익히면 평생 잊어버리지 않듯이, 타자도 한 번 손가락에 제대로 새겨두면 평생 써먹는 무기가 됩니다. 독수리 타법을 벗어나서 분당 1,000타까지 가는 현실적인 방법을 정리해 봤습니다.

<div style="display: flex; justify-content: center; margin: 2rem 0;">
  <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="200" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <path d="M110 100 C 160 50, 240 50, 290 100" stroke="#3B82F6" stroke-width="4" stroke-dasharray="6 6" fill="none"/>
    <circle cx="100" cy="100" r="35" fill="#3B82F6" opacity="0.1"/>
    <circle cx="100" cy="100" r="25" fill="#3B82F6"/>
    <circle cx="300" cy="100" r="35" fill="#10B981" opacity="0.1"/>
    <circle cx="300" cy="100" r="25" fill="#10B981"/>
    <text x="100" y="105" font-family="sans-serif" font-weight="bold" font-size="14" fill="white" text-anchor="middle">생각</text>
    <text x="300" y="105" font-family="sans-serif" font-weight="bold" font-size="14" fill="white" text-anchor="middle">손끝</text>
    <text x="200" y="60" font-family="sans-serif" font-weight="bold" font-size="16" fill="#2563EB" text-anchor="middle">근육 기억 (Muscle Memory)</text>
    <text x="200" y="140" font-family="sans-serif" font-size="12" fill="#64748B" text-anchor="middle">머리를 거치지 않고 다이렉트로 출력하기</text>
  </svg>
</div>

---

## 🟢 내가 '한글타자왕'을 직접 만든 이유

요즘 AI가 글도 대신 써주고 기획도 도와주는 시대라고들 하죠. 하지만 역설적으로 그 AI에게 프롬프트를 입력하고, 나온 결과물을 내 의도대로 빠르게 수정하는 건 결국 우리 몫입니다. 입력이 느리면 아무리 좋은 툴이 있어도 실질적인 퍼포먼스가 떨어질 수밖에 없어요.

저도 평소에 업무를 보거나 프로젝트를 진행할 때, 입력 속도에서 오는 병목현상을 자주 느꼈습니다. 어떻게 하면 사람들이 타자 연습을 지루한 숙제가 아니라, 예전 산성비 게임처럼 재밌게 즐기면서 속도를 올릴 수 있을까 고민하다가 직접 타자 연습 서비스를 만들게 되었습니다.

---

## 1단계: 초급 - 눈은 모니터에만 고정하기

초급 단계에서 가장 중요한 건 딱 하나, '**시선 독립**'입니다. 키보드와 모니터를 번갈아 보는 고개 숙임을 멈춰야 합니다.

### 1. 주말에 몰아치기보다 매일 30분씩
키보드 자판을 외우는 건 영단어 암기랑 다릅니다. 몸으로 익히는 거라 한 번에 5시간 몰아서 치는 것보다, 매일 아침 워밍업 느낌으로 30분씩 꾸준히 치는 게 근육 기억에 훨씬 좋습니다. 

<div style="display: flex; justify-content: center; margin: 2rem 0;">
  <svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="250" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <path d="M60 200 L340 200" stroke="#94A3B8" stroke-width="2"/>
    <path d="M60 200 L60 50" stroke="#94A3B8" stroke-width="2"/>
    <text x="200" y="230" font-family="sans-serif" font-size="12" fill="#64748B" text-anchor="middle">연습 기간</text>
    <text x="30" y="125" font-family="sans-serif" font-size="12" fill="#64748B" text-anchor="middle" transform="rotate(-90 30 125)">타자 속도</text>
    <path d="M60 200 Q 150 190 200 130 T 340 60" stroke="#10B981" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="200" cy="130" r="6" fill="#EF4444"/>
    <text x="200" y="110" font-family="sans-serif" font-weight="bold" font-size="12" fill="#EF4444" text-anchor="middle">이 구간만 버티면 됩니다!</text>
    <text x="200" y="30" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1E293B" text-anchor="middle">꾸준함이 만드는 성장 곡선</text>
  </svg>
</div>

---

## 2단계: 중급 - 속도보다 정확도가 먼저다

손가락이 대충 어디 있는지 알게 되면 누구나 본능적으로 빨리 치고 싶어 집니다. 하지만 여기서 오타를 무시하고 속도만 올리면 나중에 버릇 고치기가 진짜 힘듭니다.

### 2. 백스페이스(Backspace) 덜 누르기
천천히 치더라도 백스페이스를 안 누르는 걸 목표로 해보세요. 차분하게 정확도 99%를 유지하면서 연습하다 보면, 속도는 굳이 억지로 내지 않아도 물 흐르듯 자연스럽게 따라옵니다.

### 3. 지루할 땐 타자 게임으로 환기
분당 300~400타 구간쯤 오면 정체기가 옵니다. 맨날 똑같은 짧은 글만 치면 재미도 없고 실력도 안 늡니다. 이럴 땐 억지로 치지 말고 타자 게임을 해보세요. 점수 내려고 집중하다 보면 나도 모르게 평소보다 훨씬 손가락이 빨리 움직이는 걸 느낄 수 있습니다.

---

## 3단계: 고급 - 손가락과 생각의 동기화

이제 키보드 자판은 아예 안 봐도 되는 수준입니다. 

### 4. 단어 통째로 인식하기 (Chunking)
타자가 빠른 사람들은 "안녕하세요"를 칠 때 자음을 하나씩 생각하고 누르지 않습니다. 단어 하나를 통째로 하나의 덩어리로 인식하고, 손가락이 반사적으로 한 번에 타닥! 하고 쳐내는 거죠. 

### 5. 나에게 맞는 타건감 찾기
타자 연습을 꾸준히 하려면 치는 맛도 중요합니다. 도각거리는 무접점 키보드나, 매끄럽게 눌리는 리니어 스위치 등 내 손끝에 잘 맞는 기계식 키보드를 찾으면 연습이 훨씬 즐거워집니다. 타건음 소리와 손끝의 촉각을 즐기면서 타자 연습을 하나의 취미처럼 만들어보세요.

---

### 마치며

타이핑 속도가 빨라지면 실무 효율도 올라가지만, 무엇보다 내 생각을 막힘없이 모니터에 쏟아내는 그 자체로 꽤 큰 쾌감이 있습니다. 하루에 조금씩만 투자해서 그 즐거움을 꼭 느껴보셨으면 좋겠습니다.

<br/>

> **[⌨️ 한글타자왕에서 바로 연습 시작하기](/practice)**
`
  },
  {
    id: "average-typing-speed",
    title: "한글 타자 평균 속도는 몇 타일까? 연령대별 기준과 내 타수 측정법",
    description: "분당 타수(CPM)의 정확한 의미부터 학생·직장인·개발자별 평균 타수, 그리고 목표 타수를 정하는 현실적인 기준까지 정리했습니다.",
    date: "2026-05-20",
    category: "가이드",
    keyword: "타자 평균 속도, 평균 타수, 분당 타수, 타자 속도 측정, 타자 몇 타",
    content: `
# 한글 타자 평균 속도는 몇 타일까? 연령대별 기준과 내 타수 측정법

타자 연습을 시작하면 가장 먼저 궁금해지는 게 있습니다. "그래서 남들은 보통 몇 타나 치는데?" 이 글에서는 분당 타수의 정확한 의미와 집단별 평균 수준, 그리고 목표 타수를 어떻게 잡아야 하는지 정리해 봤습니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="320" viewBox="0 0 480 320" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="수준별 분당 타수 비교 막대 차트">
    <rect width="480" height="320" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="42" font-family="sans-serif" font-weight="bold" font-size="17" fill="#1E293B" text-anchor="middle">수준별 분당 타수(CPM) 기준</text>
    <text x="98" y="82" font-family="sans-serif" font-size="13" fill="#64748B" text-anchor="end">입문</text>
    <rect x="108" y="68" width="50" height="19" rx="9" fill="#CBD5E1"/>
    <text x="166" y="82" font-family="sans-serif" font-size="12" fill="#94A3B8">150타</text>
    <text x="98" y="120" font-family="sans-serif" font-size="13" fill="#64748B" text-anchor="end">초급</text>
    <rect x="108" y="106" width="83" height="19" rx="9" fill="#CBD5E1"/>
    <text x="199" y="120" font-family="sans-serif" font-size="12" fill="#94A3B8">250타</text>
    <text x="98" y="158" font-family="sans-serif" font-weight="bold" font-size="13" fill="#1E293B" text-anchor="end">평균</text>
    <rect x="108" y="144" width="117" height="19" rx="9" fill="#3B82F6"/>
    <text x="233" y="158" font-family="sans-serif" font-weight="bold" font-size="12" fill="#3B82F6">350타 ← 일반 직장인</text>
    <text x="98" y="196" font-family="sans-serif" font-size="13" fill="#64748B" text-anchor="end">숙련</text>
    <rect x="108" y="182" width="167" height="19" rx="9" fill="#93C5FD"/>
    <text x="283" y="196" font-family="sans-serif" font-size="12" fill="#94A3B8">500타</text>
    <text x="98" y="234" font-family="sans-serif" font-size="13" fill="#64748B" text-anchor="end">상급</text>
    <rect x="108" y="220" width="233" height="19" rx="9" fill="#93C5FD"/>
    <text x="349" y="234" font-family="sans-serif" font-size="12" fill="#94A3B8">700타</text>
    <text x="98" y="272" font-family="sans-serif" font-size="13" fill="#64748B" text-anchor="end">최상위</text>
    <rect x="108" y="258" width="300" height="19" rx="9" fill="#10B981"/>
    <text x="416" y="272" font-family="sans-serif" font-weight="bold" font-size="12" fill="#059669">900타+</text>
    <text x="240" y="304" font-family="sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle">300~400타면 이미 평균입니다. 조급해하지 마세요.</text>
  </svg>
</div>

## 타수(CPM)가 정확히 뭘 뜻하는 걸까?

한국에서 말하는 '타수'는 보통 **분당 타수**(CPM, Characters Per Minute)를 의미합니다. 여기서 중요한 건 '글자 수'가 아니라 '타건 수'라는 점입니다. 예를 들어 '값'이라는 한 글자는 ㄱ + ㅏ + ㅂ + ㅅ, 총 4번의 키 입력이 필요하므로 4타로 계산됩니다.

영어권에서 쓰는 WPM(Words Per Minute)과는 다른 단위이기 때문에, 해외 타자 사이트의 기록과 직접 비교하면 안 됩니다. 대략 한글 1타수는 영어 WPM의 5분의 1 수준으로 환산하는 것이 일반적입니다.

## 집단별 평균 타수, 현실적인 숫자

공식 통계기관의 조사는 없지만, 타자 연습 서비스들의 누적 데이터와 학교·직업 교육 현장에서 통용되는 기준을 종합하면 대략 이렇습니다.

| 수준 | 분당 타수 | 설명 |
|------|-----------|------|
| 입문 | 100~200타 | 독수리 타법, 자판을 보면서 침 |
| 초급 | 200~300타 | 자판 위치는 외웠지만 아직 느림 |
| 평균 | 300~400타 | 일반적인 사무직 직장인 수준 |
| 숙련 | 400~600타 | 문서 작업이 많은 직군, 상위권 학생 |
| 상급 | 600~800타 | 속기에 준하는 수준, 전체의 5% 미만 |
| 최상위 | 800타 이상 | 프로게이머, 속기사 등 극소수 |

**분당 300~400타면 이미 평균**입니다. 인터넷 커뮤니티에는 700타, 900타 인증이 넘쳐나서 내 실력이 초라해 보일 수 있지만, 그건 애초에 타자에 관심 많은 사람들이 모인 곳이라 표본이 왜곡된 겁니다.

## 목표 타수는 이렇게 잡으세요

### 1. 현재 타수 + 100타를 1차 목표로
지금 250타라면 350타를 목표로 잡으세요. "1,000타 도전!" 같은 목표는 대부분 2주 안에 포기하게 됩니다. 100타 단위로 끊어서 올라가는 게 성취감 유지에 훨씬 좋습니다.

### 2. 정확도 95% 아래면 속도 욕심은 금물
정확도가 낮은 상태로 속도를 올리면 오타 습관이 근육에 같이 새겨집니다. 백스페이스 누르는 시간까지 계산하면 실질 타수는 오히려 낮아집니다. [짧은 글 연습](/practice)에서 정확도를 먼저 95% 이상으로 끌어올린 뒤 속도를 올리는 게 순서입니다.

### 3. 측정은 '긴 글'로 해야 정확하다
낱말 몇 개 쳐서 나온 순간 최고 타수는 실제 실력이 아닙니다. 문장 부호와 띄어쓰기가 섞인 [긴 글 필사](/transcription)를 3분 이상 쳤을 때의 평균 타수가 진짜 내 실력입니다.

## 타수가 정체됐다면

300~400타 구간에서는 누구나 정체기를 겪습니다. 이 구간을 뚫는 검증된 방법은 두 가지입니다.

1. **게임으로 한계 속도 건드리기** — [산성비 게임](/game/acid-rain)처럼 시간 압박이 있는 환경에서는 평소보다 순간 속도가 올라갑니다. 이 '한계 경험'이 반복되면 평균 속도도 따라 올라옵니다.
2. **약점 글쇠 집중 연습** — 대부분 특정 글쇠(ㅋ, ㅌ, ㅍ 같은 새끼손가락 자리)에서 속도가 죽습니다. [자리 연습](/practice)으로 약점 구간만 반복하는 게 전체 문장을 계속 치는 것보다 효율적입니다.

## 마치며

평균에 연연할 필요는 없지만, 기준점이 있으면 연습의 방향이 잡힙니다. 지금 바로 내 타수를 측정해보고, +100타 목표를 세워보세요.

> **[⏱️ 지금 내 타자 속도 측정하러 가기](/practice)**
`
  },
  {
    id: "common-spelling-mistakes",
    title: "한국인이 가장 자주 틀리는 맞춤법 15개 총정리 (되/돼, 안/않, 왠/웬)",
    description: "카톡, 메일, 보고서에서 반복해서 틀리는 한국어 맞춤법을 원리와 함께 정리했습니다. 헷갈릴 때마다 찾아볼 수 있는 치트시트입니다.",
    date: "2026-06-05",
    category: "맞춤법",
    keyword: "맞춤법 정리, 되 돼 구분, 안 않 차이, 왠지 웬지, 자주 틀리는 맞춤법",
    content: `
# 한국인이 가장 자주 틀리는 맞춤법 15개 총정리

맞춤법은 몰라서 틀리는 게 아니라 '헷갈려서' 틀립니다. 그리고 헷갈리는 단어는 사람마다 거의 비슷합니다. 업무 메일이나 자기소개서에서 자주 틀리는 맞춤법 15개를 구분 원리와 함께 정리했습니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="235" viewBox="0 0 480 235" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="되와 돼를 하와 해로 구분하는 방법">
    <rect width="480" height="235" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="42" font-family="sans-serif" font-weight="bold" font-size="17" fill="#1E293B" text-anchor="middle">되/돼 3초 구분법: '하/해'를 넣어보세요</text>
    <rect x="55" y="65" width="170" height="95" rx="12" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="2"/>
    <text x="140" y="110" font-family="sans-serif" font-weight="bold" font-size="30" fill="#3B82F6" text-anchor="middle">되 = 하</text>
    <text x="140" y="140" font-family="sans-serif" font-size="12" fill="#64748B" text-anchor="middle">되고 싶다 → 하고 싶다 ✓</text>
    <rect x="255" y="65" width="170" height="95" rx="12" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="2"/>
    <text x="340" y="110" font-family="sans-serif" font-weight="bold" font-size="30" fill="#059669" text-anchor="middle">돼 = 해</text>
    <text x="340" y="140" font-family="sans-serif" font-size="12" fill="#64748B" text-anchor="middle">그래도 돼? → 그래도 해? ✓</text>
    <text x="240" y="196" font-family="sans-serif" font-weight="bold" font-size="13" fill="#1E293B" text-anchor="middle">문장 끝은 무조건 '돼' — "이제 다 됐다"도 같은 원리</text>
    <text x="240" y="216" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">'되'는 홀로 문장을 끝맺을 수 없습니다</text>
  </svg>
</div>

## 1. 되 vs 돼 — '하/해'를 넣어보세요

'돼'는 '되어'의 준말입니다. 헷갈리는 자리에 '하'와 '해'를 넣어보고, '해'가 자연스러우면 '돼'를 쓰면 됩니다.

- 그래도 **돼**? → 그래도 **해**? (자연스러움 → 돼)
- **되**고 싶다 → **하**고 싶다 (자연스러움 → 되)

문장 끝에는 무조건 '돼'입니다. '되'로 문장을 끝낼 수 없기 때문입니다. [→ 되/돼 퀴즈 풀어보기](/quiz/dwae-vs-doe)

## 2. 안 vs 않 — 빼도 말이 되면 '안'

'안'은 부사라서 빼도 문장이 성립하고, '않'은 용언의 일부라서 빼면 문장이 무너집니다.

- 밥을 **안** 먹었다 → 밥을 먹었다 (성립 → 안)
- 밥을 먹지 **않**았다 → 밥을 먹지 았다 (불성립 → 않)

## 3. 왠 vs 웬 — '왠'은 '왠지' 하나뿐

'왠'이 들어가는 우리말은 '왠지(왜인지)' 딱 하나입니다. 웬일, 웬만하면, 웬 떡 — 나머지는 전부 '웬'입니다.

## 4. 낫다 vs 낳다

병은 **낫고**, 아기는 **낳습니다**. "감기 빨리 낳으세요"는 상대에게 출산을 권하는 문장이 됩니다. [→ 낫다/낳다 퀴즈](/quiz/natda-vs-nahda)

## 5. 어떡해 vs 어떻게

문장이 그 말로 끝나면 '어떡해(어떻게 해)', 뒤에 동사가 오면 '어떻게'입니다. '어떻해'는 세상에 없는 표기입니다.

## 6. 예요 vs 이에요

앞말에 받침이 없으면 '예요'(거예요), 받침이 있으면 '이에요'(책상이에요). '이예요'는 항상 틀립니다.

## 7. 맞히다 vs 맞추다

정답과 과녁은 **맞히고**, 퍼즐과 시간은 **맞춥니다**. "문제를 맞췄다"가 아니라 "문제를 맞혔다"가 맞습니다.

## 8. 다르다 vs 틀리다

같지 않으면 '다르다', 그르면 '틀리다'입니다. "우리는 취향이 틀려"라고 하면 상대의 취향이 잘못됐다는 뜻이 돼버립니다.

## 9. 결제 vs 결재

카드는 **결제**, 부장님 사인은 **결재**. 돈이 오가면 경제의 '제'를 쓴다고 기억하세요.

## 10. 로서 vs 로써

자격·신분은 '로서'(학생으로서), 수단·도구는 '로써'(대화로써). 사람이면 '로서'라고 기억하면 대부분 맞습니다.

## 11. 금세 vs 금새

'금시에'의 준말이라 '금세'가 맞습니다. '금새'는 물건값이라는 전혀 다른 뜻의 말입니다.

## 12. 설렘 vs 설레임

기본형이 '설레다'이므로 명사형은 '설렘'입니다. '설레임'은 아이스크림 이름일 뿐, 표준어가 아닙니다.

## 13. 며칠 vs 몇 일

어떤 경우에도 '며칠'만 맞습니다. '몇 일'과 '몇일'은 한글 맞춤법이 인정하지 않는 표기입니다. [→ 며칠 퀴즈](/quiz/myeochil-vs-myeotil)

## 14. 이따가 vs 있다가

시간(조금 뒤)은 '이따가', 머무름은 '있다가'입니다. "이따가 봐"와 "집에 있다가 나갈게"를 비교해 보세요.

## 15. 잃어버리다 vs 잊어버리다

물건은 **잃어버리고**, 기억은 **잊어버립니다**. 지갑은 잃고, 비밀번호는 잊는 겁니다.

---

## 눈으로 외우지 말고 손으로 익히세요

맞춤법은 읽을 때는 다 아는 것 같아도 막상 타이핑할 때 틀립니다. 결국 손가락이 올바른 표기를 기억하게 만들어야 하는데, 그 방법이 바로 반복 타이핑입니다.

한글타자왕의 [맞춤법 퀴즈](/quiz)에서는 이 글에서 다룬 단어들을 퀴즈로 풀고, 상세한 해설을 확인한 뒤, 바로 [짧은 글 타자 연습](/practice)으로 넘어가 손에 익힐 수 있습니다.

> **[📝 맞춤법 퀴즈 40제 풀러 가기](/quiz)**
`
  },
  {
    id: "acid-rain-typing-game",
    title: "산성비 게임의 추억: 타자 게임이 진짜 타자 실력에 도움이 될까?",
    description: "2000년대 컴퓨터 교실을 지배했던 산성비 게임. 추억의 게임이 실제로 타자 속도 향상에 효과적인 이유를 훈련 원리 관점에서 분석했습니다.",
    date: "2026-06-18",
    category: "게임",
    keyword: "산성비 게임, 타자 게임, 한메타자 산성비, 타자 게임 추천, 무료 타자 게임",
    content: `
# 산성비 게임의 추억: 타자 게임이 진짜 타자 실력에 도움이 될까?

컴퓨터 교실에서 몰래 하던 산성비 게임을 기억하시나요? 하늘에서 떨어지는 단어를 바닥에 닿기 전에 쳐내던 그 게임 말입니다. 재미로 하던 게임이었지만, 사실 산성비는 훈련 이론 관점에서 꽤 정교하게 설계된 연습 도구였습니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="300" viewBox="0 0 480 300" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="산성비 게임의 원리를 나타낸 그림">
    <rect width="480" height="300" rx="16" fill="#0F172A" stroke="#1E293B" stroke-width="2"/>
    <text x="240" y="40" font-family="sans-serif" font-weight="bold" font-size="16" fill="#E2E8F0" text-anchor="middle">산성비 게임의 원리</text>
    <text x="100" y="90" font-family="sans-serif" font-weight="bold" font-size="15" fill="#7DD3FC" text-anchor="middle">구름</text>
    <line x1="100" y1="98" x2="100" y2="118" stroke="#7DD3FC" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.5"/>
    <text x="240" y="70" font-family="sans-serif" font-weight="bold" font-size="15" fill="#7DD3FC" text-anchor="middle">바람</text>
    <line x1="240" y1="78" x2="240" y2="98" stroke="#7DD3FC" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.5"/>
    <text x="380" y="110" font-family="sans-serif" font-weight="bold" font-size="15" fill="#FDE047" text-anchor="middle">💣폭탄</text>
    <line x1="380" y1="118" x2="380" y2="138" stroke="#FDE047" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.5"/>
    <text x="165" y="170" font-family="sans-serif" font-weight="bold" font-size="15" fill="#F87171" text-anchor="middle">타자</text>
    <line x1="165" y1="178" x2="165" y2="196" stroke="#F87171" stroke-width="1.5" stroke-dasharray="3 4"/>
    <text x="165" y="192" font-family="sans-serif" font-size="10" fill="#F87171" text-anchor="middle" dy="16">위험!</text>
    <line x1="30" y1="225" x2="450" y2="225" stroke="#EF4444" stroke-width="2" stroke-dasharray="6 5"/>
    <text x="440" y="243" font-family="sans-serif" font-size="11" fill="#F87171" text-anchor="end">바닥에 닿으면 게임 오버</text>
    <rect x="140" y="255" width="200" height="30" rx="8" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
    <text x="155" y="275" font-family="monospace" font-weight="bold" font-size="14" fill="#4ADE80">타자_</text>
    <text x="330" y="275" font-family="sans-serif" font-size="10" fill="#64748B" text-anchor="end">빠르고 정확하게!</text>
  </svg>
</div>

## 산성비 게임이 뭐길래

산성비는 1990~2000년대 국민 타자 프로그램들에 들어있던 미니게임입니다. 화면 위에서 단어들이 비처럼 떨어지고, 바닥(땅)에 닿기 전에 해당 단어를 정확히 입력하면 사라집니다. 단어가 쌓이면 게임 오버. 레벨이 오를수록 낙하 속도가 빨라집니다.

규칙은 단순하지만 중독성은 강력했습니다. 그리고 그 중독성의 구조가 바로 타자 실력을 끌어올리는 핵심 장치였습니다.

## 게임이 일반 연습보다 효과적인 3가지 이유

### 1. 시간 압박이 '한계 속도'를 건드린다

일반 타자 연습은 내가 편한 속도로 칩니다. 편한 속도로만 연습하면 실력은 그 속도에 머뭅니다. 반면 산성비는 단어가 떨어지는 속도를 게임이 정합니다. 평소 속도로는 못 막는 순간이 반드시 오고, 그때 손가락은 평소보다 빠르게 움직이는 경험을 하게 됩니다.

운동으로 치면 '점진적 과부하'입니다. 평소보다 아주 살짝 무거운 무게를 들 때 근육이 성장하듯, 평소보다 살짝 빠른 입력을 강요받을 때 타자 속도가 성장합니다.

### 2. 오타의 대가가 즉각적이다

일반 연습에서 오타는 백스페이스 한 번이면 그만입니다. 하지만 산성비에서 오타는 곧 시간 손실이고, 시간 손실은 곧 게임 오버입니다. 오타에 실질적인 '비용'이 붙는 순간, 뇌는 정확도에 훨씬 민감해집니다.

### 3. 몰입이 연습 시간을 늘린다

"매일 30분 타자 연습"은 작심삼일로 끝나기 쉽지만, "한 판만 더"는 30분을 훌쩍 넘깁니다. 결국 실력은 누적 연습량이 결정하는데, 게임은 그 누적량을 고통 없이 쌓게 해주는 장치입니다.

## 산성비로 연습할 때의 팁

1. **정확도가 먼저입니다.** 급하다고 대충 치면 오히려 단어가 쌓입니다. 한 단어씩 확실하게 지우는 게 결과적으로 빠릅니다.
2. **긴 단어부터 처리하세요.** 짧은 단어는 마지막 순간에도 지울 수 있지만, 긴 단어는 시간이 필요합니다.
3. **게임만 하지는 마세요.** 산성비는 낱말 단위 훈련이라 문장 타이핑(띄어쓰기, 문장부호)은 늘지 않습니다. [긴 글 필사](/transcription)와 병행해야 실전 타이핑이 늡니다.

## 웹에서 바로 즐기는 산성비

한글타자왕에는 설치 없이 브라우저에서 바로 즐길 수 있는 [산성비 게임](/game/acid-rain)이 있습니다. 원작의 감성을 살리면서 폭탄 단어, 얼음 단어 같은 아이템 요소를 추가했습니다. 이외에도 [단어 디펜스](/game/castle-defense), [블록 팝](/game/block-pop) 같은 타자 게임을 무료로 제공합니다.

> **[🌧️ 산성비 게임 바로 하러 가기](/game/acid-rain)**
`
  },
  {
    id: "transcription-benefits",
    title: "키보드 필사의 효과: 손글씨가 아니라 타이핑으로 필사해도 될까?",
    description: "필사는 꼭 손으로 써야 할까요? 키보드 필사가 가진 고유한 장점과, 필사로 글쓰기·타자 실력을 동시에 키우는 방법을 정리했습니다.",
    date: "2026-07-01",
    category: "필사",
    keyword: "필사 효과, 키보드 필사, 필사 하는 법, 필사 추천 글, 타자 필사",
    content: `
# 키보드 필사의 효과: 손글씨가 아니라 타이핑으로 필사해도 될까?

필사(筆寫)라고 하면 만년필과 노트부터 떠올리게 됩니다. 그래서 "키보드로 치는 건 필사가 아니지 않나?"라는 질문을 종종 받습니다. 결론부터 말하면, 키보드 필사는 손글씨 필사와는 다른 고유한 효과가 있고, 목적에 따라서는 오히려 더 나은 선택입니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="250" viewBox="0 0 480 250" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="눈으로 읽기와 필사의 차이를 나타낸 그림">
    <rect width="480" height="250" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="42" font-family="sans-serif" font-weight="bold" font-size="17" fill="#1E293B" text-anchor="middle">눈으로 읽기 vs 필사하며 읽기</text>
    <text x="65" y="90" font-family="sans-serif" font-weight="bold" font-size="13" fill="#64748B">👀 눈으로 읽기</text>
    <circle cx="80" cy="115" r="7" fill="#3B82F6"/>
    <circle cx="130" cy="115" r="7" fill="#E2E8F0" stroke="#CBD5E1"/>
    <circle cx="180" cy="115" r="7" fill="#E2E8F0" stroke="#CBD5E1"/>
    <circle cx="230" cy="115" r="7" fill="#3B82F6"/>
    <circle cx="280" cy="115" r="7" fill="#E2E8F0" stroke="#CBD5E1"/>
    <circle cx="330" cy="115" r="7" fill="#E2E8F0" stroke="#CBD5E1"/>
    <circle cx="380" cy="115" r="7" fill="#3B82F6"/>
    <path d="M80 100 Q 155 75 230 100 Q 305 75 380 100" stroke="#94A3B8" stroke-width="2" stroke-dasharray="5 4" fill="none"/>
    <text x="415" y="119" font-family="sans-serif" font-size="11" fill="#94A3B8">건너뜀</text>
    <text x="65" y="170" font-family="sans-serif" font-weight="bold" font-size="13" fill="#059669">⌨️ 필사하며 읽기</text>
    <circle cx="80" cy="195" r="7" fill="#10B981"/>
    <circle cx="130" cy="195" r="7" fill="#10B981"/>
    <circle cx="180" cy="195" r="7" fill="#10B981"/>
    <circle cx="230" cy="195" r="7" fill="#10B981"/>
    <circle cx="280" cy="195" r="7" fill="#10B981"/>
    <circle cx="330" cy="195" r="7" fill="#10B981"/>
    <circle cx="380" cy="195" r="7" fill="#10B981"/>
    <line x1="80" y1="195" x2="380" y2="195" stroke="#10B981" stroke-width="2" opacity="0.4"/>
    <text x="415" y="199" font-family="sans-serif" font-size="11" fill="#059669">전부 처리</text>
    <text x="240" y="232" font-family="sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle">필사는 조사 하나, 쉼표 하나까지 강제로 '느리게 읽기'를 만듭니다</text>
  </svg>
</div>

## 필사의 본질은 '느리게 읽기'다

필사의 핵심 효과는 쓰는 행위 자체가 아니라, **문장을 강제로 천천히, 빠짐없이 읽게 되는 것**에 있습니다.

눈으로만 읽으면 뇌는 문장을 건너뜁니다. 조사 하나, 쉼표 하나는 인식조차 못 하고 지나갑니다. 하지만 필사를 하면 모든 글자를 하나하나 처리해야 합니다. 작가가 왜 여기서 문장을 끊었는지, 왜 이 단어를 골랐는지가 그제야 보입니다. 이 효과는 손으로 쓰든 키보드로 치든 동일하게 작동합니다.

## 키보드 필사만의 장점 3가지

### 1. 분량이 다르다
손글씨 필사는 30분에 원고지 2~3매가 한계지만, 키보드로는 같은 시간에 5~10배의 분량을 소화할 수 있습니다. 단편소설 한 편을 통째로 필사하는 일이 현실적으로 가능해집니다. 접하는 문장의 절대량이 많아지면 문장 감각도 그만큼 빨리 자랍니다.

### 2. 타자 연습이 저절로 된다
필사는 사실상 최고의 타자 연습 텍스트입니다. 낱말 연습과 달리 실제 문장에는 띄어쓰기, 쉼표, 마침표, 따옴표가 섞여 있어서, 필사로 연습하면 '실전 타이핑'이 늡니다. 좋은 문장을 읽으면서 타수도 오르니 일석이조입니다.

### 3. 진입 장벽이 없다
악필 걱정도, 손목 통증도, 노트와 펜을 준비할 필요도 없습니다. 오늘 밤 자기 전 10분, 브라우저만 열면 시작할 수 있습니다. 습관은 진입 장벽이 낮을수록 오래갑니다.

## 필사하기 좋은 글은 따로 있다

처음부터 장편소설에 도전하면 지칩니다. 이런 순서를 추천합니다.

1. **시(詩)부터** — 윤동주의 '별 헤는 밤', 김소월의 '진달래꽃'처럼 짧고 리듬감 있는 시는 필사 입문에 가장 좋습니다.
2. **수필과 단편** — 시가 익숙해지면 현진건, 채만식 같은 작가의 단편 일부로 넘어가세요. 서사가 있는 글은 몰입감이 다릅니다.
3. **내가 좋아하는 글** — 결국 오래 하려면 좋아하는 글이어야 합니다. 가사, 에세이, 연설문 무엇이든 좋습니다.

## 키보드 필사, 이렇게 하세요

- **하루 10분, 같은 시간에.** 분량 목표보다 시간 목표가 지키기 쉽습니다.
- **오타에 관대해지세요.** 필사의 목적은 문장 흡수이지 무오타가 아닙니다. 정확도 훈련은 별도의 타자 연습에서 하면 됩니다.
- **다 치고 한 번 소리 내어 읽기.** 필사한 문장을 읽어보면 눈으로 읽을 때 안 보이던 리듬이 들립니다.

## 원고지 감성으로 필사하기

한글타자왕의 [필사 연습](/transcription)에서는 윤동주, 김소월, 정지용, 이육사, 한용운 등 한국 문학의 명문을 디지털 원고지 위에서 필사할 수 있습니다. 타수와 정확도가 실시간으로 측정되고, 다른 사용자가 올린 글로 연습하는 [필사 챌린지](/challenge)도 있습니다.

> **[📖 원고지 필사 연습 시작하기](/transcription)**
`
  },
  {
    id: "keyboard-switch-guide",
    title: "기계식 키보드 축 완벽 정리: 청축·갈축·적축·무접점, 타자 연습엔 뭐가 좋을까?",
    description: "청축은 시끄럽고 적축은 밋밋하다? 축별 특성과 소음, 키압을 비교하고 타자 연습·사무실·게임 등 용도별로 어떤 축을 골라야 하는지 정리했습니다.",
    date: "2026-05-28",
    category: "장비",
    keyword: "기계식 키보드 축 차이, 청축 갈축 적축, 무접점 키보드, 타자용 키보드 추천, 키보드 축 추천",
    content: `
# 기계식 키보드 축 완벽 정리: 타자 연습엔 뭐가 좋을까?

타자 연습을 하다 보면 어느 순간 장비에 눈이 갑니다. 그리고 기계식 키보드를 검색하는 순간 '청축', '갈축', '적축', '무접점'이라는 낯선 단어의 벽에 부딪히죠. 어렵게 생각할 필요 없습니다. 축(스위치)은 결국 **누를 때의 느낌과 소리**를 결정하는 부품일 뿐입니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="270" viewBox="0 0 480 270" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="키보드 축별 타건감과 소음 비교">
    <rect width="480" height="270" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="40" font-family="sans-serif" font-weight="bold" font-size="17" fill="#1E293B" text-anchor="middle">4대 축 한눈에 비교</text>
    <circle cx="97" cy="95" r="24" fill="#3B82F6"/>
    <text x="97" y="140" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1E293B" text-anchor="middle">청축</text>
    <text x="97" y="160" font-family="sans-serif" font-size="12" fill="#64748B" text-anchor="middle">딸깍!</text>
    <rect x="62" y="180" width="70" height="10" rx="5" fill="#FCA5A5"/>
    <text x="97" y="212" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">소음 큼</text>
    <circle cx="192" cy="95" r="24" fill="#A16207"/>
    <text x="192" y="140" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1E293B" text-anchor="middle">갈축</text>
    <text x="192" y="160" font-family="sans-serif" font-size="12" fill="#64748B" text-anchor="middle">서걱서걱</text>
    <rect x="172" y="180" width="40" height="10" rx="5" fill="#FCD34D"/>
    <text x="192" y="212" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">소음 중간</text>
    <circle cx="287" cy="95" r="24" fill="#EF4444"/>
    <text x="287" y="140" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1E293B" text-anchor="middle">적축</text>
    <text x="287" y="160" font-family="sans-serif" font-size="12" fill="#64748B" text-anchor="middle">부드러움</text>
    <rect x="274" y="180" width="26" height="10" rx="5" fill="#86EFAC"/>
    <text x="287" y="212" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">소음 작음</text>
    <circle cx="382" cy="95" r="24" fill="#6366F1"/>
    <text x="382" y="140" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1E293B" text-anchor="middle">무접점</text>
    <text x="382" y="160" font-family="sans-serif" font-size="12" fill="#64748B" text-anchor="middle">도각도각</text>
    <rect x="367" y="180" width="30" height="10" rx="5" fill="#86EFAC"/>
    <text x="382" y="212" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">소음 작음</text>
    <text x="240" y="248" font-family="sans-serif" font-weight="bold" font-size="12" fill="#1E293B" text-anchor="middle">입문 추천: 갈축 · 사무실: 저소음 적축 · 예산 되면: 무접점</text>
  </svg>
</div>

## 축이란 무엇인가

기계식 키보드는 키캡 아래에 하나하나 독립된 스위치가 들어 있습니다. 이 스위치의 내부 구조에 따라 키를 누를 때의 압력, 걸리는 느낌(구분감), 소리가 달라집니다. 축의 이름은 스위치 내부 부품의 색깔에서 왔습니다.

## 4대 축 특성 비교

| 축 | 타건감 | 소음 | 특징 |
|----|--------|------|------|
| 청축 | 딸깍! 하는 명확한 클릭 | 매우 큼 | 타건의 쾌감 최고, 사무실 반입 금지급 소음 |
| 갈축 | 서걱, 약한 걸림(넉클) | 중간 | 구분감과 소음의 균형, 입문 추천 1순위 |
| 적축 | 걸림 없이 부드럽게 쑥 | 작음 | 빠른 연타에 유리, 게이밍에서 인기 |
| 무접점 | 도각도각, 쫀득함 | 작음~중간 | 물리 접점 없이 정전용량 감지, 내구성·정숙함 최상, 가격 비쌈 |

### 청축 — 타자 치는 맛의 끝판왕
누를 때마다 '딸깍' 소리와 함께 확실한 구분감이 옵니다. 타자 연습이 즐거워지는 축이지만, 소음이 커서 같이 사는 가족이나 사무실 동료의 원성을 살 수 있습니다. **혼자 쓰는 공간이 있을 때만** 추천합니다.

### 갈축 — 뭘 살지 모르겠다면 이것
청축의 구분감을 줄이고 소음도 줄인 중간 지점입니다. 타건감이 있으면서도 시끄럽지 않아 첫 기계식 키보드로 가장 무난합니다.

### 적축 — 부드럽고 빠르게
걸리는 느낌 없이 일직선으로 눌리는 리니어 방식입니다. 힘이 덜 들어 장시간 타이핑과 빠른 연타에 유리하지만, 처음에는 '이게 눌린 건가?' 싶게 밋밋할 수 있습니다.

### 무접점 — 예산이 허락한다면
물리적 금속 접점 없이 정전용량 변화로 입력을 감지합니다. '도각도각'이라 표현되는 특유의 쫀득한 타건감 때문에 한 번 쓰면 못 돌아간다는 사람이 많습니다. 대신 가격대가 기계식보다 높습니다.

## 용도별 추천

- **집에서 타자 연습**: 갈축 또는 청축. 타건의 재미가 연습 지속률을 높여줍니다.
- **사무실**: 저소음 적축(일명 '저적') 또는 무접점. 일반 청축은 절대 금물입니다.
- **게임 위주**: 적축. 입력 반응이 빠르고 연타가 편합니다.
- **밤에 조용히**: 저소음 적축 또는 저소음 갈축.

## 키압도 확인하세요

같은 축이라도 키압(누르는 데 필요한 힘)이 다릅니다. 보통 45g 전후가 표준인데, 손힘이 약하거나 장시간 타이핑하면 35~45g의 가벼운 축이, 오타가 잦은 독수리 타법 교정 중이라면 오히려 50g 이상의 무거운 축이 실수를 줄여주기도 합니다.

## 장비보다 중요한 것

솔직히 말하면, 300타를 치는 사람이 30만 원짜리 키보드를 산다고 500타가 되지는 않습니다. 하지만 **좋은 키보드는 연습을 계속하게 만듭니다**. 치는 맛이 있으면 매일 키보드 앞에 앉는 게 즐거워지고, 결국 그 누적 시간이 실력을 만듭니다.

장비를 바꿨다면 [타자 속도 측정](/practice)으로 타건감 차이를 직접 느껴보세요.

> **[⌨️ 지금 타자 연습 시작하기](/practice)**
`
  },
  {
    id: "kids-typing-guide",
    title: "초등학생 타자 연습, 언제 어떻게 시작해야 할까? (학부모 가이드)",
    description: "아이 타자 교육의 적정 시기, 단계별 학습 순서, 게임을 활용한 동기부여 방법까지. 컴퓨터 수업을 앞둔 초등학생 학부모를 위한 가이드입니다.",
    date: "2026-06-10",
    category: "가이드",
    keyword: "초등학생 타자 연습, 아이 타자 배우기, 어린이 타자 게임, 초등 컴퓨터 수업, 타자 교육",
    content: `
# 초등학생 타자 연습, 언제 어떻게 시작해야 할까?

요즘 초등학교는 저학년부터 디지털 기기로 과제를 합니다. 3~4학년이 되면 실과 수업에서 문서 작성을 배우고, 발표 자료도 직접 만들죠. 이때 타자가 느린 아이는 내용을 몰라서가 아니라 **입력이 느려서** 뒤처지는 경험을 하게 됩니다. 타자는 어릴 때 잡아주면 평생 쓰는 기술입니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="200" viewBox="0 0 480 200" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="초등학생 타자 학습 4단계 로드맵">
    <rect width="480" height="200" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="42" font-family="sans-serif" font-weight="bold" font-size="17" fill="#1E293B" text-anchor="middle">우리 아이 타자 학습 로드맵</text>
    <circle cx="90" cy="105" r="30" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2.5"/>
    <text x="90" y="100" font-family="sans-serif" font-weight="bold" font-size="13" fill="#3B82F6" text-anchor="middle">1단계</text>
    <text x="90" y="117" font-family="sans-serif" font-size="12" fill="#1E293B" text-anchor="middle">자리</text>
    <path d="M126 105 L154 105" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M148 99 L156 105 L148 111" stroke="#CBD5E1" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="190" cy="105" r="30" fill="#ECFDF5" stroke="#10B981" stroke-width="2.5"/>
    <text x="190" y="100" font-family="sans-serif" font-weight="bold" font-size="13" fill="#059669" text-anchor="middle">2단계</text>
    <text x="190" y="117" font-family="sans-serif" font-size="12" fill="#1E293B" text-anchor="middle">낱말</text>
    <path d="M226 105 L254 105" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M248 99 L256 105 L248 111" stroke="#CBD5E1" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="290" cy="105" r="30" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2.5"/>
    <text x="290" y="100" font-family="sans-serif" font-weight="bold" font-size="13" fill="#D97706" text-anchor="middle">3단계</text>
    <text x="290" y="117" font-family="sans-serif" font-size="12" fill="#1E293B" text-anchor="middle">게임</text>
    <path d="M326 105 L354 105" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M348 99 L356 105 L348 111" stroke="#CBD5E1" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="390" cy="105" r="30" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="2.5"/>
    <text x="390" y="100" font-family="sans-serif" font-weight="bold" font-size="13" fill="#7C3AED" text-anchor="middle">4단계</text>
    <text x="390" y="117" font-family="sans-serif" font-size="12" fill="#1E293B" text-anchor="middle">문장</text>
    <text x="240" y="172" font-family="sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle">하루 15~20분 · 속도보다 '자판 안 보는 습관'이 먼저</text>
  </svg>
</div>

## 시작 시기: 한글을 뗀 후, 초등 1~3학년

타자 연습의 전제 조건은 두 가지입니다.

1. **한글 읽기가 자유로울 것** — 자모 결합 원리(ㄱ+ㅏ=가)를 이해해야 자판 연습이 의미가 있습니다.
2. **손이 키보드에 어느 정도 닿을 것** — 손이 너무 작으면 올바른 손가락 분담 자체가 물리적으로 어렵습니다.

이 두 조건이 갖춰지는 초등 1~3학년이 일반적인 적기입니다. 너무 이르게 시작하면 잘못된 습관(독수리 타법)만 굳어질 수 있으니 서두를 필요는 없습니다.

## 가장 중요한 것: 처음부터 '바른 손가락'으로

어른의 타자 교정이 어려운 이유는 이미 굳은 독수리 타법을 지우고 다시 배워야 하기 때문입니다. 아이는 백지상태라서 처음부터 올바르게 배우면 교정 과정 자체가 필요 없습니다.

핵심 규칙은 단 두 가지만 지키게 해주세요.

- **기준 자리(ㅁㄴㅇㄹ / ㅓㅏㅣ;)에 손가락을 올려놓고 시작한다**
- **키보드를 보지 않고 화면을 본다**

처음엔 답답해서 자꾸 키보드를 내려다볼 겁니다. 그래도 "빨리 쳐봐"라고 하지 말고 "손 안 보고 친 것"을 칭찬해주세요. 속도는 나중에 저절로 따라옵니다.

## 단계별 학습 순서

### 1단계: 자리 연습 (1~2주)
[자리 연습](/practice)으로 각 손가락이 담당하는 키를 익힙니다. 하루 10~15분이면 충분합니다. 아이 집중력은 짧기 때문에 길게 시키면 오히려 역효과입니다.

### 2단계: 낱말 연습 (2~4주)
[낱말 연습](/practice/word)으로 짧은 단어를 쳐봅니다. 플래시카드가 넘어가는 방식이라 아이들이 카드 넘기는 재미로 계속하게 됩니다.

### 3단계: 게임으로 동기부여
아이에게 "연습해라"는 말보다 강력한 것이 게임입니다. [산성비 게임](/game/acid-rain)은 원래 어른들도 어릴 때 이 게임 때문에 타자가 늘었을 정도로 검증된 방식입니다. 점수가 눈에 보이니 아이 스스로 어제의 기록을 깨려고 합니다.

### 4단계: 짧은 문장 연습
게임에 익숙해지면 [짧은 글 연습](/practice/short)으로 띄어쓰기와 문장 부호가 포함된 실전 타이핑을 시작합니다. 속담 카테고리를 고르면 타자 연습을 하면서 속담 공부도 됩니다.

## 학부모가 자주 묻는 질문

**Q. 하루에 얼마나 시켜야 하나요?**
15~20분이 적당합니다. 몰아서 1시간보다 매일 15분이 근육 기억 형성에 훨씬 효과적이고, 아이도 질리지 않습니다.

**Q. 목표 타수는 어느 정도로 잡아야 하나요?**
초등 저학년은 100~150타, 고학년은 200~300타면 또래 상위권입니다. 어른 기준(300~400타)을 들이대지 마세요.

**Q. 영타도 같이 시켜야 하나요?**
한글 타자가 어느 정도 자리 잡은 후에 시작하는 걸 추천합니다. 두 자판을 동시에 배우면 둘 다 어중간해지기 쉽습니다.

## 마치며

타자는 한 번 몸에 익으면 자전거처럼 평생 가는 기술입니다. 그리고 그 기술은 아이가 앞으로 하게 될 모든 디지털 활동의 기초 체력이 됩니다. 회원가입 없이 무료로 바로 시작할 수 있으니, 오늘 아이와 함께 산성비 게임 한 판으로 시작해보세요.

> **[🎮 아이와 함께 산성비 게임 해보기](/game/acid-rain)**
`
  },
  {
    id: "typing-posture-wrist",
    title: "타자 칠 때 손목이 아픈 이유: 손목 통증을 만드는 자세 3가지와 교정법",
    description: "장시간 타이핑 후 손목이 시큰거린다면 자세부터 점검해야 합니다. 손목 통증을 만드는 대표적인 자세 문제와 교정법, 예방 스트레칭을 정리했습니다.",
    date: "2026-06-25",
    category: "가이드",
    keyword: "타자 손목 통증, 키보드 손목 아픔, 올바른 타이핑 자세, 손목터널증후군 예방, 타이핑 자세 교정",
    content: `
# 타자 칠 때 손목이 아픈 이유: 통증을 만드는 자세 3가지와 교정법

타자 연습을 열심히 하다 보면 실력보다 먼저 찾아오는 불청객이 있습니다. 바로 손목 통증입니다. 하루 종일 키보드를 쓰는 직장인이라면 더더욱 남 일이 아니죠. 손목 통증의 대부분은 타이핑 '양'이 아니라 '자세'에서 옵니다.

*(참고: 이 글은 일반적인 자세 정보이며, 통증이 지속되거나 저림·감각 이상이 동반되면 반드시 병원 진료를 받으세요.)*

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="240" viewBox="0 0 480 240" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="잘못된 손목 자세와 올바른 손목 자세 비교">
    <rect width="480" height="240" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="40" font-family="sans-serif" font-weight="bold" font-size="17" fill="#1E293B" text-anchor="middle">손목, 꺾지 말고 일직선으로</text>
    <rect x="40" y="60" width="185" height="130" rx="12" fill="#FEF2F2" stroke="#FECACA" stroke-width="2"/>
    <text x="132" y="85" font-family="sans-serif" font-weight="bold" font-size="14" fill="#DC2626" text-anchor="middle">✗ 꺾인 손목</text>
    <path d="M60 150 L140 150 L175 118" stroke="#DC2626" stroke-width="6" stroke-linecap="round" fill="none"/>
    <rect x="130" y="148" width="60" height="14" rx="4" fill="#FCA5A5" opacity="0.6"/>
    <path d="M152 138 A 18 18 0 0 1 138 148" stroke="#DC2626" stroke-width="1.5" fill="none"/>
    <text x="132" y="180" font-family="sans-serif" font-size="11" fill="#B91C1C" text-anchor="middle">손목 통로가 눌립니다</text>
    <rect x="255" y="60" width="185" height="130" rx="12" fill="#F0FDF4" stroke="#BBF7D0" stroke-width="2"/>
    <text x="347" y="85" font-family="sans-serif" font-weight="bold" font-size="14" fill="#16A34A" text-anchor="middle">✓ 일직선 손목</text>
    <path d="M275 135 L420 135" stroke="#16A34A" stroke-width="6" stroke-linecap="round"/>
    <rect x="352" y="148" width="60" height="14" rx="4" fill="#86EFAC" opacity="0.6"/>
    <text x="347" y="180" font-family="sans-serif" font-size="11" fill="#15803D" text-anchor="middle">손등~팔뚝이 한 선 위에</text>
    <text x="240" y="218" font-family="sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle">팔꿈치 90~100도 · 손목은 공중에 · 받침대는 쉴 때만</text>
  </svg>
</div>

## 통증을 만드는 자세 1: 꺾인 손목

가장 흔한 원인입니다. 손바닥 뒤꿈치를 책상에 딱 붙인 채 손가락만 들어 올려 치면, 손목이 위로 꺾인 상태(신전)로 몇 시간을 보내게 됩니다. 이 자세는 손목 안쪽 통로(수근관)를 압박합니다.

**교정법**: 타이핑하는 동안 손목은 공중에 살짝 떠 있는 것이 이상적입니다. 피아니스트의 손을 떠올려 보세요. 손등부터 팔뚝까지가 일직선이 되어야 합니다. 계속 띄우기 힘들면 팜레스트(손목 받침대)를 쓰되, 타이핑 중이 아니라 **쉴 때 얹는 용도**로 쓰는 것이 원칙입니다.

## 통증을 만드는 자세 2: 너무 높은 키보드

책상이 높거나 의자가 낮으면 팔꿈치보다 키보드가 높아집니다. 그러면 어깨는 올라가고 손목은 꺾이고, 어깨·목·손목이 한 세트로 망가집니다.

**교정법**: 의자 높이를 조절해 **팔꿈치 각도가 90~100도**, 팔뚝이 바닥과 수평이 되게 만드세요. 키보드의 다리(틸트)를 세우는 것도 의외로 손목 꺾임을 심하게 만듭니다. 손목 건강만 보면 키보드는 평평하거나 오히려 앞쪽이 낮은 게 좋습니다.

## 통증을 만드는 자세 3: 손목만 움직이는 타이핑

멀리 있는 키(백스페이스, 엔터, 숫자열)를 칠 때 팔은 고정하고 손목만 휙휙 비틀어 치는 습관입니다. 작은 관절인 손목이 큰 이동을 전담하면서 피로가 누적됩니다.

**교정법**: 먼 키는 손목을 비틀지 말고 **팔 전체를 살짝 이동**해서 치세요. 그리고 근본적으로는 열 손가락 타법을 익혀 각 손가락이 담당 구역만 처리하게 만들면 손목의 이동량 자체가 줄어듭니다. 독수리 타법은 두 손가락이 자판 전체를 커버해야 해서 손목 이동이 몇 배로 많습니다. [자리 연습](/practice)으로 손가락 분담을 익히는 것이 최고의 손목 보호법입니다.

## 50분 타이핑, 10분 휴식

자세가 완벽해도 쉼 없는 연속 타이핑은 부담이 됩니다.

- 50분에 한 번은 키보드에서 손을 떼고 손목을 돌려주세요.
- **손목 스트레칭**: 팔을 앞으로 뻗고 손끝을 아래로 향한 뒤, 반대 손으로 손등을 몸 쪽으로 지그시 10초 당깁니다. 반대 방향(손끝 위로)도 10초. 좌우 각 3회.
- 주먹을 꽉 쥐었다 활짝 펴는 동작을 10회 반복하면 혈류가 돌아옵니다.

## 장비가 도움이 되는 경우

- **키압이 높은 키보드**를 오래 쓰면 손가락·손목 피로가 커집니다. 통증이 있다면 45g 이하의 가벼운 축이 유리합니다.
- 어깨 폭보다 좁은 일반 키보드는 손목을 안쪽으로 모으게 만듭니다. 증상이 있다면 인체공학 키보드도 고려해볼 만합니다.

## 마치며

타자 실력은 하루아침에 늘지 않지만, 손목은 하루아침에 망가질 수 있습니다. 오늘부터 '손목 일직선, 팔꿈치 90도, 50분마다 휴식' 세 가지만 기억하세요. 바른 자세는 통증만 막는 게 아니라 타자 속도도 함께 올려줍니다.

> **[🖐️ 바른 손가락 자세로 자리 연습 시작하기](/practice)**
`
  },
  {
    id: "best-poems-for-transcription",
    title: "필사하기 좋은 시 7선: 윤동주부터 이상까지, 타자로 새기는 한국 명시",
    description: "필사 입문자에게 추천하는 한국 현대시 7편을 골랐습니다. 각 시가 필사에 좋은 이유와 함께, 바로 원고지에서 타자 필사를 시작할 수 있는 링크를 담았습니다.",
    date: "2026-07-03",
    category: "필사",
    keyword: "필사하기 좋은 시, 필사 추천 글, 명시 필사, 윤동주 별 헤는 밤 필사, 시 필사 추천",
    content: `
# 필사하기 좋은 시 7선: 타자로 새기는 한국 명시

필사를 시작할 때 가장 어려운 건 '무엇을 필사할까'입니다. 너무 길면 지치고, 너무 어려우면 재미가 없습니다. 그래서 필사 입문에는 시가 가장 좋습니다. 짧고, 리듬이 있고, 한 글자 한 글자에 의미가 눌러 담겨 있으니까요. 저작권이 만료되어 마음껏 필사할 수 있는 한국 현대시 중에서 7편을 골랐습니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="230" viewBox="0 0 480 230" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="원고지 위에 쓴 별 헤는 밤">
    <rect width="480" height="230" rx="16" fill="#FFFDF7" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="42" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1E293B" text-anchor="middle">원고지 위에, 한 자 한 자</text>
    <g stroke="#FDA4AF" stroke-width="1.5" fill="none">
      <rect x="60" y="65" width="45" height="45"/><rect x="105" y="65" width="45" height="45"/><rect x="150" y="65" width="45" height="45"/><rect x="195" y="65" width="45" height="45"/><rect x="240" y="65" width="45" height="45"/><rect x="285" y="65" width="45" height="45"/><rect x="330" y="65" width="45" height="45"/><rect x="375" y="65" width="45" height="45"/>
      <rect x="60" y="120" width="45" height="45"/><rect x="105" y="120" width="45" height="45"/><rect x="150" y="120" width="45" height="45"/><rect x="195" y="120" width="45" height="45"/><rect x="240" y="120" width="45" height="45"/><rect x="285" y="120" width="45" height="45"/><rect x="330" y="120" width="45" height="45"/><rect x="375" y="120" width="45" height="45"/>
    </g>
    <g font-family="serif" font-weight="bold" font-size="24" fill="#334155" text-anchor="middle">
      <text x="82" y="97">별</text><text x="127" y="97">하</text><text x="172" y="97">나</text><text x="217" y="97">에</text><text x="307" y="97">추</text><text x="352" y="97">억</text><text x="397" y="97">과</text>
      <text x="82" y="152">별</text><text x="127" y="152">하</text><text x="172" y="152">나</text><text x="217" y="152">에</text><text x="307" y="152">사</text><text x="352" y="152">랑</text>
    </g>
    <rect x="376" y="126" width="3" height="33" fill="#3B82F6">
      <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite"/>
    </rect>
    <text x="240" y="205" font-family="sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle">윤동주, 「별 헤는 밤」 中 — 타자로 새기는 필사</text>
  </svg>
</div>

## 1. 윤동주, 「별 헤는 밤」

> 별 하나에 추억과 / 별 하나에 사랑과 / 별 하나에 쓸쓸함과…

필사 추천 1순위입니다. "별 하나에"로 시작하는 반복 구절은 타이핑에 리듬감을 만들어주고, 어머니를 부르는 후반부는 필사하다 손이 멈추는 경험을 하게 됩니다. 분량도 적당해서 10~15분이면 완주할 수 있습니다.

[→ 「별 헤는 밤」 타자 필사 시작하기](/transcription/poem_1)

## 2. 김소월, 「진달래꽃」

> 나 보기가 역겨워 가실 때에는 / 말없이 고이 보내 드리우리다

한국인이라면 누구나 아는 시지만, 눈으로 아는 것과 손으로 쳐보는 것은 완전히 다릅니다. 7·5조의 전통 율격이 손끝에서 그대로 재생되는, 운율 필사의 교과서 같은 작품입니다.

[→ 「진달래꽃」 타자 필사 시작하기](/transcription/poem_2)

## 3. 정지용, 「향수」

> 그곳이 차마 꿈엔들 잊힐 리야

"넓은 벌 동쪽 끝으로 옛이야기 지줄대는 실개천이 회돌아 나가고" — 첫 문장부터 우리말의 감각적인 아름다움이 폭발하는 시입니다. 흔히 쓰지 않는 순우리말 어휘가 많아 타자 실력, 특히 낯선 글자 조합 처리 능력을 키우는 데도 좋습니다.

[→ 「향수」 타자 필사 시작하기](/transcription/poem_4)

## 4. 이육사, 「광야」

> 다시 천고의 뒤에 / 백마 타고 오는 초인이 있어

짧지만 한 연 한 연의 무게가 다른 시입니다. 문장이 간결해서 필사 초보도 부담이 없고, 마지막 연을 칠 때의 묵직함은 긴 산문 필사에서는 얻기 힘든 경험입니다.

[→ 「광야」 타자 필사 시작하기](/transcription/poem_8)

## 5. 한용운, 「알 수 없어요」

> 타고 남은 재가 다시 기름이 됩니다

전체가 질문으로 이루어진 독특한 구조의 시입니다. "~은 누구의 ~입니까"라는 문형이 반복되어 리듬을 타기 좋고, 물음표가 있어 문장 부호 타이핑 연습도 자연스럽게 됩니다.

[→ 「알 수 없어요」 타자 필사 시작하기](/transcription/poem_6)

## 6. 이상, 「거울」

> 거울속에는소리가없소 / 저렇게까지조용한세상은참없을것이오

띄어쓰기를 의도적으로 붙여 쓴 실험적인 시입니다. 평소 습관대로 스페이스바를 누르려는 손가락과 싸우게 되는데, 이 낯선 경험 자체가 '내가 얼마나 무의식적으로 타이핑하는지'를 깨닫게 해줍니다. 필사에 익숙해진 분들에게 추천합니다.

[→ 「거울」 타자 필사 시작하기](/transcription/poem_7)

## 7. 윤동주, 「새로운 길」

> 내를 건너서 숲으로 / 고개를 넘어서 마을로

무언가 새로 시작하는 시기에 필사하기 가장 좋은 시입니다. 짧고 쉽고 맑아서 오늘 처음 필사를 시작하는 분의 첫 작품으로도 완벽합니다.

[→ 「새로운 길」 타자 필사 시작하기](/transcription/poem_5)

---

## 시 필사를 더 오래 즐기는 팁

1. **하루 한 편이면 충분합니다.** 여러 편을 몰아치기보다 한 편을 천천히, 가능하면 두 번 치세요. 두 번째 필사에서 처음엔 안 보이던 것들이 보입니다.
2. **마지막 행을 치고 나면 소리 내어 읽어보세요.** 타자로 새긴 시는 눈으로 읽은 시보다 오래 남습니다.
3. **기록을 남기세요.** 한글타자왕에서는 필사를 마치면 타수와 정확도가 기록됩니다. 같은 시를 한 달 뒤에 다시 쳐보면 실력 변화가 그대로 보입니다.

시가 익숙해지면 [필사 챌린지](/challenge)에서 다른 사용자들이 올린 글에 도전해보거나, 직접 좋아하는 글을 등록해보세요.

> **[📖 전체 필사 작품 목록 보러 가기](/transcription)**
`
  },
  {
    id: "dubeolsik-vs-sebeolsik",
    title: "두벌식 vs 세벌식: 한글 자판 전쟁의 역사와 지금 배운다면 무엇을 택해야 할까",
    description: "표준이 된 두벌식과 마니아들이 지키는 세벌식. 두 자판의 구조 차이, 도깨비불 현상, 그리고 2026년에 타자를 배우는 사람에게 현실적인 선택지를 정리했습니다.",
    date: "2026-07-04",
    category: "지식",
    keyword: "두벌식 세벌식 차이, 세벌식 자판, 한글 자판 종류, 공병우 세벌식, 두벌식 표준",
    content: `
# 두벌식 vs 세벌식: 한글 자판 전쟁의 역사와 현실적인 선택

지금 여러분이 쓰는 한글 자판은 '두벌식'입니다. 그런데 타자에 관심을 갖다 보면 어디선가 "세벌식이 더 우수하다"는 이야기를 듣게 됩니다. 실제로 타자 커뮤니티에는 세벌식으로 전향한 마니아들이 있고, 이들의 만족도는 상당히 높습니다. 도대체 무슨 차이가 있는 걸까요?

## '벌'이 뭘까?

한글 자판에서 '벌'은 글쇠 묶음의 수를 뜻합니다.

- **두벌식**: 자음 한 벌 + 모음 한 벌 = 2벌. 'ㄱ'은 초성이든 받침이든 같은 키를 씁니다.
- **세벌식**: 초성 한 벌 + 중성 한 벌 + 종성(받침) 한 벌 = 3벌. 초성 'ㄱ'과 받침 'ㄱ'이 서로 다른 키에 있습니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="250" viewBox="0 0 480 250" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="두벌식과 세벌식의 글쇠 구성 비교">
    <rect width="480" height="250" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="40" font-family="sans-serif" font-weight="bold" font-size="17" fill="#1E293B" text-anchor="middle">'벌'의 개수가 다릅니다</text>
    <text x="132" y="75" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3B82F6" text-anchor="middle">두벌식 (표준)</text>
    <rect x="55" y="90" width="72" height="55" rx="10" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
    <text x="91" y="115" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1E293B" text-anchor="middle">자음</text>
    <text x="91" y="133" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">ㄱㄴㄷ…</text>
    <rect x="137" y="90" width="72" height="55" rx="10" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
    <text x="173" y="115" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1E293B" text-anchor="middle">모음</text>
    <text x="173" y="133" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">ㅏㅑㅓ…</text>
    <text x="132" y="172" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">초성·받침이 같은 키</text>
    <text x="132" y="188" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">→ 도깨비불 현상 있음</text>
    <line x1="240" y1="70" x2="240" y2="195" stroke="#E2E8F0" stroke-width="2"/>
    <text x="352" y="75" font-family="sans-serif" font-weight="bold" font-size="14" fill="#059669" text-anchor="middle">세벌식 (공병우)</text>
    <rect x="270" y="90" width="50" height="55" rx="10" fill="#ECFDF5" stroke="#10B981" stroke-width="2"/>
    <text x="295" y="115" font-family="sans-serif" font-weight="bold" font-size="13" fill="#1E293B" text-anchor="middle">초성</text>
    <text x="295" y="133" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">ㄱ</text>
    <rect x="328" y="90" width="50" height="55" rx="10" fill="#ECFDF5" stroke="#10B981" stroke-width="2"/>
    <text x="353" y="115" font-family="sans-serif" font-weight="bold" font-size="13" fill="#1E293B" text-anchor="middle">중성</text>
    <text x="353" y="133" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">ㅏ</text>
    <rect x="386" y="90" width="50" height="55" rx="10" fill="#ECFDF5" stroke="#10B981" stroke-width="2"/>
    <text x="411" y="115" font-family="sans-serif" font-weight="bold" font-size="13" fill="#1E293B" text-anchor="middle">종성</text>
    <text x="411" y="133" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">ㄱ</text>
    <text x="352" y="172" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">초성·받침이 다른 키</text>
    <text x="352" y="188" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">→ 도깨비불 현상 없음</text>
    <text x="240" y="225" font-family="sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle">한글의 구조(초성+중성+종성)에 더 가까운 쪽은 세벌식</text>
  </svg>
</div>

한글의 구조 자체가 초성+중성+종성이니, 세벌식이 한글의 원리를 더 충실히 반영한 설계인 셈입니다. 세벌식은 한글 타자기의 아버지라 불리는 안과의사 공병우 박사가 1949년 개발했고, 두벌식은 1982년 정부 표준으로 채택되며 대세가 됐습니다.

## 두벌식의 약점: 도깨비불 현상

두벌식으로 "국이"를 쳐보세요. 'ㄱ+ㅜ+ㄱ'까지 치면 화면에 '국'이 있다가, 'ㅣ'를 치는 순간 받침 ㄱ이 떨어져 나가 '구기'가 됩니다. 글자가 도깨비불처럼 넘나든다고 해서 **도깨비불 현상**이라고 부릅니다.

두벌식은 이 때문에 컴퓨터가 '이 ㄱ이 받침인지 다음 글자의 초성인지'를 계속 추측해야 하고, 타자수 입장에서도 시각적 출렁임이 생깁니다. 세벌식은 초성과 종성 키가 아예 다르므로 이 현상이 원천적으로 없습니다.

## 세벌식의 장점과 단점

**장점**
- 도깨비불 현상이 없어 입력이 안정적입니다.
- 왼손(종성·중성)과 오른손(초성)의 리듬이 번갈아 살아나 장시간 타이핑 피로가 적다는 평가가 많습니다.
- 모아치기(여러 키 동시 입력)가 가능해 이론상 최고 속도가 높습니다.

**단점**
- 배워야 할 키가 많습니다. 받침이 숫자열까지 올라가 있어 초기 학습 장벽이 확실히 높습니다.
- 표준이 아닙니다. 내 컴퓨터가 아닌 곳(회사 공용 PC, PC방, 시험장)에서는 설정을 바꿔야 하고, 그마저 불가능한 환경도 있습니다.
- 두벌식이 이미 몸에 익은 사람은 수개월의 재학습 비용을 치러야 합니다.

## 그래서, 지금 배운다면?

현실적인 답을 드리면 **대부분의 사람에게는 두벌식**입니다.

1. 세상의 모든 키보드와 시험 환경이 두벌식 기준으로 돌아갑니다.
2. 두벌식으로도 충분히 빠릅니다. 두벌식 600~800타 타이피스트는 흔하고, 그 속도면 생각의 속도를 이미 따라잡습니다.
3. 속도의 병목은 대부분 자판 방식이 아니라 **연습량과 정확도**입니다. 300타인 사람이 세벌식으로 바꾼다고 빨라지지 않습니다. 같은 시간을 두벌식 연습에 쓰는 게 낫습니다.

다만 이런 분들에게는 세벌식 도전이 의미가 있습니다. 하루 종일 글을 쓰는 직업이라 손목 피로 분산이 절실한 분, 이미 두벌식 500타 이상인데 타자 자체가 취미가 된 분, 한글 입력 방식의 역사에 매력을 느끼는 분.

## 어느 자판이든, 결국은 연습

두벌식이든 세벌식이든 실력을 만드는 건 결국 꾸준한 연습입니다. 한글타자왕의 [자리 연습](/practice)으로 기본기를 다지고, [낱말 연습](/practice/word)과 [긴 글 필사](/transcription)로 속도를 올려보세요. 내 타수가 어느 정도인지 궁금하다면 [평균 타자 속도 가이드](/blog/average-typing-speed)도 함께 읽어보시길 권합니다.

> **[⌨️ 지금 쓰는 자판으로 타자 속도 측정하기](/practice)**
`
  },
  {
    id: "hangul-typewriter-history",
    title: "한글 타자기의 역사: 안과의사 공병우는 왜 타자기를 만들었나",
    description: "세벌식 타자기를 만든 공병우 박사부터 1982년 두벌식 표준화, 컴퓨터 시대의 타자 프로그램까지. 우리가 매일 쓰는 한글 자판에 담긴 역사를 정리했습니다.",
    date: "2026-06-14",
    category: "지식",
    keyword: "한글 타자기 역사, 공병우 타자기, 세벌식 타자기, 한글 기계화, 두벌식 표준",
    content: `
# 한글 타자기의 역사: 안과의사 공병우는 왜 타자기를 만들었나

우리는 매일 아무 생각 없이 한글을 타이핑하지만, '기계로 한글을 찍는다'는 것은 한때 국가적 난제였습니다. 알파벳 26자를 일렬로 찍으면 되는 영문과 달리, 한글은 자음과 모음이 네모 칸 안에서 조합되는 문자이기 때문입니다. 이 문제를 풀어낸 사람들의 이야기를 하려고 합니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="210" viewBox="0 0 480 210" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="한글 타자기 역사 연표">
    <rect width="480" height="210" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="42" font-family="sans-serif" font-weight="bold" font-size="17" fill="#1E293B" text-anchor="middle">한글 입력의 결정적 장면들</text>
    <line x1="55" y1="110" x2="425" y2="110" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
    <circle cx="80" cy="110" r="9" fill="#3B82F6"/>
    <text x="80" y="88" font-family="sans-serif" font-weight="bold" font-size="13" fill="#3B82F6" text-anchor="middle">1949</text>
    <text x="80" y="136" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">공병우</text>
    <text x="80" y="151" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">세벌식 타자기</text>
    <circle cx="193" cy="110" r="9" fill="#10B981"/>
    <text x="193" y="88" font-family="sans-serif" font-weight="bold" font-size="13" fill="#10B981" text-anchor="middle">1982</text>
    <text x="193" y="136" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">두벌식</text>
    <text x="193" y="151" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">표준 자판 확정</text>
    <circle cx="307" cy="110" r="9" fill="#F59E0B"/>
    <text x="307" y="88" font-family="sans-serif" font-weight="bold" font-size="13" fill="#F59E0B" text-anchor="middle">1990년대</text>
    <text x="307" y="136" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">PC 보급과</text>
    <text x="307" y="151" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">타자 프로그램 전성기</text>
    <circle cx="420" cy="110" r="9" fill="#8B5CF6"/>
    <text x="420" y="88" font-family="sans-serif" font-weight="bold" font-size="13" fill="#8B5CF6" text-anchor="middle">현재</text>
    <text x="420" y="136" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">웹에서 바로</text>
    <text x="420" y="151" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">타자 연습</text>
    <text x="240" y="188" font-family="sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle">타자기 → 표준 자판 → 타자 게임 → 웹 브라우저</text>
  </svg>
</div>

## 네모 글자를 기계에 넣는다는 것

영문 타자기는 글쇠 하나가 글자 하나입니다. 하지만 한글 '값'을 찍으려면 ㄱ, ㅏ, ㅂ, ㅅ 네 요소를 **같은 자리에 겹쳐** 찍어야 합니다. 게다가 '가'의 ㄱ과 '고'의 ㄱ은 모양과 위치가 다르죠. 이 조합 문제 때문에 한글 기계화는 오랫동안 "불가능하다", "차라리 한글을 풀어쓰자"는 말까지 나왔던 난제였습니다.

## 안과의사, 타자기에 인생을 걸다

이 문제에 뛰어든 대표적인 인물이 안과의사 **공병우**입니다. 병원을 운영하던 그는 한글학자 이극로를 만나 한글 기계화의 필요성에 눈을 뜬 뒤, 진료실 한켠에서 타자기 개발에 매달렸습니다. 그리고 1949년, 초성·중성·종성을 세 벌로 나눈 **세벌식 속도 타자기**를 내놓습니다.

공병우 타자기는 빨랐습니다. 글자 모양은 다소 삐뚤빼뚤했지만(이른바 '빨랫줄 글꼴') 실용적인 속도를 냈고, 한국전쟁기와 그 이후 군과 관공서의 문서 행정에서 실제로 활약했습니다. "기계에 한글을 맞추지 말고, 한글의 구조대로 기계를 만든다"는 그의 철학은 지금의 [세벌식 자판](/blog/dubeolsik-vs-sebeolsik)으로 이어져 여전히 마니아들이 쓰고 있습니다.

## 1982년, 두벌식이 표준이 되다

타자기 시대에는 회사마다 다른 자판을 썼습니다. 네벌식, 다섯벌식까지 난립하던 자판은 컴퓨터 시대가 열리며 정리가 불가피해졌고, 1982년 정부는 **자음 한 벌 + 모음 한 벌의 두벌식**을 표준으로 확정합니다.

두벌식이 채택된 논리는 명확했습니다. 배울 게 적다는 것. 자판 배열이 단순해 교육 비용이 낮고, 기계식 타자기와 달리 컴퓨터는 초성·종성 구분을 소프트웨어가 대신 처리해줄 수 있었습니다. 세벌식 진영은 강하게 반발했지만 표준의 힘은 컸고, 이후 모든 학교와 관공서, PC가 두벌식으로 통일됩니다.

## 1990년대: 타자 연습이 국민 오락이 되다

PC가 가정과 학교에 보급되면서 흥미로운 일이 벌어집니다. 타자 연습이 '교육'을 넘어 '오락'이 된 겁니다. 컴퓨터 학원과 학교 컴퓨터실에서는 타자 연습 프로그램이 필수 코스였고, 그 안에 들어 있던 [산성비 게임](/blog/acid-rain-typing-game)은 수업 시간에 몰래 하는 국민 게임이 됐습니다. 지금 30~40대의 상당수는 이 시절 게임으로 타자를 뗐습니다.

## 그리고 현재: 설치 없이, 브라우저에서

이제 타자 연습은 설치형 프로그램에서 웹으로 넘어왔습니다. 한글타자왕도 그 연장선에 있습니다. 70여 년 전 진료실에서 타자기를 두드리던 안과의사의 문제의식 — '한글을 얼마나 빠르고 편하게 입력할 것인가' — 은 여전히 유효하고, 우리는 그 역사의 수혜자로서 매일 키보드를 두드리고 있는 셈입니다.

오늘 이 글을 읽었다면, 당신의 타자 속도로 그 역사에 답해보는 건 어떨까요.

> **[⌨️ 한글 타자 속도 측정하러 가기](/practice)**
`
  },
  {
    id: "work-typing-productivity",
    title: "직장인의 시간을 버는 타이핑: 타자 속도가 만드는 연간 80시간의 차이",
    description: "메일, 메신저, 보고서까지 직장인은 하루 종일 타이핑합니다. 타자 속도가 업무 시간에 미치는 실제 영향과, 당장 쓸 수 있는 필수 단축키·입력 습관을 정리했습니다.",
    date: "2026-06-21",
    category: "생산성",
    keyword: "직장인 타자 속도, 업무 단축키, 타이핑 생산성, 문서 작성 속도, 일 잘하는 법",
    content: `
# 직장인의 시간을 버는 타이핑: 타자 속도가 만드는 연간 80시간의 차이

"타자야 뭐, 대충 치면 되지." 맞는 말이었습니다. 하루에 몇 문장만 치던 시절에는요. 하지만 지금 직장인의 하루를 보세요. 아침 메일 답장, 하루 종일 이어지는 메신저, 회의록, 보고서, 그리고 AI에게 보내는 프롬프트까지. 사무직의 업무는 사실상 **타이핑으로 이루어져 있습니다**.

## 계산해 봅시다: 타자 속도와 업무 시간

메일과 메신저, 문서를 합쳐 하루 15,000타 정도를 입력하는 평범한 사무직을 가정해 보죠. (A4 보고서 한 장이 대략 5,000~6,000타입니다.)

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="250" viewBox="0 0 480 250" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="타자 속도별 하루 타이핑 소요 시간 비교">
    <rect width="480" height="250" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="42" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1E293B" text-anchor="middle">하루 15,000타 입력에 걸리는 시간</text>
    <text x="130" y="83" font-family="sans-serif" font-weight="bold" font-size="13" fill="#64748B" text-anchor="end">분당 300타</text>
    <rect x="140" y="68" width="250" height="22" rx="11" fill="#F87171"/>
    <text x="265" y="83" font-family="sans-serif" font-weight="bold" font-size="12" fill="white" text-anchor="middle">50분</text>
    <text x="130" y="128" font-family="sans-serif" font-weight="bold" font-size="13" fill="#64748B" text-anchor="end">분당 500타</text>
    <rect x="140" y="113" width="150" height="22" rx="11" fill="#34D399"/>
    <text x="215" y="128" font-family="sans-serif" font-weight="bold" font-size="12" fill="white" text-anchor="middle">30분</text>
    <line x1="290" y1="108" x2="290" y2="140" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3 3"/>
    <text x="240" y="175" font-family="sans-serif" font-weight="bold" font-size="14" fill="#059669" text-anchor="middle">차이: 매일 20분 = 연간 약 80시간</text>
    <text x="240" y="200" font-family="sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle">근무일 240일 기준, 열흘치 근무 시간에 해당</text>
  </svg>
</div>

분당 300타와 500타의 차이는 하루 20분입니다. 연간 근무일로 환산하면 **약 80시간, 꼬박 열흘치 근무 시간**이죠. 그리고 이 계산에는 더 중요한 게 빠져 있습니다. 타자가 느리면 문장을 치는 동안 생각이 끊기고, 끊긴 생각을 다시 잇는 데 드는 '전환 비용'은 시간으로 환산조차 어렵습니다.

## 속도만큼 중요한 것: 입력 습관

### 1. 백스페이스 습관부터 고치세요
느린 타자보다 나쁜 게 '오타 → 지우기 → 다시 치기' 루프입니다. 실측하면 오타 정정에 쓰는 시간이 전체 입력 시간의 20~30%를 차지하는 경우도 흔합니다. 속도를 올리기 전에 [정확도부터 끌어올리는 것](/blog/ultimate-typing-guide)이 순서입니다.

### 2. 문장 단위로 생각하고, 문장 단위로 치세요
단어 하나 치고 멈춰서 생각하고, 또 한 단어 치는 방식은 손과 머리가 서로를 기다리는 구조입니다. 문장을 머릿속에서 완성한 뒤 한 번에 쏟아내는 습관을 들이면 같은 타수로도 체감 속도가 크게 오릅니다. [짧은 글 연습](/practice)이 정확히 이 훈련입니다.

### 3. 자주 쓰는 문구는 시스템에 맡기세요
"안녕하세요, ○○팀 △△입니다" 같은 인사말을 하루에 열 번씩 손으로 치고 있다면, 이메일 서명이나 상용구(텍스트 대치) 기능에 등록해두세요. 잘 치는 것만큼 '안 치는 것'도 생산성입니다.

## 오늘부터 쓰는 필수 단축키

손이 키보드와 마우스를 오가는 순간마다 흐름이 끊깁니다. 최소한 이것만은 손에 붙여두세요.

- **Ctrl + C / X / V** — 복사 / 잘라내기 / 붙여넣기. 기본 중의 기본.
- **Ctrl + Shift + V** — 서식 없이 붙여넣기. 다른 문서에서 가져온 글자의 서식이 깨질 때 쓰는 그 기능입니다.
- **Win + V** — 클립보드 히스토리. 복사한 항목 여러 개를 거슬러 올라가 붙여넣을 수 있습니다. 모르는 사람이 의외로 많은 최고의 기능.
- **Ctrl + 방향키 / Ctrl + Backspace** — 단어 단위 이동/삭제. 글자 하나씩 지우는 습관과 이별하세요.
- **Alt + Tab** — 창 전환. 마우스로 작업 표시줄을 클릭하고 있다면 지금 바꾸세요.
- **F2** — 파일명 바꾸기, 엑셀 셀 편집. 사무직의 숨은 효자 키입니다.

## 타자 속도는 '측정'에서 시작합니다

내 타수가 몇인지 모르면 개선도 없습니다. 지금 [타자 속도 측정](/practice)으로 현재 타수를 확인하고, [평균 타수 기준](/blog/average-typing-speed)과 비교해 보세요. 300타 이하라면, 하루 15분씩 한 달의 연습이 앞으로 수십 년의 업무 시간을 벌어주는 가장 수익률 높은 투자가 될 겁니다.

> **[⏱️ 내 타자 속도 측정하고 시작하기](/practice)**
`
  },
  {
    id: "four-week-typing-plan",
    title: "4주 완성 타자 연습 플랜: 하루 20분으로 100타 올리는 커리큘럼",
    description: "무작정 치는 연습은 늘지 않습니다. 자리 익히기부터 실전 문장까지, 주차별 목표와 연습 메뉴를 정해둔 4주짜리 타자 연습 커리큘럼을 제안합니다.",
    date: "2026-06-29",
    category: "가이드",
    keyword: "타자 연습 방법, 타자 속도 올리기, 타자 연습 계획, 타수 올리는 법, 4주 타자 연습",
    content: `
# 4주 완성 타자 연습 플랜: 하루 20분으로 100타 올리기

"타자 연습 해야지"라고 마음먹고 아무 문장이나 치다가 사흘 만에 그만둔 경험, 있으실 겁니다. 문제는 의지가 아니라 **계획의 부재**입니다. 운동에 루틴이 있듯 타자에도 커리큘럼이 필요합니다. 하루 20분, 4주짜리 플랜을 제안합니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="240" viewBox="0 0 480 240" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="4주 타자 연습 로드맵">
    <rect width="480" height="240" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="40" font-family="sans-serif" font-weight="bold" font-size="17" fill="#1E293B" text-anchor="middle">4주 로드맵: 정확도에서 속도로</text>
    <rect x="30" y="65" width="98" height="105" rx="12" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="2"/>
    <text x="79" y="92" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3B82F6" text-anchor="middle">1주차</text>
    <text x="79" y="117" font-family="sans-serif" font-size="12" fill="#475569" text-anchor="middle">자리 연습</text>
    <text x="79" y="135" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">자판 안 보기</text>
    <text x="79" y="155" font-family="sans-serif" font-weight="bold" font-size="11" fill="#3B82F6" text-anchor="middle">정확도 95%</text>
    <rect x="138" y="65" width="98" height="105" rx="12" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="2"/>
    <text x="187" y="92" font-family="sans-serif" font-weight="bold" font-size="14" fill="#059669" text-anchor="middle">2주차</text>
    <text x="187" y="117" font-family="sans-serif" font-size="12" fill="#475569" text-anchor="middle">낱말 연습</text>
    <text x="187" y="135" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">글자 조합 훈련</text>
    <text x="187" y="155" font-family="sans-serif" font-weight="bold" font-size="11" fill="#059669" text-anchor="middle">+30타</text>
    <rect x="246" y="65" width="98" height="105" rx="12" fill="#FFFBEB" stroke="#FDE68A" stroke-width="2"/>
    <text x="295" y="92" font-family="sans-serif" font-weight="bold" font-size="14" fill="#D97706" text-anchor="middle">3주차</text>
    <text x="295" y="117" font-family="sans-serif" font-size="12" fill="#475569" text-anchor="middle">짧은 글+게임</text>
    <text x="295" y="135" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">속도 압박 훈련</text>
    <text x="295" y="155" font-family="sans-serif" font-weight="bold" font-size="11" fill="#D97706" text-anchor="middle">+30타</text>
    <rect x="354" y="65" width="98" height="105" rx="12" fill="#F5F3FF" stroke="#DDD6FE" stroke-width="2"/>
    <text x="403" y="92" font-family="sans-serif" font-weight="bold" font-size="14" fill="#7C3AED" text-anchor="middle">4주차</text>
    <text x="403" y="117" font-family="sans-serif" font-size="12" fill="#475569" text-anchor="middle">긴 글 필사</text>
    <text x="403" y="135" font-family="sans-serif" font-size="11" fill="#94A3B8" text-anchor="middle">실전 지구력</text>
    <text x="403" y="155" font-family="sans-serif" font-weight="bold" font-size="11" fill="#7C3AED" text-anchor="middle">+40타</text>
    <text x="240" y="205" font-family="sans-serif" font-weight="bold" font-size="13" fill="#1E293B" text-anchor="middle">하루 20분 × 4주 = 평균 +100타</text>
  </svg>
</div>

## 시작 전: 현재 타수를 기록하세요

플랜의 효과를 확인하려면 출발점이 필요합니다. [긴 글 필사](/transcription)에서 아무 작품이나 골라 3분 이상 쳐보고, 평균 타수와 정확도를 메모해 두세요. 이게 4주 뒤 비교할 기준 기록입니다.

## 1주차: 자리 — 키보드와 눈을 끊는 주

**메뉴: [자리 연습](/practice) 15분 + 낱말 연습 5분**

이번 주의 유일한 목표는 속도가 아니라 '키보드를 보지 않는 습관'입니다. 기준 자리(왼손 ㅁㄴㅇㄹ, 오른손 ㅓㅏㅣ;)에 손을 올리고, 답답해도 시선은 화면에 고정하세요. 이번 주에 타수가 오히려 떨어져도 정상입니다. 정확도 95%를 넘기는 것만 신경 쓰세요.

- 요령: 오타가 나도 백스페이스를 누르지 말고 그냥 진행해 보세요. 지우는 습관보다 '틀리지 않으려는 집중'이 먼저 생겨야 합니다.

## 2주차: 낱말 — 글자 조합을 손에 새기는 주

**메뉴: [낱말 연습](/practice/word) 15분 + 자리 복습 5분**

한글 타자의 속도는 '자주 나오는 글자 조합'을 얼마나 반사적으로 치느냐에서 나옵니다. 낱말 연습은 받침, 이중모음 같은 조합을 압축적으로 훈련시켜 줍니다. 이번 주부터 타수가 눈에 띄게 오르기 시작합니다.

- 요령: 유난히 자주 틀리는 글쇠(보통 ㅋ, ㅌ, ㅊ, ㅍ 같은 바깥쪽 키)를 발견하면 메모해 두고, 다음 날 자리 연습 5분을 그 키에 쓰세요.

## 3주차: 게임 — 한계 속도를 건드리는 주

**메뉴: [짧은 글 연습](/practice/short) 10분 + [산성비 게임](/game/acid-rain) 10분**

편한 속도로만 치면 실력은 그 속도에 머뭅니다. 산성비처럼 시간 압박이 있는 게임은 평소보다 빠른 손놀림을 강제로 끌어내고, 이 '한계 경험'이 반복되면 평균 속도가 따라 올라옵니다. 근력 운동의 점진적 과부하와 같은 원리입니다.

- 요령: 게임은 재미있어서 과몰입하기 쉽습니다. 10분 타이머를 걸어두세요. 이 플랜의 핵심은 강도가 아니라 '매일'입니다.

## 4주차: 필사 — 실전 문장으로 완성하는 주

**메뉴: [긴 글 필사](/transcription) 20분**

실제 타이핑에는 띄어쓰기, 쉼표, 물음표가 섞여 있습니다. 낱말과 게임으로 올린 속도를 실전 문장에서 유지하는 훈련이 마지막 단계입니다. 시 한 편, 짧은 산문 하나를 처음부터 끝까지 완주하는 것을 목표로 하세요. [필사하기 좋은 시 7선](/blog/best-poems-for-transcription)에서 작품을 골라도 좋습니다.

**4주차 마지막 날**, 첫날과 같은 작품으로 기록을 측정해 보세요. 하루 20분을 지켰다면 대부분 60~120타가 올라 있을 겁니다.

## 4주가 끝난 뒤에는

- 300타를 넘겼다면: [짧은 글 연습](/practice/short)을 매일 10분씩 유지하면서 [맞춤법 퀴즈](/quiz)로 정확한 표기까지 챙기세요.
- 정체기가 왔다면: [평균 타수 가이드](/blog/average-typing-speed)의 정체기 돌파법을 참고하세요. 대부분 300~400타 구간에서 한 번 멈춥니다.

계획은 여기까지 준비해 드렸습니다. 남은 건 오늘의 20분뿐입니다.

> **[🗓️ 1주차 자리 연습부터 시작하기](/practice)**
`
  },
  {
    id: "how-to-choose-transcription-site",
    title: "필사 사이트 고르는 법: 온라인 필사, 어디서 어떻게 시작할까?",
    description: "메모장, 블로그, 전용 필사 사이트까지 — 온라인 필사를 시작하는 방법을 비교하고, 필사 사이트를 고를 때 꼭 확인해야 할 4가지 기준을 정리했습니다.",
    date: "2026-07-07",
    category: "필사",
    keyword: "필사 사이트, 온라인 필사, 필사 타자연습, 필사 하는 법, 타자 필사 사이트",
    content: `
# 필사 사이트 고르는 법: 온라인 필사, 어디서 어떻게 시작할까?

필사를 시작하기로 마음먹고 검색창에 '필사 사이트'를 쳐본 분이라면 알 겁니다. 생각보다 선택지가 애매하다는 걸요. 손글씨 필사 커뮤니티는 많은데, 정작 키보드로 필사할 곳은 마땅치 않습니다. 메모장을 열자니 허전하고, 블로그에 쓰자니 공개가 부담스럽고요.

키보드 필사를 어디서 하면 좋을지, 방법별 장단점과 사이트를 고르는 기준을 정리했습니다. (키보드 필사가 손글씨 필사만큼 효과가 있는지 궁금하다면 [키보드 필사의 효과](/blog/transcription-benefits) 글을 먼저 읽어보세요.)

## 온라인 필사, 세 가지 방법 비교

### 1. 메모장·워드에 직접 치기
가장 간단한 방법입니다. 준비물이 없다는 게 장점이지만, 치명적인 단점이 있습니다. **원문과 대조가 안 됩니다.** 책을 옆에 펴두고 화면과 번갈아 봐야 하니 시선이 계속 끊기고, 오타가 나도 모르고 지나갑니다. 필사의 핵심인 '문장을 빠짐없이 읽기'가 무너지기 쉽습니다.

### 2. 블로그·SNS에 필사 기록 올리기
'필사 챌린지' 형태로 블로그에 올리는 분들이 많습니다. 기록이 쌓이고 다른 사람의 반응이 동기부여가 되는 건 장점입니다. 다만 이것도 결국 빈 화면에 치는 방식이라 대조 문제는 그대로고, '올리기 위한 필사'가 되면 문장보다 인증에 마음이 가기 쉽습니다.

### 3. 전용 필사 사이트에서 치기
원문이 화면에 떠 있고, 그 위에 겹쳐 쓰듯 따라 치는 방식입니다. 눈이 원문에서 떨어질 일이 없고, 틀린 글자는 실시간으로 표시됩니다. 필사의 몰입감은 유지하면서 타자 연습 효과까지 함께 얻을 수 있어서, 키보드 필사가 목적이라면 가장 합리적인 선택입니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="230" viewBox="0 0 480 230" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="필사 방법 세 가지 비교표">
    <rect width="480" height="230" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="38" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1E293B" text-anchor="middle">온라인 필사 방법 비교</text>
    <text x="150" y="72" font-family="sans-serif" font-weight="bold" font-size="12" fill="#64748B" text-anchor="middle">원문 대조</text>
    <text x="260" y="72" font-family="sans-serif" font-weight="bold" font-size="12" fill="#64748B" text-anchor="middle">오타 확인</text>
    <text x="370" y="72" font-family="sans-serif" font-weight="bold" font-size="12" fill="#64748B" text-anchor="middle">기록 측정</text>
    <text x="30" y="105" font-family="sans-serif" font-size="13" fill="#334155">메모장</text>
    <text x="150" y="105" font-family="sans-serif" font-size="14" fill="#EF4444" text-anchor="middle">✕</text>
    <text x="260" y="105" font-family="sans-serif" font-size="14" fill="#EF4444" text-anchor="middle">✕</text>
    <text x="370" y="105" font-family="sans-serif" font-size="14" fill="#EF4444" text-anchor="middle">✕</text>
    <text x="30" y="145" font-family="sans-serif" font-size="13" fill="#334155">블로그</text>
    <text x="150" y="145" font-family="sans-serif" font-size="14" fill="#EF4444" text-anchor="middle">✕</text>
    <text x="260" y="145" font-family="sans-serif" font-size="14" fill="#EF4444" text-anchor="middle">✕</text>
    <text x="370" y="145" font-family="sans-serif" font-size="14" fill="#F59E0B" text-anchor="middle">△</text>
    <text x="30" y="185" font-family="sans-serif" font-weight="bold" font-size="13" fill="#059669">필사 사이트</text>
    <text x="150" y="185" font-family="sans-serif" font-size="14" fill="#10B981" text-anchor="middle">◯</text>
    <text x="260" y="185" font-family="sans-serif" font-size="14" fill="#10B981" text-anchor="middle">◯</text>
    <text x="370" y="185" font-family="sans-serif" font-size="14" fill="#10B981" text-anchor="middle">◯</text>
    <line x1="30" y1="120" x2="450" y2="120" stroke="#E2E8F0" stroke-width="1"/>
    <line x1="30" y1="160" x2="450" y2="160" stroke="#E2E8F0" stroke-width="1"/>
  </svg>
</div>

## 필사 사이트를 고르는 4가지 기준

### 1. 필사할 글이 큐레이션되어 있는가
직접 텍스트를 구해서 붙여 넣어야 한다면 시작 전에 지칩니다. 윤동주, 김소월 같은 검증된 작품이 골라져 있고, 짧은 시부터 긴 산문까지 난이도 선택이 되는 곳이 오래갑니다. 어떤 작품부터 시작할지 막막하다면 [필사하기 좋은 시 7선](/blog/best-poems-for-transcription)을 참고하세요.

### 2. 무료로, 로그인 없이 시작할 수 있는가
필사는 습관이 되기 전까지가 고비입니다. 결제나 회원가입이 첫 화면을 막고 있으면 '내일 하자'가 되기 쉽습니다. 일단 오늘 밤 한 편을 쳐볼 수 있어야 합니다.

### 3. 타수와 정확도가 기록되는가
필사의 부수 효과는 타자 실력입니다. 오늘 몇 타로 쳤는지, 정확도가 얼마였는지 수치로 남으면 필사가 '기록 갱신'이라는 또 하나의 재미를 갖게 됩니다. 습관을 만드는 데 이만한 장치가 없습니다.

### 4. 분위기 — 의외로 가장 중요한 것
필사는 결국 감성의 영역입니다. 삭막한 입력창이 아니라 원고지처럼 글 쓰는 맛이 나는 화면인지, 광고가 몰입을 깨지 않는지. 매일 10분씩 머무를 공간이니 분위기가 마음에 들어야 합니다.

## 한글타자왕에서 필사하기

사실 이 기준 네 가지는 제가 한글타자왕의 [필사 연습](/transcription)을 만들 때 세웠던 원칙이기도 합니다. 디지털 원고지 위에서 윤동주, 김소월, 정지용, 이육사, 한용운의 작품을 무료로, 로그인 없이 바로 필사할 수 있고, 타수와 정확도가 실시간으로 측정됩니다.

다른 사용자가 올린 글로 함께 연습하는 [필사 챌린지](/challenge)도 있으니, 명시가 익숙해지면 도전해 보세요.

> **[📖 원고지 필사 바로 시작하기](/transcription)**
`
  },
  {
    id: "free-online-typing-practice",
    title: "무료 타자연습 사이트 고르는 법: 설치 없이 웹에서 바로 시작하기",
    description: "한컴타자연습 없이도 타자연습 할 수 있을까? 맥·크롬북·회사 PC에서도 되는 웹 타자연습 사이트의 조건과, 실력이 실제로 느는 연습 코스를 정리했습니다.",
    date: "2026-07-09",
    category: "가이드",
    keyword: "무료 타자연습 사이트, 타자연습 사이트, 한글 타자연습, 웹 타자연습, 한컴타자연습 대안",
    content: `
# 무료 타자연습 사이트 고르는 법: 설치 없이 웹에서 바로 시작하기

'타자연습' 하면 아직도 많은 분이 한컴타자연습을 떠올립니다. 학교 컴퓨터실에서 다들 한 번씩 해봤으니까요. 그런데 지금 내 자리로 돌아와 보면 상황이 다릅니다. 맥북에는 설치가 안 되고, 크롬북도 마찬가지고, 회사 PC는 프로그램 설치 자체가 막혀 있는 경우가 많습니다.

다행히 요즘은 설치 없이 브라우저에서 바로 되는 타자연습 사이트가 대안이 됩니다. 다만 아무 데서나 연습한다고 실력이 느는 건 아니라서, 어떤 기준으로 골라야 하는지를 정리했습니다.

## 설치형에서 웹으로, 뭐가 달라졌나

설치형 프로그램의 장점은 완성도였습니다. 자리연습부터 게임까지 커리큘럼이 잘 짜여 있었죠. 웹 타자연습은 그 커리큘럼을 그대로 가져오면서 세 가지가 좋아졌습니다.

- **어디서나 같은 환경** — 집 데스크톱, 회사 PC, 맥북 어디서든 브라우저만 열면 이어서 연습할 수 있습니다.
- **기록이 남는다** — 로그인하면 기기가 바뀌어도 내 타수 기록과 성장 곡선이 유지됩니다.
- **운영체제를 안 가린다** — 윈도우 전용이던 시절과 달리 맥, 리눅스, 크롬북에서도 동일하게 동작합니다.

## 타자연습 사이트, 이 4가지를 확인하세요

### 1. 단계별 커리큘럼이 있는가
낱말 게임만 있는 사이트로는 독수리 타법을 못 벗어납니다. **자리연습(기본 손가락 위치) → 낱말 → 짧은 글 → 긴 글**로 이어지는 단계가 있어야 제대로 된 연습이 됩니다. 특히 초보라면 자리연습 없이 시작하는 건 잘못된 손버릇만 굳히는 지름길입니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="150" viewBox="0 0 480 150" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="타자연습 4단계 커리큘럼">
    <rect width="480" height="150" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <rect x="25" y="55" width="90" height="44" rx="10" fill="#3B82F6"/>
    <text x="70" y="82" font-family="sans-serif" font-weight="bold" font-size="13" fill="white" text-anchor="middle">자리연습</text>
    <path d="M120 77 L138 77" stroke="#94A3B8" stroke-width="2"/>
    <rect x="143" y="55" width="90" height="44" rx="10" fill="#6366F1"/>
    <text x="188" y="82" font-family="sans-serif" font-weight="bold" font-size="13" fill="white" text-anchor="middle">낱말</text>
    <path d="M238 77 L256 77" stroke="#94A3B8" stroke-width="2"/>
    <rect x="261" y="55" width="90" height="44" rx="10" fill="#8B5CF6"/>
    <text x="306" y="82" font-family="sans-serif" font-weight="bold" font-size="13" fill="white" text-anchor="middle">짧은 글</text>
    <path d="M356 77 L374 77" stroke="#94A3B8" stroke-width="2"/>
    <rect x="379" y="55" width="76" height="44" rx="10" fill="#10B981"/>
    <text x="417" y="82" font-family="sans-serif" font-weight="bold" font-size="13" fill="white" text-anchor="middle">긴 글</text>
    <text x="240" y="35" font-family="sans-serif" font-weight="bold" font-size="15" fill="#1E293B" text-anchor="middle">실력이 느는 연습 순서</text>
    <text x="240" y="128" font-family="sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle">건너뛰면 그 단계에서 반드시 정체가 옵니다</text>
  </svg>
</div>

### 2. 진짜 무료인가
'무료'를 내걸고 몇 판 하면 결제 창이 뜨는 곳이 많습니다. 핵심 연습 기능이 제한 없이 무료인지, 시작할 때 회원가입을 강제하지 않는지 확인하세요.

### 3. 타수 측정이 정확한가
분당 타수(타/분)가 실시간으로 보이고, 정확도가 함께 측정되어야 합니다. 속도만 보여주는 사이트에서 연습하면 오타 습관이 그대로 굳습니다. 내 실력이 어느 정도인지 궁금하다면 [연령대별 평균 타수](/blog/average-typing-speed)와 비교해 보세요.

### 4. 지루하지 않은가
타자 실력은 결국 누적 시간입니다. 산성비 같은 게임 요소가 있으면 연습을 '오늘도 해야 하는 숙제'가 아니라 '한 판 더'로 만들어 줍니다. 게임이 실제로 실력에 도움이 되는지는 [산성비 게임 분석 글](/blog/acid-rain-typing-game)에서 다뤘습니다.

## 한글타자왕은 이렇게 쓰면 됩니다

한글타자왕은 위 네 가지 기준을 전부 채우는 것을 목표로 만든 웹 타자연습 사이트입니다. 설치 없이, 무료로, 맥에서도 크롬북에서도 됩니다.

- **처음이라면**: [자리연습](/practice/position)으로 손가락 위치부터. 독수리 타법 교정도 여기서 시작합니다.
- **기본기가 있다면**: [낱말 연습](/practice/word)과 [짧은 글 연습](/practice/short)으로 속도를 올리세요.
- **지루해질 때쯤**: [산성비 게임](/game/acid-rain)을 비롯한 [타자 게임](/game)으로 순발력을 끌어올리고,
- **내 위치가 궁금하면**: [타자 속도 테스트](/test)로 현재 타수를 측정해 보세요.

체계적으로 하고 싶다면 [4주 완성 타자 연습 플랜](/blog/four-week-typing-plan)에 하루 20분짜리 커리큘럼을 정리해 두었습니다.

> **[⌨️ 설치 없이 타자연습 시작하기](/practice)**
`
  },
  {
    id: "mobile-typing-practice",
    title: "모바일 타자연습, 스마트폰으로 가능할까? 상황별 현실적인 방법",
    description: "PC가 없을 때 스마트폰으로 타자연습이 되는지, 모바일 연습이 PC 타자 실력에 도움이 되는지, 그리고 지금 폰에서 바로 할 수 있는 방법을 정리했습니다.",
    date: "2026-07-11",
    category: "가이드",
    keyword: "모바일 타자연습, 타자연습 모바일, 스마트폰 타자연습, 타자연습 어플, 모바일 타자게임",
    content: `
# 모바일 타자연습, 스마트폰으로 가능할까? 상황별 현실적인 방법

'타자연습 모바일'을 검색해서 들어오신 분이라면 상황은 둘 중 하나일 겁니다. 지금 PC가 없거나, 이동 중이거나. 결론부터 말하면 **스마트폰으로도 타자연습은 됩니다.** 다만 무엇이 되고 무엇이 안 되는지를 알고 해야 시간 낭비가 없습니다.

## 먼저 솔직한 이야기: 모바일 연습의 한계

스마트폰 쿼티 자판은 PC 키보드와 배열이 같습니다. ㅂㅈㄷㄱ 위치도, 쌍자음 치는 법도 동일하죠. 그래서 모바일 연습으로도 **글자 조합 감각**은 확실히 늡니다. 어떤 글자가 어디 있는지, 받침을 어떻게 조합하는지가 빨라집니다.

하지만 PC 타자의 핵심인 **열 손가락 근육 기억**은 모바일로 만들 수 없습니다. 엄지 두 개로 치는 것과 열 손가락으로 치는 건 다른 운동이니까요. 분당 500타를 목표로 한다면 결국 물리 키보드 앞에 앉아야 합니다. ([현실적인 연습 가이드](/blog/ultimate-typing-guide) 참고)

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="210" viewBox="0 0 480 210" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="모바일 타자연습으로 되는 것과 안 되는 것">
    <rect width="480" height="210" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="38" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1E293B" text-anchor="middle">모바일 타자연습으로 되는 것 / 안 되는 것</text>
    <rect x="30" y="60" width="200" height="120" rx="12" fill="#10B981" opacity="0.08"/>
    <text x="130" y="88" font-family="sans-serif" font-weight="bold" font-size="14" fill="#059669" text-anchor="middle">✓ 되는 것</text>
    <text x="130" y="115" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="middle">자판 배열 암기</text>
    <text x="130" y="138" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="middle">글자 조합 감각</text>
    <text x="130" y="161" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="middle">순발력 · 어휘 반응 속도</text>
    <rect x="250" y="60" width="200" height="120" rx="12" fill="#EF4444" opacity="0.08"/>
    <text x="350" y="88" font-family="sans-serif" font-weight="bold" font-size="14" fill="#DC2626" text-anchor="middle">✕ 안 되는 것</text>
    <text x="350" y="115" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="middle">열 손가락 근육 기억</text>
    <text x="350" y="138" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="middle">시선 독립 훈련</text>
    <text x="350" y="161" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="middle">분당 400타 이상의 속도</text>
  </svg>
</div>

그럼 모바일 연습은 의미가 없냐 하면, 전혀 아닙니다. 목적을 바꾸면 됩니다. 모바일에서는 **게임으로 순발력을 유지하고**, PC에서는 **자리연습으로 손가락을 만드는** 식으로 역할을 나누는 겁니다.

## 지금 폰에서 바로 할 수 있는 것

### 1. 모바일 웹에서 타자 게임 하기
한글타자왕의 [타자 게임](/game)은 전부 모바일 화면에 맞게 만들어져 있습니다. 게임을 시작하면 전체 화면으로 전환되고, 입력창이 자판 바로 위에 붙어서 폰으로도 쾌적하게 플레이됩니다.

- [산성비](/game/acid-rain) — 떨어지는 단어를 빠르게 입력하는 추억의 그 게임
- [타자 레이스](/game/typing-race), [블록 팝](/game/block-pop) 같은 순발력 게임들

출퇴근 지하철에서 한 판씩 하기 좋습니다. 실시간 랭킹이 있어서 은근히 승부욕도 자극됩니다.

### 2. 안드로이드 앱으로 연습하기
브라우저 열기도 귀찮다면 [한글타자왕 안드로이드 앱](https://play.google.com/store/apps/details?id=com.moneytaker.korean_typing)을 설치해 두세요. 홈 화면에서 바로 실행되니 자투리 시간 연습의 진입 장벽이 확 낮아집니다.

### 3. 맞춤법 퀴즈로 '정확한 타자' 챙기기
타자는 빨리 치는 것 못지않게 맞게 치는 게 중요합니다. 화면이 작아도 전혀 지장 없는 [맞춤법 퀴즈](/quiz)는 모바일에 딱 맞는 콘텐츠입니다. 되/돼, 왠/웬처럼 [한국인이 자주 틀리는 맞춤법](/blog/common-spelling-mistakes)을 퀴즈로 하나씩 잡아보세요.

## 이렇게 조합하면 가장 빠릅니다

1. **이동 중 (모바일)** — 타자 게임 한두 판으로 감각 유지, 맞춤법 퀴즈로 정확도 보강
2. **집·사무실 (PC)** — [자리연습](/practice/position)과 [짧은 글 연습](/practice/short)으로 열 손가락 훈련
3. **주 1회 (PC)** — [타자 속도 테스트](/test)로 기록 측정

모바일은 보조, PC는 본 훈련. 이 조합이면 자투리 시간까지 전부 연습 시간이 됩니다.

> **[🎮 폰에서 바로 타자 게임 한 판](/game)**
`
  },
  {
    id: "how-typing-speed-is-measured",
    title: "타자 속도 측정의 모든 것: 사이트마다 내 타수가 다르게 나오는 이유",
    description: "한글 타자 속도의 '타'는 어떻게 계산될까? 타수 계산 원리부터 사이트마다 측정값이 달라지는 4가지 이유, 정확하게 측정하는 요령까지 정리했습니다.",
    date: "2026-07-08",
    category: "지식",
    keyword: "타자 속도 측정, 타자 속도 테스트, 타수 계산, 한글 타자 속도, 타자 테스트",
    content: `
# 타자 속도 측정의 모든 것: 사이트마다 내 타수가 다르게 나오는 이유

타자 속도를 재봤는데 어떤 사이트에서는 450타, 다른 곳에서는 380타가 나옵니다. 내 실력이 하루 만에 준 걸까요? 아닙니다. **타수는 측정 방식에 따라 달라지는 값**이라서, 원리를 모르면 숫자에 휘둘리게 됩니다. 오늘은 '타'가 정확히 뭔지부터 짚어보겠습니다.

## '타'는 글자 수가 아니라 키를 누른 횟수다

한글 타자 속도의 단위인 '타/분(타수)'는 1분 동안 입력한 **자모(키 입력)의 수**입니다. 글자 수가 아닙니다. 예를 들어 '안녕하세요' 다섯 글자를 치려면 키보드를 12번 눌러야 합니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="240" viewBox="0 0 480 240" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="안녕하세요의 타수 계산 예시">
    <rect width="480" height="240" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="40" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1E293B" text-anchor="middle">'안녕하세요' = 5글자, 12타</text>
    <rect x="35" y="65" width="78" height="52" rx="10" fill="#3B82F6" opacity="0.12"/>
    <text x="74" y="97" font-family="sans-serif" font-weight="bold" font-size="20" fill="#1E293B" text-anchor="middle">안</text>
    <rect x="123" y="65" width="78" height="52" rx="10" fill="#3B82F6" opacity="0.12"/>
    <text x="162" y="97" font-family="sans-serif" font-weight="bold" font-size="20" fill="#1E293B" text-anchor="middle">녕</text>
    <rect x="211" y="65" width="78" height="52" rx="10" fill="#3B82F6" opacity="0.12"/>
    <text x="250" y="97" font-family="sans-serif" font-weight="bold" font-size="20" fill="#1E293B" text-anchor="middle">하</text>
    <rect x="299" y="65" width="78" height="52" rx="10" fill="#3B82F6" opacity="0.12"/>
    <text x="338" y="97" font-family="sans-serif" font-weight="bold" font-size="20" fill="#1E293B" text-anchor="middle">세</text>
    <rect x="387" y="65" width="58" height="52" rx="10" fill="#3B82F6" opacity="0.12"/>
    <text x="416" y="97" font-family="sans-serif" font-weight="bold" font-size="20" fill="#1E293B" text-anchor="middle">요</text>
    <text x="74" y="145" font-family="sans-serif" font-size="13" fill="#2563EB" text-anchor="middle">ㅇ+ㅏ+ㄴ</text>
    <text x="162" y="145" font-family="sans-serif" font-size="13" fill="#2563EB" text-anchor="middle">ㄴ+ㅕ+ㅇ</text>
    <text x="250" y="145" font-family="sans-serif" font-size="13" fill="#2563EB" text-anchor="middle">ㅎ+ㅏ</text>
    <text x="338" y="145" font-family="sans-serif" font-size="13" fill="#2563EB" text-anchor="middle">ㅅ+ㅔ</text>
    <text x="416" y="145" font-family="sans-serif" font-size="13" fill="#2563EB" text-anchor="middle">ㅇ+ㅛ</text>
    <text x="74" y="172" font-family="sans-serif" font-weight="bold" font-size="14" fill="#059669" text-anchor="middle">3타</text>
    <text x="162" y="172" font-family="sans-serif" font-weight="bold" font-size="14" fill="#059669" text-anchor="middle">3타</text>
    <text x="250" y="172" font-family="sans-serif" font-weight="bold" font-size="14" fill="#059669" text-anchor="middle">2타</text>
    <text x="338" y="172" font-family="sans-serif" font-weight="bold" font-size="14" fill="#059669" text-anchor="middle">2타</text>
    <text x="416" y="172" font-family="sans-serif" font-weight="bold" font-size="14" fill="#059669" text-anchor="middle">2타</text>
    <text x="240" y="212" font-family="sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle">받침이 많은 글일수록 같은 글자 수라도 타수가 높게 나옵니다</text>
  </svg>
</div>

그래서 같은 속도로 쳐도 **받침과 쌍자음이 많은 글**은 타수가 높게, '아이가 오이를 사요' 같은 받침 없는 글은 낮게 나옵니다. 영문 타자의 WPM(분당 단어 수)과 한글 타수가 직접 비교가 안 되는 이유이기도 합니다.

## 사이트마다 타수가 다르게 나오는 4가지 이유

### 1. 오타를 어떻게 처리하는가
가장 큰 변수입니다. 오타 친 키 입력도 타수에 포함하는 곳, 오타 글자만 빼는 곳, 오타가 나면 감점까지 하는 곳이 다 다릅니다. 오타 감점 방식이면 체감보다 타수가 훨씬 낮게 나옵니다.

### 2. 백스페이스 수정을 인정하는가
수정한 글자를 정타로 인정하는지, 수정에 쓴 시간과 키 입력을 어떻게 계산하는지도 사이트마다 다릅니다. 백스페이스를 자주 쓰는 습관이 있다면 이 차이가 크게 벌어집니다.

### 3. 텍스트 난이도가 다르다
위에서 본 것처럼 받침 밀도에 따라 타수가 달라지는데, 사이트마다 기본 제공 텍스트의 난이도가 다릅니다. 문장부호와 영문·숫자가 섞인 텍스트는 타수가 더 낮게 나옵니다.

### 4. 측정 시간이 다르다
15초짜리 짧은 측정은 순간 최고 속도에 가깝고, 3분 이상 긴 글 측정은 지구력이 반영된 실전 속도에 가깝습니다. 짧은 측정값이 보통 10~20% 높게 나옵니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="210" viewBox="0 0 480 210" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="측정 시간에 따른 타수 차이 그래프">
    <rect width="480" height="210" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="36" font-family="sans-serif" font-weight="bold" font-size="15" fill="#1E293B" text-anchor="middle">측정 시간이 길수록 타수는 낮고 정직해집니다</text>
    <path d="M60 170 L430 170" stroke="#94A3B8" stroke-width="2"/>
    <path d="M60 170 L60 60" stroke="#94A3B8" stroke-width="2"/>
    <path d="M70 75 C 150 80, 230 110, 420 128" stroke="#3B82F6" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="80" cy="76" r="6" fill="#EF4444"/>
    <text x="98" y="68" font-family="sans-serif" font-size="11" fill="#EF4444">15초: 순간 최고 속도</text>
    <circle cx="400" cy="127" r="6" fill="#059669"/>
    <text x="392" y="152" font-family="sans-serif" font-size="11" fill="#059669" text-anchor="end">3분 이상: 실전 속도</text>
    <text x="245" y="192" font-family="sans-serif" font-size="12" fill="#64748B" text-anchor="middle">측정 시간</text>
  </svg>
</div>

## 그래서, 어떻게 측정해야 정확할까

측정의 목적은 '큰 숫자'가 아니라 '성장 추적'입니다. 세 가지만 지키면 됩니다.

1. **항상 같은 사이트, 같은 방식으로** — 절대값보다 변화량이 중요하니 측정 조건을 고정하세요.
2. **1분 이상 측정** — 15초 순간 속도는 실전과 다릅니다. 최소 1분, 가능하면 긴 글로 재세요.
3. **정확도를 같이 기록** — 타수 450에 정확도 85%보다 타수 400에 정확도 98%가 실전에서는 훨씬 빠릅니다. 오타 수정 시간까지 포함하면요.

내 타수가 또래 대비 어느 정도인지 궁금하다면 [연령대별 평균 타수 가이드](/blog/average-typing-speed)와 비교해 보고, 측정 결과가 아쉬웠다면 [4주 완성 연습 플랜](/blog/four-week-typing-plan)으로 올려보세요.

한글타자왕의 [타자 속도 테스트](/test)는 실전 문장 기준으로 타수와 정확도를 함께 측정하고, 로그인하면 기록이 남아 성장 곡선을 확인할 수 있습니다.

> **[⏱️ 지금 내 타자 속도 측정하기](/test)**
`
  },
  {
    id: "best-free-typing-games",
    title: "무료 타자 게임 5종 완전 정복: 게임마다 느는 실력이 다릅니다",
    description: "산성비, 성문방어, 블록 팝핑, 기억력 타자, 타자 레이스 — 타자 게임마다 훈련되는 능력이 다릅니다. 내 약점에 맞는 게임 고르는 법을 정리했습니다.",
    date: "2026-07-10",
    category: "게임",
    keyword: "타자 게임, 무료 타자게임, 한글 타자 게임, 타자 게임 추천, 산성비 게임",
    content: `
# 무료 타자 게임 5종 완전 정복: 게임마다 느는 실력이 다릅니다

"타자 게임이 연습에 도움이 되나요?"라는 질문에 대한 답은 [산성비 게임 분석 글](/blog/acid-rain-typing-game)에서 다뤘습니다. 결론은 '된다, 단 목적에 맞게 쓰면'이었죠. 오늘은 그 다음 질문입니다. **"그래서 어떤 게임을 해야 하나요?"**

타자 게임은 다 비슷해 보이지만, 게임 방식에 따라 훈련되는 능력이 다릅니다. 헬스장에서 부위별로 기구를 고르듯, 타자 게임도 내 약점에 맞게 골라야 효율이 나옵니다.

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="270" viewBox="0 0 480 270" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="타자 게임 5종별 훈련 능력 매트릭스">
    <rect width="480" height="270" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="36" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1E293B" text-anchor="middle">게임별 주력 훈련 능력</text>
    <text x="185" y="66" font-family="sans-serif" font-weight="bold" font-size="11" fill="#64748B" text-anchor="middle">순발력</text>
    <text x="270" y="66" font-family="sans-serif" font-weight="bold" font-size="11" fill="#64748B" text-anchor="middle">정확도</text>
    <text x="355" y="66" font-family="sans-serif" font-weight="bold" font-size="11" fill="#64748B" text-anchor="middle">판단력</text>
    <text x="435" y="66" font-family="sans-serif" font-weight="bold" font-size="11" fill="#64748B" text-anchor="middle">지속력</text>
    <text x="30" y="97" font-family="sans-serif" font-size="13" fill="#334155">🌧️ 산성비</text>
    <text x="185" y="97" font-family="sans-serif" font-size="13" fill="#10B981" text-anchor="middle">●●●</text>
    <text x="270" y="97" font-family="sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">●●</text>
    <text x="355" y="97" font-family="sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">●●</text>
    <text x="435" y="97" font-family="sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">●</text>
    <text x="30" y="134" font-family="sans-serif" font-size="13" fill="#334155">🏰 성문방어</text>
    <text x="185" y="134" font-family="sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">●●</text>
    <text x="270" y="134" font-family="sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">●●</text>
    <text x="355" y="134" font-family="sans-serif" font-size="13" fill="#10B981" text-anchor="middle">●●●</text>
    <text x="435" y="134" font-family="sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">●●</text>
    <text x="30" y="171" font-family="sans-serif" font-size="13" fill="#334155">🧱 블록 팝핑</text>
    <text x="185" y="171" font-family="sans-serif" font-size="13" fill="#10B981" text-anchor="middle">●●●</text>
    <text x="270" y="171" font-family="sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">●●</text>
    <text x="355" y="171" font-family="sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">●</text>
    <text x="435" y="171" font-family="sans-serif" font-size="13" fill="#10B981" text-anchor="middle">●●●</text>
    <text x="30" y="208" font-family="sans-serif" font-size="13" fill="#334155">🃏 기억력 타자</text>
    <text x="185" y="208" font-family="sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">●</text>
    <text x="270" y="208" font-family="sans-serif" font-size="13" fill="#10B981" text-anchor="middle">●●●</text>
    <text x="355" y="208" font-family="sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">●●</text>
    <text x="435" y="208" font-family="sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">●</text>
    <text x="30" y="245" font-family="sans-serif" font-size="13" fill="#334155">🏁 타자 레이스</text>
    <text x="185" y="245" font-family="sans-serif" font-size="13" fill="#10B981" text-anchor="middle">●●●</text>
    <text x="270" y="245" font-family="sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">●●</text>
    <text x="355" y="245" font-family="sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">●</text>
    <text x="435" y="245" font-family="sans-serif" font-size="13" fill="#10B981" text-anchor="middle">●●</text>
    <line x1="25" y1="110" x2="455" y2="110" stroke="#E2E8F0" stroke-width="1"/>
    <line x1="25" y1="147" x2="455" y2="147" stroke="#E2E8F0" stroke-width="1"/>
    <line x1="25" y1="184" x2="455" y2="184" stroke="#E2E8F0" stroke-width="1"/>
    <line x1="25" y1="221" x2="455" y2="221" stroke="#E2E8F0" stroke-width="1"/>
  </svg>
</div>

## 1. 산성비 — 순발력의 왕도

[산성비](/game/acid-rain)는 하늘에서 떨어지는 단어를 바닥에 닿기 전에 입력하는, 타자 게임의 원형 같은 게임입니다. '단어를 보는 즉시 손이 나가는' 반응 속도를 기르는 데 이만한 게 없습니다. 아이템 기믹과 실시간 랭킹이 있어서 은근히 오래 잡게 됩니다.

- **이런 분에게**: 낱말 연습은 할 만큼 했는데 실전에서 첫 키가 늦게 나가는 분

## 2. 성문방어 — 읽고 판단하며 치는 훈련

[성문방어](/game/castle-defense)는 발사·방패·번개·수리 같은 **명령어를 상황에 맞게 골라 입력하며** 60초 동안 성문을 지키는 게임입니다. 단순히 보이는 대로 치는 게 아니라 '지금 뭘 쳐야 하지?'를 판단하면서 쳐야 해서, 생각하면서 타이핑하는 실전 감각(채팅, 업무 메신저)에 가장 가깝습니다.

- **이런 분에게**: 따라 치는 건 빠른데 머릿속 문장을 칠 때 느려지는 분

## 3. 블록 팝핑 — 지속력과 멘탈 관리

[블록 팝핑](/game/block-pop)은 아래에서 차오르는 단어 블록을 천장에 닿기 전에 터뜨리는 게임입니다. 산성비가 '떨어지는 것을 막는' 수비라면, 블록 팝핑은 쌓이는 압박을 계속 걷어내는 지구전입니다. 후반으로 갈수록 속도 압박이 커져서 한계 속도를 끌어올리는 과부하 훈련이 됩니다.

- **이런 분에게**: 처음엔 빠른데 30초만 지나면 급격히 느려지는 분

## 4. 기억력 타자 — 정확도 집중 훈련

[기억력 타자](/game/card-flip)는 마우스 없이 오직 타자로 카드를 뒤집어 짝을 맞추는 게임입니다. 속도 압박이 약한 대신 **한 번에 정확히 입력하는 것**이 중요해서, 오타 습관을 잡는 데 좋습니다. 카드 위치를 외우는 기억력 게임이기도 해서 아이들 연습용으로도 인기가 많습니다.

- **이런 분에게**: 속도는 나오는데 정확도가 90%를 못 넘는 분, 초등학생 자녀 ([초등학생 타자 가이드](/blog/kids-typing-guide) 참고)

## 5. 타자 레이스 — 기록 경쟁의 재미

[타자 레이스](/game/typing-race)는 거북이, 토끼, 치타와 경주하며 단어를 입력해 결승선을 통과하는 게임입니다. 상대가 눈에 보이는 경쟁 구도라서 혼자 연습할 때보다 확실히 손이 빨라집니다. 치타를 이기는 날이 오면 [속도 테스트](/test)에서 기록을 재보세요. 꽤 올라 있을 겁니다.

- **이런 분에게**: 혼자 하는 연습이 심심해서 자꾸 그만두게 되는 분

## 뭐부터 할지 모르겠다면: 단계별 로드맵

<div style="display:flex;justify-content:center;margin:2rem 0;">
  <svg width="480" height="200" viewBox="0 0 480 200" style="max-width:100%;height:auto" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="실력 단계별 추천 타자 게임 로드맵">
    <rect width="480" height="200" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="240" y="36" font-family="sans-serif" font-weight="bold" font-size="15" fill="#1E293B" text-anchor="middle">실력 단계별 추천 게임</text>
    <rect x="30" y="60" width="130" height="80" rx="12" fill="#3B82F6" opacity="0.1"/>
    <text x="95" y="85" font-family="sans-serif" font-weight="bold" font-size="13" fill="#2563EB" text-anchor="middle">~200타</text>
    <text x="95" y="108" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="middle">기억력 타자</text>
    <text x="95" y="127" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">정확도 먼저</text>
    <path d="M165 100 L183 100" stroke="#94A3B8" stroke-width="2"/>
    <rect x="188" y="60" width="130" height="80" rx="12" fill="#8B5CF6" opacity="0.1"/>
    <text x="253" y="85" font-family="sans-serif" font-weight="bold" font-size="13" fill="#7C3AED" text-anchor="middle">200~400타</text>
    <text x="253" y="108" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="middle">산성비 · 블록 팝핑</text>
    <text x="253" y="127" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">순발력과 지속력</text>
    <path d="M323 100 L341 100" stroke="#94A3B8" stroke-width="2"/>
    <rect x="346" y="60" width="110" height="80" rx="12" fill="#10B981" opacity="0.1"/>
    <text x="401" y="85" font-family="sans-serif" font-weight="bold" font-size="13" fill="#059669" text-anchor="middle">400타~</text>
    <text x="401" y="108" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="middle">타자 레이스</text>
    <text x="401" y="127" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">성문방어 · 기록 경쟁</text>
    <text x="240" y="172" font-family="sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle">내 타수를 모른다면 속도 테스트부터 해보세요</text>
  </svg>
</div>

내 타수가 어느 구간인지 모르겠다면 [타자 속도 테스트](/test)로 먼저 측정해 보세요. 사이트마다 타수가 다르게 나오는 이유는 [타자 속도 측정 가이드](/blog/how-typing-speed-is-measured)에 정리해 두었습니다.

## 게임은 반찬, 기본기는 밥

마지막으로 한 번 더 강조하면 — 게임은 이미 아는 자판을 빠르게 만드는 도구지, 자판을 처음 익히는 도구가 아닙니다. 아직 키보드를 보면서 친다면 [자리연습](/practice/position)부터, 기본기가 있다면 게임과 [짧은 글 연습](/practice/short)을 번갈아 하는 게 가장 빠릅니다. 하루 20분 기준의 조합은 [4주 완성 플랜](/blog/four-week-typing-plan)에 정리해 두었습니다.

다섯 게임 모두 무료고, 모바일에서도 됩니다. ([모바일 타자연습 가이드](/blog/mobile-typing-practice))

> **[🎮 내 약점에 맞는 게임 고르러 가기](/game)**
`
  },
  {
    id: "batchim-double-consonant",
    title: "한글에서 오타가 가장 잦은 글자들: 받침·쌍자음 공략법",
    description: "쌍자음과 겹받침에서 유독 오타가 나는 이유를 자판 구조로 풀어보고, 오타율을 낮추는 구체적인 연습 순서를 정리했습니다.",
    date: "2026-08-04",
    category: "가이드",
    keyword: "쌍자음 타자, 겹받침 오타, 오타 줄이기, 받침 타자, 타자 정확도",
    content: `
# 한글에서 오타가 가장 잦은 글자들: 받침·쌍자음 공략법

타자 연습 사이트를 운영하면서 사용자들의 연습 기록을 보다 보면 재미있는 패턴이 하나 보입니다. 오타가 아무 데서나 고르게 나는 게 아니라, **특정 글자 유형에서 집중적으로** 난다는 겁니다. 범인은 늘 비슷합니다. 쌍자음(ㄲ, ㄸ, ㅃ, ㅆ, ㅉ), 겹받침(ㄺ, ㄼ, ㅀ...), 그리고 받침이 다음 글자로 넘어가는 순간이죠.

"나는 왜 '있었다'만 치면 틀리지?"라고 자책하셨다면, 그건 실력 문제가 아니라 **자판 구조상 원래 어려운 구간**이기 때문입니다. 오늘은 이 어려운 글자들만 골라서 공략하는 방법을 정리해 봤습니다.

---

## 🔴 1. 쌍자음: 시프트(Shift)가 만드는 병목

두벌식 자판에서 쌍자음은 **Shift + 자음**으로 입력합니다. 문제는 이 조합이 손가락 하나가 아니라 '양손의 협응'을 요구한다는 거예요. '까'를 치려면 오른손 새끼손가락으로 Shift를 누른 채 왼손 중지로 ㄱ을 눌러야 합니다. 이 타이밍이 0.1초만 어긋나도 'ㄱ가'나 '가'가 되어버립니다.

<div style="display: flex; justify-content: center; margin: 2rem 0;">
  <svg width="400" height="220" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="220" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="200" y="35" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1E293B" text-anchor="middle">쌍자음 = 양손 협응 동작</text>
    <rect x="40" y="60" width="140" height="50" rx="10" fill="#3B82F6"/>
    <text x="110" y="90" font-family="sans-serif" font-weight="bold" font-size="14" fill="white" text-anchor="middle">오른손: Shift 누름</text>
    <rect x="220" y="60" width="140" height="50" rx="10" fill="#10B981"/>
    <text x="290" y="90" font-family="sans-serif" font-weight="bold" font-size="14" fill="white" text-anchor="middle">왼손: ㄱ 누름</text>
    <path d="M110 120 L110 150 L290 150 L290 120" stroke="#94A3B8" stroke-width="2" fill="none"/>
    <circle cx="200" cy="150" r="4" fill="#EF4444"/>
    <text x="200" y="180" font-family="sans-serif" font-weight="bold" font-size="13" fill="#EF4444" text-anchor="middle">두 동작이 겹치는 타이밍이 어긋나면 오타</text>
    <text x="200" y="200" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">까 → "ㄱ가" / "가" 로 깨지는 이유</text>
  </svg>
</div>

### 공략법: 반대손 시프트 규칙
피아노 페달처럼, 시프트는 **본 글자를 치는 손의 반대손**으로 누르는 게 정석입니다. ㄲ, ㄸ, ㅃ, ㅆ, ㅉ은 전부 왼손 담당 자음이니, 쌍자음의 시프트는 항상 **오른손 새끼손가락**이 담당하게 됩니다. 이 규칙 하나만 몸에 붙여도 쌍자음 오타가 눈에 띄게 줄어듭니다.

연습 재료로는 쌍자음이 촘촘히 들어간 단어들을 반복하는 게 좋습니다. "깜빡", "떡볶이", "빨래", "쓰레기", "짜장면", "어쩔", "글쎄" 같은 단어를 하루 열 번씩만 정확하게 쳐보세요.

---

## 🟡 2. 겹받침: 눈으로 외우면 늦는다

'닭', '삶', '않-', '읽-', '없-' 같은 겹받침 글자는 받침 두 개를 연속으로 눌러야 합니다. 문제는 겹받침의 구성(ㄺ = ㄹ + ㄱ)을 머리로 떠올리는 순간 이미 손이 멈춘다는 겁니다.

### 공략법: 단어 단위로 통째로 익히기
겹받침은 조합 규칙을 외우는 것보다, **자주 쓰는 겹받침 단어를 통째로 손에 새기는 편**이 훨씬 빠릅니다. 실생활에서 쓰는 겹받침 단어는 생각보다 몇 개 안 됩니다.

- ㄺ: 닭, 읽다, 밝다, 맑다
- ㄻ: 삶, 젊다, 닮다
- ㄶ: 않다, 많다, 괜찮다
- ㅀ: 옳다, 잃다, 싫다
- ㅄ: 없다, 값

이 목록에서 보이듯 "않-", "없-", "괜찮-"만 자동화돼도 일상 타이핑의 겹받침 스트레스 대부분이 사라집니다.

---

## 🟢 3. 도깨비불 현상: 받침이 다음 글자로 도망갈 때

"직업"을 치는 과정을 천천히 보면 ㅈ→지→직→**지겁**→직업 처럼, 받침 ㄱ이 잠시 다음 글자의 초성으로 넘어갔다가 돌아오는 순간이 있습니다. 이걸 '도깨비불 현상'이라고 부르는데, 한글 입력기의 정상 동작입니다.

문제는 이 화면 출렁임을 눈으로 쫓다가 리듬이 깨지는 경우입니다. 특히 화면을 보며 오타를 실시간 검열하는 습관이 있는 분들이 여기서 자주 무너집니다.

### 공략법: 글자가 아니라 '단어 끝'에서만 확인
치는 도중의 화면 출렁임은 무시하고, **단어 하나를 다 친 뒤에만** 시선으로 확인하는 습관을 들이세요. 중간 과정은 입력기가 알아서 정리합니다. 확인 주기를 '글자'에서 '단어'로 늘리는 것만으로 리듬이 살아나고, 역설적으로 오타도 줄어듭니다.

---

## 마치며: 약점만 때리는 연습이 가장 빠르다

전체 문장을 무작정 반복하는 것보다, 이렇게 **오타가 나는 유형만 골라 집중 연습**하는 쪽이 정확도를 올리는 지름길입니다. 순서를 요약하면:

1. 쌍자음 단어 10개 × 10회 (반대손 시프트 의식하기)
2. 겹받침 고빈도 단어 통째로 익히기
3. 문장 연습에서는 단어 끝에서만 시선 확인

정확도가 잡히면 속도는 따라옵니다. 반대로 속도부터 올리면 오타 습관도 같이 굳습니다. 급할수록 돌아가세요.

<br/>

> **[🎯 낱말 연습으로 약점 글자 집중 공략하기](/practice/word)**
`
  },
  {
    id: "senior-typing-guide",
    title: "부모님을 위한 타자 배우기: 시니어 타자 연습 단계별 가이드",
    description: "50~70대가 타자를 배울 때 겪는 진짜 장벽과, 자녀가 옆에서 도와줄 때 쓸 수 있는 4단계 학습 순서를 정리했습니다.",
    date: "2026-08-05",
    category: "가이드",
    keyword: "시니어 타자, 어르신 타자 연습, 부모님 컴퓨터 배우기, 독수리 타법 교정",
    content: `
# 부모님을 위한 타자 배우기: 시니어 타자 연습 단계별 가이드

"아버지가 컴퓨터로 뭘 쓰시려면 한 글자에 3초씩 걸려요. 알려드리고 싶은데 어디서부터 시작해야 할지 모르겠어요."

사이트를 운영하며 종종 받는 질문입니다. 시니어 타자 학습은 아이들 타자 교육과는 완전히 다른 접근이 필요합니다. 배우는 속도의 문제가 아니라, **수십 년 굳은 습관과 '틀리면 어쩌지' 하는 심리적 부담**이 진짜 장벽이기 때문입니다. 부모님께 알려드리는 상황을 기준으로, 실제로 효과를 본 순서를 정리했습니다.

---

## 먼저: 시니어 학습의 3가지 특징 이해하기

1. **독수리 타법이 이미 완성형입니다.** 수년간 두 손가락으로 쳐오셨다면 그것도 하나의 숙련된 기술입니다. "그거 틀렸어요"라고 시작하면 학습 의욕부터 꺾입니다. 교정이 아니라 '업그레이드'라는 프레임으로 접근하세요.
2. **시선 왕복이 가장 큰 비용입니다.** 자판 보고 → 화면 보고 → 다시 자판 찾고. 이 왕복이 속도보다 먼저 지치게 만듭니다.
3. **성취가 눈에 보여야 계속합니다.** "늘고 있다"는 증거(타수 숫자, 연습 기록)가 눈에 보일 때 어른들은 의외로 아이들보다 더 꾸준합니다.

<div style="display: flex; justify-content: center; margin: 2rem 0;">
  <svg width="400" height="240" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="240" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="200" y="32" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1E293B" text-anchor="middle">시니어 타자 학습 4단계</text>
    <rect x="30" y="180" width="80" height="34" rx="8" fill="#3B82F6"/>
    <text x="70" y="202" font-family="sans-serif" font-weight="bold" font-size="11" fill="white" text-anchor="middle">1. 환경 세팅</text>
    <rect x="120" y="140" width="80" height="34" rx="8" fill="#10B981"/>
    <text x="160" y="162" font-family="sans-serif" font-weight="bold" font-size="11" fill="white" text-anchor="middle">2. 자리 익히기</text>
    <rect x="210" y="100" width="80" height="34" rx="8" fill="#F59E0B"/>
    <text x="250" y="122" font-family="sans-serif" font-weight="bold" font-size="11" fill="white" text-anchor="middle">3. 낱말 10분</text>
    <rect x="300" y="60" width="80" height="34" rx="8" fill="#8B5CF6"/>
    <text x="340" y="82" font-family="sans-serif" font-weight="bold" font-size="11" fill="white" text-anchor="middle">4. 문장·기록</text>
    <path d="M70 180 L160 174 M160 140 L250 134 M250 100 L340 94" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="4 4"/>
    <text x="200" y="230" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">한 단계에 1~2주, 서두르지 않는 것이 핵심</text>
  </svg>
</div>

---

## 1단계: 몸이 편한 환경부터 (첫날)

연습법보다 먼저 챙길 게 환경입니다.

- **브라우저 글자 크기를 키우세요.** Ctrl과 + 키를 함께 누르면 화면이 확대됩니다. 125~150%만 되어도 부담이 크게 줄어듭니다.
- **키보드는 키가 크고 깊이 눌리는 것**이 좋습니다. 얇은 노트북 키보드보다 데스크톱용 일반 키보드가 초반 학습에 유리합니다.
- **의자 높이**는 팔꿈치가 책상과 수평이 되게. 손목이 꺾인 채 배우면 통증 때문에 금방 그만두게 됩니다.

## 2단계: 자판 자리 익히기 (1~2주)

기준은 딱 하나입니다. **왼손 검지는 ㄹ(F), 오른손 검지는 ㅓ(J).** 두 키에 있는 돌기를 손끝으로 찾는 것부터 시작하세요. 이 '홈 포지션'만 익혀도 시선 왕복이 절반으로 줄어듭니다.

이 단계에서는 속도 얘기를 꺼내지 마세요. "하루 10분, 자리만 익히기"가 목표입니다.

## 3단계: 낱말 연습 하루 10분 (2~3주)

자리가 어느 정도 익으면 짧은 낱말 연습으로 넘어갑니다. 이때 요령은 **받아쓰기가 아니라 게임처럼** 하는 겁니다. 하루 10분을 넘기지 않는 게 오히려 중요합니다. 길게 하면 다음 날 안 하게 됩니다.

## 4단계: 문장 연습 + 기록 보여드리기

짧은 문장(속담, 격언)으로 넘어가면서 **타수 기록을 함께 확인**해 주세요. "지난주 80타였는데 오늘 110타네요?" 이 한 마디가 어떤 교재보다 강력합니다. 익숙해지면 좋아하는 시나 글귀를 필사하는 것도 좋습니다. 연습이 아니라 취미가 되는 순간, 더 이상 옆에서 챙겨드릴 필요가 없어집니다.

---

## 하지 말아야 할 것 3가지

1. **속도 재촉** — "더 빨리"는 금지어입니다. 정확하게만 치면 속도는 알아서 붙습니다.
2. **한 번에 오래** — 30분 몰아치기보다 10분씩 3일이 낫습니다.
3. **어깨너머 교정** — 치는 도중에 "아니 그 손가락 말고"라고 끼어들면 리듬과 자신감이 같이 무너집니다. 끝나고 한 가지씩만.

---

### 마치며

타자는 시니어에게 단순한 기술이 아니라 **디지털 세상과의 대화 속도**입니다. 검색을 하고, 손주에게 메시지를 보내고, 하고 싶은 말을 제 속도로 쓸 수 있게 되는 것. 그 변화를 옆에서 지켜보는 건 생각보다 뭉클한 일입니다. 이번 주말, 부모님과 함께 10분만 시작해 보세요.

<br/>

> **[⌨️ 타자 연습장에서 낱말 연습부터 시작하기](/practice)**
`
  },
  {
    id: "pilsa-habit-21days",
    title: "필사, 작심삼일로 끝나지 않으려면: 21일 필사 습관 설계법",
    description: "필사가 3일 만에 끊기는 진짜 이유와, 트리거-루틴-보상 구조로 21일 만에 습관을 안착시키는 구체적인 주차별 플랜.",
    date: "2026-08-06",
    category: "필사",
    keyword: "필사 습관, 필사 챌린지, 21일 습관, 필사 루틴, 키보드 필사",
    content: `
# 필사, 작심삼일로 끝나지 않으려면: 21일 필사 습관 설계법

필사를 시작하는 사람은 많은데, 3주를 넘기는 사람은 드뭅니다. 사이트의 필사 기록 데이터를 봐도 첫 3일의 이탈률이 압도적으로 높습니다. 흥미로운 건, **3주를 넘긴 사람들은 대부분 몇 달씩 이어간다**는 겁니다. 즉 필사 습관의 승부처는 딱 초반 21일입니다.

의지가 약해서가 아닙니다. 설계가 없어서입니다. 오늘은 '매일 필사해야지'라는 다짐 대신, 구조로 습관을 만드는 방법을 정리했습니다.

---

## 왜 3일 만에 끊기는가

작심삼일의 공통 패턴은 세 가지입니다.

1. **목표가 큽니다.** "매일 한 페이지씩"은 첫날엔 되지만 피곤한 셋째 날엔 부담이 됩니다.
2. **시간과 장소가 매번 다릅니다.** '언젠가 짬나면'은 뇌 입장에서 계획이 아닙니다.
3. **보상이 없습니다.** 쌓이는 게 눈에 안 보이면 뇌는 그 행동의 우선순위를 조용히 내립니다.

습관 연구에서 반복적으로 확인된 구조는 단순합니다. **신호(트리거) → 행동(루틴) → 보상**. 이 세 칸을 채우는 것이 설계의 전부입니다.

<div style="display: flex; justify-content: center; margin: 2rem 0;">
  <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="200" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="200" y="35" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1E293B" text-anchor="middle">습관의 3단 구조</text>
    <circle cx="90" cy="110" r="42" fill="#3B82F6"/>
    <text x="90" y="105" font-family="sans-serif" font-weight="bold" font-size="13" fill="white" text-anchor="middle">신호</text>
    <text x="90" y="122" font-family="sans-serif" font-size="10" fill="#DBEAFE" text-anchor="middle">저녁 양치 후</text>
    <circle cx="200" cy="110" r="42" fill="#10B981"/>
    <text x="200" y="105" font-family="sans-serif" font-weight="bold" font-size="13" fill="white" text-anchor="middle">행동</text>
    <text x="200" y="122" font-family="sans-serif" font-size="10" fill="#D1FAE5" text-anchor="middle">필사 5분</text>
    <circle cx="310" cy="110" r="42" fill="#F59E0B"/>
    <text x="310" y="105" font-family="sans-serif" font-weight="bold" font-size="13" fill="white" text-anchor="middle">보상</text>
    <text x="310" y="122" font-family="sans-serif" font-size="10" fill="#FEF3C7" text-anchor="middle">쌓인 기록 확인</text>
    <path d="M132 110 L158 110 M242 110 L268 110" stroke="#94A3B8" stroke-width="3"/>
    <text x="200" y="180" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">의지가 아니라 이 세 칸을 채우는 것이 습관 설계</text>
  </svg>
</div>

---

## 21일 주차별 플랜

### 1주차 (1~7일): 어이없을 만큼 작게
- **하루 5분, 짧은 시 한 편.** 끝나면 그날은 더 하고 싶어도 멈추세요.
- 핵심은 분량이 아니라 **'매일 했다'는 사실**입니다. 5분이 부담스러운 날은 세 줄만 쳐도 성공으로 칩니다.
- 시간을 고정하세요. "저녁 양치 후" 같은 기존 습관 뒤에 붙이는 게 가장 잘 붙습니다.

### 2주차 (8~14일): 10분으로, 그리고 리듬 타기
- 5분이 싱거워지는 시점이 옵니다. 그때 10분으로 늘립니다. (싱거워지기 전에 늘리면 안 됩니다.)
- 수필이나 소설의 한 단락처럼 호흡이 조금 긴 글로 넘어가 보세요. 타자 리듬과 글의 호흡이 맞아떨어지는 경험이 이 주차의 보상입니다.

### 3주차 (15~21일): 기록을 돌아보는 주
- 분량은 그대로 두고, **일주일치 기록을 돌아보는 시간**을 한 번 가지세요. 내가 어떤 문장을 골랐는지, 타수가 얼마나 변했는지.
- 쌓인 기록을 눈으로 확인하는 순간이 습관 회로의 '보상' 칸을 완성합니다. 여기까지 오면 22일째부터는 설계 없이도 손이 먼저 움직입니다.

---

## 무너졌을 때의 규칙: '이틀 연속'만 피하라

하루 빼먹는 건 사고가 아니라 통계입니다. 21일 중 두세 번은 누구나 빠집니다. 진짜 위험한 건 하루 빼먹은 뒤 "망했네, 다음 달에 다시 시작하자"며 리셋하는 습관입니다.

규칙은 하나면 됩니다. **"이틀 연속으로는 거르지 않는다."** 어제 못 했으면 오늘은 세 줄이라도 칩니다. 습관은 완벽한 연속이 아니라, 끊겨도 다시 잇는 복원력으로 만들어집니다.

---

### 마치며

손글씨 필사든 키보드 필사든, 필사의 본질은 좋은 문장을 내 속도로 통과시키는 경험입니다. 키보드 필사의 장점은 그 모든 기록이 자동으로 쌓이고, 쌓인 만큼이 눈에 보인다는 것. 21일 뒤, 내가 고른 문장들이 목록으로 쌓여 있는 화면을 보는 기분은 직접 경험해 보시길 바랍니다.

<br/>

> **[📖 오늘의 첫 필사, 5분짜리 시 한 편으로 시작하기](/transcription)**
`
  },
  {
    id: "world-typing-records",
    title: "세계에서 가장 빠른 타이피스트는 몇 타를 칠까: 타자 기록의 세계",
    description: "기네스북에 오른 전설의 타이피스트부터 온라인 타자 리더보드의 괴물들까지, 인간 타이핑의 한계치를 정리했습니다.",
    date: "2026-08-07",
    category: "지식",
    keyword: "타자 세계기록, 가장 빠른 타이피스트, 타자 기네스, wpm 기록",
    content: `
# 세계에서 가장 빠른 타이피스트는 몇 타를 칠까: 타자 기록의 세계

타자 속도 테스트를 만들다 보니 자연스럽게 궁금해졌습니다. 인간은 대체 얼마나 빨리 칠 수 있을까? 자료를 파보면 팔수록 상상 이상의 세계가 나옵니다. 오늘은 가볍게 읽는 지식 편으로, 타이핑 기록의 역사를 정리해 봤습니다.

---

## 전설의 기록들

**스텔라 파주나스(Stella Pajunas), 1946년.** IBM 전동 타자기로 **분당 216단어**(WPM)를 기록했습니다. 영문 타자 기준으로 아직도 회자되는 전설적인 수치입니다. 분당 216단어면 1초에 대략 18타를 두드렸다는 계산이 나옵니다.

**바바라 블랙번(Barbara Blackburn).** 기네스북에 '세계에서 가장 빠른 타이피스트'로 올랐던 인물로, 드보락(Dvorak) 자판을 사용해 장시간 평균 150WPM, 순간 최고 **212WPM**을 기록했습니다. 재미있는 건 그가 학창 시절 표준 쿼티(QWERTY) 타자 수업에서는 낙제 수준이었다는 일화입니다. 자판 배열을 바꾸고 인생이 바뀐 셈이죠.

**요즘의 온라인 리더보드.** 타자 연습 사이트들의 상위권에는 200WPM을 넘나드는 젊은 스피드 타이피스트들이 즐비합니다. 대회 형식의 실시간 대결에서 순간 300WPM에 가까운 기록이 나오기도 합니다.

<div style="display: flex; justify-content: center; margin: 2rem 0;">
  <svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="250" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="200" y="32" font-family="sans-serif" font-weight="bold" font-size="16" fill="#1E293B" text-anchor="middle">영문 타자 속도 비교 (WPM)</text>
    <rect x="60" y="180" width="60" height="30" rx="6" fill="#94A3B8"/>
    <text x="90" y="170" font-family="sans-serif" font-weight="bold" font-size="12" fill="#475569" text-anchor="middle">40</text>
    <text x="90" y="228" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">일반인 평균</text>
    <rect x="150" y="135" width="60" height="75" rx="6" fill="#3B82F6"/>
    <text x="180" y="125" font-family="sans-serif" font-weight="bold" font-size="12" fill="#2563EB" text-anchor="middle">80~100</text>
    <text x="180" y="228" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">전문 타이피스트</text>
    <rect x="240" y="90" width="60" height="120" rx="6" fill="#10B981"/>
    <text x="270" y="80" font-family="sans-serif" font-weight="bold" font-size="12" fill="#059669" text-anchor="middle">150+</text>
    <text x="270" y="228" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">블랙번(지속)</text>
    <rect x="330" y="55" width="50" height="155" rx="6" fill="#EF4444"/>
    <text x="355" y="45" font-family="sans-serif" font-weight="bold" font-size="12" fill="#DC2626" text-anchor="middle">216</text>
    <text x="355" y="228" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">파주나스</text>
  </svg>
</div>

---

## WPM과 '타/분'은 다르다: 한글 기록이 따로 없는 이유

여기서 많이들 헷갈리는 지점. 영어권의 WPM(Words Per Minute)은 5글자를 1단어로 치는 단위입니다. 반면 한국에서 쓰는 '타/분'은 **키를 누른 횟수** 기준이라 서로 단순 비교가 안 됩니다.

- 영어 40WPM ≈ 분당 200타 수준
- 영어 216WPM ≈ 분당 1,000타를 넘는 수준

한글은 자음·모음을 조합해 글자를 만드는 구조라, 같은 '분당 500타'라도 완성되는 글자 수는 영어와 다릅니다. 그래서 한글 타자는 국제 기록과 직접 비교하기 어렵고, 공식 세계기록도 영문 기준으로만 관리됩니다. 국내 타자 커뮤니티에서는 **분당 700~800타면 상위 1% 수준, 1,000타는 '괴수'의 영역**으로 통합니다.

---

## 인간의 한계는 어디일까

흥미로운 건 속기사들의 세계입니다. 일반 키보드의 물리적 한계(한 키씩 순서대로 누름)를 넘기 위해, 속기 키보드는 **여러 키를 동시에 눌러 음절 단위로 입력**합니다. 법정 속기사들은 이 방식으로 말하는 속도(분당 300음절 이상)를 실시간으로 받아 적습니다. 즉 '입력 장치가 바뀌면 한계도 바뀐다'는 것이 타이핑 기록사의 결론에 가깝습니다.

일반 키보드 기준으로 보면, 손가락의 물리적 이동과 신경 전달 속도 때문에 대략 300WPM 부근이 이론적 상한선으로 여겨집니다. 전설들의 기록이 200WPM대에 몰려 있는 게 우연이 아닌 셈이죠.

---

### 마치며: 기록보다 재미있는 것

세계기록을 찾아보며 느낀 건, 이 사람들 모두 '기록을 위해' 연습한 게 아니라는 점입니다. 매일 치다 보니 빨라졌고, 빨라지니 재미있어서 더 쳤다는 이야기가 반복됩니다. 당신의 최고 기록은 몇 타인가요? 오늘 한 번 재보고, 한 달 뒤 다시 재보세요. 세계기록보다 내 기록이 갱신되는 쪽이 훨씬 짜릿합니다.

<br/>

> **[⏱️ 1분 타자 테스트로 내 기록 재보기](/test)**
`
  },
  {
    id: "english-typing-gap",
    title: "한타는 빠른데 영타는 느린 이유: 영어 타자 연습 현실 가이드",
    description: "한글 500타를 쳐도 영타만 잡으면 버벅대는 이유를 자판 구조와 어휘 인출의 관점에서 풀고, 영타를 올리는 연습 순서를 정리했습니다.",
    date: "2026-08-08",
    category: "가이드",
    keyword: "영타 연습, 영어 타자, wpm, 영타 속도, 영문 타자 연습",
    content: `
# 한타는 빠른데 영타는 느린 이유: 영어 타자 연습 현실 가이드

한글은 분당 400~500타를 넘게 치는데, 영어만 치면 갑자기 독수리 타법 시절로 돌아가는 기분. 개발자, 대학원생, 해외 업무를 하는 직장인들이 공통으로 겪는 현상입니다. 같은 키보드, 같은 손가락인데 왜 이럴까요? 이유를 알면 연습 방향이 완전히 달라집니다.

---

## 이유 1: 근육 기억은 '언어별로' 저장된다

키 위치는 같지만, 타자 실력의 실체인 **손가락 이동 패턴의 기억은 언어별로 따로** 쌓입니다. 한글 타자가 빠른 건 'ㅎ+ㅏ+ㄴ' 같은 조합 패턴이 수만 번 반복되어 자동화됐기 때문인데, 영어의 조합 패턴(th, ing, tion...)은 그 기억이 거의 비어 있는 상태입니다. 한타 실력이 영타로 이월되지 않는 게 정상입니다.

## 이유 2: 두벌식의 좌우 리듬 vs 영어의 불규칙 리듬

두벌식 자판은 **왼손 = 자음, 오른손 = 모음**으로 설계되어 있습니다. 한글은 자음과 모음이 거의 번갈아 나오므로, 치다 보면 좌우 손이 왕복하는 리듬이 저절로 생깁니다. 드럼처럼 규칙적인 박자가 나오는 구조죠.

영어는 다릅니다. 'strength'처럼 자음이 다섯 개 연속되기도 하고, 한 손에 몰린 단어(예: 왼손만 쓰는 'address')도 많습니다. 리듬이 불규칙하니 한글에서 쓰던 몸의 박자가 통하지 않는 겁니다.

<div style="display: flex; justify-content: center; margin: 2rem 0;">
  <svg width="400" height="230" viewBox="0 0 400 230" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="230" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <text x="200" y="32" font-family="sans-serif" font-weight="bold" font-size="15" fill="#1E293B" text-anchor="middle">한글 vs 영어: 좌우 손 사용 리듬</text>
    <text x="55" y="80" font-family="sans-serif" font-weight="bold" font-size="12" fill="#3B82F6" text-anchor="end">한글</text>
    <circle cx="90" cy="75" r="10" fill="#3B82F6"/><circle cx="120" cy="75" r="10" fill="#10B981"/><circle cx="150" cy="75" r="10" fill="#3B82F6"/><circle cx="180" cy="75" r="10" fill="#10B981"/><circle cx="210" cy="75" r="10" fill="#3B82F6"/><circle cx="240" cy="75" r="10" fill="#10B981"/><circle cx="270" cy="75" r="10" fill="#3B82F6"/><circle cx="300" cy="75" r="10" fill="#10B981"/>
    <text x="330" y="80" font-family="sans-serif" font-size="10" fill="#64748B">규칙적</text>
    <text x="55" y="130" font-family="sans-serif" font-weight="bold" font-size="12" fill="#EF4444" text-anchor="end">영어</text>
    <circle cx="90" cy="125" r="10" fill="#3B82F6"/><circle cx="120" cy="125" r="10" fill="#3B82F6"/><circle cx="150" cy="125" r="10" fill="#3B82F6"/><circle cx="180" cy="125" r="10" fill="#10B981"/><circle cx="210" cy="125" r="10" fill="#3B82F6"/><circle cx="240" cy="125" r="10" fill="#10B981"/><circle cx="270" cy="125" r="10" fill="#10B981"/><circle cx="300" cy="125" r="10" fill="#3B82F6"/>
    <text x="330" y="130" font-family="sans-serif" font-size="10" fill="#64748B">불규칙</text>
    <text x="115" y="170" font-family="sans-serif" font-size="11" fill="#3B82F6">● 왼손</text>
    <text x="185" y="170" font-family="sans-serif" font-size="11" fill="#10B981">● 오른손</text>
    <text x="200" y="205" font-family="sans-serif" font-size="11" fill="#64748B" text-anchor="middle">두벌식의 좌우 교대 리듬이 영어에선 사라진다</text>
  </svg>
</div>

## 이유 3: 타자 문제가 아니라 '스펠링 인출' 문제

의외로 가장 큰 병목은 손이 아니라 머리에 있습니다. 한글은 소리 나는 대로 조합하면 되지만, 영어는 치는 도중에 철자를 떠올려야 합니다. 'necessary'의 c와 s가 몇 개였는지 0.5초 머뭇거리는 순간, 타자 리듬은 이미 끊겨 있습니다. 영타가 느린 사람의 상당수는 타자 연습이 아니라 **자주 쓰는 단어의 철자 자동화**가 필요한 상태입니다.

---

## 영타 올리는 현실적인 연습 순서

1. **고빈도 단어 100개부터.** the, and, that, with, from... 영어 문장의 절반은 상위 100개 단어로 이루어져 있습니다. 이 단어들만 반사적으로 나가도 체감 속도가 확 뜁니다.
2. **자주 치는 연결 패턴 익히기.** -ing, -tion, -ment, th-, wh- 같은 덩어리를 묶어서 반복하세요. 영어권 타이피스트들이 실제로 쓰는 방법입니다.
3. **내 분야의 문장으로 연습하기.** 개발자라면 코드와 변수명, 직장인이라면 이메일 상용구(Thank you for..., Please find attached...)처럼 실제로 칠 문장이 최고의 교재입니다.
4. **기준은 WPM으로.** 영타는 40WPM이면 평균, 60WPM이면 업무에 막힘이 없는 수준, 80WPM 이상이면 상급입니다. 한글 타수와 별개의 지표로 관리하세요.

---

### 마치며

영타는 한타의 연장선이 아니라 사실상 새로운 악기 하나를 배우는 일입니다. 다행인 건 이미 한타로 '타자 배우는 법'을 한 번 겪어봤다는 것. 홈포지션도, 정확도 우선 원칙도, 매일 조금씩의 힘도 전부 그대로 통합니다. 두 번째 악기는 언제나 첫 번째보다 빨리 늡니다.

<br/>

> **[⏱️ 먼저 내 한글 타수부터 측정해 보기](/test)**
`
  }
];

export const stubPosts = [];