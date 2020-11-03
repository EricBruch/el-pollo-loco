//################################# Game Config ##################################
export const JUMP_TIME = 300; // in ms
export const JUMP_SPEED = 10;
export const JUMP_ANIMATION_SWITCH = JUMP_TIME / 8; // 37,5 // in ms
export const WALK_SPEED = 7;
export const IDLE_ANIMATION_SWITCH = 8000; // in ms
export const WALK_ANIMATION_SWITCH = 50; // in ms

export const X_COORDINATE_BASE_LEVEL = 100; // in px
export const Y_COORDINATE_BASE_LEVEL = 260; // in px

export const AUDIO_RUNNING = new Audio('assets/audio/running.mp3');
export const AUDIO_JUMP = new Audio('assets/audio/jump.mp3');
export const AUDIO_OPEN_BOTTLE = new Audio('assets/audio/open_bottle.mp3');

//################################# Character state ###################################
// Enum describes the States that the character can be in
export const enum CHARACTER_STATUS {
  IDLE = 'IDLE',
  LONG_IDLE_ = 'LONG_IDLE',
  WALK_LEFT = 'WALK_LEFT',
  WALK_RIGHT = 'WALK_RIGHT',
  JUMP = 'JUMP',
  HIT = 'HIT',
}

// ################################ Character Image Sources ################################
export const imgSrcs = {
  charWalk: [
    'assets/img/animation/walk/W-0.png',
    'assets/img/animation/walk/W-1.png',
    'assets/img/animation/walk/W-2.png',
    'assets/img/animation/walk/W-3.png',
    'assets/img/animation/walk/W-4.png',
    'assets/img/animation/walk/W-5.png',
  ],
  charIdle: [
    'assets/img/animation/idle/short_idle/I-1.png',
    'assets/img/animation/idle/short_idle/I-2.png',
    'assets/img/animation/idle/short_idle/I-3.png',
    'assets/img/animation/idle/short_idle/I-4.png',
    'assets/img/animation/idle/short_idle/I-5.png',
    'assets/img/animation/idle/short_idle/I-6.png',
    'assets/img/animation/idle/short_idle/I-7.png',
    'assets/img/animation/idle/short_idle/I-8.png',
    'assets/img/animation/idle/short_idle/I-9.png',
    'assets/img/animation/idle/short_idle/I-10.png',
  ],
  charLongIdle: [
    'assets/img/animation/idle/long_idle/I-11.png',
    'assets/img/animation/idle/long_idle/I-12.png',
    'assets/img/animation/idle/long_idle/I-13.png',
    'assets/img/animation/idle/long_idle/I-14.png',
    'assets/img/animation/idle/long_idle/I-15.png',
    'assets/img/animation/idle/long_idle/I-16.png',
    'assets/img/animation/idle/long_idle/I-17.png',
    'assets/img/animation/idle/long_idle/I-18.png',
    'assets/img/animation/idle/long_idle/I-19.png',
    'assets/img/animation/idle/long_idle/I-20.png',
  ],
  charJump: [
    'assets/img/animation/jump/J-0.png',
    'assets/img/animation/jump/J-1.png',
    'assets/img/animation/jump/J-2.png',
    'assets/img/animation/jump/J-3.png',
    'assets/img/animation/jump/J-4.png',
    'assets/img/animation/jump/J-5.png',
    'assets/img/animation/jump/J-6.png',
    'assets/img/animation/jump/J-7.png',
    'assets/img/animation/jump/J-8.png',
  ],
  bg_complete: 'assets/img/background/Completo.png',
  bg_1: 'assets/img/background/background_1.png',
  bg_2: 'assets/img/background/background_2.png',
  gallinita: [
    'assets/img/enemies/gallinita/walk/1.Ga_paso_derecho.png',
    'assets/img/enemies/gallinita/walk/2-Ga_centro.png',
    'assets/img/enemies/gallinita/walk/3.Ga_paso izquierdo.png',
  ],
  gallinitaDEAD: 'assets/img/enemies/gallinita/dead/4.G_muerte.png',
  pollito: [
    'assets/img/enemies/pollito/walk/1.Paso_derecho.png',
    'assets/img/enemies/pollito/walk/2.Centro.png',
    'assets/img/enemies/pollito/walk/3.Paso_izquierdo.png',
  ],
  pollitoDEAD: 'assets/img/enemies/pollito/dead/4.Muerte.png',
  bottles: [
    'assets/img/background/objects/bottle/botella.png',
    'assets/img/background/objects/bottle/botella_left.png',
    'assets/img/background/objects/bottle/botella_right.png',
  ],
};

/*                      */
export type MainCharacter = {
  charEnergy: number;
  x_coordinate: number;
  y_coordinate: number;
  isIdle: boolean;
  isJumping: boolean;
  isFalling: boolean;
  isRunningRight: boolean;
  isRunningLeft: boolean;
  lastJumpStarted: number;
  lastJumpAnimationStarted: number;
  lastIdleStarted: number;
  lastWalkStarted: number;
  charImage: HTMLImageElement;
  charImageSrc: string;
  idleImg: number;
  walkImg: number;
  walkRightImg: number;
  walkLeftImg: number;
  jumpImg: number;
  collBottles: number;
};

export type Chicken = {
  img: string;
  pos_x: number;
  pos_y: number;
  scale: number;
  opactiy: number;
  speed: number;
};
