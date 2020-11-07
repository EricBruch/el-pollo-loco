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
} from './constants';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  mainChar: MainCharacter = {
    charLives: 5,
    x_coordinate: X_COORDINATE_BASE_LEVEL,
    y_coordinate: Y_COORDINATE_BASE_LEVEL,
    isIdle: true,
    isJumping: false,
    isFalling: false,
    isRunningRight: false,
    isRunningLeft: false,
    lastJumpStarted: 0,
    lastJumpAnimationStarted: 0,
    lastIdleStarted: 0,
    lastWalkStarted: 0,
    lastHitHappened: 0,
    charImage: new Image(),
    charImageSrc: IMG_SRCs.charIdle[0],
    idleImg: 0,
    walkImg: 0,
    walkRightImg: 0,
    walkLeftImg: 0,
    jumpImg: 0,
    collBottles: 50,
    collCoins: 0,
    lastBottleThrowTime: 0,
  };

  gameFinished = false;
  charLostAt = undefined;

  bg_elements: number = 0;
  background_image = new Image();

  chickens = [];
  coins = [];
  coins_i = 1;

  bottles: Bottles = {
    placedB: BOTTLE_START_X_COORD,
    throwB_X: 0,
    throwB_Y: 0,
    throwB_Status: 'inactive',
    throwB_ImgNr: 0,
  };

  endboss: EndBoss = {
    live: 100,
    defeatedAt: 0,
    lastHitTakenAt: 0,
    lastWalkAnimationAt: new Date().getTime(),
    deathImgNr: 0,
    walkImgNr: 0,
    imgSrc: IMG_SRCs.giantGallinitaWalk[0],
    pos_x: BOSS_X_START,
    pos_y: BOSS_Y_START,
  };
  /*
  TODOs
  * + Start Screen
  * + endboss objekt erstellen mit eigenem Type in constants ordner
  * + Endboss:
  *   + Animation alert hinzufügen
  *      # mit leichter Bewegung
  *   + Animation attacke hinzufügen
  *      # mit großer Bewegung
  *   + Animation hurt hinzufügen wenn getroffen
  *      # Idee für identifikation: 
  *         Mit LastAnimationDate; undefined setzen für Abbruch
  *   + Check das Jeder Flaschenwurd nur 1x mal Schaden ausführt.
  *   + Check das Endgegner besiegt wird wenn Leben auf 0 oder weniger geht.
  * + Sound für aufeinanderfolgenden Flaschenwurf abspielen
  * + Tabasco Flasche:
  *   # splash animation der Flasche
  *   # dreh Animation der Flasche beim werfen
  * + Main Character:
  *   # Long_Idle hinzufügen für wartenden Character
  *   # Animation hurt hinzufügen
  *   # Animation dead hinzufügen
  * Frage an Junus:
  *   Marcadorvida_enemy
  *       --> Was ist der Kontext dafür? Ist das die lebensanzeige 
  *           für normale Gegner
  *   Coins sind einfach so zum einsammeln oder?
  *   Gibt es eine Win-Screen Grafik?
  * -------------------------------------------------
  * Gedanken zu weiteren Themen:
  *   # Vollbildmodus
  *   # 
  *
*/
  @ViewChild('canvas')
  myCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.loadResources();
    // todo optional set const arrays frozen
    this.checkForRunning();
    this.checkForJump();
    this.checkForIdle();
    this.checkCollisionDetection();
    this.calculateChickenPosition();
    this.checkForEndboss();
    this.draw();
  }

  loadResources() {
    this.setupImgCache();
    this.createCoins();
    this.background_image.src = IMG_SRCs.bg_complete;
    this.createChickens();
    this.initalizeSound();
  }

  checkForRunning() {
    setInterval(() => {
      if (
        this.mainChar.isRunningRight == true &&
        this.bg_elements > RIGHT_BORDER
      ) {
        this.adjustAudioForJump();
        this.bg_elements -= WALK_SPEED;
        this.adjustWalkAnimation();
      }
      if (
        this.mainChar.isRunningLeft == true &&
        this.bg_elements < LEFT_BORDER
      ) {
        this.adjustAudioForJump();
        this.bg_elements += WALK_SPEED;
        this.adjustWalkAnimation();
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
      if (this.mainChar.isIdle) {
        this.updateIdleState();
      }
    }, 30);
  }

  checkForEndboss() {
    setInterval(() => {
      let ebStatus = this.getEndbossStatus();
      switch (ebStatus) {
        case 'defeated':
          this.adjustEndbossDeath();
          break;

        case 'walking':
          this.adjustEndbossWalking();
          break;

        default:
          break;
      }
    }, 30);
  }

  getEndbossStatus() {
    if (this.endboss.defeatedAt) {
      return 'defeated';
    } /*if (!this.endboss.defeatedAt)*/ else {
      return 'walking';
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
    let timePassed = new Date().getTime() - this.endboss.lastWalkAnimationAt;
    if (timePassed > 80) {
      this.endboss.imgSrc =
        IMG_SRCs.giantGallinitaWalk[
          this.endboss.walkImgNr++ % IMG_SRCs.giantGallinitaWalk.length
        ];
      this.endboss.lastWalkAnimationAt = new Date().getTime();
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
      let rnd_y = Math.round(Math.random() * 250);
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
    this.mainChar.charImage = imgCache.find((img) => {
      img.src.endsWith(src_path);
    });
    // create new Image if not found in cache
    if (!this.mainChar.charImage) {
      this.mainChar.charImage = new Image();
      this.mainChar.charImage.src = src_path;
    }
  }

  draw() {
    let drawFunction = () => this.draw();
    requestAnimationFrame(drawFunction);
    this.drawBackgroundPicture();
    if (this.gameFinished) {
      this.drawEndScreen();
    } else {
      this.updateCharacter();
      this.drawChicken();
      this.drawBottles();
      this.drawCoins();
      this.drawItemOverview();
      this.drawThrowBottle();
    }
    this.drawEndBoss();
  }

  updateCharacter() {
    this.getImgFromCache(this.mainChar.charImageSrc);
    //console.log(this.mainChar.charImage);

    let xAdjustment = 0;
    let imgWidthAdjustment = 1;
    if (this.mainChar.isRunningLeft) {
      this.mirrorImg();
      xAdjustment = this.mainChar.charImage.width * 0.35;
      imgWidthAdjustment = -1;
    }
    // draw character
    if (this.mainChar.charImage.complete) {
      this.context.drawImage(
        this.mainChar.charImage,
        this.mainChar.x_coordinate - xAdjustment,
        this.mainChar.y_coordinate,
        this.mainChar.charImage.width * 0.35 * imgWidthAdjustment,
        this.mainChar.charImage.height * 0.35
      );
    }
    if (this.mainChar.isRunningLeft) {
      this.context.restore();
    }
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
    this.context.fillText('x' + this.mainChar.charLives, x_txt + 120, 55);

    this.addNonMoveableObject(IMG_SRCs.coin, x_icon + 220, 0, 0.5, 1);
    this.context.fillText('x' + this.mainChar.collCoins, x_txt + 230, 55);
  }

  drawThrowBottle() {
    switch (this.bottles.throwB_Status) {
      case 'throw':
        this.moveThrowBottle();
        break;

      case 'splash':
        this.splashThrowBottle();
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

  splashThrowBottle() {
    if (this.bottles.throwB_ImgNr < IMG_SRCs.bottlesSplash.length) {
      this.addNonMoveableObject(
        IMG_SRCs.bottlesSplash[this.bottles.throwB_ImgNr++],
        this.bottles.throwB_X,
        this.bottles.throwB_Y,
        0.25,
        1
      );
    } else {
      this.bottles.throwB_Status = 'inactive';
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
        BOSS_X_START.valueOf() + this.bg_elements,
        260,
        2 * this.endboss.live,
        15
      );

      this.context.fillStyle = 'black';
      this.context.fillRect(
        BOSS_X_START.valueOf() - 5 + this.bg_elements,
        255,
        210,
        25
      );
      this.context.globalAlpha = 1;
    }
  }

  drawEndScreen() {
    let msg = this.charLostAt > 0 ? 'You lost' : 'You won!';
    this.context.font = '120px Kalam';
    this.context.fillText(msg, 250, 200);
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
    }, 100);
  }

  checkCollisionChicken() {
    this.chickens.forEach((c) => {
      let c_x = c.pos_x + this.bg_elements;
      if (this.isInCollisionWith(c_x, 220)) {
        let timePassed = new Date().getTime() - this.mainChar.lastHitHappened;
        if (this.mainChar.charLives > 0 && timePassed > 1000) {
          this.mainChar.charLives--;
          this.mainChar.lastHitHappened = new Date().getTime();
        }
        if (this.mainChar.charLives <= 0) {
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
    let timePassed = new Date().getTime() - this.endboss.lastHitTakenAt;
    if (
      this.bottles.throwB_X > BOSS_X_START.valueOf() + this.bg_elements - 100 &&
      this.bottles.throwB_X < BOSS_X_START.valueOf() + this.bg_elements + 100 &&
      timePassed > 1000
    ) {
      if (this.endboss.live > 0) {
        AUDIO.SMASH_BOTTLE.play();
        this.bottles.throwB_Status = 'splash';
        this.bottles.throwB_ImgNr = 0;
        this.endboss.live -= 10;
        this.endboss.lastHitTakenAt = new Date().getTime();
      } else if (this.endboss.defeatedAt == 0) {
        this.endboss.defeatedAt = new Date().getTime();
        this.finishLevel();
      }
    }
  }

  checkCollisionCoins() {
    for (let i = 0; i < this.coins.length; i++) {
      const coin = this.coins[i];
      let c_x = coin.pos_x + this.bg_elements;
      if (this.isInCollisionWith(c_x, 220)) {
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
      x - 60 < this.mainChar.x_coordinate &&
      x + 60 > this.mainChar.x_coordinate &&
      this.mainChar.y_coordinate > y
    );
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
      for (let i = 0; i < this.chickens.length; i++) {
        let chicken = this.chickens[i];
        chicken.pos_x -= this.chickens[i].speed;
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
      let src =
        IMG_SRCs.charIdle[
          this.incrImgCount(++this.mainChar.idleImg, IMG_SRCs.charIdle.length)
        ];
      this.mainChar.charImageSrc = src;
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
    if (diffJumpAnim > JUMP_ANIMATION_SWITCH && this.mainChar.jumpImg < 7) {
      this.mainChar.charImageSrc = IMG_SRCs.charJump[++this.mainChar.jumpImg];
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
    if (this.isLanding(border)) {
      let src =
        IMG_SRCs.charJump[++this.mainChar.jumpImg % IMG_SRCs.charJump.length];
      this.mainChar.charImageSrc = src;
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
    this.mainChar.charImageSrc = src;
    this.mainChar.lastWalkStarted = new Date().getTime();
  }

  resetIdle() {
    this.mainChar.idleImg = 0;
    this.mainChar.lastIdleStarted = new Date().getTime();
  }

  resetWalk() {
    this.mainChar.walkRightImg = 0;
    this.mainChar.walkLeftImg = 0;
  }

  adjustWalkAnimation() {
    if (!this.mainChar.isJumping) {
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
    this.mainChar.charImageSrc = IMG_SRCs.charIdle[0];
    AUDIO.RUNNING.pause();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    //console.log("key: " + e.key + " code: " + e.code);
    if (
      e.code === 'KeyD' &&
      this.mainChar.collBottles > 0 &&
      new Date().getTime() - this.mainChar.lastBottleThrowTime > 1000
    ) {
      this.mainChar.collBottles--;
      this.mainChar.lastBottleThrowTime = new Date().getTime();
      AUDIO.THROW_BOTTLE.play();
      this.bottles.throwB_Status = 'throw';
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
