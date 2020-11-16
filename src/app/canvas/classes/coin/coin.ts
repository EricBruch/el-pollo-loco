import { ImageCacheService } from 'src/app/services/image-cache.service';
import {
  IMG_SRCs,
  IMG_SRC_KEYS,
  SCALING_FACTOR,
  Y_COORDINATE_BASE_LEVEL,
} from '../../constants';

export class Coin {
  private posX: number;
  private posY: number;
  private scale: number;
  private opacity: number;
  private imgSrc: string;
  private imgNr: number;

  constructor(
    xCoordinate: number,
    yCoordinate: number,
    imgNr: number,
    srcPath: string,
    private ImageCacheService: ImageCacheService
  ) {
    this.posX = xCoordinate;
    this.posY = yCoordinate + Y_COORDINATE_BASE_LEVEL;
    this.imgNr = imgNr;
    this.imgSrc = srcPath;
    this.scale = SCALING_FACTOR.coin;
    this.opacity = 1;
  }

  public getImgSrc(): string {
    return this.imgSrc;
  }

  public setImgSrc(imgSrc: string): void {
    this.imgSrc = imgSrc;
  }

  public getLeftImgBorder(): number {
    return this.posX;
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

  public getCurrentXPosition(bg_elements: number): number {
    return this.posX + bg_elements;
  }

  public setPosX(posX: number): void {
    this.posX = posX;
  }

  public getPosY(): number {
    return this.posY;
  }

  public setPosY(posY: number): void {
    this.posY = posY;
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
