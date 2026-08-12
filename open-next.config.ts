import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// KV 무료 한도(쓰기 1천/일)로는 ISR revalidate 주기를 못 버텨 R2로 전환.
// 바인딩은 wrangler.jsonc의 r2_buckets — NEXT_INC_CACHE_R2_BUCKET.
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
  // updateTag("books") 동작에 필수 — 없으면 어드민 책 발행이 revalidate 주기까지 반영 안 됨
  tagCache: d1NextTagCache,
  // 시간 기반 revalidate 백그라운드 재생성에 필수 (메모리 큐는 dev 전용)
  queue: doQueue,
  // 캐시 히트 시 NextServer 부팅을 생략해 CPU 시간 절약.
  // ISR 페이지에서 헤더/리디렉션 이상이 보이면 이 옵션을 먼저 꺼서 확인할 것.
  enableCacheInterception: true,
});
