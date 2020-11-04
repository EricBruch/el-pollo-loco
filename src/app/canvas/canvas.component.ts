import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  WALK_SPEED,
  JUMP_TIME,
  JUMP_SPEED,
  IDLE_ANIMATION_SWITCH,
  WALK_ANIMATION_SWITCH,
  GRAVITY,
  X_COORDINATE_BASE_LEVEL,
  Y_COORDINATE_BASE_LEVEL,
  imgSrcs,
  MainCharacter,
  Chicken,
  JUMP_ANIMATION_SWITCH,
  AUDIO,
  Bottles
} from './constants';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  mainChar: MainCharacter = {
    charEnergy: 100,
    x_coordinate: X_COORDINATE_BASE_LEVEL,
    y_coordinate: Y_COORDINATE_BASE_LEVEL,
    isIdle: true,
    isJumping: false,
    isFalling: false,
    isRunningRight: false,
    isRunningLeft: false,
    lastJumpStarted: 0,
    lastJumpAnimationStarted: 0,
    lastIdleStarted: 0,
    lastWalkStarted: 0,
    charImage: new Image(),
    charImageSrc: imgSrcs.charIdle[0],
    idleImg: 0,
    walkImg: 0,
    walkRightImg: 0,
    walkLeftImg: 0,
    jumpImg: 0,
    collBottles: 50,
    lastBottleThrowTime: 0,
  };

  bg_elements: number = 0;
  background_image = new Image();

  chickens = [];

  bottles: Bottles = {
    placedB: [500, 1000, 1700, 2500, 2800, 3000, 3300],
    throwB_X: 0,
    throwB_Y: 0
  }
  
  endbossEnergy = 100;

  @ViewChild('canvas')
  myCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.loadResources();
    this.initalizeSound();
    // todo optional set const arrays frozen
    this.checkForRunning();
    this.checkForJump();
    this.checkForIdle();
    this.checkCollisionDetection();
    this.draw();
  }
  loadResources() {
    this.background_image.src = imgSrcs.bg_complete;
    this.createChickens();
    this.calculateChickenPosition();
  }

  checkForRunning() {
    setInterval(() => {
      if (this.mainChar.isRunningRight == true) {
        this.adjustAudioForJump();
        this.bg_elements -= WALK_SPEED;
        this.adjustWalkAnimation();
      }
      if (this.mainChar.isRunningLeft == true && this.bg_elements < 100) {
        this.adjustAudioForJump();
        this.bg_elements += WALK_SPEED;
        this.adjustWalkAnimation();
      }
    }, 20);
  }

  checkForJump() {
    setInterval(() => {
      if (this.charPerformsJump()) {
        this.updateJumpCharacter();
      }
    }, 10);
  }

  checkForIdle() {
    setInterval(() => {
      if (this.mainChar.isIdle) {
        this.updateIdleState();
      }
    }, 30);
  }

  adjustAudioForJump() {
    if (this.isInJumpProcess() && !AUDIO.RUNNING.paused) {
      AUDIO.RUNNING.pause();
    }
    if (!this.isInJumpProcess() && AUDIO.RUNNING.paused) {
      AUDIO.RUNNING.play();
    }
  }

  createChickens() {
    this.chickens = [
      this.createChicken(imgSrcs.gallinita[1], 850),
      this.createChicken(imgSrcs.gallinita[1], 2850),
      this.createChicken(imgSrcs.gallinita[1], 3250),
      this.createChicken(imgSrcs.gallinita[1], 3750),
      this.createChicken(imgSrcs.gallinita[1], 4050),
    ];
  }

  draw() {
    this.drawBackgroundPicture();
    this.updateCharacter();
    this.drawChicken();
    this.drawBottles();
    this.drawEnergyBar();
    let drawFunction = () => this.draw();
    try {
      requestAnimationFrame(drawFunction);
    } catch (error) {
      console.error('Graphic card error', error);
    }
    this.drawItemOverview();
    this.drawThrowBottle();
    this.drawEndBoss();
  }

  updateCharacter() {
    this.mainChar.charImage.src = this.mainChar.charImageSrc;
    let xAdjustment = 0;
    let imgWidthAdjustment = 1;
    if (this.mainChar.isRunningLeft) {
      this.mirrorImg();
      xAdjustment = this.mainChar.charImage.width * 0.35;
      imgWidthAdjustment = -1;
    }
    // draw character
    if (this.mainChar.charImage.complete) {
      this.context.drawImage(
        this.mainChar.charImage,
        this.mainChar.x_coordinate - xAdjustment,
        this.mainChar.y_coordinate,
        this.mainChar.charImage.width * 0.35 * imgWidthAdjustment,
        this.mainChar.charImage.height * 0.35
      );
    }
    if (this.mainChar.isRunningLeft) {
      this.context.restore();
    }
  }

  initalizeSound() {
    AUDIO.BG_MUSIC.loop = true;
    AUDIO.BG_MUSIC.volume = 0.2;
  }

  drawEnergyBar() {
    this.context.globalAlpha = 0.3;
    this.context.fillStyle = 'blue';
    this.context.fillRect(680, 15, 2 * this.mainChar.charEnergy, 30);

    this.context.fillStyle = 'black';
    this.context.fillRect(675, 10, 210, 40);
    this.context.globalAlpha = 1;
  }

  drawItemOverview() {
    this.context.font = '30px Kalam';
    this.context.fillText('x' + this.mainChar.collBottles, 50, 55);
    this.addNonMoveableObject(imgSrcs.bottles[0], -15, 0, 0.2, 1);
  }

  drawThrowBottle() {
    if (this.mainChar.lastBottleThrowTime) {
      let timePassed = new Date().getTime() - this.mainChar.lastBottleThrowTime;
      let g = Math.pow(GRAVITY, timePassed / 300);
      this.bottles.throwB_X = 225 + timePassed * 0.9;
      this.bottles.throwB_Y = 470 - (timePassed * 0.4 - g);
      this.addNonMoveableObject(
        imgSrcs.bottles[0],
        this.bottles.throwB_X,
        this.bottles.throwB_Y,
        0.25,
        1
      );
    }
  }

  drawEndBoss() {
    this.context.globalAlpha = 0.3;
    this.context.fillStyle = 'red';
    this.context.fillRect(500, 260, 2 * this.endbossEnergy, 15);

    this.context.fillStyle = 'black';
    this.context.fillRect(495, 255, 210, 25);
    this.context.globalAlpha = 1;

    let endB_x = 500;
    this.addBgObject(imgSrcs.giantGallinitaWalk[0],endB_x, 225, 0.4, 1);
  }

  mirrorImg() {
    this.context.save();
    this.context.scale(-1, 1);
  }

  drawBottles() {
    this.bottles.placedB.forEach((b) => {
      let x = b.valueOf();
      this.addBgObject(
        imgSrcs.bottles[0],
        x,
        Y_COORDINATE_BASE_LEVEL + 312,
        0.25,
        1
      );
    });
  }

  checkCollisionDetection() {
    setInterval(() => {
      // check for chicken
      this.chickens.forEach((c) => {
        let c_x = c.pos_x + this.bg_elements;
        if (this.isInCollisionWith(c_x)) {
          this.mainChar.charEnergy--;
        }
      });
      // check for tabasco
      for (let i = 0; i < this.bottles.placedB.length; i++) {
        let b_x = this.bottles.placedB[i].valueOf() + this.bg_elements;
        if (this.isInCollisionWith(b_x)) {
          this.bottles.placedB.splice(i, 1);
          AUDIO.OPEN_BOTTLE.play();
          this.mainChar.collBottles++;
        }
      }
      // check for endboss
      if (this.bottles.throwB_X > 500 + this.bg_elements - 100 && 
        this.bottles.throwB_X < 500 + this.bg_elements + 100) {
        this.endbossEnergy -= 10;
        AUDIO.SMASH_BOTTLE.play();
      } 
      
    }, 100);
  }

  isInCollisionWith(x: number) {
    return (
      x - 60 < this.mainChar.x_coordinate &&
      x + 60 > this.mainChar.x_coordinate &&
      this.mainChar.y_coordinate > 220
    );
  }

  drawBackgroundPicture() {
    for (let i = 0; i < 10; i += 3) {
      let canvas = this.myCanvas.nativeElement;
      this.addBGPicture(
        this.background_image,
        canvas.width * i,
        0,
        canvas.width * 3,
        canvas.height,
        1,
        1
      );
    }
  }

  calculateChickenPosition() {
    setInterval(() => {
      for (let i = 0; i < this.chickens.length; i++) {
        let chicken = this.chickens[i];
        chicken.pos_x -= this.chickens[i].speed;
      }
    }, 200);
  }

  addBgObject(
    src: string,
    offset_x: number,
    offset_y: number,
    scale: number,
    opacity: number
  ) {
    if (opacity != undefined) {
      this.context.globalAlpha = opacity;
    }
    let img = new Image();
    img.src = src;
    if (img.complete) {
      this.context.drawImage(
        img,
        offset_x + this.bg_elements,
        offset_y,
        img.width * scale,
        img.height * scale
      );
    } else {
      //console.error('Img not fully loaded');
    }
    this.context.globalAlpha = 1;
  }

  addNonMoveableObject(
    src: string,
    offset_x: number,
    offset_y: number,
    scale: number,
    opacity: number
  ) {
    if (opacity != undefined) {
      this.context.globalAlpha = opacity;
    }
    let img = new Image();
    img.src = src;
    if (img.complete) {
      this.context.drawImage(
        img,
        offset_x,
        offset_y,
        img.width * scale,
        img.height * scale
      );
    } else {
      //console.error('Img not fully loaded');
    }
    this.context.globalAlpha = 1;
  }

  addBGPicture(
    img: HTMLImageElement,
    offset_x: number,
    offset_y: number,
    width: number,
    height: number,
    scale: number,
    opacity: number
  ) {
    if (opacity != undefined) {
      this.context.globalAlpha = opacity;
    }
    this.context.drawImage(
      img,
      offset_x + this.bg_elements,
      offset_y,
      width * scale,
      height * scale
    );
    this.context.globalAlpha = 1;
  }

  drawChicken() {
    for (let i = 0; i < this.chickens.length; i++) {
      this.addBgObject(
        this.chickens[i].img,
        this.chickens[i].pos_x,
        this.chickens[i].pos_y,
        this.chickens[i].scale,
        this.chickens[i].opactiy
      );
    }
  }

  createChicken(src, pos_x) {
    let c: Chicken = {
      img: src,
      pos_x: pos_x,
      pos_y: 595,
      scale: 0.3,
      opactiy: 1,
      speed: Math.random() * 15,
    };
    return c;
  }

  /**
   * This method checks if the character is Idle longer then the IDLE_ANIMATION_SWITCH difference
   * if so the next img of Idle is shown
   */
  updateIdleState() {
    let diff = new Date().getTime() - this.mainChar.lastIdleStarted;
    if (diff > IDLE_ANIMATION_SWITCH) {
      let src =
        imgSrcs.charIdle[
          this.incrImgCount(++this.mainChar.idleImg, imgSrcs.charIdle.length)
        ];
      this.mainChar.charImageSrc = src;
      this.mainChar.lastIdleStarted = new Date().getTime();
    }
  }

  incrImgCount(imgCounter: number, countImages: number) {
    return imgCounter % countImages;
  }

  charJump(diffJump: number, diffJumpAnim: number) {
    this.mainChar.y_coordinate -= JUMP_SPEED;
    this.adjustJumpAnimation(diffJumpAnim);
    this.checkForJumpingPeak(diffJump);
  }

  adjustJumpAnimation(diffJumpAnim: number) {
    if (diffJumpAnim > JUMP_ANIMATION_SWITCH && this.mainChar.jumpImg < 7) {
      this.mainChar.charImageSrc = imgSrcs.charJump[++this.mainChar.jumpImg];
      this.mainChar.lastJumpAnimationStarted = new Date().getTime();
    }
  }

  checkForJumpingPeak(diffJump: number) {
    if (diffJump > JUMP_TIME) {
      this.mainChar.isJumping = false;
      this.mainChar.isFalling = true;
    }
  }

  charFall() {
    this.mainChar.y_coordinate += JUMP_SPEED;
    this.adjustLandingAnimation();
    this.adjustIfJumpEnd();
  }

  adjustLandingAnimation() {
    let border = Y_COORDINATE_BASE_LEVEL - 0.05 * Y_COORDINATE_BASE_LEVEL;
    if (this.isLanding(border)) {
      let src =
        imgSrcs.charJump[++this.mainChar.jumpImg % imgSrcs.charJump.length];
      this.mainChar.charImageSrc = src;
    }
  }

  isInJumpProcess() {
    return this.mainChar.isJumping == true || this.mainChar.isFalling == true;
  }

  isRunning() {
    return (
      this.mainChar.isRunningLeft == true ||
      this.mainChar.isRunningRight == true
    );
  }

  isLanding(border: number) {
    return (
      this.mainChar.y_coordinate < border &&
      this.mainChar.jumpImg > 6 &&
      this.mainChar.jumpImg < 9
    );
  }

  adjustIfJumpEnd() {
    if (this.mainChar.y_coordinate >= Y_COORDINATE_BASE_LEVEL) {
      this.mainChar.isFalling = false;
      this.mainChar.jumpImg = 0;
      this.resetIdle();
      if (!this.isRunning()) {
        this.mainChar.isIdle = true;
      }
    }
  }

  charPerformsJump() {
    return this.mainChar.isJumping == true || this.mainChar.isFalling == true;
  }
  changeWalkAnimationDue(diff) {
    return diff > WALK_ANIMATION_SWITCH;
  }

  changeWalkAnimation() {
    let src =
      imgSrcs.charWalk[this.mainChar.walkImg++ % imgSrcs.charWalk.length];
    this.mainChar.charImageSrc = src;
    this.mainChar.lastWalkStarted = new Date().getTime();
  }

  resetIdle() {
    this.mainChar.idleImg = 0;
    this.mainChar.lastIdleStarted = new Date().getTime();
  }

  resetWalk() {
    this.mainChar.walkRightImg = 0;
    this.mainChar.walkLeftImg = 0;
  }

  adjustWalkAnimation() {
    if (!this.mainChar.isJumping) {
      let diff = new Date().getTime() - this.mainChar.lastWalkStarted;
      if (this.changeWalkAnimationDue(diff)) {
        this.changeWalkAnimation();
      }
    }
  }

  updateJumpCharacter() {
    let diffJump = new Date().getTime() - this.mainChar.lastJumpStarted;
    let diffJumpAnim =
      new Date().getTime() - this.mainChar.lastJumpAnimationStarted;
    if (this.mainChar.isJumping == true) {
      this.charJump(diffJump, diffJumpAnim);
    } else {
      this.charFall();
    }
  }

  endRunningState() {
    this.resetIdle();
    this.mainChar.isIdle = true;
    this.mainChar.charImageSrc = imgSrcs.charIdle[0];
    AUDIO.RUNNING.pause();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    //console.log("key: " + e.key + " code: " + e.code);
    if (
      e.code === 'KeyD' &&
      this.mainChar.collBottles > 0 &&
      new Date().getTime() - this.mainChar.lastBottleThrowTime > 1000
    ) {
      this.mainChar.collBottles--;
      this.mainChar.lastBottleThrowTime = new Date().getTime();
      AUDIO.THROW_BOTTLE.play();
    }

    if (e.code === 'ArrowLeft') {
      this.mainChar.isRunningLeft = true;
      this.mainChar.isIdle = false;
      AUDIO.RUNNING.play();
    }
    if (e.code == 'ArrowRight') {
      this.mainChar.isRunningRight = true;
      this.mainChar.isIdle = false;
      AUDIO.RUNNING.play();
    }
    let timePassedSinceJump =
      new Date().getTime() - this.mainChar.lastJumpStarted;
    if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2) {
      this.mainChar.lastJumpStarted = new Date().getTime();
      this.mainChar.isJumping = true;
      this.mainChar.isIdle = false;
      AUDIO.JUMP.play();
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.mainChar.isRunningLeft = false;
      this.endRunningState();
    }
    if (e.key == 'ArrowRight') {
      this.mainChar.isRunningRight = false;
      this.endRunningState();
    }
    // if (e.code == 'Space') {
    //   this.isJumping = false;
    // }
  }
}
