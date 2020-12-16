import { SCALING_FACTOR } from '../constants';
import { ImageCacheService } from 'src/app/services/image-cache.service';

export abstract class MoveableObject {
  constructor(public ImageCacheService: ImageCacheService) {}

  protected xPos: number;
  protected yPos: number;
  protected imgSrc: string;
  protected scale: number;
  protected opacity: number;

  public getOpacity(): number {
    return this.opacity;
  }

  public setOpacity(opacity: number): void {
    this.opacity = opacity;
  }

  /**
   * getLeftImgBorder
   */
  public getLeftImgBorder(): number {
    return this.xPos;
  }

  public setX_Pos(xPos: number): void {
    this.xPos = xPos;
  }

  /**
   * getUpperImgBorder
   */
  public getUpperImgBorder(): number {
    return this.yPos;
  }

  public setY_Pos(yPos: number): void {
    this.yPos = yPos;
  }

  public getImgSrc(): string {
    return this.imgSrc;
  }

  public setImgSrc(imgSrc: string): void {
    this.imgSrc = imgSrc;
  }

  /**
   * getScale
   */
  public getScale(): SCALING_FACTOR {
    return this.scale;
  }

  /**
   * getImgWidth
   */
  public getImgWidth() {
    let img = this.ImageCacheService.getImgFromCache(this.imgSrc);
    return img.width * this.scale;
  }

  /**
   * getImgHeight
   */
  public getImgHeight() {
    let img = this.ImageCacheService.getImgFromCache(this.imgSrc);
    return img.height * this.scale;
  }

  /**
   * return the img of this object
   */
  public getImg(): HTMLImageElement {
    return this.ImageCacheService.getImgFromCache(this.imgSrc);
  }
}
