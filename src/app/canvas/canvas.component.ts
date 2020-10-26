import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  CHARACTER_STATUS,
  WALK_SPEED,
  JUMP_TIME,
  JUMP_SPEED,
  AUDIO_JUMP,
  AUDIO_RUNNING,
  IDLE_ANIMATION_SWITCH,
  WALK_ANIMATION_SWITCH,
  X_COORDINATE_BASE_LEVEL,
  Y_COORDINATE_BASE_LEVEL,
  imgSrcs,
  MainCharacter,
  Chicken,
  JUMP_ANIMATION_SWITCH,
  LANDING_ANIM_SWI,
} from './constants';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  mainChar: MainCharacter = {
    charStatus: CHARACTER_STATUS.IDLE,
    x_coordinate: X_COORDINATE_BASE_LEVEL,
    y_coordinate: Y_COORDINATE_BASE_LEVEL,
    isJumping: false,
    lastJumpStarted: 0,
    lastJumpAnimationStarted: 0,
    lastIdleStarted: 0,
    lastWalkStarted: 0,
    characterImage: new Image(),
    characterImageSrc: imgSrcs.characterIdle[0],
    idleImg: 0,
    walkRightImg: 0,
    walkLeftImg: 0,
    jumpImg: 0,
  };

  bg_elements: number = 0;
  background_image = new Image();

  chickens = [];

  @ViewChild('canvas')
  myCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.loadResources();
    this.checkCollisionDetection();
    this.draw();
  }
  loadResources() {
    this.background_image.src = imgSrcs.bg_complete;
    this.createChickens();
    this.calculateChickenPosition();
  }

  createChickens() {
    this.chickens = [
      this.createChicken(imgSrcs.gallinita[1], 350),
      this.createChicken(imgSrcs.gallinita[1], 2850),
      this.createChicken(imgSrcs.gallinita[1], 3750),
    ];
  }

  draw() {
    this.drawBackgroundPicture();
    this.updateCharacter();
    this.drawChicken();
    let drawFunction = () => this.draw();
    try {
      requestAnimationFrame(drawFunction);
    } catch (error) {
      console.error('Graphic card error', error);
    }
  }

  updateCharacter() {
    this.adjustCharacter();
    if (this.mainChar.isJumping) {
      this.updateJumpCharacter();
    }
    this.mainChar.characterImage.src = this.mainChar.characterImageSrc;

    // draw character
    if (this.mainChar.characterImage.complete) {
      this.context.drawImage(
        this.mainChar.characterImage,
        this.mainChar.x_coordinate,
        this.mainChar.y_coordinate,
        this.mainChar.characterImage.width * 0.35,
        this.mainChar.characterImage.height * 0.35
      );
    }
  }

  adjustCharacter() {
    switch (this.mainChar.charStatus) {
      case CHARACTER_STATUS.IDLE:
        this.updateIdleState();
        AUDIO_RUNNING.pause();
        AUDIO_JUMP.pause();
        break;

      /* TODO
      case CHARACTER_STATUS.LONG_IDLE_:
        // change Character Image
        // change position of Character
        break;
      */

      case CHARACTER_STATUS.WALK_RIGHT:
        AUDIO_RUNNING.play();
        this.updateWalkRightState();
        break;

      case CHARACTER_STATUS.WALK_LEFT:
        AUDIO_RUNNING.play();
        this.updateWalkLeftState();
        break;

      case CHARACTER_STATUS.JUMP:
        AUDIO_RUNNING.pause();
        this.resetIdle();
        this.mainChar.isJumping = true;
        break;
    }
  }

  checkCollisionDetection() {
    setInterval(() => {
    this.chickens.forEach((c) => {
      if (
        c.pos_x - 120 < this.mainChar.x_coordinate &&
        c.pos_x + 120 > this.mainChar.x_coordinate
      ) {
        alert('Collision');
      }
    });
    }, 100);
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
    this.context.drawImage(
      img,
      offset_x + this.bg_elements,
      offset_y,
      img.width * scale,
      img.height * scale
    );
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
    let x: Chicken = {
      img: src,
      pos_x: pos_x,
      pos_y: 545,
      scale: 0.5,
      opactiy: 1,
      speed: Math.random() * 15,
    };
    return x;
  }

  /**
   * This method checks if the character is Idle longer then the IDLE_ANIMATION_SWITCH difference
   * if so the next img of Idle is shown
   */
  updateIdleState() {
    let diff = new Date().getTime() - this.mainChar.lastIdleStarted;
    if (diff > IDLE_ANIMATION_SWITCH) {
      let src =
        imgSrcs.characterIdle[
          this.incrImgCount(
            ++this.mainChar.idleImg,
            imgSrcs.characterIdle.length
          )
        ];
      this.mainChar.characterImageSrc = src;
      this.mainChar.lastIdleStarted = new Date().getTime();
    }
  }

  incrImgCount(imgCounter: number, countImages: number) {
    return imgCounter % countImages;
  }

  incrJumpImgUpToFalling() {
    if (this.mainChar.jumpImg < 7) {
      return ++this.mainChar.jumpImg;
    }
  }

  performJumpAnimation(diffJumpAnim: number) {
    if (diffJumpAnim > JUMP_ANIMATION_SWITCH) {
      let src = imgSrcs.characterJump[this.incrJumpImgUpToFalling()];
      this.mainChar.characterImageSrc = src;
      this.mainChar.lastJumpAnimationStarted = new Date().getTime();
    }
  }

  performLandingAnimation() {
    let src =
      imgSrcs.characterJump[
        ++this.mainChar.jumpImg % imgSrcs.characterJump.length
      ];
    this.mainChar.characterImageSrc = src;
  }

  isJumping(diffJump: number) {
    return diffJump < JUMP_TIME;
  }
  isFalling() {
    return this.mainChar.y_coordinate <= Y_COORDINATE_BASE_LEVEL;
  }

  isLanding() {
    return this.mainChar.jumpImg > 6 && this.mainChar.jumpImg < 9;
  }

  changeWalkAnimationDue(diff) {
    return diff > WALK_ANIMATION_SWITCH;
  }

  changeRightWalkAnimation() {
    let src =
      imgSrcs.characterWalkRight[
        this.incrImgCount(
          this.mainChar.walkRightImg++,
          imgSrcs.characterWalkRight.length
        )
      ];
    this.mainChar.characterImageSrc = src;
    this.mainChar.lastWalkStarted = new Date().getTime();
  }

  changeLeftWalkAnimation() {
    let src =
      imgSrcs.characterWalkLeft[
        this.incrImgCount(
          this.mainChar.walkLeftImg++,
          imgSrcs.characterWalkLeft.length
        )
      ];
    this.mainChar.characterImageSrc = src;
    this.mainChar.lastWalkStarted = new Date().getTime();
  }

  endJumpingState() {
    this.mainChar.isJumping = false;
    this.mainChar.jumpImg = 0;
    this.mainChar.charStatus = CHARACTER_STATUS.IDLE;
    this.mainChar.characterImageSrc = imgSrcs.characterIdle[0];
  }

  resetIdle() {
    this.mainChar.idleImg = 0;
  }

  resetWalk() {
    this.mainChar.walkRightImg = 0;
    this.mainChar.walkLeftImg = 0;
  }

  updateWalkRightState() {
    this.resetIdle();
    this.bg_elements -= WALK_SPEED;
    if (!this.mainChar.isJumping) {
      let diff = new Date().getTime() - this.mainChar.lastWalkStarted;
      if (this.changeWalkAnimationDue(diff)) {
        this.changeRightWalkAnimation();
      }
    }
  }

  updateWalkLeftState() {
    this.resetIdle();
    this.bg_elements += WALK_SPEED;
    if (!this.mainChar.isJumping) {
      let diff = new Date().getTime() - this.mainChar.lastWalkStarted;
      if (this.changeWalkAnimationDue(diff)) {
        this.changeLeftWalkAnimation();
      }
    }
  }

  updateJumpCharacter() {
    let diffJump = new Date().getTime() - this.mainChar.lastJumpStarted;
    let diffJumpAnim =
      new Date().getTime() - this.mainChar.lastJumpAnimationStarted;
    // Check if Character is jumping or Falling or Landing
    if (this.isJumping(diffJump)) {
      this.mainChar.y_coordinate -= JUMP_SPEED;
      this.performJumpAnimation(diffJumpAnim);
    } else if (this.isFalling()) {
      this.mainChar.y_coordinate += JUMP_SPEED;
    } else if (this.isLanding()) {
      if (diffJumpAnim > LANDING_ANIM_SWI) {
        this.performLandingAnimation();
      }
    } else {
      this.endJumpingState();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.mainChar.charStatus = CHARACTER_STATUS.WALK_LEFT;
    }
    if (e.key == 'ArrowRight') {
      this.mainChar.charStatus = CHARACTER_STATUS.WALK_RIGHT;
    }
    let timePassedSinceJump =
      new Date().getTime() - this.mainChar.lastJumpStarted;
    if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2) {
      this.mainChar.charStatus = CHARACTER_STATUS.JUMP;
      this.mainChar.lastJumpStarted = new Date().getTime();
      AUDIO_JUMP.play();
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.resetIdle();
      this.mainChar.charStatus = CHARACTER_STATUS.IDLE;
    }
    if (e.key == 'ArrowRight') {
      this.resetIdle();
      this.mainChar.charStatus = CHARACTER_STATUS.IDLE;
    }
    // if (e.code == 'Space') {
    //   this.isJumping = false;
    // }
  }
}
