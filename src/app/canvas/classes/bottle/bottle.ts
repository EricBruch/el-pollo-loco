import { ImageCacheService } from '../../../services/image-cache.service';
import { canvasSize, IMG_SRCs, IMG_SRC_KEYS, SCALING_FACTOR } from '../../constants';
export class Bottle {
  constructor(
    xPos: number,
    private ImageCacheSerice: ImageCacheService
  ) {
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

  private xPos: number;
  private yPos: number;
  private imgSrc: string;
  private type: string;
  private scale: number;

  /**
   * getCurrentXPosition
   */
  public getCurrentXPosition(bg_elements) {
    return this.xPos + bg_elements;
  }

  private setYPosWhenCanvasDefined(intvID: number): void {
    if (canvasSize.height && canvasSize.width) {
      this.yPos = canvasSize.height * 0.80;
      clearInterval(intvID);
    }
  }

  public getLeftImgBorder(): number {
    return this.xPos;
  }

  public getScale(): SCALING_FACTOR.bottle {
    return this.scale;
  }

  public setScale(scale: SCALING_FACTOR.bottle): void {
    this.scale = scale;
  }

  public setXPos(xPos: number): void {
    this.xPos = xPos;
  }

  public getUpperImgBorder(): number {
    return this.yPos;
  }

  public setYPos(yPos: number): void {
    this.yPos = yPos;
  }

  public getImgSrc(): string {
    return this.imgSrc;
  }

  public getType(): string {
    return this.type;
  }

  /**
   * getImgWidth
   */
  public getImgWidth() {
    let img = this.ImageCacheSerice.getImgFromCache(this.imgSrc);
    return img.width * this.scale;
  }

  /**
   * getImgHeight
   */
  public getImgHeight() {
    let img = this.ImageCacheSerice.getImgFromCache(this.imgSrc);
    return img.height * this.scale;
  }
}
