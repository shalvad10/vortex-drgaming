import { Container, Graphics, Sprite, Texture } from "pixi.js";

export interface CircleWithTextureOptions {
  x?: number;
  y?: number;
  size: number;
  strokeWidth?: number;
  strokeColor?: number;
  fillColor?: number;
  texture: Texture;
}

export class CircleWithTexture extends Container {
  private maskCircle: Graphics;
  private image: Sprite;
  private stroke: Graphics;
  private background: Graphics;

  constructor(opts: CircleWithTextureOptions) {
    super();

    this.position.set(opts.x ?? 0, opts.y ?? 0);

    const diameter = opts.size;
    const radius = diameter / 2;
    const strokeWidth = opts.strokeWidth ?? 6;
    const strokeColor = opts.strokeColor ?? 0xffffff;
    const fillColor = opts.fillColor ?? 0x000000;
    

    this.background = new Graphics();
    this.background.beginFill(fillColor);
    this.background.circle(0, 0, radius);
    this.background.endFill();
    this.addChild(this.background);
    

    this.maskCircle = new Graphics();
    this.maskCircle.beginFill(0xffffff);
    this.maskCircle.circle(0, 0, radius);
    this.maskCircle.endFill();
    this.addChild(this.maskCircle);

    
    this.image = new Sprite(opts.texture);
    this.image.anchor.set(0.5);

    const scale = diameter / Math.max(opts.texture.width, opts.texture.height);
    this.image.scale.set(scale);

    this.image.mask = this.maskCircle;
    this.addChild(this.image);
    
    this.stroke = new Graphics();
    this.stroke.beginFill(0x000000, 0);
    this.stroke.stroke({ width: strokeWidth, color: strokeColor });
    this.stroke.circle(0, 0, radius);
    this.stroke.endFill();
    this.addChild(this.stroke);
  }
}
