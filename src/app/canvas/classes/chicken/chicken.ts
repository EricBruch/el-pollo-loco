import { ImageCacheService } from 'src/app/services/image-cache.service';
import {
  canvasSize,
  IMG_SRCs,
  IMG_SRC_KEYS,
  SCALING_FACTOR,
} from '../../constants';
import { MoveableObject } from '../moveable-object';

export class Chicken extends MoveableObject {
  private imgNr: number;
  private pollito: boolean;
  private speed: number;

  constructor(xCoordinate: number, ImageCacheService: ImageCacheService) {
    super(ImageCacheService);
    this.imgNr = 0;
    this.chooseRandomChickenType();
    this.scale = SCALING_FACTOR.chicken;
    this.opacity = 1;
    this.speed = Math.random() * 15;
    this.ImageCacheService = ImageCacheService;
    this.xPos = xCoordinate;
    let intvID = setInterval(() => {
      this.setYPosWhenCanvasDefined(intvID);
    });
  }

  private chooseRandomChickenType() {
    if (Math.round(Math.random()) === 0) {
      this.imgSrc = IMG_SRCs.gallinitaWalk[0];
      this.pollito = false;
    } else {
      this.imgSrc = IMG_SRCs.pollitoWALK[0];
      this.pollito = true;
    }
  }

  public adjustImgNr(): void {
    if (this.pollito) {
      this.adjustImgNrPollito();
    } else {
      this.adjustImgNrGallinita();
    }
  }

  private setYPosWhenCanvasDefined(intvID: number): void {
    if (canvasSize.height && canvasSize.width) {
      this.yPos = canvasSize.height * 0.85;
      clearInterval(intvID);
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

  public moveChicken(): void {
    this.xPos = this.xPos - this.speed;
  }

  /**
   * getCurrentXPosition
   */
  public getCurrentXPosition(bg_elements: number) {
    return this.xPos + bg_elements;
  }

  public getSpeed(): number {
    return this.speed;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }
}
