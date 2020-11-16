import { ImageCacheService } from 'src/app/services/image-cache.service';
import {
  IMG_SRCs,
  IMG_SRC_KEYS,
  SCALING_FACTOR,
  yPositions,
} from '../../constants';

export class Chicken {
  private imgNr: number;
  private imgSrc: string;
  private pollito: boolean;
  private posX: number;
  private posY: number;
  private scale: number;
  private opacity: number;
  private speed: number;
  private ImageCacheService: ImageCacheService;

  constructor(xCoordinate: number, ImageCacheService: ImageCacheService) {
    this.imgNr = 0;
    if (Math.round(Math.random()) === 0) {
      this.imgSrc = IMG_SRCs.gallinitaWalk[0];
      this.pollito = false;
    } else {
      this.imgSrc = IMG_SRCs.pollitoWALK[0];
      this.pollito = true;
    }
    this.posX = xCoordinate;
    this.posY = yPositions.chicken;
    this.scale = SCALING_FACTOR.chicken;
    this.opacity = 1;
    this.speed = Math.random() * 15;
    this.ImageCacheService = ImageCacheService;
  }

  public getImgSrc(): string {
    return this.imgSrc;
  }

  public adjustImgNr(): void {
    if (this.pollito) {
      this.adjustImgNrPollito();
    } else {
      this.adjustImgNrGallinita();
    }
  }

  private adjustImgNrGallinita() {
    let imgNr = this.imgNr + 1;
    let imgNrLength = IMG_SRCs[IMG_SRC_KEYS.gallinitaWalk].length;
    this.imgNr = imgNr % imgNrLength;
    this.imgSrc = this.ImageCacheService.getImgSrcPathByKey(
      IMG_SRC_KEYS.gallinitaWalk,
      this.imgNr
    );
  }

  private adjustImgNrPollito() {
    let imgNr = this.imgNr + 1;
    let imgNrLength = IMG_SRCs[IMG_SRC_KEYS.pollitoWALK].length;
    this.imgNr = imgNr % imgNrLength;
    this.imgSrc = this.ImageCacheService.getImgSrcPathByKey(
      IMG_SRC_KEYS.pollitoWALK,
      this.imgNr
    );
  }

  public getImgNr(): number {
    return this.imgNr;
  }

  public setImgNr(imgNr: number): void {
    this.imgNr = imgNr;
  }

  public getLeftImgBorder(): number {
    return this.posX;
  }

  public moveChicken(): void {
    this.posX = this.posX - this.speed;
  }

  /**
   * getCurrentXPosition
   */
  public getCurrentXPosition(bg_elements: number) {
    return this.posX + bg_elements;
  }

  /**
   * getUpperImgBorder
   */
  public getUpperImgBorder() {
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

  public getSpeed(): number {
    return this.speed;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  /**
   * getImgWidth
   */
  public getImgWidth(): number {
    let img = this.ImageCacheService.getImgFromCache(this.imgSrc);
    return img.width * SCALING_FACTOR.chicken;
  }

  /**
   * getImgHeight
   */
  public getImgHeight(): number {
      let img = this.ImageCacheService.getImgFromCache(this.imgSrc);
      return img.height * SCALING_FACTOR.chicken;
  }

  /**
   * getImg
   */
  public getImg(): HTMLImageElement {
     return this.ImageCacheService.getImgFromCache(this.imgSrc);

  }
}
