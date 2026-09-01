import type { Metadata } from 'next';
import { BASE_URL, koToEnPath, type Locale } from './routes';

/**
 * ko ↔ en hreflang 상호참조 + 자기 자신 canonical을 한 곳에서 생성한다.
 * 양쪽 페이지가 같은 helper를 쓰므로 상호참조가 어긋날 수 없다.
 *
 * - canonical: 각 언어가 자기 자신을 가리킨다 (/en/x의 canonical은 /en/x)
 * - x-default: 한국어 원본
 * - 홈('/')의 한국어 URL은 기존 canonical과 동일하게 트레일링 슬래시 없는 BASE_URL을 유지한다.
 */
export function localeAlternates(koPath: string, locale: Locale): NonNullable<Metadata['alternates']> {
  const koUrl = koPath === '/' ? BASE_URL : `${BASE_URL}${koPath}`;
  const enUrl = `${BASE_URL}${koToEnPath(koPath)}`;
  return {
    canonical: locale === 'ko' ? koUrl : enUrl,
    languages: {
      ko: koUrl,
      en: enUrl,
      'x-default': koUrl,
    },
  };
}
