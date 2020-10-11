import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  character_x: number = 0;
  character_y: number = 425;
  bg_elements: number = 0;
  isMovingRight: boolean = false;
  isMovingLeft: boolean = false;
  lastJumpStarted: number = 0;

  @ViewChild('canvas')
  myCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;
  character_image = new Image();
  background_image = new Image();

  //################################# Game Config ##################################
  JUMP_TIME = 300; // in ms


  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.loadResources();
    this.draw();
  }

  loadResources() {
    this.character_image.src = 'assets/img/mexican.png';
    this.background_image.src = 'assets/img/background_1.png';
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
    let timePassedSinceJump = new Date().getTime() - this.lastJumpStarted;

    if (timePassedSinceJump < this.JUMP_TIME) {
      this.character_y -= 10;
    } else {
      // Check falling
      if (this.character_y < 425) {
        this.character_y += 10;
      }
    }
    // draw picture
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
      this.bg_elements += 2;
    }
    if (this.isMovingRight) {
      this.bg_elements -= 2;
    }
    let canvas = this.myCanvas.nativeElement;
    if (this.background_image.complete) {
      this.context.drawImage(
        this.background_image,
        this.bg_elements,
        0,
        canvas.width,
        canvas.height
      );
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.isMovingLeft = true;
      this.character_x -= 10;
    }
    if (e.key == 'ArrowRight') {
      this.isMovingRight = true;
      this.character_x += 10;
    }
    let timePassedSinceJump = new Date().getTime() - this.lastJumpStarted;
    if (e.code == 'Space' && timePassedSinceJump > (this.JUMP_TIME * 2)) {
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
