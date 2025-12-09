import { Container, Texture } from "pixi.js";
import { SegmentedCircle } from "./Ring";
import { CircleWithTexture } from "@/components/CircleWithTexture";
import { useGameStore } from "@/store/gameStore";

export class ConcentricRings extends Container {
  public circles: Record<string, SegmentedCircle> = {};

  constructor(icons: Record<string, Texture>) {
    super();

    const textureMap: Record<string, Texture | undefined> = {
      lion: icons.lion,
      crown: icons.crown,
      womansDay: icons.womensDay,
    };

    const rings = useGameStore.getState().rings;

    Object.values(rings).forEach((cfg: any) => {
      const circle = new SegmentedCircle({
        ...cfg,
        icon: cfg.icon
          ? { ...cfg.icon, texture: textureMap[cfg.name]! }
          : undefined,
      });

      this.circles[cfg.name] = circle;
      this.addChild(circle);
      
      if (cfg.icon) {
        const iconTexture = textureMap[cfg.name];
        if (!iconTexture) return;

        const iconCircle = new CircleWithTexture({
          x: 0,
          y: -cfg.diameter / 2 + cfg.stroke / 2 + 13,
          size: 45,
          strokeWidth: 5,
          strokeColor: 0x090b0f,
          fillColor: 0x1f2128,
          texture: iconTexture,
        });

        iconCircle.zIndex = 99;
        this.addChild(iconCircle);
      }
      
      if (cfg.multipliers && cfg.segments) {
        useGameStore.setState((state) => ({
          ringProgress: {
            ...state.ringProgress,
            [cfg.name]: {
              current: 0,
              max: cfg.segments!.count,
              multipliers: cfg.multipliers!.map((m: any) =>
                Number(m.replace("X", ""))
              ),
            },
          },
        }));
      }
    });
  }
  
  public addChildToCircle(item: Container) {
    this.circles["center"]?.masked?.addChild(item);
  }
  
  public updateForSymbol(symbol: string) {
    const store = useGameStore.getState();

    if (symbol === "forbidden") {
      store.resetAllProgress();
      this.resetAllProgressUI();
      return;
    }

    const ring = this.circles[symbol];
    if (!ring?.progressArc) return;

    store.addProgress(symbol);
    ring.progressArc.advanceOneSegment();
  }
  
  public resetAllProgressUI() {
    Object.values(this.circles).forEach((ring) => {
      ring.progressArc?.resetProgress?.();
    });
  }
}
