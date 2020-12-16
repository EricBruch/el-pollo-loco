import { ImageCacheService } from 'src/app/services/image-cache.service';
import {
  canvasSize,
  IMG_SRCs,
  IMG_SRC_KEYS,
  SCALING_FACTOR,
} from '../../constants';
import { MoveableObject } from '../moveable-object';

export class Bottle extends MoveableObject {
  constructor(xPos: number, public ImageCacheService: ImageCacheService) {
    super(ImageCacheService);
    let rnd = Math.round(Math.random() * 2);
    let srcPath = IMG_SRCs[IMG_SRC_KEYS.bottles][rnd];
    this.imgSrc = srcPath;
    this.type = rnd === 0 ? 'middle' : rnd === 1 ? 'left' : 'right';
    this.scale = SCALING_FACTOR.bottle;
    this.xPos = xPos;
    let intvID = setInterval(() => {
      this.setYPosWhenCanvasDefined(intvID);
    });
  }

  private type: string;

  /**
   * getCurrentXPosition
   */
  public getCurrentXPosition(bg_elements) {
    return this.xPos + bg_elements;
  }

  private setYPosWhenCanvasDefined(intvID: number): void {
    if (canvasSize.height && canvasSize.width) {
      this.yPos = canvasSize.height * 0.8;
      clearInterval(intvID);
    }
  }

  public getType(): string {
    return this.type;
  }
}
