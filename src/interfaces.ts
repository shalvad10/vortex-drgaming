import { Texture } from "pixi.js";

export interface RingConfig {
  x?: number;
  y?: number;
  diameter: number;
  stroke: number;
  name: string;
  strokeColor?: number;
  mainCircle: boolean;
  gradient?: {
    start: number;
    end: number;
  };
  segments?: {
    count: number;
    color: number;
    width: number;
    alpha: number;
    radius: number;
    stroke: number;
  };
  multipliers?: string[];
  progressBar?: {
      color?: number;
      width?: number;
      offset?: number;
      endCircleColor?: number;
      endCircleRadius?: number;
      segmentCount?: number;
  }
  icon?: {
    texture: Texture;
    scale?: number;
    offset?: number;
  };
}

