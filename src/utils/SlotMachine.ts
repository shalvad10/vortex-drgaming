import {
  Application,
  Container,
  Sprite,
  Texture,
  BlurFilter,
} from "pixi.js";
import gsap from "gsap";

export interface SlotMachineOptions {
  reels: number;
  rows: number;
  symbolSize: number;
  reelWidth: number;
  textures: Texture[];
  x: number;
  y: number;
  symbolGap?: number;
}

type Reel = {
  container: Container;
  symbols: Sprite[];
  position: number;
  previousPosition: number;
  blur: BlurFilter;
};

export class SlotMachine extends Container {
  private reels: Reel[] = [];
  private running = false;
  private symbolGap: number;

  constructor(private app: Application, private opts: SlotMachineOptions) {
    super();

    this.x = opts.x;
    this.y = opts.y;
    this.symbolGap = opts.symbolGap ?? 1;

    this.buildMachine();
    this.setupTicker();
  }

  private buildMachine() {
    const {
      reels,
      rows,
      symbolSize,
      reelWidth,
      textures,
    } = this.opts;

    const step = symbolSize + this.symbolGap;

    const reelContainer = new Container();
    this.addChild(reelContainer);

    for (let i = 0; i < reels; i++) {
      const rc = new Container();
      rc.x = i * reelWidth;
      reelContainer.addChild(rc);

      const reel: Reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new BlurFilter(),
      };

      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      rc.filters = [reel.blur];

      for (let j = 0; j < rows; j++) {
        const tex =
          textures[Math.floor(Math.random() * textures.length)];

        const symbol = new Sprite(tex);

        symbol.y = j * step;
        symbol.scale.set(
          Math.min(
            symbolSize / symbol.width,
            symbolSize / symbol.height
          )
        );
        symbol.x = Math.round((symbolSize - symbol.width) / 2);

        reel.symbols.push(symbol);
        rc.addChild(symbol);
      }

      this.reels.push(reel);
    }
  }

  public async spin(): Promise<void> {
    if (this.running) return;
    this.running = true;

    const rows = this.opts.rows;

    const randomStopOffset = Math.floor(Math.random() * rows);

    await Promise.all(
      this.reels.map((r, i) => {
        return new Promise<void>((resolve) => {
          const randomCycles = 10 + Math.floor(Math.random() * 4) * rows;

          const target = r.position + randomCycles + randomStopOffset + i * 0.25;

          const duration = (1600 + i * 800) / 1000;

          gsap.to(r, {
            position: target,
            duration,
            ease: "power3.out",
            onComplete: resolve,
          });
        });
      })
    );

    this.running = false;
  }

  private setupTicker() {
    const symbolSize = this.opts.symbolSize;
    const textures = this.opts.textures;
    const step = symbolSize + this.symbolGap;

    this.app.ticker.add(() => {
      for (const r of this.reels) {

        r.blur.blurY = (r.position - r.previousPosition) * 8;
        r.previousPosition = r.position;

        
        for (let j = 0; j < r.symbols.length; j++) {
          const s = r.symbols[j];
          const prevY = s.y;

          s.y = ((r.position + j) % r.symbols.length) * step - step;

          if (s.y < 0 && prevY > step) {
            const tex =
              textures[Math.floor(Math.random() * textures.length)];

            s.texture = tex;
            s.scale.set(
              Math.min(
                symbolSize / s.texture.width,
                symbolSize / s.texture.height
              )
            );
            s.x = Math.round((symbolSize - s.width) / 2);
          }
        }
      }
    });
  }

  public getCenterSymbol(reelIndex = 0): Sprite | null {
    const reel = this.reels[reelIndex];
    if (!reel) return null;

    const symbolSize = this.opts.symbolSize;
    const step = symbolSize + this.symbolGap;

    const centerMid = step + symbolSize / 2;

    let closest: Sprite | null = null;
    let bestDist = Infinity;

    for (const s of reel.symbols) {
      const midY = s.y + s.height / 2;
      const d = Math.abs(midY - centerMid);
      if (d < bestDist) {
        bestDist = d;
        closest = s;
      }
    }

    return closest;
  }
}
