import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  character_x: number = 0;
  bg_elements: number = 0;
  isMovingRight: boolean = false;
  isMovingLeft: boolean = false;


  @ViewChild('canvas')
  myCanvas: ElementRef<HTMLCanvasElement>;

  public context: CanvasRenderingContext2D;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');

    setInterval( () => {
      //this.drawBackground();
      this.drawBackgroundPicture();
      this.updateCharacter();
      //this.drawGround();
      
    }, 50);

    this.drawGround();
  }


  drawBackground() {
    this.context.fillStyle = 'white';
    this.context.fillRect(
      0,
      0,
      this.myCanvas.nativeElement.width,
      this.myCanvas.nativeElement.height
    );
  }

  drawGround() {
    let canvas = this.myCanvas.nativeElement;
    this.context.fillStyle = 'rgba(255,230,153)';
    this.context.fillRect(0, 640, canvas.width, canvas.height);
  }

  updateCharacter() {
    let base_image = new Image();
    base_image.src = 'assets/img/mexican.png';
    base_image.onload = () => {
      this.context.drawImage(base_image, this.character_x, 425, base_image.width * 0.35, base_image.height * 0.35);
    };
  }

  drawBackgroundPicture(){
    if (this.isMovingLeft) {
      this.bg_elements += 2;
    }
    if (this.isMovingRight) {
      this.bg_elements -= 2;
    }
    let canvas =  this.myCanvas.nativeElement;
    let background_image = new Image();
    background_image.src = 'assets/img/background_1.png';
    background_image.onload = () => {
      this.context.drawImage(background_image, this.bg_elements, 0, canvas.width, canvas.height);
    };
  }

  @HostListener('document:keydown',['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      this.isMovingLeft = true;
      this.character_x -= 10;
    }
    if (e.key == "ArrowRight") {
      this.isMovingRight = true;
      this.character_x += 10;
    }
  }

  @HostListener('document:keyup',['$event'])
  onKeyUp(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      this.isMovingLeft = false;
    }
    if (e.key == "ArrowRight") {
      this.isMovingRight = false;
    }
  }

}
