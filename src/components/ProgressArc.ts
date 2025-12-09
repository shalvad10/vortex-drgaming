import { Container, Graphics } from "pixi.js";
import gsap from "gsap";

interface ProgressArcOptions {
  radius: number;
  stroke: number;
  arcWidth?: number;
  color?: number;
  endCircleColor?: number;
  endCircleRadius?: number;
  startAngle?: number;
  segmentCount?: number;
}

export class ProgressArc extends Container {
  private gfx: Graphics;
  private endCircle: Graphics;

  private radius: number;
  private color: number;
  private arcWidth: number;
  private startAngle: number;
  private segmentCount: number;

  private endCircleRadius: number;
  private endCircleColor: number;

  private value = 0;
  private currentSegmentIndex = -1;

  constructor(opts: ProgressArcOptions) {
    super();

    this.radius = opts.radius - opts.stroke * 0.15;
    this.arcWidth = opts.arcWidth ?? opts.stroke * 0.45;
    this.color = opts.color ?? 0xffc400;
    this.startAngle = (opts.startAngle ?? -90) * (Math.PI / 180);
    this.segmentCount = Math.max(1, opts.segmentCount ?? 1);

    this.endCircleColor = opts.endCircleColor ?? this.color;
    this.endCircleRadius = opts.endCircleRadius ?? this.arcWidth * 0.6;

    this.gfx = new Graphics();
    this.endCircle = new Graphics();

    this.addChild(this.gfx);
    this.addChild(this.endCircle);

    this.draw(0);
  }

  public animateToSegment(segmentIndex: number, duration = 0.8) {
    const maxIndex = this.segmentCount - 1;
    const clampedIndex = Math.min(Math.max(segmentIndex, 0), maxIndex);

    const step = 1 / this.segmentCount;
    let targetValue = step * (clampedIndex + 1);

    targetValue = Math.min(targetValue, 0.9999);

    gsap.to(this, {
      value: targetValue,
      duration,
      ease: "power2.inOut",
      onUpdate: () => this.draw(this.value),
      onComplete: () => {
        this.value = targetValue;
        this.currentSegmentIndex = clampedIndex;
        this.draw(this.value);
      },
    });
  }
  
  public advanceOneSegment(duration = 0.8) {
    const maxIndex = this.segmentCount - 1;
    const nextIndex =
      this.currentSegmentIndex < 0
        ? 0
        : Math.min(this.currentSegmentIndex + 1, maxIndex);

    this.animateToSegment(nextIndex, duration);
  }
  
  public resetProgress(duration = 0.4) {
    this.currentSegmentIndex = -1;

    gsap.to(this, {
      value: 0,
      duration,
      ease: "power2.out",
      onUpdate: () => this.draw(this.value),
      onComplete: () => {
        this.value = 0;
        this.draw(this.value);
      },
    });
  }
  
  public setProgress(v: number) {
    this.value = Math.min(Math.max(v, 0), 0.9999);
    this.draw(this.value);
  }
  
  private draw(v: number) {
    const pct = Math.min(Math.max(v, 0), 0.9999);
    
    const endAngle = this.startAngle + pct * Math.PI * 2;

    this.gfx.clear();
    this.gfx.beginFill(0xffffff, 0);
    this.gfx.stroke({ width: this.arcWidth, color: this.color, cap: "round" });
    
    const sx = Math.cos(this.startAngle) * this.radius;
    const sy = Math.sin(this.startAngle) * this.radius;
    this.gfx.moveTo(sx, sy);
    this.gfx.lineTo(sx, sy);
    
    this.gfx.arc(0, 0, this.radius, this.startAngle, endAngle);
    this.gfx.endFill();

    const ex = Math.cos(endAngle) * this.radius;
    const ey = Math.sin(endAngle) * this.radius;

    this.endCircle.clear();
    this.endCircle
      .beginFill(this.endCircleColor)
      .circle(ex, ey, this.endCircleRadius)
      .endFill();
  }
}
