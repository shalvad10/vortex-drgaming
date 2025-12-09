import { Texture } from "pixi.js";

/**
 * @param renderer The Pixi renderer instance
 * @param width Gradient texture width
 * @param height Height (usually stroke width)
 * @param leftColor Hex number
 * @param rightColor Hex number
 */
export function createLinearGradientTexture(width: number, height: number, leftColor: number, rightColor: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, width, 0);

  gradient.addColorStop(0, `#${leftColor.toString(16).padStart(6, "0")}`);
  gradient.addColorStop(1, `#${leftColor.toString(16).padStart(6, "0")}`);

  gradient.addColorStop(0, `#${rightColor.toString(16).padStart(6, "0")}`);
  gradient.addColorStop(1, `#${rightColor.toString(16).padStart(6, "0")}`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return Texture.from(canvas);
}

