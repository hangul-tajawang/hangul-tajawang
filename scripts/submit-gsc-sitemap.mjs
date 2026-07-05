#!/usr/bin/env node
/**
 * Google Search Console 사이트맵 제출 스크립트 (의존성 없음, Node 18+)
 *
 * 구글은 IndexNow를 지원하지 않고, 일반 페이지용 Indexing API도 없습니다.
 * (Indexing API는 채용공고/라이브방송 페이지 전용 — 일반 사이트에 쓰면 정책 위반)
 * 구글에 대한 공식적인 자동화 방법은 "Search Console API로 사이트맵 제출"입니다.
 *
 * ── 1회성 사전 준비 (사람이 직접 해야 함) ──────────────────────────────
 * 1. https://search.google.com/search-console 에서 사이트 소유권 확인
 *    (이미 layout.tsx에 GSC 연동 이력이 있다면 완료된 상태)
 * 2. Google Cloud Console → 프로젝트 생성 → "Google Search Console API" 사용 설정
 * 3. 서비스 계정 생성 → JSON 키 다운로드
 * 4. Search Console → 설정 → 사용자 및 권한 → 서비스 계정 이메일을 '소유자'로 추가
 * 5. 키 파일 경로를 환경변수로 지정: export GSC_KEY_FILE=./gsc-service-account.json
 *    (⚠️ 키 파일은 절대 git에 커밋하지 말 것 — .gitignore에 추가되어 있음)
 *
 * 사용법:
 *   GSC_KEY_FILE=./gsc-service-account.json node scripts/submit-gsc-sitemap.mjs
 */

import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';

const SITE_URL = 'https://www.hangul-tajawang.com/'; // GSC에 등록된 속성 URL
const SITEMAP = 'https://www.hangul-tajawang.com/sitemap.xml';

const keyFile = process.env.GSC_KEY_FILE;
if (!keyFile) {
  console.error('환경변수 GSC_KEY_FILE에 서비스 계정 JSON 키 경로를 지정하세요.');
  console.error('예: GSC_KEY_FILE=./gsc-service-account.json node scripts/submit-gsc-sitemap.mjs');
  process.exit(1);
}

const sa = JSON.parse(readFileSync(keyFile, 'utf8'));

// ── 서비스 계정 JWT 생성 → 액세스 토큰 교환 ──────────────────────────────
function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const signature = signer.sign(sa.private_key, 'base64url');
  const jwt = `${header}.${claims}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`토큰 발급 실패: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps/${encodeURIComponent(SITEMAP)}`;

  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 200 || res.status === 204) {
    console.log('✅ 구글 서치콘솔에 사이트맵 제출 완료:', SITEMAP);
  } else {
    console.error(`❌ 제출 실패 (${res.status}):`, await res.text());
    console.error('서비스 계정이 GSC 속성에 "소유자"로 추가되어 있는지 확인하세요.');
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
