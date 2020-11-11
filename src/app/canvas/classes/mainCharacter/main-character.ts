import {
  X_COORDINATE_BASE_LEVEL,
  Y_COORDINATE_BASE_LEVEL,
  IMG_SRCs,
  imgCache,
  IDLE_ANIMATION_SWITCH,
  JUMP_SPEED,
  JUMP_ANIMATION_SWITCH,
  JUMP_TIME,
  RIGHT_BORDER,
  WALK_SPEED,
  WALK_ANIMATION_SWITCH,
} from './../../constants';
export class MainCharacter {
  private lives: number;
  public x_coordinate: number;
  public y_coordinate: number;
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
  public collBottles: number;
  public collCoins: number;

  constructor() {
    this.lives = 2;
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

  isInJumpProcess() {
    return this.isJumping == true || this.isFalling == true;
  }

  getMainCharImg(src_path: string) {
    this.img = imgCache.find((img) => {
      img.src.endsWith(src_path);
    });
    // create new Image if not found in cache
    if (!this.img) {
      this.img = new Image();
      this.img.src = src_path;
    }
  }

  checkCollision(x: number, y: number, bg_elements: number) {
    return (
      x >= this.x_coordinate - bg_elements &&
      x <= this.x_coordinate + this.img.width &&
      y >= this.y_coordinate &&
      y <= this.y_coordinate + this.img.height
    );
  }

  updateIdleState() {
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

  updateLongIdleState() {
    let diff = new Date().getTime() - this.lastIdleStarted;
    if (diff > IDLE_ANIMATION_SWITCH) {
      let src =
        IMG_SRCs.charLongIdle[this.idleImg++ % IMG_SRCs.charLongIdle.length];
      this.imgSrc = src;
      this.lastIdleStarted = new Date().getTime();
    }
  }

  updateJumpCharacter(charLostAt: number) {
    let diffJump = new Date().getTime() - this.lastJumpStarted;
    let diffJumpAnim = new Date().getTime() - this.lastJumpAnimationStarted;
    if (this.isJumping == true) {
      this.updateJump(diffJump, diffJumpAnim, charLostAt);
    } else {
      this.updateFall(charLostAt);
    }
  }

  private updateJump(
    diffJump: number,
    diffJumpAnim: number,
    charLostAt: number
  ) {
    this.y_coordinate -= JUMP_SPEED;
    this.adjustJumpAnimation(diffJumpAnim, charLostAt);
    this.checkForJumpingPeak(diffJump);
  }

  privat;
  adjustJumpAnimation(diffJumpAnim: number, charLostAt: number) {
    if (
      diffJumpAnim > JUMP_ANIMATION_SWITCH &&
      this.jumpImg < 7 &&
      !this.isHit &&
      !charLostAt
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

  private updateFall(charLostAt: number) {
    this.y_coordinate += JUMP_SPEED;
    this.adjustLandingAnimation(charLostAt);
    this.adjustIfJumpEnd();
  }

  private adjustLandingAnimation(charLostAt: number) {
    let border = Y_COORDINATE_BASE_LEVEL - 0.05 * Y_COORDINATE_BASE_LEVEL;
    if (this.isLanding(border) && !this.isHit && !charLostAt) {
      let src = IMG_SRCs.charJump[++this.jumpImg % IMG_SRCs.charJump.length];
      this.imgSrc = src;
    }
  }

  charPerformsJump() {
    return this.isJumping == true || this.isFalling == true;
  }

  private;
  adjustIfJumpEnd() {
    if (this.y_coordinate >= Y_COORDINATE_BASE_LEVEL) {
      this.isFalling = false;
      this.jumpImg = 0;
      this.resetIdle();
      if (!this.isRunning()) {
        this.isIdle = true;
      }
    }
  }

  resetIdle() {
    this.idleImg = 0;
    this.lastIdleStarted = new Date().getTime();
  }

  public checkRunningLeft(bg_elements: number, AUDIO) {
    if (this.isRunningRight == true && bg_elements > RIGHT_BORDER) {
      this.adjustAudioForJump(AUDIO);
      bg_elements -= WALK_SPEED;
      this.adjustWalkAnimation();
    }
  }

  adjustAudioForJump(AUDIO) {
    if (this.isInJumpProcess() && !AUDIO.RUNNING.paused) {
      AUDIO.RUNNING.pause();
    }
    if (!this.isInJumpProcess() && AUDIO.RUNNING.paused) {
      AUDIO.RUNNING.play();
    }
  }

  adjustWalkAnimation() {
    if (!this.isJumping && !this.isHit) {
      let diff = new Date().getTime() - this.lastWalkStarted;
      if (diff > WALK_ANIMATION_SWITCH) {
        this.changeWalkAnimation();
      }
    }
  }

  changeWalkAnimation() {
    let src = IMG_SRCs.charWalk[this.walkImg++ % IMG_SRCs.charWalk.length];
    this.imgSrc = src;
    this.lastWalkStarted = new Date().getTime();
  }

  updateCharacterHit() {
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

  updateCharacterDead(charLostAt: number) {
    let timePassed = new Date().getTime() - charLostAt;
    if (charLostAt && timePassed > 100) {
      let n = this.deadImg++;
      if (n < IMG_SRCs.charDead.length) {
        this.imgSrc = IMG_SRCs.charDead[n];
        charLostAt = new Date().getTime();
      }
    }
  }

}
