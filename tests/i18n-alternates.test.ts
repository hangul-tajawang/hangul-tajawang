import * as assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { localeAlternates } from "../lib/i18n/alternates";
import {
  BASE_URL,
  LOCALIZED_KO_PATHS,
  koToEnPath,
  enToKoPath,
  switchLocaleHref,
} from "../lib/i18n/routes";

// hreflang은 한쪽이라도 어긋나면 양방향 모두 무효가 되므로,
// ko/en 페이지가 공유하는 helper의 상호참조를 회귀 테스트로 고정한다.

test("ko와 en의 hreflang alternates가 정확히 상호참조한다", () => {
  for (const koPath of LOCALIZED_KO_PATHS) {
    const ko = localeAlternates(koPath, "ko");
    const en = localeAlternates(koPath, "en");

    // 두 언어 페이지가 완전히 같은 languages 집합을 선언해야 상호참조가 성립
    assert.deepEqual(ko.languages, en.languages, `languages mismatch: ${koPath}`);

    const langs = ko.languages as Record<string, string>;
    // canonical은 각 언어가 자기 자신
    assert.equal(ko.canonical, langs.ko, `ko canonical != ko hreflang: ${koPath}`);
    assert.equal(en.canonical, langs.en, `en canonical != en hreflang: ${koPath}`);
    // x-default는 한국어 원본
    assert.equal(langs["x-default"], langs.ko, `x-default must be ko: ${koPath}`);
    // en URL은 /en 프리픽스
    assert.ok(langs.en.startsWith(`${BASE_URL}/en`), `en url prefix: ${langs.en}`);
  }
});

test("한국어 canonical은 기존 값과 동일하다 (홈은 트레일링 슬래시 없는 BASE_URL)", () => {
  assert.equal(localeAlternates("/", "ko").canonical, "https://www.hangul-tajawang.com");
  assert.equal(localeAlternates("/test", "ko").canonical, "https://www.hangul-tajawang.com/test");
  assert.equal(
    localeAlternates("/game/acid-rain", "ko").canonical,
    "https://www.hangul-tajawang.com/game/acid-rain",
  );
});

test("경로 변환은 왕복 손실이 없다", () => {
  for (const koPath of LOCALIZED_KO_PATHS) {
    assert.equal(enToKoPath(koToEnPath(koPath)), koPath);
  }
});

test("언어 선택기는 대응 페이지로, 대응이 없으면 상대 언어 홈으로 보낸다", () => {
  assert.equal(switchLocaleHref("/test"), "/en/test");
  assert.equal(switchLocaleHref("/en/test"), "/test");
  assert.equal(switchLocaleHref("/"), "/en");
  assert.equal(switchLocaleHref("/en"), "/");
  // 대응 en 페이지가 없는 한국어 페이지 → en 홈
  assert.equal(switchLocaleHref("/transcription"), "/en");
  assert.equal(switchLocaleHref("/blog/some-post"), "/en");
});

test("LOCALIZED_KO_PATHS의 모든 항목에 실제 en 페이지 파일이 존재한다", () => {
  const appDir = join(__dirname, "..", "app");
  for (const koPath of LOCALIZED_KO_PATHS) {
    const enPagePath = join(appDir, koToEnPath(koPath).slice(1), "page.tsx");
    assert.ok(existsSync(enPagePath), `missing en page: ${enPagePath}`);
    // ko 원본도 존재해야 hreflang이 유효
    const koPagePath = join(appDir, koPath === "/" ? "" : koPath.slice(1), "page.tsx");
    assert.ok(existsSync(koPagePath), `missing ko page: ${koPagePath}`);
  }
});
