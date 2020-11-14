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
  BOSS_X_START,
  BOSS_Y_START,
  Y_COORDINATE_BASE_LEVEL,
  CHICKEN_START_X_COORD,
  IMG_SRCs,
  AUDIO,
  imgCache,
  COINS_START_X_COORD,
  BOTTLE_START_X_COORD,
  ENDBOSS_STATUS,
  GAME_STATUS,
  loseImgs,
  BOTTLE_STATUS,
  SCALING_FACTOR,
  X_COLLISION_ADJUSTMENT,
} from './constants';
import { Coin } from './types/coin.type';
import { Chicken } from './types/chicken.type';
import { EndBoss } from './types/endboss.type';
import { Bottles } from './types/bottles.type';
import { MainCharacter as mainChar } from './classes/mainCharacter/main-character';
import { ImageCacheService } from '../services/image-cache.service';
import { CollisionService } from '../services/Collision/collision.service';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  CanvasMainCharacter: mainChar;

  gameStarted = false;
  gameFinished = false;
  charLostAt = undefined;

  startImage = new Image();
  loseScreenImg = 0;

  bg_elements: number = 0;
  background_image = new Image();

  chickens = [];
  coins = [];
  coins_i = 1;

  bottles: Bottles = {
    placedB: BOTTLE_START_X_COORD,
    throwB_X: 0,
    throwB_Y: 0,
    throwB_Status: BOTTLE_STATUS.inactive,
    throwB_ImgNr: 0,
  };

  endboss: EndBoss = {
    live: 100,
    defeatedAt: 0,
    lastHitTakenAt: 0,
    lastWalkAnimationAt: 0,
    lastHitAnimationAt: 0,
    status: ENDBOSS_STATUS.walk,
    deathImgNr: 0,
    walkImgNr: 0,
    hurtImgNr: 0,
    alertImgNr: 0,
    attackImgNr: 0,
    moveLeft: true,
    imgSrc: IMG_SRCs.giantGallinitaWalk[0],
    pos_x: BOSS_X_START,
    pos_y: BOSS_Y_START,
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
*/
  @ViewChild('canvas')
  myCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  constructor(
    private ImageCacheService: ImageCacheService,
    private CollisionService: CollisionService
  ) {
    this.CanvasMainCharacter = new mainChar(this, ImageCacheService);
  }

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
    this.draw();
  }

  loadResources() {
    this.setupImgCache();
    this.loadAdditionalImgs();
    this.createCoins();
    this.createChickens();
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
      let st = this.getEndbossStatus();
      switch (st) {
        case ENDBOSS_STATUS.death:
          this.adjustEndbossDeath();
          break;

        case ENDBOSS_STATUS.hit:
          this.adjustEndbossHit();
          break;

        case ENDBOSS_STATUS.walk:
          this.adjustEndbossWalking();
          break;

        case ENDBOSS_STATUS.alert:
          this.adjustEndbossAlert();
          break;

        case ENDBOSS_STATUS.attack:
          this.adjustEndbossAttack();
          break;

        default:
          break;
      }
    }, 30);
  }

  getEndbossStatus() {
    if (this.endboss.defeatedAt) {
      return ENDBOSS_STATUS.death;
    }
    if (this.endboss.status === ENDBOSS_STATUS.hit) {
      return ENDBOSS_STATUS.hit;
    } else if (this.endboss.live >= 70) {
      return ENDBOSS_STATUS.walk;
    } else if (this.endboss.live >= 40) {
      return ENDBOSS_STATUS.alert;
    } else {
      return ENDBOSS_STATUS.attack;
    }
  }

  adjustEndbossDeath() {
    let timePassed = new Date().getTime() - this.endboss.defeatedAt;
    if (timePassed > 80 && this.endboss.deathImgNr < 2) {
      this.endboss.deathImgNr++;
    }
    this.endboss.imgSrc = IMG_SRCs.giantGallinitaDeath[this.endboss.deathImgNr];
    this.endboss.pos_x += timePassed * 0.1;
    this.endboss.pos_y -= timePassed * 0.1;
  }

  adjustEndbossWalking() {
    this.adjustEndbossMovement(2);
    let timePassed = new Date().getTime() - this.endboss.lastWalkAnimationAt;
    if (timePassed > 80) {
      this.endboss.imgSrc =
        IMG_SRCs.giantGallinitaWalk[
          this.endboss.walkImgNr++ % IMG_SRCs.giantGallinitaWalk.length
        ];
      this.endboss.lastWalkAnimationAt = new Date().getTime();
    }
  }

  adjustEndbossHit() {
    let timePassed = new Date().getTime() - this.endboss.lastHitTakenAt;
    if (timePassed > 55) {
      if (this.endboss.hurtImgNr < IMG_SRCs.giantGallinitaHurt.length) {
        this.endboss.imgSrc =
          IMG_SRCs.giantGallinitaHurt[this.endboss.hurtImgNr++];
        this.endboss.lastHitTakenAt = new Date().getTime();
      } else {
        this.endboss.status = ENDBOSS_STATUS.adjust;
        this.endboss.hurtImgNr = 0;
      }
    }
  }

  adjustEndbossAlert() {
    this.adjustEndbossMovement(7);
    let timePassed = new Date().getTime() - this.endboss.lastWalkAnimationAt;
    if (timePassed > 80) {
      this.endboss.imgSrc =
        IMG_SRCs.giantGallinitaAlert[
          this.endboss.alertImgNr++ % IMG_SRCs.giantGallinitaAlert.length
        ];
      this.endboss.lastWalkAnimationAt = new Date().getTime();
    }
  }

  adjustEndbossAttack() {
    this.adjustEndbossMovement(15);
    let timePassed: number =
      new Date().getTime() - this.endboss.lastWalkAnimationAt;
    if (timePassed > 80) {
      this.endboss.imgSrc =
        IMG_SRCs.giantGallinitaAttack[
          this.endboss.attackImgNr++ % IMG_SRCs.giantGallinitaAttack.length
        ];
      this.endboss.lastWalkAnimationAt = new Date().getTime();
    }
  }

  adjustEndbossMovement(move_x: number) {
    let x_left_border = BOSS_X_START - Math.round(Math.random() * 1000);
    let x_right_border = BOSS_X_START + Math.round(Math.random() * 1000);
    if (this.endboss.moveLeft) {
      if (this.endboss.pos_x > x_left_border) {
        this.endboss.pos_x -= move_x;
      } else {
        this.endboss.moveLeft = false;
      }
    } else {
      if (this.endboss.pos_x < x_right_border) {
        this.endboss.pos_x += move_x;
      } else {
        this.endboss.moveLeft = true;
      }
    }
  }

  createChickens() {
    CHICKEN_START_X_COORD.forEach((chicken_X) => {
      let x = Math.round(Math.random());
      if (x == 0) {
        this.chickens.push(
          this.createChicken(IMG_SRCs.gallinitaWalk[0], chicken_X)
        );
      } else {
        this.chickens.push(
          this.createChicken(IMG_SRCs.pollitoWALK[0], chicken_X)
        );
      }
    });
  }

  createCoins() {
    COINS_START_X_COORD.forEach((coin_x) => {
      let rnd_y = Math.round(Math.random() * 250);
      let c = this.createCoin(coin_x, rnd_y);
      this.coins.push(c);
    });
  }

  createCoin(x: number, y: number) {
    let c: Coin = {
      pos_x: x,
      pos_y: Y_COORDINATE_BASE_LEVEL + y,
      scale: SCALING_FACTOR.coin,
      opacity: 1,
    };
    return c;
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
      0.25,
      1
    );
  }

  splashAnimationBottle() {
    if (this.bottles.throwB_ImgNr < IMG_SRCs.bottlesSplash.length) {
      this.addNonMoveableObject(
        IMG_SRCs.bottlesSplash[this.bottles.throwB_ImgNr++],
        this.bottles.throwB_X,
        this.bottles.throwB_Y,
        0.25,
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
      this.endboss.imgSrc,
      this.endboss.pos_x,
      this.endboss.pos_y,
      0.4,
      1
    );

    if (!this.endboss.defeatedAt) {
      this.context.globalAlpha = 0.3;
      this.context.fillStyle = 'red';
      this.context.fillRect(
        this.endboss.pos_x + this.bg_elements,
        260,
        2 * this.endboss.live,
        15
      );

      this.context.fillStyle = 'black';
      this.context.fillRect(
        this.endboss.pos_x - 5 + this.bg_elements,
        255,
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
    this.bottles.placedB.forEach((b) => {
      let x = b.valueOf();
      this.addBgObject(
        IMG_SRCs.bottles[0],
        x,
        Y_COORDINATE_BASE_LEVEL + 312,
        0.25,
        1
      );
    });
  }

  drawCoins() {
    this.coins.forEach((c) => {
      let i = this.coins_i === 1 ? 0 : 1;
      let src = IMG_SRCs.coins[i];
      this.addBgObject(src, c.pos_x, c.pos_y, c.scale, c.opacity);
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
    this.chickens.forEach((c) => {
      let c_x = c.pos_x + this.bg_elements;
      let src_path = this.ImageCacheService.getImgSrcPathByKey(
        'gallinitaWalk',
        0
      );
      let chickenImg = this.ImageCacheService.getImgFromCache(src_path);
      let timePassed =
        new Date().getTime() - this.CanvasMainCharacter.getLastHitHappened();
      let hasCollision = this.CollisionService.areObjectsInCollision(
        c_x,
        c.pos_y,
        chickenImg.width * SCALING_FACTOR.chicken -
          X_COLLISION_ADJUSTMENT.mainCharWithChicken,
        chickenImg.height * SCALING_FACTOR.chicken,
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
    for (let i = 0; i < this.bottles.placedB.length; i++) {
      let b_x = this.bottles.placedB[i].valueOf() + this.bg_elements;
      let src_path = this.ImageCacheService.getImgSrcPathByKey('bottles', 0);
      let bottleImg = this.ImageCacheService.getImgFromCache(src_path);
      if (
        this.CollisionService.areObjectsInCollision(
          b_x,
          250,
          bottleImg.width - 0,
          bottleImg.height,
          this.CanvasMainCharacter.getLeftImgBorder(),
          this.CanvasMainCharacter.getUpperImgBorder(),
          this.CanvasMainCharacter.getImgWidth() -
            X_COLLISION_ADJUSTMENT.mainCharWithTabasco,
          this.CanvasMainCharacter.getImgHeight()
        )
      ) {
        this.CanvasMainCharacter.collBottle(i);
        AUDIO.OPEN_BOTTLE.play();
      }
    }
  }

  checkCollisionEndboss() {
    this.checkEndbossHit();
    this.checkEndbossTouchesCharacter();
  }

  checkCollisionCoins() {
    for (let i = 0; i < this.coins.length; i++) {
      const coin = this.coins[i];
      let c_x = coin.pos_x + this.bg_elements;
      let src_path = this.ImageCacheService.getImgSrcPathByKey('coins', 0);
      let imgCoin = this.ImageCacheService.getImgFromCache(src_path);
      let coinImgWidth = imgCoin.width * SCALING_FACTOR.coin - 0;
      let coinImgHeight = imgCoin.height * SCALING_FACTOR.coin - 0;
      let mainCharImgWidth =
        this.CanvasMainCharacter.getImgWidth() -
        X_COLLISION_ADJUSTMENT.mainCharWithCoin;
      if (
        this.CollisionService.areObjectsInCollision(
          c_x,
          coin.pos_y,
          coinImgWidth,
          coinImgHeight,
          this.CanvasMainCharacter.getLeftImgBorder(),
          this.CanvasMainCharacter.getUpperImgBorder(),
          mainCharImgWidth,
          this.CanvasMainCharacter.getImgHeight() - 0
        )
      ) {
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
    let timePassed = new Date().getTime() - this.endboss.lastHitTakenAt;
    if (
      this.bottles.throwB_X > this.endboss.pos_x + this.bg_elements - 100 &&
      this.bottles.throwB_X < this.endboss.pos_x + this.bg_elements + 100 &&
      timePassed > 1000
    ) {
      if (this.endboss.live > 0) {
        AUDIO.SMASH_BOTTLE.play();
        this.bottles.throwB_Status = BOTTLE_STATUS.splash;
        this.bottles.throwB_ImgNr = 0;
        this.endboss.live -= 10;
        this.endboss.lastHitTakenAt = new Date().getTime();
        this.endboss.status = ENDBOSS_STATUS.hit;
      } else if (this.endboss.defeatedAt == 0) {
        this.endboss.defeatedAt = new Date().getTime();
        this.finishLevel();
      }
    }
  }

  checkEndbossTouchesCharacter() {
    let timePassed =
      new Date().getTime() - this.CanvasMainCharacter.getLastHitHappened();
    if (
      this.CanvasMainCharacter.getLeftImgBorder() >
        this.endboss.pos_x + this.bg_elements - 100 &&
      this.CanvasMainCharacter.getLeftImgBorder() <
        this.endboss.pos_x + this.bg_elements + 100 &&
      timePassed > 1000
    ) {
      if (this.CanvasMainCharacter.getLives() > 1) {
        this.CanvasMainCharacter.performCharHit();
      } else {
        this.charLostAt = new Date().getTime();
        this.gameFinished = true;
      }
    }
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

  calculateChickenPosition() {
    setInterval(() => {
      if (this.gameStarted) {
        for (let i = 0; i < this.chickens.length; i++) {
          let chicken = this.chickens[i];
          chicken.pos_x -= this.chickens[i].speed;
        }
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
    let c: Chicken = {
      img: src,
      pos_x: pos_x,
      pos_y: 595,
      scale: SCALING_FACTOR.chicken,
      opactiy: 1,
      speed: Math.random() * 15,
    };
    return c;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    //AUDIO.BG_MUSIC.play();
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
