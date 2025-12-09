declare module "lottie-web-parser" {
  export default function parseAnimationData(
    data: any,
    options?: {
      resolution?: number;
      preserveAspectRatio?: string;
      createCanvas?: () => HTMLCanvasElement;
    }
  ): Promise<{
    textures: import("pixi.js").Texture[];
    totalFrames: number;
    frameRate: number;
    width: number;
    height: number;
  }>;
}
