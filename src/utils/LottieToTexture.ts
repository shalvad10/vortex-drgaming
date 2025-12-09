import lottie, { AnimationItem } from "lottie-web";
import { Texture } from "pixi.js";

export async function lottieToStaticTexture(path: string): Promise<Texture> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "500px";
    container.style.height = "500px";
    document.body.appendChild(container);

    const anim: AnimationItem = lottie.loadAnimation({
      container,
      renderer: "canvas",
      autoplay: false,
      loop: false,
      path,
    });

    anim.addEventListener("DOMLoaded", () => {
      anim.goToAndStop(0, true); // force frame 0

      const rendererAny = anim.renderer as any;
      const canvas: HTMLCanvasElement = rendererAny.canvasContext.canvas;

      // Create Pixi texture from canvas
      const tex = Texture.from(canvas);

      // Cleanup DOM & animation
      anim.destroy();
      container.remove();

      resolve(tex);
    });
  });
}
