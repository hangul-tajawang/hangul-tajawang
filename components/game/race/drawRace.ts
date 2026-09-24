/**
 * 타자 레이스 렌더러 — 옆에서 따라가는 중계 카메라 (Canvas 2D).
 *
 * 캐릭터 스프라이트(Pixel Frog, CC0)가 모두 옆모습이라,
 * 내 캐릭터를 화면 왼쪽 1/3에 고정하고 세상을 뒤로 흘려보낸다.
 * 배경은 여러 겹(하늘·산·관중석·울타리·앞 잔디)이 서로 다른 속도로 흐르는 패럴랙스.
 * 거리 단위는 "타" — 1타 = PPS 픽셀.
 */

export interface RaceSprite {
  img: HTMLImageElement | null;
  frameW: number;
  frameH: number;
  frames: number;
  flip: boolean;
}

export interface RaceFrameRunner {
  sprite: RaceSprite;
  label: string;
  lane: number;
  color: string;
  /** 내 위치 기준 상대 거리(타). +면 앞 */
  rel: number;
  cpm: number;
  flying?: boolean;
}

export interface RaceFrame {
  pos: number;
  /** 내 현재 속도(타/초) */
  speed: number;
  time: number;
  distance: number;
  /** 레인 수 */
  lanes: number;
  player: { sprite: RaceSprite; lane: number; stumbling: boolean; label: string; stumbleLabel: string };
  runners: RaceFrameRunner[];
  /** 앞/뒤 화면 밖 표시 문구 */
  aheadLabel: (rel: number) => string;
  behindLabel: (rel: number) => string;
}

function drawSprite(ctx: CanvasRenderingContext2D, s: RaceSprite, frame: number, x: number, footY: number, scale: number) {
  if (!s.img || !s.img.complete || s.img.naturalWidth === 0) return;
  const w = s.frameW * scale;
  const h = s.frameH * scale;
  const flip = s.flip;
  ctx.save();
  // (x, footY)가 발밑 가운데 — 가운데 기준으로 좌우 반전
  ctx.translate(x, footY - h);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(s.img, (frame % s.frames) * s.frameW, 0, s.frameW, s.frameH, -w / 2, 0, w, h);
  ctx.restore();
}

export function drawRace(ctx: CanvasRenderingContext2D, W: number, H: number, f: RaceFrame) {
  ctx.imageSmoothingEnabled = false;
  const PPS = Math.max(W, 520) / 115; // 1타당 픽셀 — 화면에 약 40타 뒤 ~ 75타 앞
  const playerX = W * 0.34;
  const cam = f.pos * PPS;
  const worldX = (d: number) => playerX + (d - f.pos) * PPS;

  const horizon = H * 0.42;
  const LANES = f.lanes;
  const trackTop = H * 0.52;
  const trackBottom = H * 0.97;
  const laneH = (trackBottom - trackTop) / LANES;
  const laneFoot = (lane: number) => trackTop + laneH * (lane + 0.85);
  // 뒤 레인일수록 작게 (원근감)
  const laneScale = (lane: number) => 0.78 + (lane / Math.max(1, LANES - 1)) * 0.34;
  const unit = Math.min(H * 0.0036, W * 0.005); // 스프라이트 1픽셀 크기

  // ── 하늘 ──
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#38bdf8");
  sky.addColorStop(1, "#e0f2fe");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, horizon + 2);
  ctx.fillStyle = "rgba(254,240,138,0.9)";
  ctx.beginPath();
  ctx.arc(W * 0.82, H * 0.12, H * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // 구름 (아주 천천히)
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  for (let i = 0; i < 6; i++) {
    const span = W + 240;
    const x = ((((i * 211 - cam * 0.05 - f.time * 8) % span) + span) % span) - 120;
    const y = H * (0.07 + 0.05 * (i % 3));
    const r = H * 0.025;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.arc(x + r, y - r * 0.5, r * 1.25, 0, Math.PI * 2);
    ctx.arc(x + r * 2.1, y, r * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }

  // 먼 산 (패럴랙스 0.1)
  const mountains = (factor: number, base: number, amp: number, color: string, period: number) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, horizon + 2);
    const off = cam * factor;
    for (let x = 0; x <= W + 10; x += 10) {
      const wx = x + off;
      const y = base - amp * (0.55 + 0.45 * Math.sin(wx / period) * Math.cos(wx / (period * 0.37)));
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, horizon + 2);
    ctx.fill();
  };
  mountains(0.08, horizon, H * 0.12, "#93c5fd", 140);
  mountains(0.16, horizon, H * 0.08, "#60a5fa", 90);

  // 관중석 (패럴랙스 0.35)
  const standTop = horizon - H * 0.02;
  const standH = trackTop - standTop - H * 0.04;
  ctx.fillStyle = "#1e3a8a";
  ctx.fillRect(0, standTop, W, standH);
  const seatOff = (cam * 0.35) % 14;
  for (let row = 0; row < 4; row++) {
    for (let x = -14; x < W + 14; x += 14) {
      const px = x - seatOff;
      const idx = Math.floor((x + cam * 0.35) / 14) + row * 7;
      const cheer = Math.sin(f.time * 6 + idx) > 0.6 ? -2 : 0;
      ctx.fillStyle = ["#fca5a5", "#fde68a", "#a5b4fc", "#86efac", "#f9a8d4"][Math.abs(idx) % 5];
      ctx.fillRect(px, standTop + 4 + row * (standH / 4.3) + cheer, 7, 6);
    }
  }
  // 광고판 띠
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, trackTop - H * 0.045, W, H * 0.045);
  ctx.font = `900 ${Math.max(10, H * 0.026)}px system-ui, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const boardOff = (cam * 0.7) % 260;
  for (let x = -260; x < W + 260; x += 260) {
    ctx.fillStyle = "#facc15";
    ctx.fillText("한글타자왕", x - boardOff + 20, trackTop - H * 0.022);
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("TYPING RACE", x - boardOff + 20 + H * 0.17, trackTop - H * 0.022);
  }

  // ── 트랙 ──
  ctx.fillStyle = "#c2410c";
  ctx.fillRect(0, trackTop, W, trackBottom - trackTop);
  for (let i = 0; i < LANES; i++) {
    ctx.fillStyle = i % 2 === 0 ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.03)";
    ctx.fillRect(0, trackTop + i * laneH, W, laneH);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2;
  for (let i = 0; i <= LANES; i++) {
    ctx.beginPath();
    ctx.moveTo(0, trackTop + i * laneH);
    ctx.lineTo(W, trackTop + i * laneH);
    ctx.stroke();
  }
  // 10타마다 눈금, 50타마다 숫자
  ctx.font = `800 ${Math.max(9, H * 0.024)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  const first = Math.floor((f.pos - 45) / 10) * 10;
  for (let d = Math.max(0, first); d <= f.pos + 90 && d <= f.distance; d += 10) {
    const x = worldX(d);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(x - 1, trackBottom - laneH * 0.35, 2, laneH * 0.35);
    if (d % 50 === 0 && d > 0 && d < f.distance) {
      ctx.fillStyle = "#fff";
      ctx.fillText(String(d), x, trackTop - H * 0.065);
    }
  }
  // 출발선
  const sx = worldX(0);
  if (sx > -10 && sx < W + 10) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(sx - 2, trackTop, 4, trackBottom - trackTop);
  }
  // 결승선 + 아치
  const fx = worldX(f.distance);
  if (fx > -40 && fx < W + 60) {
    const cell = laneH / 3;
    for (let r = 0; r * cell < trackBottom - trackTop; r++) {
      for (let c = 0; c < 2; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? "#fff" : "#111";
        ctx.fillRect(fx - cell + c * cell, trackTop + r * cell, cell, cell);
      }
    }
    const archTop = standTop - H * 0.02;
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(fx - cell - 6, archTop, 6, trackTop - archTop);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(fx - cell * 5, archTop, cell * 8, H * 0.06);
    ctx.fillStyle = "#fff";
    ctx.font = `900 ${Math.max(11, H * 0.04)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("FINISH", fx - cell, archTop + H * 0.03);
  }

  // ── 선수들 (먼 레인부터) ──
  type Entry = { lane: number; draw: () => void };
  const entries: Entry[] = [];
  const offscreen: { lane: number; ahead: boolean; rel: number; label: string; color: string }[] = [];
  for (const r of f.runners) {
    const x = worldX(f.pos + r.rel);
    const scale = unit * laneScale(r.lane) * (r.flying ? 1.15 : 1.25);
    const halfW = (r.sprite.frameW * scale) / 2;
    if (x - halfW > W || x + halfW < 0) {
      offscreen.push({ lane: r.lane, ahead: r.rel > 0, rel: r.rel, label: r.label, color: r.color });
      continue;
    }
    entries.push({
      lane: r.lane,
      draw: () => {
        const foot = laneFoot(r.lane) - (r.flying ? laneH * 1.6 + Math.sin(f.time * 5 + r.lane) * laneH * 0.25 : 0);
        const frame = Math.floor(f.time * (12 + r.cpm / 40));
        if (!r.flying) {
          // 그림자 + 흙먼지
          ctx.fillStyle = "rgba(0,0,0,0.25)";
          ctx.beginPath();
          ctx.ellipse(x, laneFoot(r.lane), halfW * 0.8, laneH * 0.1, 0, 0, Math.PI * 2);
          ctx.fill();
          for (let k = 0; k < 3; k++) {
            const t = (f.time * 3 + k / 3 + r.lane) % 1;
            ctx.fillStyle = `rgba(254,215,170,${0.5 * (1 - t)})`;
            ctx.beginPath();
            ctx.arc(x - halfW * 0.8 - t * halfW * 1.2, laneFoot(r.lane) - t * laneH * 0.4, laneH * 0.08 * (1 + t), 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          ctx.fillStyle = "rgba(0,0,0,0.15)";
          ctx.beginPath();
          ctx.ellipse(x, laneFoot(r.lane), halfW * 0.6, laneH * 0.08, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        drawSprite(ctx, r.sprite, frame, x, foot, scale);
        // 이름표
        const fs = Math.max(10, H * 0.024);
        ctx.font = `800 ${fs}px system-ui, sans-serif`;
        const tw = ctx.measureText(r.label).width + fs;
        const ty = foot - r.sprite.frameH * scale - fs * 0.4;
        ctx.fillStyle = "rgba(15,23,42,0.78)";
        ctx.beginPath();
        ctx.roundRect(x - tw / 2, ty - fs * 1.2, tw, fs * 1.4, fs * 0.5);
        ctx.fill();
        ctx.fillStyle = r.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(r.label, x, ty - fs * 0.5);
      },
    });
  }
  // 나
  entries.push({
    lane: f.player.lane,
    draw: () => {
      const scale = unit * laneScale(f.player.lane) * 1.45;
      const foot = laneFoot(f.player.lane);
      const s = f.player.sprite;
      const moving = f.speed > 0.4;
      const frame = f.player.stumbling ? Math.floor(f.time * 14) : moving ? Math.floor(f.time * (10 + f.speed * 2)) : Math.floor(f.time * 12);
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(playerX, foot, s.frameW * scale * 0.35, laneH * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      if (moving && !f.player.stumbling) {
        for (let k = 0; k < 4; k++) {
          const t = (f.time * 3.5 + k / 4) % 1;
          ctx.fillStyle = `rgba(254,215,170,${0.6 * (1 - t)})`;
          ctx.beginPath();
          ctx.arc(playerX - s.frameW * scale * 0.3 - t * 60, foot - t * laneH * 0.5, laneH * 0.1 * (1 + t), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      drawSprite(ctx, s, frame, playerX, foot, scale);
      const fs = Math.max(11, H * 0.026);
      ctx.font = `900 ${fs}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = f.player.stumbling ? "#f87171" : "#facc15";
      // 32px 프레임 위쪽이 비어 있어 머리 바로 위에 붙도록 0.8만큼만 올린다
      ctx.fillText(f.player.stumbling ? f.player.stumbleLabel : f.player.label, playerX, foot - s.frameH * scale * 0.8 - fs * 0.4);
    },
  });
  entries.sort((a, b) => a.lane - b.lane).forEach((e) => e.draw());

  // 화면 밖 상대 표시
  const fs = Math.max(10, H * 0.024);
  ctx.font = `800 ${fs}px system-ui, sans-serif`;
  for (const o of offscreen) {
    const text = o.ahead ? `${o.label} ${f.aheadLabel(o.rel)} ▶` : `◀ ${o.label} ${f.behindLabel(o.rel)}`;
    const tw = ctx.measureText(text).width + fs;
    const y = laneFoot(o.lane) - laneH * 0.45;
    const x = o.ahead ? W - tw - 6 : 6;
    ctx.fillStyle = "rgba(15,23,42,0.8)";
    ctx.beginPath();
    ctx.roundRect(x, y - fs * 0.8, tw, fs * 1.6, fs * 0.6);
    ctx.fill();
    ctx.fillStyle = o.color;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + fs / 2, y);
  }

  // 속도감 줄
  if (f.speed > 5) {
    const a = Math.min(0.5, (f.speed - 5) / 10);
    ctx.strokeStyle = `rgba(255,255,255,${a})`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 14; i++) {
      const y = trackTop - H * 0.1 + ((i * 53) % (trackBottom - trackTop + H * 0.1));
      const len = W * (0.08 + (i % 3) * 0.04);
      const x = W - ((f.time * W * 1.6 + i * 137) % (W + len));
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y);
      ctx.stroke();
    }
  }

  // 앞 잔디 (패럴랙스 1.3)
  ctx.fillStyle = "#15803d";
  ctx.fillRect(0, trackBottom, W, H - trackBottom);
  ctx.fillStyle = "#166534";
  const grassOff = (cam * 1.3) % 18;
  for (let x = -18; x < W + 18; x += 18) {
    ctx.beginPath();
    ctx.moveTo(x - grassOff, H);
    ctx.lineTo(x - grassOff + 5, trackBottom - 4);
    ctx.lineTo(x - grassOff + 10, H);
    ctx.fill();
  }
}
