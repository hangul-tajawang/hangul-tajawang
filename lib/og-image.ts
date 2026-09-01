const SITE = 'https://www.hangul-tajawang.com';

/**
 * 소셜 공유 썸네일(og:image)용 URL.
 *
 * 본문에 쓰는 표지는 Supabase 캐시 이그레스를 줄이려고 400px로 줄여 두었다.
 * 그런데 같은 파일을 og:image로 쓰면 카카오톡 공유 썸네일까지 작아지므로,
 * 표지에 한해 같은 이름의 800px 변형(`-og`)을 따로 올려 두고 여기서만 가리킨다.
 * og:image는 스크래퍼만 받아가서 요청 수가 적으므로 파일이 커도 이그레스에 거의 영향이 없다.
 *
 * `-og` 변형은 업로드 시 본문용과 함께 올린다(둘 중 하나라도 실패하면 저장이 실패한다).
 * 표지가 아닌 이미지(작가 사진 등)는 변형이 없으므로 원본 URL을 그대로 절대경로화만 한다.
 */
export function ogImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const abs = url.startsWith('/') ? `${SITE}${url}` : url;
  return abs.replace(/(\/covers\/[^/?]+)\.(webp|jpg|jpeg|png)(\?|$)/, '$1-og.$2$3');
}

/** 표지 본문용 경로에서 og 변형 경로를 만든다 (업로드 측과 규칙을 공유한다). */
export function toOgPath(path: string): string {
  return path.replace(/\.(webp|jpg|jpeg|png)$/, '-og.$1');
}
