import {
  BOTTLE_STATUS,
  canvasSize,
  GRAVITY,
  IMG_SRCs,
  IMG_SRC_KEYS,
  SCALING_FACTOR,
} from '../../constants';
import { ImageCacheService } from '../../../services/image-cache.service';
import { MoveableObject } from '../moveable-object';

export class ThrowBottle extends MoveableObject {
  constructor(
    xPos: number,
    yPos: number,
    throwTime: number,
    public ImageCacheService: ImageCacheService
  ) {
    super(ImageCacheService);
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

  private xStartPos: number;
  private yStartPos: number;
  private status: string;
  private thrownAt: number;
  private lastAnimationChangeAt: number;
  private ImgNr: number;

  /**
   * isOnGroundLevel
   */
  public isOnGroundLevel() {
    return this.yPos >= canvasSize.yGroundLevel;
  }

  /**
   * getCurrentXPosition
   */
  public getCurrentXPosition(bg_elements: number): number {
    return this.xPos + bg_elements;
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
   * isSplashFinished
   */
  public isSplashFinished() {
    return (
      this.status === BOTTLE_STATUS.splash &&
      this.ImgNr === IMG_SRCs[IMG_SRC_KEYS.bottlesSpinning].length - 1
    );
  }
}
