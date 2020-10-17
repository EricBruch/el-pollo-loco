//################################# Game Config ##################################
export const JUMP_TIME = 300; // in ms
export const GAME_SPEED = 7;

//################################# Game state ###################################
// Enum describes the States that the character can be in
export const enum CHARACTER_STATUS {
    IDLE = 'IDLE',
    LONG_IDLE_= 'LONG_IDLE',
    WALK_LEFT = 'WALK_LEFT',
    WALK_RIGHT = 'WALK_RIGHT',
    JUMP = 'JUMP',
    HIT = 'HIT'
}

