import { Injectable } from '@angular/core';
import { CreateCoinsService } from "../createObjects/createCoins/create-coins.service";

@Injectable({
  providedIn: 'root'
})
export class LoadResourcesService {

  constructor(private CreateCoinsService: CreateCoinsService) { 

  }
  
  /**
   * loadResourceLog
   */
  public loadResourceLog() {
    this.CreateCoinsService.CreateCoinsServiceLog();
    console.log('log from loadResourcesService');   
  }
  
  /**
   * loadResources
   */
  public loadResources() {
    this.CreateCoinsService.createCoins();
  }
}
