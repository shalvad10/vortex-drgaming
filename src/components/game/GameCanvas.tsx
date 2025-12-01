"use client";

import { useEffect, useRef } from "react";
import { Application, Container } from "pixi.js";
import { createRingGroup } from "./ring/RingGroup";
import { createCenterOrb } from "./orb/CenterOrb";

export const GameCanvas = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    if (!containerRef.current || appRef.current) return;

    (async () => {
      // PIXI 8 INSTANCE
      const app = new Application();
      await app.init({
        width: 900,
        height: 900,
        backgroundAlpha: 0,
        antialias: true,
      });

      appRef.current = app;
      containerRef.current!.appendChild(app.renderer.canvas);
      globalThis.__PIXI_APP__ = app;
      // ROOT (center)
      const root = new Container();
      root.x = 450;
      root.y = 450;
      app.stage.addChild(root);

      // RINGS
      const rings = createRingGroup();
      root.addChild(rings);

      // CENTER ORB
      const orb = createCenterOrb();
      root.addChild(orb);
    })();

    return () => {
      if (appRef.current) appRef.current.destroy(true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: 900,
        height: 900,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};
