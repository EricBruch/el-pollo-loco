//################################# Game Config ##################################
export const JUMP_TIME = 300; // in ms
export const JUMP_SPEED = 10;
export const JUMP_ANIMATION_SWITCH = JUMP_TIME / 8; // 37,5 // in ms
export const WALK_SPEED = 7;
export const IDLE_ANIMATION_SWITCH = 3000; // in ms
export const WALK_ANIMATION_SWITCH = 50; // in ms
export const GRAVITY = 9.81;
export const LEFT_BORDER = 100;
export const RIGHT_BORDER = -6500;

export const X_COORDINATE_BASE_LEVEL = 100; // in px
export const Y_COORDINATE_BASE_LEVEL = 260; // in px

export const BOSS_X_START = 5000;
export const BOSS_Y_START = 225;

export enum ENDBOSS_STATUS {
  walk = 'walk',
  alert = 'alert',
  attack = 'attack',
  hit = 'hit',
  death = 'death',
  adjust = 'adjust',
}

export enum GAME_STATUS {
  start = 'start',
  play = 'play',
  end = 'end',
}

export enum BOTTLE_STATUS {
  throw = 'throw',
  splash = 'splash',
  inactive = 'inactive',
}

export const CHICKEN_START_X_COORD = [
  1000,
  // 1400,
  // 1800,
  // 2500,
  // 3000,
  // 3300,
  // 3800,
  // 4200,
  // 4500,
];
export const COINS_START_X_COORD = [
  // 800,
  // 1200,
  // 1800,
  // 1900,
  // 2000,
  // 2100,
  // 2500,
  // 2600,
];

export const BOTTLE_START_X_COORD = [
  500,
  // 1000,
  // 1100,
  // 1200,
  // 1700,
  // 2000,
  // 2500,
  // 2800,
  // 3000,
  // 3300,
];

export const loseImgs = [];

//############################# Audio Sounds ############################
export const AUDIO = {
  RUNNING: new Audio('assets/audio/running.mp3'),
  JUMP: new Audio('assets/audio/jump.mp3'),
  OPEN_BOTTLE: new Audio('assets/audio/open_bottle.mp3'),
  THROW_BOTTLE: new Audio('assets/audio/throw_bottle.mp3'),
  SMASH_BOTTLE: new Audio('assets/audio/smash_bottle.mp3'),
  COLL_COIN: new Audio('assets/audio/collect_coin.mp3'),
  BG_MUSIC: new Audio('assets/audio/background_music.mp3'),
  CHICKEN: new Audio('assets/audio/chicken.mp3'),
  WIN: new Audio('assets/audio/win.mp3'),
};

// ################################ Character Image Sources ################################
export const IMG_SRCs: any = {
  charWalk: [
    'assets/img/character/walk/W-0.png',
    'assets/img/character/walk/W-1.png',
    'assets/img/character/walk/W-2.png',
    'assets/img/character/walk/W-3.png',
    'assets/img/character/walk/W-4.png',
    'assets/img/character/walk/W-5.png',
  ],
  charIdle: [
    'assets/img/character/idle/short_idle/I-1.png',
    'assets/img/character/idle/short_idle/I-2.png',
    'assets/img/character/idle/short_idle/I-3.png',
    'assets/img/character/idle/short_idle/I-4.png',
    'assets/img/character/idle/short_idle/I-5.png',
    'assets/img/character/idle/short_idle/I-6.png',
    'assets/img/character/idle/short_idle/I-7.png',
    'assets/img/character/idle/short_idle/I-8.png',
    'assets/img/character/idle/short_idle/I-9.png',
    'assets/img/character/idle/short_idle/I-10.png',
  ],
  charLongIdle: [
    'assets/img/character/idle/long_idle/I-11.png',
    'assets/img/character/idle/long_idle/I-12.png',
    'assets/img/character/idle/long_idle/I-13.png',
    'assets/img/character/idle/long_idle/I-14.png',
    'assets/img/character/idle/long_idle/I-15.png',
    'assets/img/character/idle/long_idle/I-16.png',
    'assets/img/character/idle/long_idle/I-17.png',
    'assets/img/character/idle/long_idle/I-18.png',
    'assets/img/character/idle/long_idle/I-19.png',
    'assets/img/character/idle/long_idle/I-20.png',
  ],
  charJump: [
    'assets/img/character/jump/J-0.png',
    'assets/img/character/jump/J-1.png',
    'assets/img/character/jump/J-2.png',
    'assets/img/character/jump/J-3.png',
    'assets/img/character/jump/J-4.png',
    'assets/img/character/jump/J-5.png',
    'assets/img/character/jump/J-6.png',
    'assets/img/character/jump/J-7.png',
    'assets/img/character/jump/J-8.png',
  ],
  charHit: [
    'assets/img/character/hit/H-0.png',
    'assets/img/character/hit/H-1.png',
    'assets/img/character/hit/H-2.png',
  ],
  charDead: [
    'assets/img/character/dead/D-0.png',
    'assets/img/character/dead/D-1.png',
    'assets/img/character/dead/D-2.png',
    'assets/img/character/dead/D-3.png',
    'assets/img/character/dead/D-4.png',
    'assets/img/character/dead/D-5.png',
    'assets/img/character/dead/D-6.png',
  ],
  bg_complete: 'assets/img/background/Completo.png',
  bg_1: 'assets/img/background/background_1.png',
  bg_2: 'assets/img/background/background_2.png',
  startScreen: [
    'assets/img/background/startscreen/start-0.png',
    'assets/img/background/startscreen/start-1.png',
  ],
  endScreen: [
    'assets/img/background/endscreen/0-you_lost.png',
    'assets/img/background/endscreen/1-oh_no_you_lost.png',
    'assets/img/background/endscreen/2-Game_over.png',
    'assets/img/background/endscreen/3-Game_over.png',
  ],
  gallinitaWalk: [
    'assets/img/enemies/gallinita/walk/0-Ga-walk-right.png',
    'assets/img/enemies/gallinita/walk/1-Ga-walk-center.png',
    'assets/img/enemies/gallinita/walk/2-Ga-walk-left.png',
  ],
  gallinitaDEAD: 'assets/img/enemies/gallinita/dead/3-Ga-dead.png',
  pollitoWALK: [
    'assets/img/enemies/pollito/walk/0-P-right.png',
    'assets/img/enemies/pollito/walk/1-P-center.png',
    'assets/img/enemies/pollito/walk/2-P-left.png',
  ],
  pollitoDEAD: 'assets/img/enemies/pollito/dead/3-P-dead.png',
  bottles: [
    'assets/img/background/objects/bottle/botella.png',
    'assets/img/background/objects/bottle/botella_left.png',
    'assets/img/background/objects/bottle/botella_right.png',
  ],
  bottlesSpinning: [
    'assets/img/background/objects/bottle/spinning/bottle-spinning-0.png',
    'assets/img/background/objects/bottle/spinning/bottle-spinning-1.png',
    'assets/img/background/objects/bottle/spinning/bottle-spinning-2.png',
    'assets/img/background/objects/bottle/spinning/bottle-spinning-3.png',
  ],
  bottlesSplash: [
    'assets/img/background/objects/bottle/splash/salsa-splash-0.png',
    'assets/img/background/objects/bottle/splash/salsa-splash-1.png',
    'assets/img/background/objects/bottle/splash/salsa-splash-2.png',
    'assets/img/background/objects/bottle/splash/salsa-splash-3.png',
    'assets/img/background/objects/bottle/splash/salsa-splash-4.png',
    'assets/img/background/objects/bottle/splash/salsa-splash-5.png',
  ],
  giantGallinitaWalk: [
    'assets/img/enemies/giganton_gallinita/walk/G-walk-0.png',
    'assets/img/enemies/giganton_gallinita/walk/G-walk-1.png',
    'assets/img/enemies/giganton_gallinita/walk/G-walk-2.png',
    'assets/img/enemies/giganton_gallinita/walk/G-walk-3.png',
  ],
  giantGallinitaAlert: [
    'assets/img/enemies/giganton_gallinita/alert/G-Alert-0.png',
    'assets/img/enemies/giganton_gallinita/alert/G-Alert-1.png',
    'assets/img/enemies/giganton_gallinita/alert/G-Alert-2.png',
    'assets/img/enemies/giganton_gallinita/alert/G-Alert-3.png',
    'assets/img/enemies/giganton_gallinita/alert/G-Alert-4.png',
    'assets/img/enemies/giganton_gallinita/alert/G-Alert-5.png',
    'assets/img/enemies/giganton_gallinita/alert/G-Alert-6.png',
    'assets/img/enemies/giganton_gallinita/alert/G-Alert-7.png',
  ],
  giantGallinitaAttack: [
    'assets/img/enemies/giganton_gallinita/attacke/G-Attack-0.png',
    'assets/img/enemies/giganton_gallinita/attacke/G-Attack-1.png',
    'assets/img/enemies/giganton_gallinita/attacke/G-Attack-2.png',
    'assets/img/enemies/giganton_gallinita/attacke/G-Attack-3.png',
    'assets/img/enemies/giganton_gallinita/attacke/G-Attack-4.png',
    'assets/img/enemies/giganton_gallinita/attacke/G-Attack-5.png',
    'assets/img/enemies/giganton_gallinita/attacke/G-Attack-6.png',
    'assets/img/enemies/giganton_gallinita/attacke/G-Attack-7.png',
  ],
  giantGallinitaHurt: [
    'assets/img/enemies/giganton_gallinita/hurt/G-hurt-0.png',
    'assets/img/enemies/giganton_gallinita/hurt/G-hurt-1.png',
    'assets/img/enemies/giganton_gallinita/hurt/G-hurt-2.png',
  ],
  giantGallinitaDeath: [
    'assets/img/enemies/giganton_gallinita/death/G-death-0.png',
    'assets/img/enemies/giganton_gallinita/death/G-death-1.png',
    'assets/img/enemies/giganton_gallinita/death/G-death-2.png',
  ],
  heart: 'assets/img/background/objects/heart/heart-0.png',
  coin: 'assets/img/background/objects/coin/0-mony.png',
  coins: [
    'assets/img/background/objects/coin/coins-1.png',
    'assets/img/background/objects/coin/coins-2.png',
  ],
};

// ##################### Cache for images  ##################################
export let imgCache = [];

/*         Main Character             */
export type MainCharacter = {
  lives: number;
  x_coordinate: number;
  y_coordinate: number;
  isIdle: boolean;
  isLongIdle: boolean;
  isJumping: boolean;
  isFalling: boolean;
  isRunningRight: boolean;
  isRunningLeft: boolean;
  isHit: boolean;
  lastJumpStarted: number;
  lastJumpAnimationStarted: number;
  lastIdleStarted: number;
  lastWalkStarted: number;
  lastHitHappened: number;
  lastHitAnimation: number;
  img: HTMLImageElement;
  imgSrc: string;
  idleImg: number;
  walkImg: number;
  jumpImg: number;
  hitImg: number;
  deadImg: number;
  collBottles: number;
  collCoins: number;
  lastBottleThrowTime: number;
};

export type Chicken = {
  img: string;
  pos_x: number;
  pos_y: number;
  scale: number;
  opactiy: number;
  speed: number;
};

export type Bottles = {
  placedB: Array<number>;
  throwB_X: number;
  throwB_Y: number;
  throwB_Status: string;
  throwB_ImgNr: number;
};

export type Coin = {
  pos_x: number;
  pos_y: number;
  scale: number;
  opacity: number;
};

export type EndBoss = {
  live: number;
  defeatedAt: number;
  lastHitTakenAt: number;
  lastWalkAnimationAt: number;
  lastHitAnimationAt: number;
  status: string;
  deathImgNr: number;
  walkImgNr: number;
  hurtImgNr: number;
  alertImgNr: number;
  attackImgNr: number;
  moveLeft: boolean;
  imgSrc: string;
  pos_x: number;
  pos_y: number;
};
