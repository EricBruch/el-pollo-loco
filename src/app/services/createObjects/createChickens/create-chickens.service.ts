import { Injectable } from '@angular/core';
import { Chicken } from 'src/app/canvas/classes/chicken/chicken';
import { CHICKEN_START_X_COORD } from 'src/app/canvas/constants';
import { chickens } from 'src/app/canvas/objects';
import { ImageCacheService } from '../../image-cache.service';


@Injectable({
  providedIn: 'root'
})
export class CreateChickensService {
  constructor(private ImageCacheSerice: ImageCacheService) { }

  createChickens() {
    CHICKEN_START_X_COORD.forEach(xPosChicken => {
      let chicken = new Chicken(xPosChicken, this.ImageCacheSerice);
      chickens.push(chicken);
    });
  }
}
