import {
  CHAR_X_POS,
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
  IDLE_ANIMATION_START,
  canvasSize,
  CHAR_COLL_BOTTLES,
} from './../../constants';
import { ImageCacheService } from '../../../services/image-cache.service';
import { bottles, coins, imgCache, scalingFactorAdjustment } from '../../objects';
import { getAdjustedScalingFactor } from '../../utils/utils';

export class MainCharacter {
  private xPos: number;
  private yPos: number;
  private yGroundLevel: number;
  public collBottles: number;
  private collCoins: number;
  private lives: number;
  private isIdle: boolean;
  private isLongIdle: boolean;
  private isJumping: boolean;
  private isFalling: boolean;
  private isLanding: boolean;
  private isRunningRight: boolean;
  private isRunningLeft: boolean;
  private isHit: boolean;
  private lastJumpStarted: number;
  private lastJumpAnimationStarted: number;
  private lastIdleStarted: number;
  private lastIdleAnimationStarted: number;
  private lastWalkStarted: number;
  private lastHitHappened: number;
  private lastHitAnimation: number;
  private lastBottleThrowTime: number;
  private imgSrc: string;
  private idleImg: number;
  private walkImg: number;
  private jumpImg: number;
  private hitImg: number;
  private deadImg: number;
  private canvasComponent;
  private scale: number;

  constructor(component, private ImageCacheService: ImageCacheService) {
    this.canvasComponent = component;
    this.lives = CHARACTER_LIVES;
    this.isIdle = false;
    this.isLongIdle = false;
    this.isJumping = false;
    this.isFalling = false;
    this.isLanding = false;
    this.isRunningRight = false;
    this.isRunningLeft = false;
    this.isHit = false;
    this.lastJumpStarted = 0;
    this.lastJumpAnimationStarted = 0;
    this.lastIdleStarted = 0;
    this.lastIdleAnimationStarted = 0;
    this.lastWalkStarted = 0;
    this.lastHitHappened = 0;
    this.lastHitAnimation = 0;
    this.lastBottleThrowTime = 0;
    this.imgSrc = IMG_SRCs.charIdle[0];
    this.idleImg = 0;
    this.walkImg = 0;
    this.jumpImg = 0;
    this.hitImg = 0;
    this.deadImg = 0;
    this.collBottles = CHAR_COLL_BOTTLES;
    this.collCoins = 0;
    this.xPos = CHAR_X_POS;
    this.scale = SCALING_FACTOR.mainChar;
    let intervallID = setInterval(() => {
      this.setYPosWhenCanvasDefined(intervallID);
    }, 50);
  }

  /**
   * getXThrowPosition
   */
  public getXThrowPosition(): number {
    let scaleX = getAdjustedScalingFactor(
      SCALING_FACTOR.throwBottle,
      scalingFactorAdjustment.x_ScalingAdjustment
    )
    return this.xPos - this.canvasComponent.bg_elements + 450 * scaleX;
  }

  private setYPosWhenCanvasDefined(intervallID) {
    if (canvasSize.height && canvasSize.width) {
      this.yPos = canvasSize.height * 0.5;
      this.yGroundLevel = this.yPos;
      clearInterval(intervallID);
    }
  }

  /**
   * getYThrowPosition
   */
  public getYThrowPosition(): number {
    return this.yPos + canvasSize.height * 0.21;
  }
  /**
   * getLeftImgBorder
   */
  public getLeftImgBorder(): number {
    return this.xPos;
  }

  /**
   * getUpperImgBorder
   */
  public getUpperImgBorder(): number {
    return this.yPos;
  }

  /**
   * getImgWidth
   */
  public getImgWidth(): number {
    let img = this.ImageCacheService.getImgFromCache(this.imgSrc);
    return img.width * SCALING_FACTOR.mainChar;
  }

  /**
   * getImgHeight
   */
  public getImgHeight(): number {
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
    bottles.splice(i, 1);
  }
  public setX_coordinate(xPos: number): void {
    this.xPos = xPos;
  }

  public setY_coordinate(yPos: number): void {
    this.yPos = yPos;
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

  public getLives(): number {
    return this.lives;
  }

  public isIsIdle(): boolean {
    return this.isIdle;
  }

  public isIsLongIdle(): boolean {
    return this.isLongIdle;
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

  public getLastIdleAnimationStarted(): number {
    return this.lastIdleAnimationStarted;
  }

  public setLastIdleAnimationStarted(lastIdleAnimationStarted: number): void {
    this.lastIdleAnimationStarted = lastIdleAnimationStarted;
  }

  public isRunning(): boolean {
    return this.isRunningLeft == true || this.isRunningRight == true;
  }

  /**
   * getScale
   */
  public getScale(): number {
    return this.scale;
  }

  /**
   * return the img of this object
   */
  public getImg(): HTMLImageElement {
    return this.ImageCacheService.getImgFromCache(this.imgSrc);
  }

  public checkCharacterIdle(): void {
    if (
      this.isHit ||
      this.canvasComponent.charLostAt ||
      this.isRunning() ||
      this.isInJumpProcess()
    ) {
      return;
    }
    let diff = new Date().getTime() - this.lastIdleStarted;
    if (diff > IDLE_ANIMATION_START) {
      if (!this.isLongIdle) {
        this.isIdle = true;
        this.updateIdleState();
        return;
      }
      this.updateLongIdleState();
    }
  }

  private updateIdleState(): void {
    let diff = new Date().getTime() - this.lastIdleAnimationStarted;
    if (diff > IDLE_ANIMATION_SWITCH) {
      let length = IMG_SRCs.charIdle.length;
      if (this.idleImg < length) {
        this.imgSrc = IMG_SRCs.charIdle[this.idleImg++ % length];
        this.lastIdleStarted = new Date().getTime();
      } else {
        this.isIdle = false;
        this.isLongIdle = true;
        this.idleImg = 0;
      }
    }
  }

  private updateLongIdleState(): void {
    let diff = new Date().getTime() - this.lastIdleAnimationStarted;
    if (diff > IDLE_ANIMATION_SWITCH) {
      let src =
        IMG_SRCs.charLongIdle[this.idleImg++ % IMG_SRCs.charLongIdle.length];
      this.imgSrc = src;
      this.lastIdleStarted = new Date().getTime();
    }
  }

  public updateJumpCharacter(): void {
    if (this.isJumping) {
      this.updateJump();
    }
    if (this.isFalling) {
      this.updateFall();
    }
    if (this.isLanding) {
      this.updateLanding();
    }
  }

  private updateJump(): void {
    this.yPos -= JUMP_SPEED;
    if (this.isJumpAnimationChangeDue()) {
      this.adjustJumpAnimation();
    }
    if (this.isJumpPeakReached()) {
      this.switchToFalling();
    }
  }

  private isJumpAnimationChangeDue(): boolean {
    let diffJumpAnim = new Date().getTime() - this.lastJumpAnimationStarted;
    return (
      diffJumpAnim > JUMP_ANIMATION_SWITCH &&
      this.jumpImg < 7 &&
      !this.isHit &&
      !this.canvasComponent.charLostAt
    );
  }

  private adjustJumpAnimation(): void {
    this.imgSrc = IMG_SRCs.charJump[this.jumpImg++];
    this.lastJumpAnimationStarted = new Date().getTime();
  }

  private isJumpPeakReached(): boolean {
    let diffJump = new Date().getTime() - this.lastJumpStarted;
    return diffJump > JUMP_TIME;
  }

  private switchToFalling(): void {
    this.isJumping = false;
    this.isFalling = true;
  }

  private updateFall(): void {
    this.yPos += JUMP_SPEED;
    if (this.isFallingAnimationChangeDue()) {
      this.adjustFallAnimation();
    }
    if (this.isReachingGround()) {
      this.switchToLanding();
    }
  }

  private isFallingAnimationChangeDue(): boolean {
    let diffFallAnim = new Date().getTime() - this.lastJumpAnimationStarted;
    return (
      diffFallAnim > 20 && // ADD Constant for fall switch animation
      this.jumpImg > 6 &&
      this.jumpImg < 9 &&
      !this.isHit &&
      !this.canvasComponent.charLostAt
    );
  }

  private adjustFallAnimation(): void {
    this.imgSrc = IMG_SRCs.charJump[this.jumpImg++];
    this.lastJumpAnimationStarted = new Date().getTime();
  }

  private isReachingGround(): boolean {
    return this.yPos >= this.yGroundLevel;
  }

  private switchToLanding() {
    this.isFalling = false;
    this.isLanding = true;
  }

  private updateLanding() {
    if (this.isLandingAnimationChangeDue()) {
      this.adjustLandingAnimation();
    }
    if (this.isLandingAnimationFinished()) {
      this.endJumpingProcess();
    }
  }

  private isLandingAnimationChangeDue(): boolean {
    let diffLandAnim = new Date().getTime() - this.lastJumpAnimationStarted;
    return diffLandAnim > 20 && this.jumpImg < IMG_SRCs['charJump'].length;
  }

  private adjustLandingAnimation(): void {
    this.imgSrc = IMG_SRCs.charJump[this.jumpImg++];
    this.lastJumpAnimationStarted = new Date().getTime();
  }

  private isLandingAnimationFinished() {
    return this.jumpImg === IMG_SRCs['charJump'].length;
  }

  private endJumpingProcess() {
    this.isLanding = false;
    this.jumpImg = 0;
  }

  public isInJumpProcess(): boolean {
    return this.isJumping || this.isFalling || this.isLanding;
  }

  private resetIdle(): void {
    this.idleImg = 0;
    this.lastIdleStarted = new Date().getTime();
  }

  /**
   * name
   */
  public updateRunningState(): void {
    this.checkRunningLeft();
    this.checkRunningRight();
  }

  private checkRunningLeft(): void {
    if (
      this.isRunningRight &&
      this.canvasComponent.bg_elements > RIGHT_BORDER
    ) {
      this.adjustAudioForJump();
      this.canvasComponent.bg_elements -= WALK_SPEED;
      this.checkWalkAnimationChange();
    }
  }

  private checkRunningRight(): void {
    if (this.isRunningLeft && this.canvasComponent.bg_elements < LEFT_BORDER) {
      this.adjustAudioForJump();
      this.canvasComponent.bg_elements += WALK_SPEED;
      this.checkWalkAnimationChange();
    }
  }

  private adjustAudioForJump(): void {
    if (this.isInJumpProcess() && !AUDIO.RUNNING.paused) {
      AUDIO.RUNNING.pause();
    }
    if (!this.isInJumpProcess() && AUDIO.RUNNING.paused) {
      AUDIO.RUNNING.play();
    }
  }

  private checkWalkAnimationChange(): void {
    if (this.isInJumpProcess() || this.isHit) {
      return;
    }
    let diff = new Date().getTime() - this.lastWalkStarted;
    if (diff > WALK_ANIMATION_SWITCH) {
      this.updateWalkImgSrc();
    }
  }

  private updateWalkImgSrc(): void {
    let src = IMG_SRCs.charWalk[this.walkImg++ % IMG_SRCs.charWalk.length];
    this.imgSrc = src;
    this.lastWalkStarted = new Date().getTime();
  }

  public updateCharacterHit(): void {
    let timePassed = new Date().getTime() - this.lastHitAnimation;
    if (this.isHit && timePassed > 120) {
      this.resetIdle();
      this.imgSrc = IMG_SRCs.charHit[this.hitImg];
      this.hitImg++;
      this.lastHitAnimation = new Date().getTime();
      if (this.hitImg === IMG_SRCs.charHit.length) {
        this.hitImg = 0;
        this.isHit = false;
        this.setToIdle();
      }
    }
  }

  public updateCharacterDead(): void {
    let timePassed = new Date().getTime() - this.canvasComponent.charLostAt;
    if (this.canvasComponent.charLostAt && timePassed > 100) {
      let n = this.deadImg++;
      if (n < IMG_SRCs.charDead.length) {
        this.imgSrc = IMG_SRCs.charDead[n];
        this.canvasComponent.charLostAt = new Date().getTime();
      }
    }
  }

  public performCharHit(): void {
    this.lives--;
    this.lastHitHappened = new Date().getTime();
    this.isHit = true;
  }

  /**
   * endRunningState
   */
  public endRunningStateLeft(): void {
    this.resetIdle();
    this.imgSrc = IMG_SRCs.charIdle[0];
    this.isRunningLeft = false;
  }

  /**
   * endRunningStateRight
   */
  public endRunningStateRight(): void {
    this.resetIdle();
    this.imgSrc = IMG_SRCs.charIdle[0];
    this.isRunningRight = false;
  }

  /**
   * startBottleThrow
   */
  public startBottleThrow(dateTime: number): void {
    this.collBottles--;
    this.lastBottleThrowTime = dateTime;
    this.resetIdle();
  }

  /**
   * startRunning
   */
  public startRunningLeft(): void {
    if (!this.isRunningRight) {
      this.isRunningLeft = true;
      this.resetIdle();
    }
  }

  public startRunningRight(): void {
    if (!this.isRunningLeft) {
      this.isRunningRight = true;
      this.resetIdle();
    }
  }

  /**
   * startJump
   */
  public startJump(): void {
    this.lastJumpStarted = new Date().getTime();
    this.isJumping = true;
    this.resetIdle();
  }

  private setToIdle() {
    this.isIdle = true;
    this.imgSrc = IMG_SRCs['charIdle'][0];
  }
}
