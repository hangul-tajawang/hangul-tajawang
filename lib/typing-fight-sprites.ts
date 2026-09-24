/**
 * 타자 격투 스프라이트 메타데이터.
 *
 * 원본: LuizMelo(itch.io) Martial Hero 1·2·3 / Huntress / Fantasy Warrior / Evil Wizard 2 — 모두 CC0.
 * 팩마다 프레임 크기·발 위치가 달라, 캐릭터별로 모든 동작 프레임의 합집합 박스로 잘라
 * public/game/typing-fight/{캐릭터}/{동작}.png 가로 스트립으로 정규화했다.
 *   w·h      : 정규화된 프레임 크기(원본 픽셀). 발은 항상 프레임 아래쪽 끝.
 *   anchorX  : 대기 자세 몸통 중심의 x(프레임 왼쪽 기준) — 화면 배치 기준점
 *   bodyH    : 대기 자세 키(원본 픽셀) — 캐릭터 간 크기 맞춤에 사용
 */
import type { FightCharacter } from './typing-fight';

export type FightAnim = 'idle' | 'attack1' | 'attack2' | 'hit' | 'death';

export interface FightSprite {
  w: number;
  h: number;
  anchorX: number;
  bodyH: number;
  frames: Record<FightAnim, number>;
}

export const FIGHT_SPRITES: Record<FightCharacter, FightSprite> = {
  samurai: { w: 130, h: 71, anchorX: 29.5, bodyH: 52, frames: { idle: 8, attack1: 6, attack2: 6, hit: 4, death: 6 } },
  huntress: { w: 90, h: 68, anchorX: 40, bodyH: 42, frames: { idle: 8, attack1: 5, attack2: 5, hit: 3, death: 8 } },
  ronin: { w: 127, h: 82, anchorX: 69, bodyH: 41, frames: { idle: 10, attack1: 7, attack2: 9, hit: 3, death: 11 } },
  knight: { w: 139, h: 102, anchorX: 68, bodyH: 45, frames: { idle: 10, attack1: 7, attack2: 8, hit: 3, death: 7 } },
  kenji: { w: 117, h: 86, anchorX: 27.5, bodyH: 56, frames: { idle: 4, attack1: 4, attack2: 4, hit: 3, death: 7 } },
  wizard: { w: 171, h: 156, anchorX: 63.5, bodyH: 104, frames: { idle: 8, attack1: 8, attack2: 8, hit: 3, death: 7 } },
};

/** 동작별 프레임당 시간(ms) */
export const FIGHT_FRAME_MS: Record<FightAnim, number> = { idle: 110, attack1: 55, attack2: 60, hit: 90, death: 120 };

export const fightSpriteUrl = (character: FightCharacter, anim: FightAnim) => `/game/typing-fight/${character}/${anim}.png`;
