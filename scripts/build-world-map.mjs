#!/usr/bin/env node
/**
 * 세계지도 정적 데이터 생성 스크립트 (1회성 — 산출물을 커밋한다)
 *
 * world-atlas의 countries-110m.json(Natural Earth 파생, 퍼블릭 도메인)을
 * geoNaturalEarth1 투영으로 SVG 패스화해 public/journey/world-map.json 으로 출력.
 * 런타임에는 d3/topojson이 전혀 필요 없다 — 클라이언트는 이 JSON의 path만 그린다.
 *
 * 사용법: npm run map:build
 * 출력: { viewBox, countries: [{ code(alpha-2 소문자), d, bbox:[x,y,w,h] }] }
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as topojson from 'topojson-client';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import iso from 'iso-3166-1';

const require = createRequire(import.meta.url);
const topoPath = require.resolve('world-atlas/countries-110m.json');
const topo = JSON.parse(readFileSync(topoPath, 'utf8'));

const WIDTH = 1000;
const HEIGHT = 520;

const geo = topojson.feature(topo, topo.objects.countries);
const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], geo);
const path = geoPath(projection);

// 좌표 소수 1자리 반올림으로 용량 축소
const round1 = (d) => d.replace(/(\d+\.\d+)/g, (m) => Number(m).toFixed(1));

const countries = [];
const unmapped = [];
for (const feature of geo.features) {
  const numeric = String(feature.id).padStart(3, '0');
  const rec = iso.whereNumeric(numeric);
  if (!rec) {
    unmapped.push(`${numeric} (${feature.properties?.name})`);
    continue;
  }
  const d = path(feature);
  if (!d) continue;
  const [[x0, y0], [x1, y1]] = path.bounds(feature);
  countries.push({
    code: rec.alpha2.toLowerCase(),
    d: round1(d),
    bbox: [x0, y0, x1 - x0, y1 - y0].map((v) => Number(v.toFixed(1))),
  });
}

countries.sort((a, b) => a.code.localeCompare(b.code));

const out = { viewBox: `0 0 ${WIDTH} ${HEIGHT}`, countries };
mkdirSync('public/journey', { recursive: true });
writeFileSync('public/journey/world-map.json', JSON.stringify(out));

const bytes = JSON.stringify(out).length;
console.log(`✅ ${countries.length}개국 → public/journey/world-map.json (${(bytes / 1024).toFixed(0)}KB)`);
if (unmapped.length) console.log(`⚠️ ISO 매핑 실패 (제외됨): ${unmapped.join(', ')}`);
console.log('코드 목록:', countries.map((c) => c.code).join(','));
