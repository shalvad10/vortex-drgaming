import { RingConfig } from "@/interfaces";

export const RING_CONFIGS: RingConfig[] = [
  {
    name: "lion",
    diameter: 495,
    stroke: 8,
    icon: { texture: null as any, scale: 1 }, // texture will be injected later
    strokeColor: 0x0a0d13,
    segments: { count: 8, color: 0x3a3f50, width: 2, alpha: 0.25, radius: 495, stroke: 10 },
    multipliers: ["1X", "1.2X", "1.5X", "2X", "3X", "4X", "5X", "6X"],
    progressBar: { width: 70, color: 0xffd166, endCircleColor: 0xffe599, endCircleRadius: 10, segmentCount: 8 },
    gradient: { start: 0x262b3a, end: 0x05060b },
    mainCircle: false,
  },
  {
    name: "crown",
    diameter: 410,
    stroke: 8,
    icon: { texture: null as any, scale: 1 },
    strokeColor: 0x0a0d13,
    segments: { count: 6, color: 0x3a3f50, width: 2, alpha: 0.25, radius: 410, stroke: 10 },
    multipliers: ["1X", "1.1X", "1.3X", "2.2X", "3X", "4.5X"],
    progressBar: { width: 70, color: 0x7df9ff, endCircleColor: 0xb9ffff, endCircleRadius: 10, segmentCount: 6 },
    gradient: { start: 0x262b3a, end: 0x05060b },
    mainCircle: false,
  },
  {
    name: "womansDay",
    diameter: 325,
    stroke: 8,
    icon: { texture: null as any, scale: 1 },
    strokeColor: 0x0a0d13,
    segments: { count: 4, color: 0x3a3f50, width: 2, alpha: 0.25, radius: 325, stroke: 10 },
    multipliers: ["1X", "1.5X", "3X", "5X"],
    progressBar: { width: 70, color: 0xff6fb1, endCircleColor: 0xff97ca, endCircleRadius: 10, segmentCount: 4 },
    gradient: { start: 0x262b3a, end: 0x05060b },
    mainCircle: false,
  },
  {
    name: "center",
    diameter: 240,
    stroke: 8,
    strokeColor: 0x0a0d13,
    gradient: { start: 0x262b3a, end: 0x05060b },
    mainCircle: true,
  },
];
