import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  WALK_SPEED,
  JUMP_TIME,
  JUMP_SPEED,
  IDLE_ANIMATION_SWITCH,
  WALK_ANIMATION_SWITCH,
  GRAVITY,
  BOSS_X_START,
  BOSS_Y_START,
  X_COORDINATE_BASE_LEVEL,
  Y_COORDINATE_BASE_LEVEL,
  CHICKEN_START_X_COORD,
  IMG_SRCs,
  MainCharacter,
  Chicken,
  JUMP_ANIMATION_SWITCH,
  AUDIO,
  Bottles,
  imgCache,
  LEFT_BORDER,
  RIGHT_BORDER,
  COINS_START_X_COORD,
  BOTTLE_START_X_COORD,
  Coin,
  EndBoss,
  ENDBOSS_STATUS,
  GAME_STATUS,
  loseImgs,
  BOTTLE_STATUS,
} from './constants';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  mainChar: MainCharacter = {
    lives: 2,
    x_coordinate: X_COORDINATE_BASE_LEVEL,
    y_coordinate: Y_COORDINATE_BASE_LEVEL,
    isIdle: true,
    isLongIdle: true,
    isJumping: false,
    isFalling: false,
    isRunningRight: false,
    isRunningLeft: false,
    isHit: false,
    lastJumpStarted: 0,
    lastJumpAnimationStarted: 0,
    lastIdleStarted: 0,
    lastWalkStarted: 0,
    lastHitHappened: 0,
    lastHitAnimation: 0,
    img: new Image(),
    imgSrc: IMG_SRCs.charIdle[0],
    idleImg: 0,
    walkImg: 0,
    jumpImg: 0,
    hitImg: 0,
    deadImg: 0,
    collBottles: 50,
    collCoins: 0,
    lastBottleThrowTime: 0,
  };

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
  * -------------------------------------------------
  * Gedanken zu weiteren Themen:
  *   # Vollbildmodus
*/
  @ViewChild('canvas')
  myCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  constructor() {}

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
        this.checkRunningLeft();
        this.checkRunningRight();
      }
    }, 20);
  }

  checkForJump() {
    setInterval(() => {
      if (this.charPerformsJump()) {
        this.updateJumpCharacter();
      }
    }, 10);
  }

  checkForIdle() {
    setInterval(() => {
      if (this.mainChar.isIdle && !this.mainChar.isHit && !this.charLostAt) {
        this.updateIdleState();
      }
      if (
        this.mainChar.isLongIdle &&
        !this.mainChar.isHit &&
        !this.charLostAt
      ) {
        this.updateLongIdleState();
      }
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
      let timePassed = new Date().getTime() - this.mainChar.lastHitAnimation;
      if (this.mainChar.isHit && timePassed > 70) {
        let n = this.mainChar.hitImg++;
        if (n < IMG_SRCs.charHit.length) {
          this.mainChar.imgSrc = IMG_SRCs.charHit[n];
          this.mainChar.lastHitAnimation = new Date().getTime();
        } else {
          this.mainChar.hitImg = 0;
          this.mainChar.isHit = false;
        }
      }
    }, 30);
  }

  checkCharacterDead() {
    setInterval(() => {
      let timePassed = new Date().getTime() - this.charLostAt;
      if (this.charLostAt && timePassed > 100) {
        let n = this.mainChar.deadImg++;
        if (n < IMG_SRCs.charDead.length) {
          this.mainChar.imgSrc = IMG_SRCs.charDead[n];
          this.charLostAt = new Date().getTime();
        }
      }
    }, 30);
  }

  checkRunningLeft() {
    if (
      this.mainChar.isRunningRight == true &&
      this.bg_elements > RIGHT_BORDER
    ) {
      this.adjustAudioForJump();
      this.bg_elements -= WALK_SPEED;
      this.adjustWalkAnimation();
    }
  }

  checkRunningRight() {
    if (this.mainChar.isRunningLeft == true && this.bg_elements < LEFT_BORDER) {
      this.adjustAudioForJump();
      this.bg_elements += WALK_SPEED;
      this.adjustWalkAnimation();
    }
  }

  checkThrowingBorder() {
    setInterval(() => {
      if (
        this.isThrowBottleActive() &&
        (this.bottles.throwB_Y > Y_COORDINATE_BASE_LEVEL + 350 ||
          this.bottles.throwB_X >
            this.mainChar.x_coordinate - this.bg_elements + 800)
      ) {
        AUDIO.SMASH_BOTTLE.play();
        this.bottles.throwB_Status = BOTTLE_STATUS.inactive;
        this.bottles.throwB_ImgNr = 0;
      }
    }, 80);
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
    let timePassed = new Date().getTime() - this.endboss.lastWalkAnimationAt;
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

  adjustAudioForJump() {
    if (this.isInJumpProcess() && !AUDIO.RUNNING.paused) {
      AUDIO.RUNNING.pause();
    }
    if (!this.isInJumpProcess() && AUDIO.RUNNING.paused) {
      AUDIO.RUNNING.play();
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
      let rnd_y = 0; //Math.round(Math.random() * 250);
      let c = this.createCoin(coin_x, rnd_y);
      this.coins.push(c);
    });
  }

  createCoin(x: number, y: number) {
    let c: Coin = {
      pos_x: x,
      pos_y: Y_COORDINATE_BASE_LEVEL + y,
      scale: 0.75,
      opacity: 1,
    };
    return c;
  }

  /**
   * This Method takes all Images Sources from IMG_SRCs
   * and loads all sources to images that are saved
   * for fast acces in imgCache.
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

  getImgFromCache(src_path: string) {
    this.mainChar.img = imgCache.find((img) => {
      img.src.endsWith(src_path);
    });
    // create new Image if not found in cache
    if (!this.mainChar.img) {
      this.mainChar.img = new Image();
      this.mainChar.img.src = src_path;
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
    this.getImgFromCache(this.mainChar.imgSrc);

    let xAdjustment = 0;
    let imgWidthAdjustment = 1;
    if (this.mainChar.isRunningLeft) {
      this.mirrorImg();
      xAdjustment = this.mainChar.img.width * 0.35;
      imgWidthAdjustment = -1;
    }
    // draw character
    if (this.mainChar.img.complete) {
      this.context.drawImage(
        this.mainChar.img,
        this.mainChar.x_coordinate - xAdjustment,
        this.mainChar.y_coordinate,
        this.mainChar.img.width * 0.35 * imgWidthAdjustment,
        this.mainChar.img.height * 0.35
      );
    }
    if (this.mainChar.isRunningLeft) {
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
    this.context.fillText('x' + this.mainChar.collBottles, x_txt, 55);

    this.addNonMoveableObject(IMG_SRCs.heart, x_icon + 110, 0, 0.5, 1);
    this.context.fillText('x' + this.mainChar.lives, x_txt + 120, 55);

    this.addNonMoveableObject(IMG_SRCs.coin, x_icon + 220, 0, 0.5, 1);
    this.context.fillText('x' + this.mainChar.collCoins, x_txt + 230, 55);
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
    let timePassed = new Date().getTime() - this.mainChar.lastBottleThrowTime;
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
      let timePassed = new Date().getTime() - this.mainChar.lastHitHappened;
      if (this.isInCollisionWith(c_x, 220) && timePassed > 2000) {
        if (this.mainChar.lives > 0) {
          this.mainChar.lives--;
          this.mainChar.lastHitHappened = new Date().getTime();
          this.mainChar.isHit = true;
        }
        if (this.mainChar.lives <= 0) {
          this.charLostAt = new Date().getTime();
          this.gameFinished = true;
        }
      }
    });
  }

  checkCollisionTabasco() {
    for (let i = 0; i < this.bottles.placedB.length; i++) {
      let b_x = this.bottles.placedB[i].valueOf() + this.bg_elements;
      if (this.isInCollisionWith(b_x, 220)) {
        this.bottles.placedB.splice(i, 1);
        AUDIO.OPEN_BOTTLE.play();
        this.mainChar.collBottles++;
      }
    }
  }

  checkCollisionEndboss() {
    this.checkEndbossHit();
    this.checkEndbossCharacterHit();
  }

  checkCollisionCoins() {
    for (let i = 0; i < this.coins.length; i++) {
      const coin = this.coins[i];
      let c_x = coin.pos_x + this.bg_elements;
      if (this.isInCollisionWith(c_x, coin.pos_y - 200)) {
        this.mainChar.collCoins++;
        this.coins.splice(i, 1);
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

  isInCollisionWith(x: number, y: number) {
    return (
      x - 130 < this.mainChar.x_coordinate &&
      x + 30 > this.mainChar.x_coordinate &&
      this.mainChar.y_coordinate > y
    );
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

  checkEndbossCharacterHit() {
    let timePassed = new Date().getTime() - this.mainChar.lastHitHappened;
    if (
      this.mainChar.x_coordinate >
        this.endboss.pos_x + this.bg_elements - 100 &&
      this.mainChar.x_coordinate <
        this.endboss.pos_x + this.bg_elements + 100 &&
      timePassed > 1000
    ) {
      if (this.mainChar.lives > 1) {
        this.mainChar.lives--;
        this.mainChar.lastHitHappened = new Date().getTime();
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
      scale: 0.3,
      opactiy: 1,
      speed: Math.random() * 15,
    };
    return c;
  }

  /**
   * This method checks if the character is Idle longer then the IDLE_ANIMATION_SWITCH difference
   * if so the next img of Idle is shown
   */
  updateIdleState() {
    let diff = new Date().getTime() - this.mainChar.lastIdleStarted;
    if (diff > IDLE_ANIMATION_SWITCH) {
      let n = IMG_SRCs.charIdle.length;
      if (this.mainChar.idleImg < n) {
        let src =
          IMG_SRCs.charIdle[this.mainChar.idleImg++ % IMG_SRCs.charIdle.length];
        this.mainChar.imgSrc = src;
        this.mainChar.lastIdleStarted = new Date().getTime();
      } else {
        this.mainChar.isIdle = false;
        this.mainChar.isLongIdle = true;
        this.mainChar.idleImg = 0;
      }
    }
  }

  updateLongIdleState() {
    let diff = new Date().getTime() - this.mainChar.lastIdleStarted;
    if (diff > IDLE_ANIMATION_SWITCH) {
      let src =
        IMG_SRCs.charLongIdle[
          this.mainChar.idleImg++ % IMG_SRCs.charLongIdle.length
        ];
      this.mainChar.imgSrc = src;
      this.mainChar.lastIdleStarted = new Date().getTime();
    }
  }

  incrImgCount(imgCounter: number, countImages: number) {
    return imgCounter % countImages;
  }

  charJump(diffJump: number, diffJumpAnim: number) {
    this.mainChar.y_coordinate -= JUMP_SPEED;
    this.adjustJumpAnimation(diffJumpAnim);
    this.checkForJumpingPeak(diffJump);
  }

  adjustJumpAnimation(diffJumpAnim: number) {
    if (
      diffJumpAnim > JUMP_ANIMATION_SWITCH &&
      this.mainChar.jumpImg < 7 &&
      !this.mainChar.isHit &&
      !this.charLostAt
    ) {
      this.mainChar.imgSrc = IMG_SRCs.charJump[++this.mainChar.jumpImg];
      this.mainChar.lastJumpAnimationStarted = new Date().getTime();
    }
  }

  checkForJumpingPeak(diffJump: number) {
    if (diffJump > JUMP_TIME) {
      this.mainChar.isJumping = false;
      this.mainChar.isFalling = true;
    }
  }

  charFall() {
    this.mainChar.y_coordinate += JUMP_SPEED;
    this.adjustLandingAnimation();
    this.adjustIfJumpEnd();
  }

  adjustLandingAnimation() {
    let border = Y_COORDINATE_BASE_LEVEL - 0.05 * Y_COORDINATE_BASE_LEVEL;
    if (this.isLanding(border) && !this.mainChar.isHit && !this.charLostAt) {
      let src =
        IMG_SRCs.charJump[++this.mainChar.jumpImg % IMG_SRCs.charJump.length];
      this.mainChar.imgSrc = src;
    }
  }

  isInJumpProcess() {
    return this.mainChar.isJumping == true || this.mainChar.isFalling == true;
  }

  isRunning() {
    return (
      this.mainChar.isRunningLeft == true ||
      this.mainChar.isRunningRight == true
    );
  }

  isLanding(border: number) {
    return (
      this.mainChar.y_coordinate < border &&
      this.mainChar.jumpImg > 6 &&
      this.mainChar.jumpImg < 9
    );
  }

  adjustIfJumpEnd() {
    if (this.mainChar.y_coordinate >= Y_COORDINATE_BASE_LEVEL) {
      this.mainChar.isFalling = false;
      this.mainChar.jumpImg = 0;
      this.resetIdle();
      if (!this.isRunning()) {
        this.mainChar.isIdle = true;
      }
    }
  }

  charPerformsJump() {
    return this.mainChar.isJumping == true || this.mainChar.isFalling == true;
  }
  changeWalkAnimationDue(diff) {
    return diff > WALK_ANIMATION_SWITCH;
  }

  changeWalkAnimation() {
    let src =
      IMG_SRCs.charWalk[this.mainChar.walkImg++ % IMG_SRCs.charWalk.length];
    this.mainChar.imgSrc = src;
    this.mainChar.lastWalkStarted = new Date().getTime();
  }

  resetIdle() {
    this.mainChar.idleImg = 0;
    this.mainChar.lastIdleStarted = new Date().getTime();
  }

  adjustWalkAnimation() {
    if (!this.mainChar.isJumping && !this.mainChar.isHit) {
      let diff = new Date().getTime() - this.mainChar.lastWalkStarted;
      if (this.changeWalkAnimationDue(diff)) {
        this.changeWalkAnimation();
      }
    }
  }

  updateJumpCharacter() {
    let diffJump = new Date().getTime() - this.mainChar.lastJumpStarted;
    let diffJumpAnim =
      new Date().getTime() - this.mainChar.lastJumpAnimationStarted;
    if (this.mainChar.isJumping == true) {
      this.charJump(diffJump, diffJumpAnim);
    } else {
      this.charFall();
    }
  }

  endRunningState() {
    this.resetIdle();
    this.mainChar.isIdle = true;
    this.mainChar.imgSrc = IMG_SRCs.charIdle[0];
    AUDIO.RUNNING.pause();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    AUDIO.BG_MUSIC.play();
    if (e.code === 'Enter') {
      this.gameStarted = true;
    }
    if (
      e.code === 'KeyD' &&
      this.mainChar.collBottles > 0 &&
      new Date().getTime() - this.mainChar.lastBottleThrowTime > 1000
    ) {
      this.mainChar.collBottles--;
      this.mainChar.lastBottleThrowTime = new Date().getTime();
      AUDIO.THROW_BOTTLE.play();
      this.bottles.throwB_Status = BOTTLE_STATUS.throw;
    }

    if (e.code === 'ArrowLeft') {
      this.mainChar.isRunningLeft = true;
      this.mainChar.isIdle = false;
      AUDIO.RUNNING.play();
    }
    if (e.code == 'ArrowRight') {
      this.mainChar.isRunningRight = true;
      this.mainChar.isIdle = false;
      AUDIO.RUNNING.play();
    }
    let timePassedSinceJump =
      new Date().getTime() - this.mainChar.lastJumpStarted;
    if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2) {
      this.mainChar.lastJumpStarted = new Date().getTime();
      this.mainChar.isJumping = true;
      this.mainChar.isIdle = false;
      AUDIO.JUMP.play();
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      this.mainChar.isRunningLeft = false;
      this.endRunningState();
    }
    if (e.key == 'ArrowRight') {
      this.mainChar.isRunningRight = false;
      this.endRunningState();
    }
    // if (e.code == 'Space') {
    //   this.isJumping = false;
    // }
  }
}
