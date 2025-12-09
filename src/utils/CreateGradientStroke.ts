import { Container, Sprite, Graphics, Texture } from "pixi.js";

export function createGradientCircleStroke(
  radius: number,
  strokeWidth: number,
  gradientTex: Texture
) {
  const container = new Container();
  const gradientSprite = new Sprite(gradientTex);
  gradientSprite.anchor.set(0.5);
  gradientSprite.width = radius * 2;
  gradientSprite.height = radius * 2;
  

  const outerMask = new Graphics()
    .beginFill(0xffffff)
    .drawCircle(0, 0, radius)
    .endFill();
    

  const innerMask = new Graphics()
    .beginFill(0x000000)
    .drawCircle(0, 0, radius - strokeWidth)
    .endFill();

  innerMask.blendMode = "erase";
    
  const finalMask = new Container();
  finalMask.addChild(outerMask);
  finalMask.addChild(innerMask);
  
  finalMask.eventMode = "none";

  gradientSprite.mask = finalMask;

  container.addChild(gradientSprite);
  container.addChild(finalMask);

  return container;
}
