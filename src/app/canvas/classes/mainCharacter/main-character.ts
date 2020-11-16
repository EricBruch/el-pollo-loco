import {
  X_COORDINATE_BASE_LEVEL,
  Y_COORDINATE_BASE_LEVEL,
  IMG_SRCs,
  IDLE_ANIMATION_SWITCH,
  JUMP_SPEED,
  JUMP_ANIMATION_SWITCH,
  JUMP_TIME,
  RIGHT_BORDER,
  WALK_SPEED,
  WALK_ANIMATION_SWITCH,
  LEFT_BORDER,
  AUDIO,
  SCALING_FACTOR,
  CHARACTER_LIVES,
} from './../../constants';
import { ImageCacheService } from '../../../services/image-cache.service';
import { coins, imgCache } from '../../objects';

export class MainCharacter {
  private x_coordinate: number;
  private y_coordinate: number;
  public collBottles: number;
  private collCoins: number;
  private lives: number;
  private isIdle: boolean;
  private isLongIdle: boolean;
  private isJumping: boolean;
  private isFalling: boolean;
  private isRunningRight: boolean;
  private isRunningLeft: boolean;
  private isHit: boolean;
  private lastJumpStarted: number;
  private lastJumpAnimationStarted: number;
  private lastIdleStarted: number;
  private lastWalkStarted: number;
  private lastHitHappened: number;
  private lastHitAnimation: number;
  private lastBottleThrowTime: number;
  private img: HTMLImageElement;
  private imgSrc: string;
  private idleImg: number;
  private walkImg: number;
  private jumpImg: number;
  private hitImg: number;
  private deadImg: number;
  private canvasComponent;

  constructor(component, private ImageCacheService: ImageCacheService) {
    this.canvasComponent = component;
    this.lives = CHARACTER_LIVES;
    this.x_coordinate = X_COORDINATE_BASE_LEVEL;
    this.y_coordinate = Y_COORDINATE_BASE_LEVEL;
    this.isIdle = true;
    this.isLongIdle = true;
    this.isJumping = false;
    this.isFalling = false;
    this.isRunningRight = false;
    this.isRunningLeft = false;
    this.isHit = false;
    this.lastJumpStarted = 0;
    this.lastJumpAnimationStarted = 0;
    this.lastIdleStarted = 0;
    this.lastWalkStarted = 0;
    this.lastHitHappened = 0;
    this.lastHitAnimation = 0;
    this.lastBottleThrowTime = 0;
    this.img = new Image();
    this.imgSrc = IMG_SRCs.charIdle[0];
    this.img.src = this.imgSrc;
    this.idleImg = 0;
    this.walkImg = 0;
    this.jumpImg = 0;
    this.hitImg = 0;
    this.deadImg = 0;
    this.collBottles = 50;
    this.collCoins = 0;
  }

  /**
   * getLeftImgBorder
   */
  public getLeftImgBorder() {
    return this.x_coordinate;
  }

  /**
   * getUpperImgBorder
   */
  public getUpperImgBorder() {
    return this.y_coordinate;
  }

  /**
   * getImgWidth
   */
  public getImgWidth() {
    let img = this.ImageCacheService.getImgFromCache(this.imgSrc);
    return img.width * SCALING_FACTOR.mainChar;
  }

  /**
   * getImgHeight
   */
  public getImgHeight() {
    let img = this.ImageCacheService.getImgFromCache(this.imgSrc);
    return img.height * SCALING_FACTOR.mainChar;
  }

  /**
   * collectCoin
   */
  public collectCoin(i: number) {
    this.collCoins++;
    coins.splice(i, 1);
  }

  /**
   * collBottle
   */
  public collBottle(i: number) {
    this.collBottles++;
    this.canvasComponent.bottles.placedB.splice(i, 1);
  }
  public setX_coordinate(x_coordinate: number): void {
    this.x_coordinate = x_coordinate;
  }

  public setY_coordinate(y_coordinate: number): void {
    this.y_coordinate = y_coordinate;
  }

  public getCollBottles(): number {
    return this.collBottles;
  }

  public setCollBottles(collBottles: number): void {
    this.collBottles = collBottles;
  }

  public getCollCoins(): number {
    return this.collCoins;
  }

  public SetRunningLeft(b: boolean) {
    this.isRunningLeft = b;
  }

  public SetRunningRight(b: boolean) {
    this.isRunningRight = b;
  }

  public getLives() {
    return this.lives;
  }

  public isIsIdle(): boolean {
    return this.isIdle;
  }

  public isIsLongIdle(): boolean {
    return this.isLongIdle;
  }

  public isIsJumping(): boolean {
    return this.isJumping;
  }

  public isIsFalling(): boolean {
    return this.isFalling;
  }

  public isIsRunningRight(): boolean {
    return this.isRunningRight;
  }

  public isIsRunningLeft(): boolean {
    return this.isRunningLeft;
  }

  public isIsHit(): boolean {
    return this.isHit;
  }

  public getLastJumpStarted(): number {
    return this.lastJumpStarted;
  }

  public getLastJumpAnimationStarted(): number {
    return this.lastJumpAnimationStarted;
  }

  public getLastIdleStarted(): number {
    return this.lastIdleStarted;
  }

  public getLastWalkStarted(): number {
    return this.lastWalkStarted;
  }

  public getLastHitHappened(): number {
    return this.lastHitHappened;
  }

  public getLastHitAnimation(): number {
    return this.lastHitAnimation;
  }

  public getLastBottleThrowTime(): number {
    return this.lastBottleThrowTime;
  }

  public getImgSrc(): string {
    return this.imgSrc;
  }

  public setImgSrc(imgSrc: string): void {
    this.imgSrc = imgSrc;
  }

  public getIdleImg(): number {
    return this.idleImg;
  }

  public setIdleImg(idleImg: number): void {
    this.idleImg = idleImg;
  }

  public getWalkImg(): number {
    return this.walkImg;
  }

  public setWalkImg(walkImg: number): void {
    this.walkImg = walkImg;
  }

  public getJumpImg(): number {
    return this.jumpImg;
  }

  public setJumpImg(jumpImg: number): void {
    this.jumpImg = jumpImg;
  }

  public getHitImg(): number {
    return this.hitImg;
  }

  public setHitImg(hitImg: number): void {
    this.hitImg = hitImg;
  }

  public getDeadImg(): number {
    return this.deadImg;
  }

  public setDeadImg(deadImg: number): void {
    this.deadImg = deadImg;
  }

  public isRunning() {
    return this.isRunningLeft == true || this.isRunningRight == true;
  }

  public isLanding(border: number) {
    return this.y_coordinate < border && this.jumpImg > 6 && this.jumpImg < 9;
  }

  public getMainCharImg() {
    // console.log('imgSrc: ' + this.imgSrc);
    // console.log('img: ' + this.img);
    // console.log(imgCache);

    // imgCache.forEach((element) => {
    //   if (element.src.endsWith(this.imgSrc)) {
    //     return (this.img = element); // weird not working
    //     // return this.img;
    //   }
    // });

    this.img = imgCache.find((img) => {
      img.src.endsWith(this.imgSrc);
    });

    // create new Image if not found in cache
    if (!this.img) {
      this.img = new Image();
      this.img.src = this.imgSrc;
      // return this.img; // weird not working
    }
    return this.img;
  }

  // checkCollision(
  //   x_Obj: number,
  //   y: number,
  //   objImgWidth: number,
  //   objImgHeight: number
  // ) {
  //   console.log('coin x_Obj: ' + x_Obj);
  //   console.log('coin y: ' + y);
  //   console.log('char x_Obj: ' + this.x_coordinate);
  //   console.log('char y: ' + this.y_coordinate);
  //   console.log('bg_elements: ' + this.canvasComponent.bg_elements);
  //   console.log(imgCache[104]);
  //   console.log(imgCache[104].width);
  //   console.log(imgCache[104].height);

  //   if (this.isObjLeftOfCharacter(x_Obj, objImgWidth) || this.isObjRightOfCharacter()) {

  //   } else {

  //   }
  //   // this.isOverlappingLeftBorder(x_Obj, objImgWidth) &&
  //   // this.isOverlappingRightBorder() x_Obj <= this.x_coordinate + this.img.width &&
  //   // y + objImgHeight >= this.y_coordinate &&
  //   // y <= this.y_coordinate + this.img.height
  // }

  // private isObjRightOfCharacter(x_Obj: number, objImgWidth: number) {

  // }

  // private isObjLeftOfCharacter(x_Obj: number, objImgWidth: number) {
  //   return (
  //     x_Obj + objImgWidth + this.canvasComponent.bg_elements <
  //     this.x_coordinate - this.canvasComponent.bg_elements
  //   );
  // }

  // private isOverlappingRightBorder() {}

  // private isOverlappingLeftBorder(x_Obj: number, objImgWidth: number) {
  //   return (
  //     this.x_coordinate + this.img.width - this.canvasComponent.bg_elements >=
  //       x_Obj + this.canvasComponent.bg_elements && this.isCharInside
  //   );
  // }

  public updateCharacterIdle() {
    if (this.isIdle && !this.isHit && !this.canvasComponent.charLostAt) {
      this.updateIdleState();
    }
    if (this.isLongIdle && !this.isHit && !this.canvasComponent.charLostAt) {
      this.updateLongIdleState();
    }
  }

  private updateIdleState() {
    let diff = new Date().getTime() - this.lastIdleStarted;
    if (diff > IDLE_ANIMATION_SWITCH) {
      let n = IMG_SRCs.charIdle.length;
      if (this.idleImg < n) {
        let src = IMG_SRCs.charIdle[this.idleImg++ % IMG_SRCs.charIdle.length];
        this.imgSrc = src;
        this.lastIdleStarted = new Date().getTime();
      } else {
        this.isIdle = false;
        this.isLongIdle = true;
        this.idleImg = 0;
      }
    }
  }

  private updateLongIdleState() {
    let diff = new Date().getTime() - this.lastIdleStarted;
    if (diff > IDLE_ANIMATION_SWITCH) {
      let src =
        IMG_SRCs.charLongIdle[this.idleImg++ % IMG_SRCs.charLongIdle.length];
      this.imgSrc = src;
      this.lastIdleStarted = new Date().getTime();
    }
  }

  public updateJumpCharacter() {
    let diffJump = new Date().getTime() - this.lastJumpStarted;
    let diffJumpAnim = new Date().getTime() - this.lastJumpAnimationStarted;
    if (this.isJumping == true) {
      this.updateJump(diffJump, diffJumpAnim);
    } else {
      this.updateFall();
    }
  }

  private updateJump(diffJump: number, diffJumpAnim: number) {
    this.y_coordinate -= JUMP_SPEED;
    this.adjustJumpAnimation(diffJumpAnim);
    this.checkForJumpingPeak(diffJump);
  }

  privat;
  adjustJumpAnimation(diffJumpAnim: number) {
    if (
      diffJumpAnim > JUMP_ANIMATION_SWITCH &&
      this.jumpImg < 7 &&
      !this.isHit &&
      !this.canvasComponent.charLostAt
    ) {
      this.imgSrc = IMG_SRCs.charJump[++this.jumpImg];
      this.lastJumpAnimationStarted = new Date().getTime();
    }
  }

  private checkForJumpingPeak(diffJump: number) {
    if (diffJump > JUMP_TIME) {
      this.isJumping = false;
      this.isFalling = true;
    }
  }

  private updateFall() {
    this.y_coordinate += JUMP_SPEED;
    this.adjustLandingAnimation();
    this.adjustIfJumpEnd();
  }

  private adjustLandingAnimation() {
    let border = Y_COORDINATE_BASE_LEVEL - 0.05 * Y_COORDINATE_BASE_LEVEL;
    if (
      this.isLanding(border) &&
      !this.isHit &&
      !this.canvasComponent.charLostAt
    ) {
      let src = IMG_SRCs.charJump[++this.jumpImg % IMG_SRCs.charJump.length];
      this.imgSrc = src;
    }
  }

  public isInJumpProcess() {
    return this.isJumping == true || this.isFalling == true;
  }

  private adjustIfJumpEnd() {
    if (this.y_coordinate >= Y_COORDINATE_BASE_LEVEL) {
      this.isFalling = false;
      this.jumpImg = 0;
      this.resetIdle();
      if (!this.isRunning()) {
        this.isIdle = true;
      }
    }
  }

  private resetIdle() {
    this.idleImg = 0;
    this.lastIdleStarted = new Date().getTime();
  }

  /**
   * name
   */
  public updateRunningState() {
    this.checkRunningLeft();
    this.checkRunningRight();
  }

  private checkRunningLeft() {
    if (
      this.isRunningRight &&
      this.canvasComponent.bg_elements > RIGHT_BORDER
    ) {
      this.adjustAudioForJump();
      this.canvasComponent.bg_elements -= WALK_SPEED;
      this.adjustWalkAnimation();
    }
  }

  private checkRunningRight() {
    if (this.isRunningLeft && this.canvasComponent.bg_elements < LEFT_BORDER) {
      this.adjustAudioForJump();
      this.canvasComponent.bg_elements += WALK_SPEED;
      this.adjustWalkAnimation();
    }
  }

  private adjustAudioForJump() {
    if (this.isInJumpProcess() && !AUDIO.RUNNING.paused) {
      AUDIO.RUNNING.pause();
    }
    if (!this.isInJumpProcess() && AUDIO.RUNNING.paused) {
      AUDIO.RUNNING.play();
    }
  }

  private adjustWalkAnimation() {
    if (!this.isJumping && !this.isHit) {
      let diff = new Date().getTime() - this.lastWalkStarted;
      if (diff > WALK_ANIMATION_SWITCH) {
        this.changeWalkAnimation();
      }
    }
  }

  private changeWalkAnimation() {
    let src = IMG_SRCs.charWalk[this.walkImg++ % IMG_SRCs.charWalk.length];
    this.imgSrc = src;
    this.lastWalkStarted = new Date().getTime();
  }

  public updateCharacterHit() {
    let timePassed = new Date().getTime() - this.lastHitAnimation;
    if (this.isHit && timePassed > 70) {
      let n = this.hitImg++;
      if (n < IMG_SRCs.charHit.length) {
        this.imgSrc = IMG_SRCs.charHit[n];
        this.lastHitAnimation = new Date().getTime();
      } else {
        this.hitImg = 0;
        this.isHit = false;
      }
    }
  }

  public updateCharacterDead() {
    let timePassed = new Date().getTime() - this.canvasComponent.charLostAt;
    if (this.canvasComponent.charLostAt && timePassed > 100) {
      let n = this.deadImg++;
      if (n < IMG_SRCs.charDead.length) {
        this.imgSrc = IMG_SRCs.charDead[n];
        this.canvasComponent.charLostAt = new Date().getTime();
      }
    }
  }

  public performCharHit() {
    this.lives--;
    this.lastHitHappened = new Date().getTime();
    this.isHit = true;
  }

  /**
   * endRunningState
   */
  public endRunningStateLeft() {
    this.resetIdle();
    this.isIdle = true;
    this.imgSrc = IMG_SRCs.charIdle[0];
    this.isRunningLeft = false;
  }

  /**
   * endRunningStateRight
   */
  public endRunningStateRight() {
    this.resetIdle();
    this.isIdle = true;
    this.imgSrc = IMG_SRCs.charIdle[0];
    this.isRunningRight = false;
  }

  /**
   * startBottleThrow
   */
  public startBottleThrow() {
    this.collBottles--;
    this.lastBottleThrowTime = new Date().getTime();
    AUDIO.THROW_BOTTLE.play();
  }

  /**
   * startRunning
   */
  public startRunningLeft() {
    this.isRunningLeft = true;
    this.isIdle = false;
  }

  public startRunningRight() {
    this.isRunningRight = true;
    this.isIdle = false;
  }

  /**
   * startJump
   */
  public startJump() {
    this.lastJumpStarted = new Date().getTime();
    this.isJumping = true;
    this.isIdle = false;
  }
}
