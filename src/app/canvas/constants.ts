//################################# Game Config ##################################
export const JUMP_TIME = 300; // in ms
export const GAME_SPEED = 7;

//################################# Game state ###################################
// Enum describes the States that the character can be in
export const enum CHARACTER_STATUS {
  IDLE = 'IDLE',
  LONG_IDLE_ = 'LONG_IDLE',
  WALK_LEFT = 'WALK_LEFT',
  WALK_RIGHT = 'WALK_RIGHT',
  JUMP = 'JUMP',
  HIT = 'HIT',
}

export const characterWalkLeft: string[] = [
  'assets/img/animation/walk/left/W-L-21.png',
  'assets/img/animation/walk/left/W-L-22.png',
  'assets/img/animation/walk/left/W-L-23.png',
  'assets/img/animation/walk/left/W-L-24.png',
  'assets/img/animation/walk/left/W-L-25.png',
  'assets/img/animation/walk/left/W-L-26.png',
];

export const characterWalkRight: string[] = [
  'assets/img/animation/walk/right/W-R-1.png',
  'assets/img/animation/walk/right/W-R-2.png',
  'assets/img/animation/walk/right/W-R-3.png',
  'assets/img/animation/walk/right/W-R-4.png',
  'assets/img/animation/walk/right/W-R-5.png',
  'assets/img/animation/walk/right/W-R-6.png',
];

export const characterIdle: string[] = [
  'assets/img/animation/idle/I-1.png',
  'assets/img/animation/idle/I-2.png',
  'assets/img/animation/idle/I-3.png',
  'assets/img/animation/idle/I-4.png',
  'assets/img/animation/idle/I-5.png',
  'assets/img/animation/idle/I-6.png',
  'assets/img/animation/idle/I-7.png',
  'assets/img/animation/idle/I-8.png',
  'assets/img/animation/idle/I-9.png',
  'assets/img/animation/idle/I-10.png',
];

export const charachterLongIdle: string[] = [
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
];

export const characterJump: string[] = [
    'assets/img/animation/jump/J-31.png',
    'assets/img/animation/jump/J-32.png',
    'assets/img/animation/jump/J-33.png',
    'assets/img/animation/jump/J-34.png',
    'assets/img/animation/jump/J-35.png',
    'assets/img/animation/jump/J-36.png',
    'assets/img/animation/jump/J-37.png',
    'assets/img/animation/jump/J-38.png',
    'assets/img/animation/jump/J-39.png',
    'assets/img/animation/jump/J-40.png',
];
