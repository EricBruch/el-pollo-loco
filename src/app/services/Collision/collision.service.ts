import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CollisionService {
  constructor() {}

  /**
   * areObjectsInCollision
   */
  public areObjectsInCollision(
    leftBorderObj_1: number,
    upperBorderObj_1: number,
    imgWidthObj_1: number,
    imgHeightObj_1: number,
    leftBorderObj_2: number,
    upperBorderObj_2: number,
    imgWidthObj_2: number,
    imgHeightObj_2: number
  ) {
    // console.log('obj 1 x: ' + leftBorderObj_1);
    // console.log('obj 1 y: ' + upperBorderObj_1);
    // console.log('obj 1 imgWidth: ' + imgWidthObj_1);
    // console.log('obj 1 imgHeight: ' + imgHeightObj_1);
    // console.log('obj 2 x: ' + leftBorderObj_2);
    // console.log('obj 2 y: ' + upperBorderObj_2);
    // console.log('obj 2 imgWidth: ' + imgWidthObj_2);
    // console.log('obj 2 imgHeight: ' + imgHeightObj_2);

    // console.log(
    //   'isObj1LeftOfObj2: ' +
    //     this.isObj1LeftOfObj2(leftBorderObj_1, imgWidthObj_1, leftBorderObj_2)
    // );
    // console.log(
    //   'isObj1RightOfObj2: ' +
    //     this.isObj1RightOfObj2(leftBorderObj_1, leftBorderObj_2, imgWidthObj_2)
    // );
    // console.log(
    //   'isObj1AboveObj2: ' +
    //     this.isObj1AboveObj2(upperBorderObj_1, imgHeightObj_1, upperBorderObj_2)
    // );
    // console.log(
    //   'isObj1BelowObj2: ' +
    //     this.isObj1BelowObj2(upperBorderObj_1, upperBorderObj_2, imgHeightObj_2)
    // );

    if (
      this.isObj1LeftOfObj2(leftBorderObj_1, imgWidthObj_1, leftBorderObj_2) ||
      this.isObj1RightOfObj2(leftBorderObj_1, leftBorderObj_2, imgWidthObj_2) ||
      this.isObj1AboveObj2(upperBorderObj_1, imgHeightObj_1, upperBorderObj_2) ||
      this.isObj1BelowObj2(upperBorderObj_1, upperBorderObj_2, imgHeightObj_2)
    ) {
      return false;
    }
    return true;
  }

  private isObj1BelowObj2(upperBorderObj_1, upperBorderObj_2, imgHeightObj_2) {
    return upperBorderObj_1 > upperBorderObj_2 + imgHeightObj_2;
  }

  private isObj1AboveObj2(
    upperBorderObj_1: number,
    imgHeightObj_1: number,
    upperBorderObj_2: number
  ) {
    return upperBorderObj_1 + imgHeightObj_1 < upperBorderObj_2;
  }

  private isObj1LeftOfObj2(
    leftBorderObj_1: number,
    imgWidthObj_1: number,
    leftBorderObj_2: number
  ) {
    return leftBorderObj_1 + imgWidthObj_1 < leftBorderObj_2;
  }

  private isObj1RightOfObj2(
    leftBorderObj_1: number,
    leftBorderObj_2: number,
    imgWidthObj_2: number
  ) {
    return leftBorderObj_1 > leftBorderObj_2 + imgWidthObj_2;
  }
}
