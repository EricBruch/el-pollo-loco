import { ImageCacheService } from '../../../services/image-cache.service';
import { SCALING_FACTOR, yPositions } from '../../constants';
export class Bottle {
  constructor(
    xPos: number,
    srcPath: string,
    type: number,
    private ImageCacheSerice: ImageCacheService
  ) {
    this.xPos = xPos;
    this.yPos = yPositions.bottles;
    this.imgSrc = srcPath;
    this.type = type === 0 ? 'middle' : type === 1 ? 'left' : 'right';
    this.scale = SCALING_FACTOR.bottle;
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
