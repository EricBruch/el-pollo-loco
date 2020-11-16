import { Injectable } from '@angular/core';
import { CreateChickensService } from '../createObjects/createChickens/create-chickens.service';
import { CreateCoinsService } from '../createObjects/createCoins/create-coins.service';

@Injectable({
  providedIn: 'root',
})
export class LoadResourcesService {
  constructor(
    private CreateCoinsService: CreateCoinsService,
    private CreateChickenService: CreateChickensService
  ) {}

  /**
   * loadResources
   */
  public loadResources() {
    this.CreateCoinsService.createCoins();
    this.CreateChickenService.createChickens();
  }
}
