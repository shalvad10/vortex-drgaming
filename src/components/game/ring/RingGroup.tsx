// src/components/game/ring/RingGroup.ts
import { Graphics } from "pixi.js";

export function createRingGroup() {
  const g = new Graphics();

  const rings = [
    { radius: 190, color: 0x3a3a3a, width: 30 },
    { radius: 155, color: 0x3a3a3a, width: 30 },
    { radius: 120, color: 0x3a3a3a, width: 30 },
  ];

  rings.forEach((r) => {
    g.beginFill(0x3a3a3a, 0);
    g.lineStyle(r.width, r.color);
    g.drawCircle(0, 0, r.radius);
    g.endFill();
  });

  return g;
}
