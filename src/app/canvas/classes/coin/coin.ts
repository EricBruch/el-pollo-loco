import { ImageCacheService } from 'src/app/services/image-cache.service';
import {
  IMG_SRCs,
  IMG_SRC_KEYS,
  SCALING_FACTOR,
  CHAR_Y_START,
  canvasSize,
} from '../../constants';

export class Coin {
  private xPos: number;
  private yPos: number;
  private scale: number;
  private opacity: number;
  private imgSrc: string;
  private imgNr: number;

  constructor(
    xCoordinate: number,
    private ImageCacheService: ImageCacheService
  ) {
    this.imgNr = Math.round(Math.random());
    let srcPath = this.ImageCacheService.getImgSrcPathByKey(
      'coins',
      this.imgNr
    );
    this.imgSrc = srcPath;
    this.scale = SCALING_FACTOR.coin;
    this.opacity = 1;
    this.xPos = xCoordinate;
    let intvID = setInterval(() => {
      this.setYPosWhenCanvasDefined(intvID);
    });
  }

  public getImgSrc(): string {
    return this.imgSrc;
  }

  public setImgSrc(imgSrc: string): void {
    this.imgSrc = imgSrc;
  }

  public getLeftImgBorder(): number {
    return this.xPos;
  }

  public getImgNr(): number {
    return this.imgNr;
  }

  public adjustImgNr(): void {
    let imgNr = this.imgNr + 1;
    let imgNrLength = IMG_SRCs[IMG_SRC_KEYS.coins].length;
    this.imgNr = imgNr % imgNrLength;
    this.imgSrc = this.ImageCacheService.getImgSrcPathByKey(
      IMG_SRC_KEYS.coins,
      this.imgNr
    );
  }

  private setYPosWhenCanvasDefined(intvID) {
    if (canvasSize.height && canvasSize.width) {
      this.yPos =
        canvasSize.height * 0.73 -
        canvasSize.height * this.getRndNumber(0, 0.35);
      clearInterval(intvID);
    }
  }

  private getRndNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  public getCurrentXPosition(bg_elements: number): number {
    return this.xPos + bg_elements;
  }

  public setXPos(xPos: number): void {
    this.xPos = xPos;
  }

  public getYPos(): number {
    return this.yPos;
  }

  public setYPos(yPos: number): void {
    this.yPos = yPos;
  }

  public getScale(): number {
    return this.scale;
  }

  public setScale(scale: number): void {
    this.scale = scale;
  }

  public getOpacity(): number {
    return this.opacity;
  }

  public setOpacity(opacity: number): void {
    this.opacity = opacity;
  }

  /**
   * getImgWidth
   */
  public getImgWidth() {
    let img = this.ImageCacheService.getImgFromCache(this.imgSrc);
    return img.width * SCALING_FACTOR.coin;
  }

  /**
   * getImgHeight
   */
  public getImgHeight() {
    let img = this.ImageCacheService.getImgFromCache(this.imgSrc);
    return img.height * SCALING_FACTOR.coin;
  }
}
