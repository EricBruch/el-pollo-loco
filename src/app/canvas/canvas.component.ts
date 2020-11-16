import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  JUMP_TIME,
  GRAVITY,
  Y_COORDINATE_BASE_LEVEL,
  IMG_SRCs,
  AUDIO,
  GAME_STATUS,
  BOTTLE_STATUS,
  SCALING_FACTOR,
  X_COLLISION_ADJUSTMENT,
} from './constants';
import { coins, imgCache, loseImgs, chickens, bottles } from './objects';
import { Bottles } from './types/bottles.type';
import { MainCharacter as mainChar } from './classes/mainCharacter/main-character';
import { Endboss } from './classes/endboss/endboss';
import { ImageCacheService } from '../services/image-cache.service';
import { CollisionService } from '../services/Collision/collision.service';
import { LoadResourcesService } from '../services/loadResources/load-resources.service';
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
    this.CanvasEndboss = new Endboss(this);
  }

  CanvasMainCharacter: mainChar;
  CanvasEndboss: Endboss;

  gameStarted = false;
  gameFinished = false;
  charLostAt = undefined;

  startImage = new Image();
  loseScreenImg = 0;

  bg_elements: number = 0;
  background_image = new Image();

  bottles: Bottles = {
    //placedB: BOTTLE_START_X_COORD,
    throwB_X: 0,
    throwB_Y: 0,
    throwB_Status: BOTTLE_STATUS.inactive,
    throwB_ImgNr: 0,
  };
  /*
  TODOs
  * + Sound für aufeinanderfolgenden Flaschenwurf abspielen
  * + Animation Chicken
  * + Animation Coins
  * + Create Class for Bottles
  *   + needs to hold y coordination
  * 
  * + dynamische Größe Canvas (Vollbildmodus)
  * + Coins:
  *   + make Coin Class to give bg_elements and make bg_elements adustment outside
*/
  @ViewChild('canvas')
  myCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.loadResources();
    this.checkCollisionDetection();
    this.calculateChickenPosition();
    this.checkForAnimationEndboss();
    this.checkForAnimationCharacter();
    this.checkForLoseScreen();
    this.checkThrowingBorder();
    this.checkForCoinAnimation();
    this.draw();
  }

  loadResources() {
    this.setupImgCache();
    this.loadAdditionalImgs();
    this.loadResourcesService.loadResources();
    this.initalizeSound();
  }

  loadAdditionalImgs() {
    this.background_image.src = IMG_SRCs.bg_complete;
    this.startImage.src = IMG_SRCs.startScreen[0];
    this.loadLoseScreenImg();
  }

  loadLoseScreenImg() {
    for (let i = 0; i < IMG_SRCs.endScreen.length; i++) {
      const src = IMG_SRCs.endScreen[i];
      let img = new Image();
      img.src = src;
      loseImgs.push(img);
    }
  }

  checkForLoseScreen() {
    let time = 1000;
    setInterval(() => {
      if (this.charLostAt) {
        setInterval(() => {
          if (this.loseScreenImg < IMG_SRCs.endScreen.length - 1) {
            this.loseScreenImg++;
          } else {
            this.loseScreenImg = 0;
          }
        }, time);
      }
    }, time);
  }

  checkForRunning() {
    setInterval(() => {
      if (this.gameStarted && !this.charLostAt) {
        this.CanvasMainCharacter.updateRunningState();
      }
    }, 20);
  }

  checkForJump() {
    setInterval(() => {
      if (this.CanvasMainCharacter.isInJumpProcess()) {
        this.CanvasMainCharacter.updateJumpCharacter();
      }
    }, 10);
  }

  checkForIdle() {
    setInterval(() => {
      this.CanvasMainCharacter.updateCharacterIdle();
    }, 30);
  }

  checkForAnimationCharacter() {
    this.checkForRunning();
    this.checkForJump();
    this.checkForIdle();
    this.checkCharacterHit();
    this.checkCharacterDead();
  }

  checkCharacterHit() {
    setInterval(() => {
      this.CanvasMainCharacter.updateCharacterHit();
      let x = this.ImageCacheService.getImgFromCache(
        'assets/img/character/walk/W-0.png'
      );
    }, 30);
  }

  checkCharacterDead() {
    setInterval(() => {
      this.CanvasMainCharacter.updateCharacterDead();
    }, 30);
  }

  checkThrowingBorder() {
    setInterval(() => {
      this.updateCheckThrowingBottle();
    }, 80);
  }

  updateCheckThrowingBottle() {
    if (
      this.isThrowBottleActive() &&
      (this.bottles.throwB_Y > Y_COORDINATE_BASE_LEVEL + 350 ||
        this.bottles.throwB_X >
          this.CanvasMainCharacter.getLeftImgBorder() - this.bg_elements + 800)
    ) {
      if (!AUDIO.SMASH_BOTTLE.ended) {
        AUDIO.SMASH_BOTTLE.pause();
        AUDIO.SMASH_BOTTLE.currentTime = 0;
      }
      AUDIO.SMASH_BOTTLE.play();
      this.bottles.throwB_Status = BOTTLE_STATUS.inactive;
      this.bottles.throwB_ImgNr = 0;
    }
  }

  isThrowBottleActive() {
    return (
      this.bottles.throwB_Status === BOTTLE_STATUS.splash ||
      this.bottles.throwB_Status === BOTTLE_STATUS.throw
    );
  }

  checkForAnimationEndboss() {
    setInterval(() => {
      this.CanvasEndboss.updateEndboss();
    }, 30);
  }

  checkForCoinAnimation() {
    setInterval(() => {
      coins.forEach((coin) => {
        coin.adjustImgNr();
      });
    }, 100);
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
        this.drawstartScreen();
        break;

      case GAME_STATUS.play:
        this.drawPlayScreens();
        break;

      case GAME_STATUS.end:
        this.drawEndScreen();
        break;

      default:
        break;
    }
  }

  updateCharacter() {
    let img = this.CanvasMainCharacter.getMainCharImg();

    let xAdjustment = 0;
    let imgWidthAdjustment = 1;
    if (this.CanvasMainCharacter.isIsRunningLeft()) {
      this.mirrorImg();
      xAdjustment = img.width * SCALING_FACTOR.mainChar;
      imgWidthAdjustment = -1;
    }
    // draw character
    if (img.complete) {
      this.context.drawImage(
        img,
        this.CanvasMainCharacter.getLeftImgBorder() - xAdjustment,
        this.CanvasMainCharacter.getUpperImgBorder(),
        img.width * SCALING_FACTOR.mainChar * imgWidthAdjustment,
        img.height * SCALING_FACTOR.mainChar
      );
    }
    if (this.CanvasMainCharacter.isIsRunningLeft()) {
      this.context.restore();
    }
  }

  drawstartScreen() {
    let canvas = this.myCanvas.nativeElement;
    this.addBGPicture(this.startImage, 0, 0, canvas.width, canvas.height, 1, 1);
  }

  drawPlayScreens() {
    this.drawBackgroundPicture();
    this.updateCharacter();
    this.drawChicken();
    this.drawBottles();
    this.drawCoins();
    this.drawItemOverview();
    this.drawThrowBottle();
    this.drawEndBoss();
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

  drawThrowBottle() {
    switch (this.bottles.throwB_Status) {
      case BOTTLE_STATUS.throw:
        this.moveThrowBottle();
        break;

      case BOTTLE_STATUS.splash:
        this.splashAnimationBottle();
        break;

      case BOTTLE_STATUS.inactive:
        break;

      default:
        break;
    }
  }

  moveThrowBottle() {
    let timePassed =
      new Date().getTime() - this.CanvasMainCharacter.getLastBottleThrowTime();
    let g = Math.pow(GRAVITY, timePassed / 300);
    this.bottles.throwB_X = 225 + timePassed * 0.9;
    this.bottles.throwB_Y = 470 - (timePassed * 0.4 - g);
    let n = this.bottles.throwB_ImgNr++ % IMG_SRCs.bottlesSpinning.length;
    this.addNonMoveableObject(
      IMG_SRCs.bottlesSpinning[n],
      this.bottles.throwB_X,
      this.bottles.throwB_Y,
      SCALING_FACTOR.throwBottle,
      1
    );
  }

  splashAnimationBottle() {
    if (this.bottles.throwB_ImgNr < IMG_SRCs.bottlesSplash.length) {
      this.addNonMoveableObject(
        IMG_SRCs.bottlesSplash[this.bottles.throwB_ImgNr++],
        this.bottles.throwB_X,
        this.bottles.throwB_Y,
        SCALING_FACTOR.throwBottle,
        1
      );
    } else {
      this.bottles.throwB_Status = BOTTLE_STATUS.inactive;
      this.bottles.throwB_ImgNr = 0;
      this.bottles.throwB_X = -2000;
      this.bottles.throwB_Y = 2000;
    }
  }

  drawEndBoss() {
    this.addBgObject(
      this.CanvasEndboss.getImgSrc(),
      this.CanvasEndboss.getLeftImgBorder(),
      this.CanvasEndboss.getUpperImgBorder(),
      this.CanvasEndboss.getScale(),
      1
    );

    if (!this.CanvasEndboss.getDefeatedAt()) {
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
  }

  drawWinScreen() {
    this.context.font = '120px Kalam';
    this.context.fillText('You won!', 250, 200);
  }

  drawLoseScreen() {
    let img = loseImgs[this.loseScreenImg];
    let canvas = this.myCanvas.nativeElement;
    this.addBGPicture(
      img,
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
    bottles.forEach((bottle) => {
      this.addBgObject(
        bottle.getImgSrc(),
        bottle.getLeftImgBorder(),
        bottle.getUpperImgBorder(),
        bottle.getScale(),
        1
      );
    });
  }

  drawCoins() {
    coins.forEach((c) => {
      this.addBgObject(
        c.getImgSrc(),
        c.getLeftImgBorder(),
        c.getPosY(),
        c.getScale(),
        c.getOpacity()
      );
    });
  }

  checkCollisionDetection() {
    setInterval(() => {
      this.checkCollisionChicken();
      this.checkCollisionTabasco();
      this.checkCollisionEndboss();
      this.checkCollisionCoins();
    }, 30);
  }

  checkCollisionChicken() {
    chickens.forEach((c) => {
      let chickenImgWidthAdjusted =
        c.getImgWidth() - X_COLLISION_ADJUSTMENT.mainCharWithChicken;
      let timePassed =
        new Date().getTime() - this.CanvasMainCharacter.getLastHitHappened();
      let hasCollision = this.CollisionService.areObjectsInCollision(
        c.getCurrentXPosition(this.bg_elements),
        c.getUpperImgBorder(),
        chickenImgWidthAdjusted,
        c.getImgHeight(),
        this.CanvasMainCharacter.getLeftImgBorder(),
        this.CanvasMainCharacter.getUpperImgBorder(),
        this.CanvasMainCharacter.getImgWidth(),
        this.CanvasMainCharacter.getImgHeight()
      );
      if (hasCollision && timePassed > 2000) {
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
    this.checkEndbossHit();
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
        coin.getPosY(),
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
    let timePassed =
      new Date().getTime() - this.CanvasEndboss.getLastHitTakenAt();
    let src_path = this.ImageCacheService.getImgSrcPathByKey(
      'bottlesSpinning',
      0
    );
    let bottleImg = this.ImageCacheService.getImgFromCache(src_path);
    let isHit = this.CollisionService.areObjectsInCollision(
      this.bottles.throwB_X,
      this.bottles.throwB_Y,
      bottleImg.width * SCALING_FACTOR.throwBottle,
      bottleImg.height * SCALING_FACTOR.throwBottle,
      this.CanvasEndboss.getCurrentXPosition(),
      this.CanvasEndboss.getUpperImgBorder(),
      this.CanvasEndboss.getImgWidth(),
      this.CanvasEndboss.getImgHeight()
    );
    if (timePassed > 1000 && isHit) {
      if (this.CanvasEndboss.getLive() > 0) {
        if (!AUDIO.SMASH_BOTTLE.ended) {
          AUDIO.SMASH_BOTTLE.pause();
          AUDIO.SMASH_BOTTLE.currentTime = 0;
        }
        AUDIO.SMASH_BOTTLE.play();
        this.bottles.throwB_Status = BOTTLE_STATUS.splash;
        this.bottles.throwB_ImgNr = 0;
        this.CanvasEndboss.hitEndboss();
      } else if (this.CanvasEndboss.getDefeatedAt() == 0) {
        this.CanvasEndboss.setDefeatedAt(new Date().getTime());
        this.finishLevel();
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
        chickens.forEach(chicken => {
          chicken.moveChicken();
        });
      }
    }, 200);
  }
  
  drawBackgroundPicture() {
    for (let i = -3; i < 15; i += 3) {
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
    chickens.forEach(chicken => {
      this.addBgObject(
        chicken.getImgSrc(),
        chicken.getLeftImgBorder(),
        chicken.getUpperImgBorder(),
        chicken.getScale(),
        chicken.getOpacity()
      );
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      this.gameStarted = true;
    }
    if (
      e.code === 'KeyD' &&
      this.CanvasMainCharacter.getCollBottles() > 0 &&
      new Date().getTime() - this.CanvasMainCharacter.getLastBottleThrowTime() >
        1000
    ) {
      this.CanvasMainCharacter.startBottleThrow();
      this.bottles.throwB_Status = BOTTLE_STATUS.throw;
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
}
