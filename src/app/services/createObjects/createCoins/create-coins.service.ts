import { Injectable } from '@angular/core';
import { Coin } from 'src/app/canvas/classes/coin/coin';
import { COINS_START_X_COORD, IMG_SRCs } from 'src/app/canvas/constants';
import { coins } from 'src/app/canvas/objects';
import { ImageCacheService } from '../../image-cache.service';

@Injectable({
  providedIn: 'root',
})
export class CreateCoinsService {
  constructor(private ImageCacheService: ImageCacheService) {}

  /**
   * createCoins
   */
  public createCoins() {
    COINS_START_X_COORD.forEach((xPos) => {
      let yPosRnd = Math.round(Math.random() * 250);
      let imgNr = Math.round(Math.random() * (IMG_SRCs['coins'].length - 1));
      let srcPath = this.ImageCacheService.getImgSrcPathByKey('coins', imgNr);
      let coin = new Coin(
        xPos,
        yPosRnd,
        imgNr,
        srcPath,
        this.ImageCacheService
      );
      coins.push(coin);
    });
  }
}
