"use client";

import { useEffect, useRef } from "react";
import { Application, Container, Sprite, Texture } from "pixi.js";
import lottie, { AnimationItem } from "lottie-web";
import { SlotMachine } from "@/utils/SlotMachine";
import { ConcentricRings } from "./ring/RingGroup";
import { useGameStore } from "@/store/gameStore";


async function lottieToStaticTexture(path: string): Promise<Texture> {
  return new Promise((resolve) => {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = "-9999px";
    div.style.width = "500px";
    div.style.height = "500px";
    document.body.appendChild(div);

    const anim = lottie.loadAnimation({
      container: div,
      renderer: "canvas",
      autoplay: false,
      loop: false,
      path,
    });

    anim.addEventListener("DOMLoaded", () => {
      anim.goToAndStop(0, true);
      const canvas = (anim.renderer as any)?.canvasContext?.canvas;
      if (!canvas) {
        anim.destroy();
        div.remove();
        resolve(Texture.EMPTY);
        return;
      }
      const tex = Texture.from(canvas);
      anim.destroy();
      div.remove();
      resolve(tex);
    });
  });
}

function playLottieOnSprite(app: Application, sprite: Sprite, path: string) {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.left = "-9999px";
  div.style.width = "500px";
  div.style.height = "500px";
  document.body.appendChild(div);

  const anim: AnimationItem = lottie.loadAnimation({
    container: div,
    renderer: "canvas",
    loop: false,
    autoplay: true,
    path,
  });

  anim.addEventListener("DOMLoaded", () => {
    const canvas = (anim.renderer as any)?.canvasContext?.canvas;
    if (!canvas) return;

    const prevW = sprite.width;
    const prevH = sprite.height;

    const tex = Texture.from(canvas, { resourceOptions: { updateId: -1 } } as any);
    sprite.texture = tex;
    sprite.scale.set(Math.min(prevW / tex.width, prevH / tex.height));

    const update = () => (tex as any).source?.update?.();
    app.ticker.add(update);

    anim.addEventListener("complete", () => {
      app.ticker.remove(update);
      anim.destroy();
      div.remove();
    });
  });
}

export const GameCanvas = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    const init = async () => {
      const [crown, lion, womensDay, forbidden] = await Promise.all([
        lottieToStaticTexture("/animations/crown_13114729.json"),
        lottieToStaticTexture("/animations/lion_19027619.json"),
        lottieToStaticTexture("/animations/womens-day_18996033.json"),
        lottieToStaticTexture("/animations/forbidden_12132914.json"),
      ]);

      const symbolTextures = [crown, lion, womensDay, forbidden];

      const TEXTURE_TO_SYMBOL = new Map<Texture, string>([
        [lion, "lion"],
        [crown, "crown"],
        [womensDay, "womansDay"],
        [forbidden, "forbidden"],
      ]);

      const SYMBOL_TO_LOTTIE: Record<string, string> = {
        lion: "/animations/lion_19027619.json",
        crown: "/animations/crown_13114729.json",
        womansDay: "/animations/womens-day_18996033.json",
        forbidden: "/animations/forbidden_12132914.json",
      };

      const app = new Application();
      await app.init({ width: 900, height: 900, backgroundAlpha: 0, antialias: true });
      appRef.current = app;
      containerRef.current!.appendChild(app.canvas);

      const root = new Container();
      root.x = 450;
      root.y = 450;
      app.stage.addChild(root);
      
      const rings = new ConcentricRings({ lion, crown, womensDay });
      rings.x = 450;
      rings.y = 450;
      app.stage.addChild(rings);
      
      const machine = new SlotMachine(app, {
        reels: 1,
        rows: 4,
        symbolSize: 200,
        reelWidth: 150,
        textures: symbolTextures,
        x: -100,
        y: -300,
        symbolGap: 1,
      });
      machine.zIndex = 3;
      rings.addChildToCircle(machine);
      
      {
        const store = useGameStore.getState();
        const originalCashout = store.cashout;
        useGameStore.setState({
          cashout: () => {
            const win = originalCashout();
            rings.resetAllProgressUI();
            return win;
          },
        });
      }

      useGameStore.setState({
        runSpin: async () => {
          const store = useGameStore.getState();
          const { addProgress, resetAllProgress, finishSpin } = store;

          await machine.spin();
          const center = machine.getCenterSymbol(0);
          if (!center) return finishSpin();

          const symbolKey = TEXTURE_TO_SYMBOL.get(center.texture as Texture) ?? "forbidden";

          if (symbolKey === "forbidden") {
            resetAllProgress();
            rings.updateForSymbol("forbidden");
          } else {
            addProgress(symbolKey);
            rings.updateForSymbol(symbolKey);
          }

          const path = SYMBOL_TO_LOTTIE[symbolKey];
          if (path) playLottieOnSprite(app, center, path);

          finishSpin();
        },
      });
      
      (window as any).__app = app;
      (window as any).__machine = machine;
      (window as any).__rings = rings;
    };

    void init();
    return () => appRef.current?.destroy(true);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: 900, height: 900, display: "flex", justifyContent: "center", alignItems: "center" }}
    />
  );
};
