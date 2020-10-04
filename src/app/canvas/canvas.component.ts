import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  character_x = 0;

  @ViewChild('canvas')
  myCanvas: ElementRef<HTMLCanvasElement>;

  public context: CanvasRenderingContext2D;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');

    setInterval( () => {
      this.drawBackground();
      this.updateCharacter();
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
      this.context.drawImage(base_image, this.character_x, 400, base_image.width * 0.35, base_image.height * 0.35);
    };
  }

  @HostListener('document:keydown',['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      this.character_x -= 5;
    }
    if (e.key == "ArrowRight") {
      this.character_x += 5;
    }
  }

  /*isArrowKey(e: KeyboardEvent){
    if (e.key == "ArrowUp" || e.key == "ArrowDown") {
      return true;
    } else {
      return false;
    }
  }*/

}
