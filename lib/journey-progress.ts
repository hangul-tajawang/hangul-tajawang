/**
 * 지식 여정 — 진행 기록 저장소 (localStorage 기반)
 *
 * pilsa-library와 같은 원칙: v1은 기기 로컬 저장(비로그인 포함 전원 동작),
 * 서버 동기화는 이 모듈의 API 뒤에 붙이는 것을 전제로 설계.
 */

export interface JourneyCompletion {
  date: string; // ISO
  kpm: number;
  accuracy: number;
  seconds: number;
}

/** 이어하기용 진행 스냅샷 */
export interface JourneySnapshot {
  stationIndex: number;
  phase: 'traveling' | 'arrived';
  accStrokes: number;
  completedTargets: number;
  mistakes: number;
  elapsedSeconds: number;
  updatedAt: string;
  /** shuffle 코스의 출제 순서(스테이션 id) — 이어가기 시 같은 순서 복원 */
  order?: string[];
}

export interface JourneyRecord {
  courseId: string;
  completions: JourneyCompletion[];
  progress?: JourneySnapshot;
}

const STORAGE_KEY = 'tajawang_journey_v1';

function loadDb(): Record<string, JourneyRecord> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveDb(db: Record<string, JourneyRecord>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* 저장 공간 부족 등은 조용히 무시 */
  }
}

export function getJourneyRecord(courseId: string): JourneyRecord | null {
  return loadDb()[courseId] || null;
}

/** 역 통과마다 호출 — 출발 직후(0역 통과)는 노이즈라 저장하지 않음 */
export function saveJourneySnapshot(courseId: string, snapshot: JourneySnapshot) {
  if (snapshot.stationIndex < 1) return;
  const db = loadDb();
  const existing = db[courseId];
  db[courseId] = {
    courseId,
    completions: existing?.completions || [],
    progress: snapshot,
  };
  saveDb(db);
}

/** 완주 기록 — 재완주 시 누적 */
export function recordJourneyCompletion(courseId: string, completion: JourneyCompletion) {
  const db = loadDb();
  const existing = db[courseId];
  db[courseId] = {
    courseId,
    completions: [...(existing?.completions || []), completion],
    progress: undefined, // 완주했으니 스냅샷 제거
  };
  saveDb(db);
}

export function clearJourneySnapshot(courseId: string) {
  const db = loadDb();
  const record = db[courseId];
  if (!record) return;
  if (record.completions.length === 0) {
    delete db[courseId];
  } else {
    record.progress = undefined;
  }
  saveDb(db);
}

/** 허브 카드용 요약: 코스별 완주 횟수·최고 타수·이어하기 위치 */
export function getJourneySummary(): Record<
  string,
  { completions: number; bestKpm: number; resumeStation: number | null }
> {
  const db = loadDb();
  const summary: Record<string, { completions: number; bestKpm: number; resumeStation: number | null }> = {};
  for (const record of Object.values(db)) {
    summary[record.courseId] = {
      completions: record.completions.length,
      bestKpm: Math.max(0, ...record.completions.map((c) => c.kpm)),
      resumeStation: record.progress ? record.progress.stationIndex : null,
    };
  }
  return summary;
}
