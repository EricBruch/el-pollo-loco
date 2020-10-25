//################################# Game Config ##################################
export const JUMP_TIME = 300;                           // in ms
export const JUMP_SPEED = 10;
export const JUMP_ANIMATION_SWITCH = JUMP_TIME / 8;     // 37,5 // in ms
export const LANDING_ANIM_SWI = 35;                     // in ms
export const WALK_SPEED = 7;
export const IDLE_ANIMATION_SWITCH = 8000;              // in ms
export const WALK_ANIMATION_SWITCH = 50;                // in ms

export const X_COORDINATE_BASE_LEVEL = 100;             // in px
export const Y_COORDINATE_BASE_LEVEL = 260;             // in px

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
export const charImgSrcs = {
    characterWalkLeft:
    [
        'assets/img/animation/walk/left/W-L-21.png',
        'assets/img/animation/walk/left/W-L-22.png',
        'assets/img/animation/walk/left/W-L-23.png',
        'assets/img/animation/walk/left/W-L-24.png',
        'assets/img/animation/walk/left/W-L-25.png',
        'assets/img/animation/walk/left/W-L-26.png'
    ],
    characterWalkRight:
    [
        'assets/img/animation/walk/right/W-R-1.png',
        'assets/img/animation/walk/right/W-R-2.png',
        'assets/img/animation/walk/right/W-R-3.png',
        'assets/img/animation/walk/right/W-R-4.png',
        'assets/img/animation/walk/right/W-R-5.png',
        'assets/img/animation/walk/right/W-R-6.png'
    ],
    characterIdle:
    [
        'assets/img/animation/idle/short_idle/I-1.png',
        'assets/img/animation/idle/short_idle/I-2.png',
        'assets/img/animation/idle/short_idle/I-3.png',
        'assets/img/animation/idle/short_idle/I-4.png',
        'assets/img/animation/idle/short_idle/I-5.png',
        'assets/img/animation/idle/short_idle/I-6.png',
        'assets/img/animation/idle/short_idle/I-7.png',
        'assets/img/animation/idle/short_idle/I-8.png',
        'assets/img/animation/idle/short_idle/I-9.png',
        'assets/img/animation/idle/short_idle/I-10.png'
    ],
    charachterLongIdle:
    [
        'assets/img/animation/idle/long_idle/I-11.png',
        'assets/img/animation/idle/long_idle/I-12.png',
        'assets/img/animation/idle/long_idle/I-13.png',
        'assets/img/animation/idle/long_idle/I-14.png',
        'assets/img/animation/idle/long_idle/I-15.png',
        'assets/img/animation/idle/long_idle/I-16.png',
        'assets/img/animation/idle/long_idle/I-17.png',
        'assets/img/animation/idle/long_idle/I-18.png',
        'assets/img/animation/idle/long_idle/I-19.png',
        'assets/img/animation/idle/long_idle/I-20.png'
    ],
    characterJump:
    [
        'assets/img/animation/jump/J-31.png',
        'assets/img/animation/jump/J-32.png',
        'assets/img/animation/jump/J-33.png',
        'assets/img/animation/jump/J-34.png',
        'assets/img/animation/jump/J-35.png',
        'assets/img/animation/jump/J-36.png',
        'assets/img/animation/jump/J-37.png',
        'assets/img/animation/jump/J-38.png',
        'assets/img/animation/jump/J-39.png'
    ]
};

/*                      */
export type MainCharacter = {
    charStatus: string,
    x_coordinate: number,
    y_coordinate: number,
    isJumping: boolean,
    lastJumpStarted: number,
    lastJumpAnimationStarted: number,
    lastIdleStarted: number,
    lastWalkStarted: number,
    characterImage: HTMLImageElement,
    characterImageSrc: string,
    idleImg: number,
    walkRightImg: number,
    walkLeftImg: number,
    jumpImg: number
}