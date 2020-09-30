import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  @ViewChild('canvas')
  myCanvas: ElementRef<HTMLCanvasElement>;

  public context: CanvasRenderingContext2D;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.drawBackground();
    this.drawCharacter();
  }


  drawBackground() {
    this.context.fillStyle = 'white';
    this.context.fillRect(
      0,
      0,
      this.myCanvas.nativeElement.width,
      this.myCanvas.nativeElement.height
    );
    //this.drawGround();
  }

  drawGround() {
    let canvas = this.myCanvas.nativeElement;
    this.context.fillStyle = 'rgba(255,230,153)';
    this.context.fillRect(0, 640, canvas.width, canvas.height);
  }

  drawCharacter() {
    let base_image = new Image();
    base_image.src = 'assets/img/mexican.png';
    base_image.onload = () => {
      this.context.drawImage(base_image, 0, 400, base_image.width * 0.35, base_image.height * 0.35);
    };
  }


}
