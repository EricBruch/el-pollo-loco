import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  JUMP_TIME,
  IMG_SRCs,
  AUDIO,
  GAME_STATUS,
  BOTTLE_STATUS,
  X_COLLISION_ADJUSTMENT,
  canvasSize,
  canvasBaseSizes,
} from './constants';
import {
  coins,
  imgCache,
  chickens,
  bottles,
  scalingFactorAdjustment,
} from './objects';
import { MainCharacter as mainChar } from './classes/mainCharacter/main-character';
import { Endboss } from './classes/endboss/endboss';
import { ImageCacheService } from '../services/image-cache.service';
import { CollisionService } from '../services/Collision/collision.service';
import { LoadResourcesService } from '../services/loadResources/load-resources.service';
import { ThrowBottle } from './classes/throwBottle/throw-bottle';
import {
  setScalingAdjustment,
  addBGObject,
  drawBackgroundPictures,
  drawObjects,
  getAdjustedScalingFactor,
} from './utils/utils';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  constructor(
    private ImageCacheService: ImageCacheService,
    private CollisionService: CollisionService,
    private loadResourcesService: LoadResourcesService
  ) {
    this.CanvasMainCharacter = new mainChar(this, ImageCacheService);
    this.CanvasEndboss = new Endboss(this, ImageCacheService);
  }

  CanvasMainCharacter: mainChar;
  CanvasEndboss: Endboss;
  CanvasThrowBottle: ThrowBottle;

  gameStarted: boolean = false;
  gameFinished: boolean = false;
  charLostAt: number = undefined;
  smallDevice: boolean = false;

  startImage: HTMLImageElement = new Image();
  loseScreenImg: number = 0;

  bg_elements: number = 0;
  background_image: HTMLImageElement = new Image();

  startGuideImg: HTMLImageElement = new Image();
  /*
  TODOs
  * collision detection variable with % of images
  * position of throw bottle
  * jump function and other interval functions shouldn't be 
  *   dependent on the intervall time they are called
  *   (e.g. each time called increase jump hight, in contrast
  *   to specified time has passed --> increase jump hight)
  * also implemented in other Intervall functions
  * Question open Service used inside Model? Is this best practice
  * 
*/
  @ViewChild('canvas')
  Canvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.context = this.Canvas.nativeElement.getContext('2d');
    this.setCanvasFullScreen();
    setScalingAdjustment(
      canvasSize.width,
      canvasSize.height,
      canvasBaseSizes,
      scalingFactorAdjustment
    );
    this.loadResources();
    this.checkCollisionDetection();
    this.calculateChickenPosition();
    this.checkAnimationEndboss();
    this.checkAnimationCharacter();
    this.checkUpdateThrowingBottle();
    this.checkForLoseScreen();
    this.checkForCoinAnimation();
    this.draw();
  }

  setCanvasFullScreen() {
    let canvas = this.Canvas.nativeElement;
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    canvasSize.height = canvas.height;
    canvasSize.width = canvas.width;
    canvasSize.yGroundLevel = canvasSize.height * 0.8;
    if (canvasSize.width <= 1000) {
      this.smallDevice = true;
      alert('El Pollo Locco not optimised for mobile usage');
    }
  }

  loadResources() {
    this.setupImgCache();
    this.loadStaticImages();
    this.loadResourcesService.loadResources();
    this.initalizeSound();
  }

  loadStaticImages() {
    this.background_image = this.ImageCacheService.getImgFromCache(
      IMG_SRCs.bg_complete
    );
    this.startImage = this.ImageCacheService.getImgFromCache(
      IMG_SRCs.startScreen[0]
    );
    this.startGuideImg = this.ImageCacheService.getImgFromCache(
      IMG_SRCs.infoGuide
    );
  }

  checkForLoseScreen() {
    setInterval(() => {
      if (this.charLostAt) {
        this.loseScreenImg++;
        this.loseScreenImg =
          this.loseScreenImg % (IMG_SRCs.loseScreen.length - 1);
      }
    }, 1000);
  }

  checkForRunning() {
    setInterval(() => {
      if (this.gameStarted && !this.charLostAt) {
        this.CanvasMainCharacter.updateRunningState();
      }
    }, 30);
  }

  checkForJump() {
    setInterval(() => {
      if (this.CanvasMainCharacter.isInJumpProcess()) {
        this.CanvasMainCharacter.updateJumpCharacter();
      }
    }, 18);
  }

  checkForIdle() {
    setInterval(() => {
      this.CanvasMainCharacter.checkCharacterIdle();
    }, 120);
  }

  checkAnimationCharacter() {
    this.checkForRunning();
    this.checkForJump();
    this.checkForIdle();
    this.checkCharacterHit();
    this.checkCharacterDead();
  }

  checkCharacterHit(): void {
    setInterval(() => {
      this.CanvasMainCharacter.updateCharacterHit();
    }, 120);
  }

  checkCharacterDead() {
    setInterval(() => {
      this.CanvasMainCharacter.updateCharacterDead();
    }, 120);
  }

  checkThrowBottTouchGround() {
    if (
      this.CanvasThrowBottle.isThrowing() &&
      this.CanvasThrowBottle.isOnGroundLevel()
      
    ) {
      this.playAudio(AUDIO.SMASH_BOTTLE);
      this.CanvasThrowBottle.setStatus(BOTTLE_STATUS.splash);
    }
  }

  playAudio(audio: HTMLAudioElement) {
    if (audio.ended) {
      audio.pause();
      audio.currentTime = 0;
    }
    audio.play();
  }

  checkAnimationEndboss() {
    setInterval(() => {
      this.CanvasEndboss.updateEndboss();
    }, 40);
  }

  checkForCoinAnimation() {
    setInterval(() => {
      coins.forEach((coin) => {
        coin.adjustImgNr();
      });
    }, 200);
  }

  /**
   * Comment me !!
   */
  setupImgCache() {
    for (const imgCateg in IMG_SRCs) {
      if (Array.isArray(IMG_SRCs[imgCateg])) {
        for (let i = 0; i < IMG_SRCs[imgCateg].length; i++) {
          const src = IMG_SRCs[imgCateg][i];
          let img = new Image();
          img.src = src;
          imgCache.push(img);
        }
      } else {
        const src = IMG_SRCs[imgCateg];
        let img = new Image();
        img.src = src;
        imgCache.push(img);
      }
    }
  }

  draw() {
    let drawFunction = () => this.draw();
    requestAnimationFrame(drawFunction);
    let status = this.getGameStatus();
    switch (status) {
      case GAME_STATUS.start:
        this.drawStartScreen();
        break;

      case GAME_STATUS.play:
        this.drawPlayScreen();
        break;

      case GAME_STATUS.end:
        this.drawEndScreen();
        break;

      default:
        break;
    }
  }

  drawCharacter() {
    let img = this.CanvasMainCharacter.getImg();
    let xAdjustment = 0;
    let imgWidthAdjustment = 1;
    let scaleX = getAdjustedScalingFactor(
      this.CanvasMainCharacter.getScale(),
      scalingFactorAdjustment.x_ScalingAdjustment
    );
    let scaleY = getAdjustedScalingFactor(
      this.CanvasMainCharacter.getScale(),
      scalingFactorAdjustment.y_ScalingAdjustment
    );
    if (this.CanvasMainCharacter.isIsRunningLeft()) {
      this.mirrorImg();
      xAdjustment = img.width * scaleX;
      imgWidthAdjustment = -1;
    }
    // draw character
    if (img.complete) {
      this.context.drawImage(
        img,
        this.CanvasMainCharacter.getLeftImgBorder() - xAdjustment,
        this.CanvasMainCharacter.getUpperImgBorder(),
        img.width * scaleX * imgWidthAdjustment,
        img.height * scaleY
      );
    }
    if (this.CanvasMainCharacter.isIsRunningLeft()) {
      this.context.restore();
    }
  }

  private drawSmallDeviceWarning(): void {
    this.context.font = '30px Kalam';
    this.context.fillText(
      'El Pollo Locco is not adjusted to be used',
      0,
      canvasSize.height * (1 / 3)
    );
    this.context.fillText(
      'with tablets or mobile devices',
      0,
      canvasSize.height * (2 / 3)
    );
  }

  drawStartScreen() {
    let canvas = this.Canvas.nativeElement;
    if (this.smallDevice) {
      this.drawSmallDeviceWarning();
      return;
    }
    addBGObject(
      this.startImage,
      0,
      0,
      canvas.width,
      canvas.height,
      1,
      1,
      1,
      this.context,
      this.bg_elements
    );
    addBGObject(
      this.startGuideImg,
      0,
      0,
      this.startGuideImg.width,
      this.startGuideImg.height,
      1,
      1,
      1,
      this.context,
      this.bg_elements
    );
  }

  drawPlayScreen() {
    this.drawBackgroundPicture();
    this.drawBottles();
    this.drawChicken();
    this.drawCoins();
    this.drawEndBoss();
    this.drawCharacter();
    this.drawThrowBottle();
    this.drawItemOverview();
  }

  drawEndScreen() {
    this.drawBackgroundPicture();
    this.drawEndBoss();
    if (this.charLostAt) {
      this.drawLoseScreen();
    } else {
      this.drawWinScreen();
    }
  }

  getGameStatus() {
    if (!this.gameStarted) {
      return GAME_STATUS.start;
    }
    if (!this.gameFinished) {
      return GAME_STATUS.play;
    }
    return GAME_STATUS.end;
  }

  initalizeSound() {
    AUDIO.BG_MUSIC.loop = true;
    AUDIO.BG_MUSIC.volume = 0.2;
  }

  drawItemOverview() {
    let x_icon = -15;
    let x_txt = 45;
    this.context.font = '30px Kalam';
    this.addNonMoveableObject(IMG_SRCs.bottles[0], x_icon, 0, 0.2, 1);
    this.context.fillText(
      'x' + this.CanvasMainCharacter.collBottles,
      x_txt,
      55
    );

    this.addNonMoveableObject(IMG_SRCs.heart, x_icon + 110, 0, 0.5, 1);
    this.context.fillText(
      'x' + this.CanvasMainCharacter.getLives(),
      x_txt + 120,
      55
    );

    this.addNonMoveableObject(IMG_SRCs.coin, x_icon + 220, 0, 0.5, 1);
    this.context.fillText(
      'x' + this.CanvasMainCharacter.getCollCoins(),
      x_txt + 230,
      55
    );
  }

  checkUpdateThrowingBottle() {
    setInterval(() => {
      if (this.CanvasThrowBottle) {
        this.updateThrowBottle();
      }
    }, 30);
  }

  updateThrowBottle() {
    switch (this.CanvasThrowBottle.getStatus()) {
      case BOTTLE_STATUS.throw:
        this.CanvasThrowBottle.moveBottle();
        this.CanvasThrowBottle.adjustAnimation();
        this.checkThrowBottTouchGround();
        this.checkEndbossHit();
        break;

      case BOTTLE_STATUS.splash:
        this.CanvasThrowBottle.adjustAnimation();
        if (this.CanvasThrowBottle.isSplashFinished()) {
          this.CanvasThrowBottle = undefined;
        }
        break;
    }
  }

  drawThrowBottle() {
    if (this.CanvasThrowBottle) {
      let img = this.CanvasThrowBottle.getImg();
      let scaleX = getAdjustedScalingFactor(
        this.CanvasThrowBottle.getScale(),
        scalingFactorAdjustment.x_ScalingAdjustment
      );
      let scaleY = getAdjustedScalingFactor(
        this.CanvasThrowBottle.getScale(),
        scalingFactorAdjustment.y_ScalingAdjustment
      );
      addBGObject(
        img,
        this.CanvasThrowBottle.getCurrentXPosition(0),
        this.CanvasThrowBottle.getUpperImgBorder(),
        img.width,
        img.height,
        scaleX,
        scaleY,
        1,
        this.context,
        this.bg_elements
      );
    }
  }

  drawEndBoss() {
    this.drawEndbossImg();
    if (!this.CanvasEndboss.getDefeatedAt()) {
      this.drawEndbossLiveBar();
    }
  }

  drawEndbossImg() {
    let endbossImg = this.CanvasEndboss.getImg();
    let scaleX = getAdjustedScalingFactor(
      this.CanvasEndboss.getScale(),
      scalingFactorAdjustment.x_ScalingAdjustment
    );
    let scaleY = getAdjustedScalingFactor(
      this.CanvasEndboss.getScale(),
      scalingFactorAdjustment.y_ScalingAdjustment
    );
    addBGObject(
      endbossImg,
      this.CanvasEndboss.getLeftImgBorder(),
      this.CanvasEndboss.getUpperImgBorder(),
      endbossImg.width,
      endbossImg.height,
      scaleX,
      scaleY,
      1,
      this.context,
      this.bg_elements
    );
  }

  drawEndbossLiveBar() {
    this.context.globalAlpha = 0.3;
    this.context.fillStyle = 'red';
    this.context.fillRect(
      this.CanvasEndboss.getCurrentXPosition(),
      this.CanvasEndboss.getUpperImgBorder() + 35,
      2 * this.CanvasEndboss.getLive(),
      15
    );

    this.context.fillStyle = 'black';
    this.context.fillRect(
      this.CanvasEndboss.getCurrentXPosition() - 5,
      this.CanvasEndboss.getUpperImgBorder() + 30,
      210,
      25
    );
    this.context.globalAlpha = 1;
  }

  drawWinScreen() {
    this.context.font = '120px Kalam';
    this.context.fillText(
      'You won!',
      canvasSize.width / 2.5,
      canvasSize.height / 2
    );
  }

  drawLoseScreen() {
    let imgService = this.ImageCacheService;
    let srcPath = imgService.getImgSrcPathByKey(
      'loseScreen',
      this.loseScreenImg
    );
    let canvas = this.Canvas.nativeElement;
    this.addBGPicture(
      imgService.getImgFromCache(srcPath),
      0 - this.bg_elements,
      0,
      canvas.width,
      canvas.height,
      1,
      1
    );
  }

  mirrorImg() {
    this.context.save();
    this.context.scale(-1, 1);
  }

  drawBottles() {
    drawObjects(
      bottles,
      scalingFactorAdjustment,
      this.context,
      this.bg_elements
    );
  }

  drawCoins() {
    drawObjects(coins, scalingFactorAdjustment, this.context, this.bg_elements);
  }

  checkCollisionDetection() {
    setInterval(() => {
      this.checkCollisionChicken();
      this.checkCollisionTabasco();
      this.checkCollisionEndboss();
      this.checkCollisionCoins();
    }, 350);
  }

  checkCollisionChicken() {
    chickens.forEach((chicken) => {
      let timePassed =
        new Date().getTime() - this.CanvasMainCharacter.getLastHitHappened();
      let hasCollision = this.CollisionService.areObjectsInCollision(
        chicken.getCurrentXPosition(this.bg_elements),
        chicken.getUpperImgBorder() - 25,
        chicken.getImgWidth() - 35,
        chicken.getImgHeight() - 25,
        this.CanvasMainCharacter.getLeftImgBorder() - 35,
        this.CanvasMainCharacter.getUpperImgBorder() - 35,
        this.CanvasMainCharacter.getImgWidth() - 35,
        this.CanvasMainCharacter.getImgHeight() - 25
      );
      if (hasCollision && timePassed > 1500) {
        if (this.CanvasMainCharacter.getLives() > 0) {
          this.CanvasMainCharacter.performCharHit();
        }
        if (this.CanvasMainCharacter.getLives() <= 0) {
          this.charLostAt = new Date().getTime();
          this.gameFinished = true;
        }
      }
    });
  }

  checkCollisionTabasco() {
    for (let i = 0; i < bottles.length; i++) {
      let bottle = bottles[i];
      if (
        this.CollisionService.areObjectsInCollision(
          bottle.getCurrentXPosition(this.bg_elements),
          bottle.getUpperImgBorder(),
          bottle.getImgWidth() - 0,
          bottle.getImgHeight() - 0,
          this.CanvasMainCharacter.getLeftImgBorder(),
          this.CanvasMainCharacter.getUpperImgBorder(),
          this.CanvasMainCharacter.getImgWidth() -
            X_COLLISION_ADJUSTMENT.mainCharWithTabasco,
          this.CanvasMainCharacter.getImgHeight()
        )
      ) {
        this.CanvasMainCharacter.collBottle(i);
        if (!AUDIO.OPEN_BOTTLE.ended) {
          AUDIO.OPEN_BOTTLE.pause();
          AUDIO.OPEN_BOTTLE.currentTime = 0;
        }
        AUDIO.OPEN_BOTTLE.play();
      }
    }
  }

  checkCollisionEndboss() {
    this.checkEndbossTouchesCharacter();
  }

  checkCollisionCoins() {
    for (let i = 0; i < coins.length; i++) {
      const coin = coins[i];
      let mainCharImgWidth =
        this.CanvasMainCharacter.getImgWidth() -
        X_COLLISION_ADJUSTMENT.mainCharWithCoin;
      let isHit = this.CollisionService.areObjectsInCollision(
        coin.getCurrentXPosition(this.bg_elements),
        coin.getUpperImgBorder(),
        coin.getImgWidth() - 0,
        coin.getImgHeight() - 0,
        this.CanvasMainCharacter.getLeftImgBorder(),
        this.CanvasMainCharacter.getUpperImgBorder(),
        mainCharImgWidth,
        this.CanvasMainCharacter.getImgHeight() - 0
      );
      if (isHit) {
        this.CanvasMainCharacter.collectCoin(i);
        AUDIO.COLL_COIN.play();
      }
    }
  }

  finishLevel() {
    AUDIO.CHICKEN.play();
    setTimeout(() => {
      AUDIO.WIN.play();
    }, 500);
    this.gameFinished = true;
  }

  checkEndbossHit() {
    if (this.CanvasThrowBottle && this.CanvasThrowBottle.isThrowing) {
      let hasCollision = this.CollisionService.areObjectsInCollision(
        this.CanvasThrowBottle.getCurrentXPosition(this.bg_elements),
        this.CanvasThrowBottle.getUpperImgBorder(),
        this.CanvasThrowBottle.getImgWidth() - 50, //- 300
        this.CanvasThrowBottle.getImgHeight() - 50,
        this.CanvasEndboss.getCurrentXPosition() + 75, //+ 140
        this.CanvasEndboss.getUpperImgBorder() + 130, //+ 180
        this.CanvasEndboss.getImgWidth() - 0,
        this.CanvasEndboss.getImgHeight() - 0
      );
      if (hasCollision) {
        if (this.CanvasEndboss.getLive() > 0) {
          this.playAudio(AUDIO.SMASH_BOTTLE);
          this.CanvasThrowBottle.setStatus(BOTTLE_STATUS.splash);
          this.CanvasEndboss.hitEndboss();
        } else if (this.CanvasEndboss.getDefeatedAt() == 0) {
          this.CanvasEndboss.setDefeatedAt(new Date().getTime());
          this.finishLevel();
        }
      }
    }
  }

  checkEndbossTouchesCharacter() {
    let timePassed =
      new Date().getTime() - this.CanvasMainCharacter.getLastHitHappened();
    let isHit = this.CollisionService.areObjectsInCollision(
      this.CanvasEndboss.getCurrentXPosition(),
      this.CanvasEndboss.getUpperImgBorder(),
      this.CanvasEndboss.getImgWidth(),
      this.CanvasEndboss.getImgHeight(),
      this.CanvasMainCharacter.getLeftImgBorder(),
      this.CanvasMainCharacter.getUpperImgBorder(),
      this.CanvasMainCharacter.getImgWidth(),
      this.CanvasMainCharacter.getImgHeight()
    );
    if (isHit && timePassed > 1000) {
      if (this.CanvasMainCharacter.getLives() > 1) {
        this.CanvasMainCharacter.performCharHit();
      } else {
        this.charLostAt = new Date().getTime();
        this.gameFinished = true;
      }
    }
  }

  calculateChickenPosition() {
    setInterval(() => {
      if (this.gameStarted) {
        chickens.forEach((chicken) => {
          chicken.moveChicken();
        });
      }
    }, 250);
  }

  drawBackgroundPicture() {
    drawBackgroundPictures(
      this.background_image,
      this.Canvas.nativeElement.width,
      this.Canvas.nativeElement.height,
      this.context,
      this.bg_elements
    );
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
    drawObjects(
      chickens,
      scalingFactorAdjustment,
      this.context,
      this.bg_elements
    );
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      this.gameStarted = true;
      //this.playAudio(AUDIO.BG_MUSIC)
    }
    if (
      e.code === 'KeyD' &&
      this.CanvasMainCharacter.getCollBottles() > 0 &&
      new Date().getTime() - this.CanvasMainCharacter.getLastBottleThrowTime() >
        1000
    ) {
      let dateTime = new Date().getTime();
      this.CanvasThrowBottle = new ThrowBottle(
        this.CanvasMainCharacter.getXThrowPosition(),
        this.CanvasMainCharacter.getYThrowPosition(),
        dateTime,
        this.ImageCacheService
      );
      this.CanvasMainCharacter.startBottleThrow(dateTime);
      this.playAudio(AUDIO.THROW_BOTTLE);
    }

    if (e.code === 'ArrowLeft') {
      this.CanvasMainCharacter.startRunningLeft();
      AUDIO.RUNNING.play();
    }
    if (e.code == 'ArrowRight') {
      this.CanvasMainCharacter.startRunningRight();
      AUDIO.RUNNING.play();
    }
    let timePassedSinceJump =
      new Date().getTime() - this.CanvasMainCharacter.getLastJumpStarted();
    if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2) {
      this.CanvasMainCharacter.startJump();
      AUDIO.JUMP.play();
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.CanvasMainCharacter.endRunningStateLeft();
      AUDIO.RUNNING.pause();
    }
    if (e.key == 'ArrowRight') {
      this.CanvasMainCharacter.endRunningStateRight();
      AUDIO.RUNNING.pause();
    }
    // if (e.code == 'Space') {
    //   this.isJumping = false;
    // }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setCanvasFullScreen();
  }
}
