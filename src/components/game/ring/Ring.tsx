// SegmentedCircle.ts
import { Container, Graphics, Text } from "pixi.js";
import { createLinearGradientTexture } from "@/utils/createGradientTexture";
import { createGradientCircleStroke } from "@/utils/CreateGradientStroke";
import { ProgressArc } from "@/components/ProgressArc";
import { RingConfig } from "@/interfaces";

export class SegmentedCircle extends Container {
  public progressArc?: ProgressArc;
  public mainCircle: boolean = false;
  public name: string = "";
  public masked!: Container;

  constructor(opts: RingConfig) {
    super();

    this.position.set(opts.x ?? 0, opts.y ?? 0);
    this.sortableChildren = true;

    this.mainCircle = opts.mainCircle ?? false;
    this.name = opts.name ?? "";

    const diameter = opts.diameter ?? 200;
    const radius = diameter / 2;
    const stroke = opts.stroke ?? 40;

    this.eventMode = "none";
    this.interactive = false;
    this.interactiveChildren = false;

    const masked = new Container();
    masked.zIndex = 2;
    this.masked = masked;
    this.addChild(masked);

    const maskShape = new Graphics();
    maskShape.beginFill(0xffffff);
    maskShape.circle(0, 0, radius - stroke * 0.5);
    maskShape.endFill();

    masked.mask = maskShape;
    this.addChild(maskShape);

    if (opts.strokeColor) {
      const solid = new Graphics();
      solid.beginFill(0x000000, 0);
      solid.stroke({ width: stroke, color: opts.strokeColor });
      solid.circle(0, 0, radius);
      solid.endFill();
      solid.zIndex = 1;
      this.addChild(solid);
    }

    if (opts.gradient) {
      const gradientTex = createLinearGradientTexture(
        diameter,
        diameter,
        opts.gradient.start,
        opts.gradient.end
      );
      const overlay = createGradientCircleStroke(radius, stroke, gradientTex);
      overlay.zIndex = 2;
      masked.addChild(overlay);
    }

    if (opts.progressBar) {
      const innerRadius = radius - (opts.progressBar.offset ?? stroke * 1.5);

      this.progressArc = new ProgressArc({
        radius: innerRadius,
        stroke: opts.progressBar.width ?? stroke * 0.45,
        color: opts.progressBar.color ?? 0xffc400,
        endCircleColor: opts.progressBar.endCircleColor ?? 0xffffff,
        endCircleRadius: opts.progressBar.endCircleRadius ?? stroke * 0.25,
        segmentCount: opts.progressBar.segmentCount ?? 1,
      });

      this.progressArc.zIndex = 4;
      masked.addChild(this.progressArc);
    }

    if (opts.segments?.count && opts.segments.count > 1) {
      const segLines = drawSegments(opts.segments);
      segLines.zIndex = 9;
      masked.addChild(segLines);
    }

    if (opts.multipliers && opts.segments?.count && opts.segments.count > 0) {
      const count = opts.segments.count;
      const step = (Math.PI * 2) / count;
      const baseAngle = -Math.PI / 2;
      const labelRadius = radius - stroke * 2.1;
      const lastTwoStartIndex = count - 2;

      opts.multipliers.forEach((txt, i) => {
        const angle = baseAngle + step * (i + 0.5);

        const label = new Text(txt, {
          fontFamily: "Arial",
          fontSize: Math.max(16, stroke * 0.42),
          fill: 0xff0000,
          fontWeight: "700",
          align: "center",
        });

        label.alpha = 0.5;
        label.anchor.set(0.5);

        label.x = Math.cos(angle) * labelRadius;
        label.y = Math.sin(angle) * labelRadius;
        label.rotation = angle + Math.PI / 2;

        if (i < lastTwoStartIndex) {
          if (Math.cos(angle) < 0) {
            label.rotation += Math.PI;
          }
        }

        label.zIndex = 99;
        this.addChild(label);
      });
    }

    this.sortableChildren = true;
  }
}

function drawSegments(cfg: {
  count: number;
  color: number;
  width: number;
  alpha: number;
  radius: number;
  stroke: number;
}): Graphics {
  const g = new Graphics();

  const angleStep = (2 * Math.PI) / cfg.count;
  const startAngle = -Math.PI / 2;
  const tickWidth = Math.max(2, cfg.width);

  g.stroke({
    width: tickWidth,
    color: cfg.color,
    alpha: cfg.alpha,
  });

  for (let i = 1; i < cfg.count; i++) {
    const angle = startAngle + i * angleStep;
    const inner = cfg.radius - cfg.stroke + cfg.stroke * 1.5;
    const outer = cfg.radius - cfg.stroke * 7;

    g.beginFill(0, 0);
    g.moveTo(Math.cos(angle) * inner * 0.5, Math.sin(angle) * inner * 0.5);
    g.lineTo(Math.cos(angle) * outer * 0.5, Math.sin(angle) * outer * 0.5);
    g.endFill();
  }

  g.zIndex = 9;
  return g;
}
