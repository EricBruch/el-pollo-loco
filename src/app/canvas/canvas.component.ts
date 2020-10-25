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
  IDLE_ANIMATION_SWITCH,
  WALK_ANIMATION_SWITCH,
  X_COORDINATE_BASE_LEVEL,
  Y_COORDINATE_BASE_LEVEL,
  charImgSrcs,
  MainCharacter,
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
    characterImageSrc: charImgSrcs.characterIdle[0],
    idleImg: 0,
    walkRightImg: 0,
    walkLeftImg: 0,
    jumpImg: 0,
  };
  bg_elements: number = 0;
  isMovingRight: boolean = false;
  isMovingLeft: boolean = false;

  @ViewChild('canvas')
  myCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;
  background_image_1 = new Image();
  background_image_2 = new Image();

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.loadResources();
    this.draw();
  }

  loadResources() {
    this.background_image_1.src = 'assets/img/Completo.png';
  }

  draw() {
    this.drawBackgroundPicture();
    this.updateCharacter();
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
        break;

      /* TODO
      case CHARACTER_STATUS.LONG_IDLE_:
        // change Character Image
        // change position of Character
        break;
      */

      case CHARACTER_STATUS.WALK_RIGHT:
        this.updateWalkRightState();
        break;

      case CHARACTER_STATUS.WALK_LEFT:
        this.updateWalkLeftState();
        break;

      case CHARACTER_STATUS.JUMP:
        this.resetIdle();
        this.mainChar.isJumping = true;
        break;
    }
  }

  drawBackgroundPicture() {
    let canvas = this.myCanvas.nativeElement;
    this.addBackgroundObject(
      this.background_image_1,
      0,
      0,
      canvas.width * 3,
      canvas.height,
      1,
      1
    );
    this.addBackgroundObject(
      this.background_image_1,
      canvas.width * 3,
      0,
      canvas.width * 3,
      canvas.height,
      1,
      1
    );
  }

  addBackgroundObject(obj, offset_x, offset_y, width, height, scale, opacity) {
    if (opacity != undefined) {
      this.context.globalAlpha = opacity;
    }
    this.context.drawImage(
      obj,
      offset_x + this.bg_elements,
      offset_y,
      width * scale,
      height * scale
    );
    this.context.globalAlpha = 1;
  }

  /**
   * This method checks if the character is Idle longer then the IDLE_ANIMATION_SWITCH difference
   * if so the next img of Idle is shown
   */
  updateIdleState() {
    let diff = new Date().getTime() - this.mainChar.lastIdleStarted;
    if (diff > IDLE_ANIMATION_SWITCH) {
      let src =
        charImgSrcs.characterIdle[
          this.incrImgCount(
            ++this.mainChar.idleImg,
            charImgSrcs.characterIdle.length
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
      let src = charImgSrcs.characterJump[this.incrJumpImgUpToFalling()];
      this.mainChar.characterImageSrc = src;
      this.mainChar.lastJumpAnimationStarted = new Date().getTime();
    }
  }

  performLandingAnimation() {
    let src =
      charImgSrcs.characterJump[
        ++this.mainChar.jumpImg % charImgSrcs.characterJump.length
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

  endJumpingState() {
    this.mainChar.isJumping = false;
    this.mainChar.jumpImg = 0;
    this.mainChar.charStatus = CHARACTER_STATUS.IDLE;
    this.mainChar.characterImageSrc = charImgSrcs.characterIdle[0];
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
      if (diff > WALK_ANIMATION_SWITCH) {
        let src =
          charImgSrcs.characterWalkRight[
            this.incrImgCount(
              this.mainChar.walkRightImg++,
              charImgSrcs.characterWalkRight.length
            )
          ];
        this.mainChar.characterImageSrc = src;
        this.mainChar.lastWalkStarted = new Date().getTime();
      }
    }
  }

  updateWalkLeftState() {
    this.resetIdle();
    this.bg_elements += WALK_SPEED;
    if (!this.mainChar.isJumping) {
      let diff = new Date().getTime() - this.mainChar.lastWalkStarted;
      if (diff > WALK_ANIMATION_SWITCH) {
        let src =
          charImgSrcs.characterWalkLeft[
            this.incrImgCount(
              this.mainChar.walkLeftImg++,
              charImgSrcs.characterWalkLeft.length
            )
          ];
        this.mainChar.characterImageSrc = src;
        this.mainChar.lastWalkStarted = new Date().getTime();
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
