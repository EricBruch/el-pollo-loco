import { ImageCacheService } from 'src/app/services/image-cache.service';
import {
  IMG_SRCs,
  IMG_SRC_KEYS,
  SCALING_FACTOR,
  canvasSize,
} from '../../constants';
import { MoveableObject } from '../moveable-object';

export class Coin extends MoveableObject {
  private imgNr: number;

  constructor(
    xCoordinate: number,
    public ImageCacheService: ImageCacheService
  ) {
    super(ImageCacheService);
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
}
