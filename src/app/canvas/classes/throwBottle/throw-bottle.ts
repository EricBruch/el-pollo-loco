import {
  BOTTLE_STATUS,
  GRAVITY,
  IMG_SRCs,
  IMG_SRC_KEYS,
  SCALING_FACTOR,
  Y_GROUND_LEVEL,
} from '../../constants';
import { ImageCacheService } from '../../../services/image-cache.service';

export class ThrowBottle {
  constructor(
    xPos: number,
    yPos: number,
    throwTime: number,
    private ImageCacheService: ImageCacheService
  ) {
    this.status = BOTTLE_STATUS.throw;
    this.xStartPos = xPos;
    this.yStartPos = yPos;
    this.xPos = xPos;
    this.yPos = yPos;
    this.thrownAt = throwTime;
    this.lastAnimationChangeAt = throwTime;
    this.ImgNr = 0;
    this.imgSrc = IMG_SRCs[IMG_SRC_KEYS.bottlesSpinning][this.ImgNr];
    this.scale = SCALING_FACTOR.throwBottle;
    this.opacity = 1;
  }

  private xPos: number;
  private yPos: number;
  private xStartPos: number;
  private yStartPos: number;
  private imgSrc: string;
  private scale: number;
  private opacity: number;
  private status: string;
  private thrownAt: number;
  private lastAnimationChangeAt: number;
  private ImgNr: number;

  /**
   * getImgWidth
   */
  public getImgWidth(): number {
    let img = this.ImageCacheService.getImgFromCache(this.imgSrc);
    return img.width * this.scale;
  }

  /**
   * getImgHeight
   */
  public getImgHeight(): number {
    let img = this.ImageCacheService.getImgFromCache(this.imgSrc);
    return img.height * this.scale;
  }

  /**
   * isOnGroundLevel
   */
  public isOnGroundLevel() {
    return this.yPos >= Y_GROUND_LEVEL;
  }

  public getOpacity(): number {
    return this.opacity;
  }

  public setOpacity(opacity: number): void {
    this.opacity = opacity;
  }

  /**
   * getCurrentXPosition
   */
  public getCurrentXPosition(bg_elements: number): number {
    return this.xPos + bg_elements;
  }

  public getLeftImgBorder(): number {
    return this.xPos;
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

  public setImgSrc(imgSrc: string): void {
    this.imgSrc = imgSrc;
  }

  public getScale(): number {
    return this.scale;
  }

  public setScale(scale: number): void {
    this.scale = scale;
  }

  public getStatus(): string {
    return this.status;
  }

  public setStatus(status: string): void {
    this.status = status;
    this.ImgNr = 0;
  }

  /**
   * isThrowing
   */
  public isThrowing() {
    return this.status === BOTTLE_STATUS.throw;
  }

  /**
   * moveBottle
   */
  public moveBottle(): void {
    let timePassed = new Date().getTime() - this.thrownAt;
    let g = Math.pow(GRAVITY, timePassed / 300);
    this.xPos = this.xStartPos + timePassed * 0.6;
    this.yPos = this.yStartPos - (timePassed * 0.7 - g);
  }

  /**
   * adjustAnimation
   */
  public adjustAnimation() {
    let timePassed = new Date().getTime() - this.lastAnimationChangeAt;
    if (timePassed > 100) {
      let imgNr, length;
      switch (this.status) {
        case BOTTLE_STATUS.throw:
          imgNr = this.ImgNr + 1;
          length = IMG_SRCs[IMG_SRC_KEYS.bottlesSpinning].length - 1;
          this.ImgNr = imgNr % length;
          this.imgSrc = IMG_SRCs[IMG_SRC_KEYS.bottlesSpinning][this.ImgNr];
          this.lastAnimationChangeAt = new Date().getTime();
          break;

        case BOTTLE_STATUS.splash:
          imgNr = this.ImgNr + 1;
          length = IMG_SRCs[IMG_SRC_KEYS.bottlesSplash].length - 1;
          this.ImgNr = imgNr % length;
          this.imgSrc = IMG_SRCs[IMG_SRC_KEYS.bottlesSplash][this.ImgNr];
          this.lastAnimationChangeAt = new Date().getTime();
          break;
      }
    }
  }

  /**
   * getImg
   */
  public getImg(): HTMLImageElement {
    return this.ImageCacheService.getImgFromCache(this.imgSrc);
  }

  /**
   * isSplashFinished
   */
  public isSplashFinished() {
    return (
      this.status === BOTTLE_STATUS.splash &&
      this.ImgNr === IMG_SRCs[IMG_SRC_KEYS.bottlesSpinning].length - 1
    );
  }
}
