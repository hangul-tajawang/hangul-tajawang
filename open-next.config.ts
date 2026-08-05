import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// R2가 정석이지만 카드 등록(본인확인) 전이라 KV 사용 중.
// R2 활성화 후: kvIncrementalCache → r2IncrementalCache로 교체 + wrangler.jsonc의 kv_namespaces → r2_buckets.
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(kvIncrementalCache, { mode: "long-lived" }),
  // updateTag("books") 동작에 필수 — 없으면 어드민 책 발행이 revalidate 주기까지 반영 안 됨
  tagCache: d1NextTagCache,
  // 시간 기반 revalidate 백그라운드 재생성에 필수 (메모리 큐는 dev 전용)
  queue: doQueue,
  // 캐시 히트 시 NextServer 부팅을 생략해 CPU 시간 절약.
  // ISR 페이지에서 헤더/리디렉션 이상이 보이면 이 옵션을 먼저 꺼서 확인할 것.
  enableCacheInterception: true,
});
