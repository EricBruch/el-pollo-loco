import { Injectable } from '@angular/core';
import { IMG_SRCs } from '../canvas/constants';
import { imgCache } from "../canvas/objects";

@Injectable({
  providedIn: 'root',
})
export class ImageCacheService {
  constructor() {}

  /**
   * getImgFromCache returns the img with the provided source string from cache.
   * It checks the cache against the provided string for the img.
   * If an img can't be find a new one will be created from the source string.
   */
  public getImgFromCache(src_path: string) {
    let img = imgCache.find((c_img) => {
      c_img.src.endsWith(src_path);
    });
    if (!img) {
      img = new Image();
      img.src = src_path;
    }
    return img;
  }

  /**
   * getImgIndexFromCache returns Index of the img with the source string from the cache.
   * It checks the Img cache against the provided source string.
   * If the img can't be find undefined will be returned
   */
  public getImgIndexFromCache(src_path: string) {
    return imgCache.findIndex((c_img) => {
      c_img.src.endsWith(src_path);
    });
  }

  /**
   * getImgSrcPathByKey returns source Path of the img with provided key and index
   * The functions searches for the key within Img sources and returns the source path for index.
   * If the key is not found a warning is logged.
   */
  public getImgSrcPathByKey(key: string, i: number) {
    let result;
    Object.keys(IMG_SRCs).forEach(element => {
      if (element === key) {
        result = true;
      }
    });
    // FRAGE: Warum funktioniert das nicht
    // let result = Object.keys(IMG_SRCs).find((element) => {
    //   element === key;
    // });
    // console.log(result);
    
    if (result) {
      return IMG_SRCs[key][i];
    } else {
      console.warn('getImgSrcPathByKey used key: ' + key + ' does not exist');
      return undefined;
    }
  }
}
