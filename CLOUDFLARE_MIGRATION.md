# Cloudflare Workers 이전 — 진행 상황 & 남은 작업

> 2026-08-05 기준. Vercel Hobby가 상업 사용(AdSense) 금지라 Cloudflare Workers로 이전 중.
> **실서비스(hangul-tajawang.com)는 아직 Vercel에서 서빙 중** — 아래 "DNS 커토버" 전까지 무영향.

## ✅ 완료됨

- 코드 세팅 전체: `wrangler.jsonc`, `open-next.config.ts`, `next.config.ts`(initOpenNextCloudflareForDev), `middleware.ts`(cf-connecting-ip 보안 수정), `package.json` 스크립트, `.dev.vars`
- Next `16.1.6 → 16.3.0` 업그레이드 (어댑터가 16.2.11+ 요구) — `npm run dev` 전 라우트 테스트 통과
- 회사 계정(bluecomms.ailab@gmail.com, Account ID `ded3e2c2...`) wrangler 로그인 + 이메일 인증
- D1 `hangul-tajawang-tag-cache` (id `4903cc22-1776-4e17-ae0c-c92cb8d345a8`) + `revalidations` 테이블 — updateTag("books")용
- KV `NEXT_INC_CACHE_KV` (id `9b9f453e938048cdb0bb97c2e1a4368a`) — ISR 페이지 캐시 (R2 대신 임시, 아래 참조)
- **첫 배포 성공** — 번들 gzip 2.34MB (무료 3MB 제한 내), 정적 파일 1,700개, 바인딩 전부 연결
  - 테스트 주소: https://hangul-tajawang.hangul-tajawang.workers.dev
- **시크릿 4개 등록 완료** (SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAILS, ADMIN_ALLOWED_IPS, KAKAO_PLATFORM_APP_KEY)
  - 확인 위치: 대시보드 → Workers & Pages → hangul-tajawang → Settings → Variables and Secrets

> **R2 대신 KV를 쓰는 이유**: R2는 카드 등록(본인확인)이 필요한데 대표님 출장으로 보류.
> KV 무료 한도: 읽기 10만/일, **쓰기 1천/일**, 1GB. 트래픽 늘면 R2 전환 필요 — 절차는 맨 아래.

## 🔜 남은 작업 (순서대로)

### 1. workers.dev SSL 인증서 대기 ⏳

서브도메인을 방금 만들어서 인증서 발급 중 (보통 수 분~1시간). 발급 전엔 테스트 주소 접속 시 TLS 에러가 정상.
확인: `curl -sI https://hangul-tajawang.hangul-tajawang.workers.dev/` 가 200 나오면 준비 완료.

### 2. workers.dev에서 검증

- [ ] 홈, `/books`, `/transcription`, `/journey/joseon-kings` 등 렌더 + 없는 slug 404
- [ ] `/feed.xml`, `/sitemap.xml`, `/robots.txt`, `/ads.txt` 200
- [ ] `/practice/short/kpop` → 301 → `/practice/short/proverb`
- [ ] 브라우저로 접속해 화면·게임·타자 연습 동작 확인
- [ ] `/adminsangwon`: 허용 IP만 접근, 그 외 404 (cf-connecting-ip 검증)
- [ ] 어드민 책 저장 → 목록 즉시 반영 (updateTag/D1)
- [ ] `revalidate: 60` 페이지 60초 후 갱신 (DO 큐)
- ⚠️ **카카오 로그인은 workers.dev에서 테스트 불가** — Supabase 리디렉션 허용 목록이 실도메인 기준. 도메인이 같아지는 커토버 후 자동 정상화되므로 커토버 직후 확인 항목.
- 로그 실시간 보기: `npx wrangler tail hangul-tajawang`

### 3. git 커밋 & 푸시

변경 파일 전부 Vercel 호환이라 푸시해도 실서비스 안전. (Vercel이 자동 재배포하지만 동작 동일)

### 4. DNS 커토버 (트래픽 전환의 순간 — 대시보드 작업)

**"커토버(cutover)" = 도메인 주소가 가리키는 서버를 Vercel → Cloudflare로 바꿔치기하는 것.**
사용자 입장에선 주소(hangul-tajawang.com) 그대로인데, 그 주소로 찾아가는 곳만 바뀜. 순서:

1. Cloudflare 대시보드 → Add a site → `hangul-tajawang.com` (Free 플랜) → 기존 DNS 레코드 자동 임포트
2. 도메인 구입한 곳(등록기관)에서 **네임서버**를 Cloudflare가 알려주는 2개로 변경
   - 네임서버 = "이 도메인의 주소록을 누가 관리하나". 전파되는 동안(수 분~수 시간)에도 기존 주소록(Vercel 향)이 그대로 쓰여서 **무중단**
3. Cloudflare에서 zone 활성화 확인 후: Workers & Pages → hangul-tajawang → Settings → **Domains & Routes** → Custom Domain으로 `www.hangul-tajawang.com` 과 `hangul-tajawang.com` **둘 다** 추가
   - **이 3번을 하는 순간부터 실사용자가 Cloudflare 워커로 접속함** (= 진짜 전환 시점)
4. Supabase/카카오 OAuth 설정 변경 불필요 (도메인이 안 바뀌므로)

### 5. 커토버 직후 확인

- [ ] `https://www.hangul-tajawang.com` 정상 + `hangul-tajawang.com` → www 301
- [ ] **카카오 로그인** → `/auth/callback` → `/mypage`
- [ ] **AdSense 광고 표시** + `/ads.txt` 200 (이전의 목적!)
- [ ] 어드민 접근/책 발행, 2번 체크리스트 재확인
- [ ] `npm run test:mobile` (Playwright)

### 6. 마무리 (커토버 48시간 후)

- 문제없으면: Vercel 프로젝트에서 도메인 제거 + 자동 배포 중지 (또는 프로젝트 삭제)
- **롤백이 필요하면**: Cloudflare DNS에서 워커 커스텀 도메인 제거 → `www` CNAME을 `cname.vercel-dns.com`으로 복원 (수 분 소요, 코드 리버트 불필요)

## 📌 나중에 할 것 (급하지 않음)

### KV → R2 전환 (대표님 복귀 후 — 트래픽 늘면 필수)

1. 대시보드에서 R2 활성화 (카드 등록 필요, 무료 한도 10GB/쓰기 100만/읽기 1000만이라 실과금 $0)
2. `npx wrangler r2 bucket create hangul-tajawang-inc-cache`
3. `wrangler.jsonc`: `kv_namespaces` 블록 → 주석 처리된 `r2_buckets` 블록으로 교체
4. `open-next.config.ts`: `kvIncrementalCache` → `r2IncrementalCache` (파일 내 주석 참조)
5. `npm run deploy`

### 기타

- **Workers Builds git 연동** — push 시 자동 배포 (지금은 `npm run deploy` 수동). 대시보드에서 연결, 빌드 `npx opennextjs-cloudflare build`, 배포 `npx opennextjs-cloudflare deploy`, 빌드 env에 `NEXT_PUBLIC_*` 2개
- Next 16.3 middleware→proxy 마이그레이션: `npx @next/codemod@canary middleware-to-proxy .` (경고만 뜨는 수준)
- Next 16.3이 자동 생성한 `AGENTS.md`/`CLAUDE.md` — 유지 or `next.config.ts`에 `agentRules: false`
- 워커 번들이 3MB(gzip) 근접하면 Workers Paid $5/월 (현재 2.34MB)

## 문제 발생 시 1차 스위치

- ISR 페이지 헤더/리디렉션 이상 → `open-next.config.ts` `enableCacheInterception: false` 후 재배포
- updateTag 미동작 → D1 `revalidations` 테이블 확인, 폴백은 `actions.ts`의 `revalidateTag("books")`
- 페이지가 오래 stale → KV 쓰기 한도(1천/일) 소진 가능성 → R2 전환
