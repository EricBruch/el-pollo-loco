import { Injectable } from '@angular/core';
import { Bottle } from 'src/app/canvas/classes/bottle/bottle';
import {
  BOTTLE_START_X_COORD,
  IMG_SRCs,
  IMG_SRC_KEYS,
} from 'src/app/canvas/constants';
import { bottles } from 'src/app/canvas/objects';
import { ImageCacheService } from '../../image-cache.service';

@Injectable({
  providedIn: 'root',
})
export class GenerateBottlesService {
  constructor(private ImageCacheSerice: ImageCacheService) {}

  createBottles() {
    BOTTLE_START_X_COORD.forEach((xPosBottle) => {
      let rnd = Math.round(Math.random() * 2);
      let srcPath = IMG_SRCs[IMG_SRC_KEYS.bottles];
      let bottle = new Bottle(xPosBottle, srcPath, rnd, this.ImageCacheSerice);
      bottles.push(bottle);
    });
  }
}
