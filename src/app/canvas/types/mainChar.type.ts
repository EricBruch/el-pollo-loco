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
