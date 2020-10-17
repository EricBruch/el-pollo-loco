import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CHARACTER_STATUS, GAME_SPEED, JUMP_TIME } from './definition';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  character_x: number = 100;
  character_y: number = 260;
  bg_elements: number = 0;
  isMovingRight: boolean = false;
  isMovingLeft: boolean = false;
  lastJumpStarted: number = 0;

  @ViewChild('canvas')
  myCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;
  character_image = new Image();
  currentCharacterImage: string = 'assets/img/animation/idle/I-1.png';
  background_image_1 = new Image();
  background_image_2 = new Image();

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.loadResources();
    this.checkForRunning();
    this.draw();
  }

  loadResources() {
    this.background_image_1.src = 'assets/img/Completo.png';
  }

  checkForRunning() {
    setInterval(() => {
      if (this.isMovingRight) {
        if (this.currentCharacterImage == 'assets/img/animation/idle/I-1.png') {
          this.currentCharacterImage = 'assets/img/animation/walk/right/W-R-1.png';
        } else {
          this.currentCharacterImage = 'assets/img/animation/idle/I-1.png';
        }
      }
    }, 200);
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
    this.character_image.src = this.currentCharacterImage;
    let timePassedSinceJump = new Date().getTime() - this.lastJumpStarted;

    if (timePassedSinceJump < JUMP_TIME) {
      this.character_y -= 10;
    } else {
      // Check falling
      if (this.character_y < 260) {
        this.character_y += 10;
      }
    }
    // draw character
    if (this.character_image.complete) {
      this.context.drawImage(
        this.character_image,
        this.character_x,
        this.character_y,
        this.character_image.width * 0.35,
        this.character_image.height * 0.35
      );
    }
  }

  drawBackgroundPicture() {
    if (this.isMovingLeft) {
      this.bg_elements += GAME_SPEED;
    }
    if (this.isMovingRight) {
      this.bg_elements -= GAME_SPEED;
    }
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

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.isMovingLeft = true;
      // this.character_x -= 10;
    }
    if (e.key == 'ArrowRight') {
      this.isMovingRight = true;
      // this.character_x += 10;
    }
    let timePassedSinceJump = new Date().getTime() - this.lastJumpStarted;
    if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2) {
      this.lastJumpStarted = new Date().getTime();
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.isMovingLeft = false;
    }
    if (e.key == 'ArrowRight') {
      this.isMovingRight = false;
    }
    // if (e.code == 'Space') {
    //   this.isJumping = false;
    // }
  }
}
