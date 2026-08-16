// 성문방어 게임용 경량 Web Audio 사운드 매니저.
// - AudioContext는 첫 사용자 제스처(방어 시작 버튼)에서 생성/resume (브라우저 자동재생 정책)
// - 짧은 효과음은 m4a 버퍼로, 키스트로크 틱/팡파레는 오실레이터 합성(용량 0)
// - 뮤트 상태는 localStorage에 영속

const MUTE_KEY = "cd_muted";
const ASSET_BASE = "/game/castle-defense";

export type SoundName = "shoot" | "hit" | "kill" | "gate_hit";

const SOUND_FILES: Record<SoundName, string> = {
  shoot: `${ASSET_BASE}/shoot.m4a`,
  hit: `${ASSET_BASE}/hit.m4a`,
  kill: `${ASSET_BASE}/kill.m4a`,
  gate_hit: `${ASSET_BASE}/gate_hit.m4a`,
};

interface PlayOptions {
  pitch?: number; // playbackRate 배수 (1 = 원음)
  volume?: number; // 0~1
}

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private buffers = new Map<SoundName, AudioBuffer>();
  private loading = false;
  private loaded = false;
  private mutedValue = false;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.mutedValue = window.localStorage.getItem(MUTE_KEY) === "1";
      } catch {
        this.mutedValue = false;
      }
    }
  }

  get muted() {
    return this.mutedValue;
  }

  setMuted(value: boolean) {
    this.mutedValue = value;
    try {
      window.localStorage.setItem(MUTE_KEY, value ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(value ? 0 : 1, this.ctx.currentTime, 0.01);
    }
  }

  toggleMuted() {
    this.setMuted(!this.mutedValue);
    return this.mutedValue;
  }

  // AudioContext만 생성/재개 (버퍼 프리로드 없음). 첫 사용자 제스처에서 호출.
  private ensureContext() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.mutedValue ? 0 : 1;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  // 성문방어용: 컨텍스트 + m4a 버퍼 프리로드
  init() {
    this.ensureContext();
    if (this.ctx && !this.loaded && !this.loading) void this.preload();
  }

  // 합성음만 쓰는 게임용(글자 계단 등): 컨텍스트만 준비
  initSynth() {
    this.ensureContext();
  }

  private async preload() {
    if (!this.ctx) return;
    this.loading = true;
    const entries = Object.entries(SOUND_FILES) as [SoundName, string][];
    await Promise.all(
      entries.map(async ([name, url]) => {
        try {
          const res = await fetch(url);
          const arr = await res.arrayBuffer();
          const buf = await this.ctx!.decodeAudioData(arr);
          this.buffers.set(name, buf);
        } catch {
          // 사운드는 부가기능 — 실패해도 게임은 진행
        }
      }),
    );
    this.loading = false;
    this.loaded = true;
  }

  play(name: SoundName, opts: PlayOptions = {}) {
    if (this.mutedValue || !this.ctx || !this.masterGain) return;
    const buffer = this.buffers.get(name);
    if (!buffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = opts.pitch ?? 1;
    const gain = this.ctx.createGain();
    gain.gain.value = opts.volume ?? 1;
    src.connect(gain).connect(this.masterGain);
    src.start();
  }

  // 범용 합성 톤 1발 (용량 0)
  blip({ freq = 660, type = "square", dur = 0.08, vol = 0.08, slideTo }: { freq?: number; type?: OscillatorType; dur?: number; vol?: number; slideTo?: number } = {}) {
    if (this.mutedValue || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), now + dur);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  // 오실레이터 합성 키스트로크 틱 (용량 0)
  tick() {
    this.blip({ freq: 660 + Math.random() * 120, type: "square", dur: 0.05, vol: 0.06 });
  }

  // ── 글자 계단 전용 합성 효과음 ──
  step() {
    // 한 칸 오를 때 짧은 상승 블립 (콤보 강도로 피치 상승)
    this.blip({ freq: 520, type: "triangle", dur: 0.09, vol: 0.09, slideTo: 760 });
  }
  jump() {
    this.blip({ freq: 300, type: "square", dur: 0.12, vol: 0.08, slideTo: 620 });
  }
  land() {
    this.blip({ freq: 200, type: "sine", dur: 0.1, vol: 0.09, slideTo: 90 });
  }
  milestone() {
    // 10칸 단위 등 구간 달성 짧은 2음
    if (this.mutedValue || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    [660, 990].forEach((f, i) => {
      const t = now + i * 0.08;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = "triangle";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(gain).connect(this.masterGain!);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  // 웨이브 클리어 팡파레 (상승 3음 아르페지오)
  fanfare() {
    if (this.mutedValue || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const t = now + i * 0.09;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      osc.connect(gain).connect(this.masterGain!);
      osc.start(t);
      osc.stop(t + 0.24);
    });
  }

  // 성문 붕괴 등 낮은 임팩트음
  thud() {
    if (this.mutedValue || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.36);
  }
}

export const sound = new SoundManager();
