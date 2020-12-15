export abstract class MoveableObject {
  private xPos: number;
  private yPos: number;
  private imgSrc: string;
  private scale: number;

  /**
   * getLeftImgBorder
   */
  public getLeftImgBorder(): number {
    return this.xPos;
  }

  public set_xPos(xPos: number): void {
    this.xPos = xPos;
  }

  /**
   * getUpperImgBorder
   */
  public getUpperImgBorder(): number {
    return this.yPos;
  }

  public set_yPos(yPos: number): void {
    this.yPos = yPos;
  }

  public getImgSrc(): string {
    return this.imgSrc;
  }

  public setImgSrc(imgSrc: string): void {
    this.imgSrc = imgSrc;
  }

    /**
   * getScale
   */
  public getScale(): number {
    return this.scale;
  }

  
}
