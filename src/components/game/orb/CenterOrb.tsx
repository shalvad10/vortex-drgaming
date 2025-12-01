// src/components/game/orb/CenterOrb.ts
import { Graphics } from "pixi.js";

export function createCenterOrb() {
  const g = new Graphics();

  g.beginFill(0x3a3a3a, 0.9);
  g.drawCircle(0, 0, 100);
  g.endFill();

  return g;
}
