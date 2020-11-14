import { CanvasComponent } from '../../canvas.component';
import {
  BOSS_X_START,
  BOSS_Y_START,
  ENDBOSS_STATUS,
  IMG_SRCs,
  SCALING_FACTOR,
} from '../../constants';

export class Endboss {
  private live: number;
  private defeatedAt: number;
  private lastHitTakenAt: number;
  private lastWalkAnimationAt: number;
  private lastHitAnimationAt: number;
  private status: string;
  private deathImgNr: number;
  private walkImgNr: number;
  private hurtImgNr: number;
  private alertImgNr: number;
  private attackImgNr: number;
  private moveLeft: boolean;
  private imgSrc: string;
  private pos_x: number;
  private pos_y: number;
  private CanvasComponent: CanvasComponent;
  private img: HTMLImageElement;

  constructor(canvas: CanvasComponent) {
    this.live = 100;
    this.defeatedAt = 0;
    this.lastHitTakenAt = 0;
    this.lastWalkAnimationAt = 0;
    this.lastHitAnimationAt = 0;
    this.status = ENDBOSS_STATUS.walk;
    this.deathImgNr = 0;
    this.walkImgNr = 0;
    this.hurtImgNr = 0;
    this.alertImgNr = 0;
    this.attackImgNr = 0;
    this.moveLeft = true;
    this.imgSrc = IMG_SRCs.giantGallinitaWalk[0];
    this.pos_x = BOSS_X_START;
    this.pos_y = BOSS_Y_START;
    this.CanvasComponent = canvas;
    this.img = new Image();
    this.img.src = this.imgSrc;
  }

  /**
   * getCurrentXPosition
   */
  public getCurrentXPosition() {
      return this.pos_x + this.CanvasComponent.bg_elements;
  }

  /**
   * getImgWidth
   */
  public getImgWidth() {
      return this.img.width * SCALING_FACTOR.endboss;
  }

  /**
   * getImgHeight
   */
  public getImgHeight() {
      return this.img.height * SCALING_FACTOR.endboss;
  }

  /**
   * hitEndboss
   */
  public hitEndboss() {
    this.live -= 10;
    this.lastHitTakenAt = new Date().getTime();
    this.status = ENDBOSS_STATUS.hit;
  }

  public getLive(): number {
    return this.live;
  }

  public setLive(live: number): void {
    this.live = live;
  }

  public getDefeatedAt(): number {
    return this.defeatedAt;
  }

  public setDefeatedAt(defeatedAt: number): void {
    this.defeatedAt = defeatedAt;
  }

  public getLastHitTakenAt(): number {
    return this.lastHitTakenAt;
  }

  public setLastHitTakenAt(lastHitTakenAt: number): void {
    this.lastHitTakenAt = lastHitTakenAt;
  }

  public getLastWalkAnimationAt(): number {
    return this.lastWalkAnimationAt;
  }

  public setLastWalkAnimationAt(lastWalkAnimationAt: number): void {
    this.lastWalkAnimationAt = lastWalkAnimationAt;
  }

  public getLastHitAnimationAt(): number {
    return this.lastHitAnimationAt;
  }

  public setLastHitAnimationAt(lastHitAnimationAt: number): void {
    this.lastHitAnimationAt = lastHitAnimationAt;
  }

  public getStatus(): string {
    return this.status;
  }

  public setStatus(status: string): void {
    this.status = status;
  }

  public getDeathImgNr(): number {
    return this.deathImgNr;
  }

  public setDeathImgNr(deathImgNr: number): void {
    this.deathImgNr = deathImgNr;
  }

  public getWalkImgNr(): number {
    return this.walkImgNr;
  }

  public setWalkImgNr(walkImgNr: number): void {
    this.walkImgNr = walkImgNr;
  }

  public getHurtImgNr(): number {
    return this.hurtImgNr;
  }

  public setHurtImgNr(hurtImgNr: number): void {
    this.hurtImgNr = hurtImgNr;
  }

  public getAlertImgNr(): number {
    return this.alertImgNr;
  }

  public setAlertImgNr(alertImgNr: number): void {
    this.alertImgNr = alertImgNr;
  }

  public getAttackImgNr(): number {
    return this.attackImgNr;
  }

  public setAttackImgNr(attackImgNr: number): void {
    this.attackImgNr = attackImgNr;
  }

  public isMoveLeft(): boolean {
    return this.moveLeft;
  }

  public setMoveLeft(moveLeft: boolean): void {
    this.moveLeft = moveLeft;
  }

  public getImgSrc(): string {
    return this.imgSrc;
  }

  public setImgSrc(imgSrc: string): void {
    this.imgSrc = imgSrc;
  }

  public getLeftImgBorder(): number {
    return this.pos_x;
  }

  public setPos_x(pos_x: number): void {
    this.pos_x = pos_x;
  }

  public getUpperImgBorder(): number {
    return this.pos_y;
  }

  public setPos_y(pos_y: number): void {
    this.pos_y = pos_y;
  }

  public updateEndboss() {
    let st = this.getEndbossStatus();
    switch (st) {
      case ENDBOSS_STATUS.death:
        this.adjustEndbossDeath();
        break;

      case ENDBOSS_STATUS.hit:
        this.adjustEndbossHit();
        break;

      case ENDBOSS_STATUS.walk:
        this.adjustEndbossWalking();
        break;

      case ENDBOSS_STATUS.alert:
        this.adjustEndbossAlert();
        break;

      case ENDBOSS_STATUS.attack:
        this.adjustEndbossAttack();
        break;

      default:
        break;
    }
  }

  private getEndbossStatus() {
    if (this.defeatedAt) {
      return ENDBOSS_STATUS.death;
    }
    if (this.status === ENDBOSS_STATUS.hit) {
      return ENDBOSS_STATUS.hit;
    } else if (this.live >= 70) {
      return ENDBOSS_STATUS.walk;
    } else if (this.live >= 40) {
      return ENDBOSS_STATUS.alert;
    } else {
      return ENDBOSS_STATUS.attack;
    }
  }

  private adjustEndbossDeath() {
    let timePassed = new Date().getTime() - this.defeatedAt;
    if (timePassed > 80 && this.deathImgNr < 2) {
      this.deathImgNr++;
    }
    this.imgSrc = IMG_SRCs.giantGallinitaDeath[this.deathImgNr];
    this.pos_x += timePassed * 0.1;
    this.pos_y -= timePassed * 0.1;
  }

  private adjustEndbossWalking() {
    this.adjustEndbossMovement(2);
    let timePassed = new Date().getTime() - this.lastWalkAnimationAt;
    if (timePassed > 80) {
      this.imgSrc =
        IMG_SRCs.giantGallinitaWalk[
          this.walkImgNr++ % IMG_SRCs.giantGallinitaWalk.length
        ];
      this.lastWalkAnimationAt = new Date().getTime();
    }
  }

  private adjustEndbossHit() {
    let timePassed = new Date().getTime() - this.lastHitTakenAt;
    if (timePassed > 55) {
      if (this.hurtImgNr < IMG_SRCs.giantGallinitaHurt.length) {
        this.imgSrc = IMG_SRCs.giantGallinitaHurt[this.hurtImgNr++];
        this.lastHitTakenAt = new Date().getTime();
      } else {
        this.status = ENDBOSS_STATUS.adjust;
        this.hurtImgNr = 0;
      }
    }
  }

  private adjustEndbossAlert() {
    this.adjustEndbossMovement(7);
    let timePassed = new Date().getTime() - this.lastWalkAnimationAt;
    if (timePassed > 80) {
      this.imgSrc =
        IMG_SRCs.giantGallinitaAlert[
          this.alertImgNr++ % IMG_SRCs.giantGallinitaAlert.length
        ];
      this.lastWalkAnimationAt = new Date().getTime();
    }
  }

  private adjustEndbossAttack() {
    this.adjustEndbossMovement(15);
    let timePassed: number = new Date().getTime() - this.lastWalkAnimationAt;
    if (timePassed > 80) {
      this.imgSrc =
        IMG_SRCs.giantGallinitaAttack[
          this.attackImgNr++ % IMG_SRCs.giantGallinitaAttack.length
        ];
      this.lastWalkAnimationAt = new Date().getTime();
    }
  }

  public adjustEndbossMovement(move_x: number) {
    let x_left_border = BOSS_X_START - Math.round(Math.random() * 1000);
    let x_right_border = BOSS_X_START + Math.round(Math.random() * 1000);
    if (this.moveLeft) {
      if (this.pos_x > x_left_border) {
        this.pos_x -= move_x;
      } else {
        this.moveLeft = false;
      }
    } else {
      if (this.pos_x < x_right_border) {
        this.pos_x += move_x;
      } else {
        this.moveLeft = true;
      }
    }
  }

  public checkEndbossHit() {
    let timePassed = new Date().getTime() - this.lastHitTakenAt;
    if (
      this.bottles.throwB_X > this.endboss.pos_x + this.bg_elements - 100 &&
      this.bottles.throwB_X < this.endboss.pos_x + this.bg_elements + 100 &&
      timePassed > 1000
    ) {
      if (this.endboss.live > 0) {
        AUDIO.SMASH_BOTTLE.play();
        this.bottles.throwB_Status = BOTTLE_STATUS.splash;
        this.bottles.throwB_ImgNr = 0;
        this.endboss.live -= 10;
        this.endboss.lastHitTakenAt = new Date().getTime();
        this.endboss.status = ENDBOSS_STATUS.hit;
      } else if (this.endboss.defeatedAt == 0) {
        this.endboss.defeatedAt = new Date().getTime();
        this.finishLevel();
      }
    }
  }
}
