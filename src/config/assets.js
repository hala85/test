// ---------------------------------------------------------------------------
// Sheet + character definitions.
//
// Every entry in SHEETS must match a spritesheet that BootScene loads and an
// entry in assets/frames.json (generated from the PNG alpha channel, so the
// game knows exactly where each pose's feet are).
//
// frames are indexed row-major: index = row * cols + col
// ---------------------------------------------------------------------------

export const SHEETS = {
    wrestler:  { file: 'wrestler.png',  cols: 4, rows: 4, cellW: 256,  cellH: 256 },
    announcer: { file: 'announcer.png', cols: 4, rows: 4, cellW: 256,  cellH: 256 },
    trackstar: { file: 'trackstar.png', cols: 4, rows: 4, cellW: 256,  cellH: 256 },
    referee:   { file: 'referee.png',   cols: 4, rows: 4, cellW: 256,  cellH: 256 },
    pogo:      { file: 'pogo.png',      cols: 4, rows: 2, cellW: 384,  cellH: 512 },
    knockout:  { file: 'knockout.png',  cols: 1, rows: 3, cellW: 1024, cellH: 512 }
};

// Target on-screen height of a standing fighter, in pixels.
export const STAND_HEIGHT = 150;

export const CHARACTERS = {
    wrangler: {
        name: 'THE WRANGLER',
        sheet: 'wrestler',
        koFrame: 0,
        color: 0xff4fa3,
        anims: {
            idle:    { frames: [0, 1], fps: 3,  loop: true },
            walk:    { frames: [2, 3], fps: 8,  loop: true },
            punch:   { frames: [4, 5], fps: 14, loop: false, hitAt: 1 },
            kick:    { frames: [6, 7], fps: 12, loop: false, hitAt: 1 },
            grapple: { frames: [8],    fps: 8,  loop: false },
            slam:    { frames: [9, 10, 11], fps: 8, loop: false, hitAt: 2 },
            hurt:    { frames: [12],   fps: 8,  loop: false },
            block:   { frames: [13],   fps: 4,  loop: false },
            victory: { frames: [14],   fps: 4,  loop: false },
            taunt:   { frames: [15],   fps: 4,  loop: false }
        }
    },
    jock_chick: {
        name: 'TRACK STAR',
        sheet: 'trackstar',
        koFrame: 1,
        color: 0xb0264f,
        anims: {
            idle:    { frames: [0, 1], fps: 3,  loop: true },
            walk:    { frames: [2, 3], fps: 9,  loop: true },
            punch:   { frames: [8, 8], fps: 14, loop: false, hitAt: 1 },
            kick:    { frames: [9, 9], fps: 12, loop: false, hitAt: 1 },
            grapple: { frames: [11],   fps: 8,  loop: false },
            slam:    { frames: [10, 10], fps: 10, loop: false, hitAt: 1 },
            hurt:    { frames: [12],   fps: 8,  loop: false },
            block:   { frames: [13],   fps: 4,  loop: false },
            victory: { frames: [14],   fps: 4,  loop: false },
            taunt:   { frames: [15],   fps: 4,  loop: false }
        }
    },
    pogo_geezer: {
        name: 'POGO GEEZER',
        sheet: 'pogo',
        koFrame: 2,
        color: 0x7bd88f,
        anims: {
            idle:    { frames: [0],      fps: 3,  loop: true },
            walk:    { frames: [1, 2],   fps: 8,  loop: true },
            punch:   { frames: [3, 4],   fps: 12, loop: false, hitAt: 1 },
            kick:    { frames: [3, 4],   fps: 12, loop: false, hitAt: 1 },
            grapple: { frames: [3],      fps: 8,  loop: false },
            slam:    { frames: [3, 4, 5], fps: 9, loop: false, hitAt: 1 },
            hurt:    { frames: [5],      fps: 8,  loop: false },
            block:   { frames: [1],      fps: 4,  loop: false },
            victory: { frames: [7],      fps: 4,  loop: false },
            taunt:   { frames: [6],      fps: 4,  loop: false }
        }
    }
};

// Referee + announcer poses, kept out of the selectable roster.
export const REF_ANIMS = {
    idle:   { frames: [0, 1], fps: 2.5, loop: true },
    walk:   { frames: [2, 3], fps: 9,   loop: true },
    run:    { frames: [4, 4], fps: 10,  loop: true },
    count:  { frames: [6, 6], fps: 3,   loop: true },
    crouch: { frames: [5],    fps: 4,   loop: false },
    point:  { frames: [9],    fps: 4,   loop: false },
    breakX: { frames: [8],    fps: 4,   loop: false },
    whistle:{ frames: [10],   fps: 4,   loop: false },
    declare:{ frames: [11],   fps: 4,   loop: false },
    shock:  { frames: [12],   fps: 4,   loop: false },
    shrug:  { frames: [13],   fps: 4,   loop: false },
    facepalm:{ frames: [14],  fps: 4,   loop: false },
    cheer:  { frames: [15],   fps: 4,   loop: false }
};

export const ANNOUNCER_ANIMS = {
    idle:     { frames: [0, 1], fps: 3,  loop: true },
    talk:     { frames: [8, 9], fps: 6,  loop: true },
    shout:    { frames: [9],    fps: 6,  loop: false },
    shocked:  { frames: [6],    fps: 6,  loop: false },
    cheer:    { frames: [12],   fps: 6,  loop: false },
    shrug:    { frames: [14],   fps: 6,  loop: false },
    cower:    { frames: [13],   fps: 6,  loop: false }
};

// Home-made roster order used by the character select screen.
export const ROSTER = ['wrangler', 'jock_chick', 'pogo_geezer'];

// Kept for backwards compatibility with older imports.
export const ASSET_MANIFEST = CHARACTERS;
