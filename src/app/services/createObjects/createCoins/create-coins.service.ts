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
      let coin = new Coin(xPos, this.ImageCacheService);
      coins.push(coin);
    });
  }
}
