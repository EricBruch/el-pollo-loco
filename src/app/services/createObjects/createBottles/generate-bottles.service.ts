import { Injectable } from '@angular/core';
import { Bottle } from 'src/app/canvas/classes/bottle/bottle';
import {
  BOTTLE_START_X_COORD,
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
      let bottle = new Bottle(xPosBottle, this.ImageCacheSerice);
      bottles.push(bottle);
    });
  }
}
