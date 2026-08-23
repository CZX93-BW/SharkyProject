'use strict';

/**
 * Provides the central registry for all visual and audio asset paths.
 * Empty paths reserve optional assets that can be integrated later.
 *
 * @constant
 * @type {Object<string, *>}
 */
const ASSET_CONFIG = {
    /** Contains Sharky's static image and animation sequences. */
    character: {
        sharky: 'assets/img/sharky/3.Swim/1.png',
        idle: [
            'assets/img/sharky/2.Long_IDLE/i1.png',
            'assets/img/sharky/2.Long_IDLE/I2.png',
            'assets/img/sharky/2.Long_IDLE/I3.png',
            'assets/img/sharky/2.Long_IDLE/I4.png',
            'assets/img/sharky/2.Long_IDLE/I5.png',
            'assets/img/sharky/2.Long_IDLE/I6.png',
            'assets/img/sharky/2.Long_IDLE/I7.png',
            'assets/img/sharky/2.Long_IDLE/I8.png',
            'assets/img/sharky/2.Long_IDLE/I9.png',
            'assets/img/sharky/2.Long_IDLE/I10.png',
            'assets/img/sharky/2.Long_IDLE/I11.png',
            'assets/img/sharky/2.Long_IDLE/I12.png',
            'assets/img/sharky/2.Long_IDLE/I13.png',
            'assets/img/sharky/2.Long_IDLE/I14.png'
        ],
        swim: [
            'assets/img/sharky/3.Swim/1.png',
            'assets/img/sharky/3.Swim/2.png',
            'assets/img/sharky/3.Swim/3.png',
            'assets/img/sharky/3.Swim/4.png',
            'assets/img/sharky/3.Swim/5.png',
            'assets/img/sharky/3.Swim/6.png'
        ],
        finSlap: [
            'assets/img/sharky/4.Attack/Fin slap/1.png',
            'assets/img/sharky/4.Attack/Fin slap/2.png',
            'assets/img/sharky/4.Attack/Fin slap/3.png',
            'assets/img/sharky/4.Attack/Fin slap/4.png',
            'assets/img/sharky/4.Attack/Fin slap/5.png',
            'assets/img/sharky/4.Attack/Fin slap/6.png',
            'assets/img/sharky/4.Attack/Fin slap/7.png',
            'assets/img/sharky/4.Attack/Fin slap/8.png'
        ],
        bubbleTrap: [
            'assets/img/sharky/4.Attack/Bubble trap/op1 (with bubble formation)/1.png',
            'assets/img/sharky/4.Attack/Bubble trap/op1 (with bubble formation)/2.png',
            'assets/img/sharky/4.Attack/Bubble trap/op1 (with bubble formation)/3.png',
            'assets/img/sharky/4.Attack/Bubble trap/op1 (with bubble formation)/4.png',
            'assets/img/sharky/4.Attack/Bubble trap/op1 (with bubble formation)/5.png',
            'assets/img/sharky/4.Attack/Bubble trap/op1 (with bubble formation)/6.png',
            'assets/img/sharky/4.Attack/Bubble trap/op1 (with bubble formation)/7.png',
            'assets/img/sharky/4.Attack/Bubble trap/op1 (with bubble formation)/8.png'
        ],
        hurt: [
            'assets/img/sharky/5.Hurt/1.Poisoned/1.png',
            'assets/img/sharky/5.Hurt/1.Poisoned/2.png',
            'assets/img/sharky/5.Hurt/1.Poisoned/3.png',
            'assets/img/sharky/5.Hurt/1.Poisoned/4.png',
            'assets/img/sharky/5.Hurt/1.Poisoned/5.png'
        ],
        dead: [
            'assets/img/sharky/6.dead/1.Poisoned/1.png',
            'assets/img/sharky/6.dead/1.Poisoned/2.png',
            'assets/img/sharky/6.dead/1.Poisoned/3.png',
            'assets/img/sharky/6.dead/1.Poisoned/4.png',
            'assets/img/sharky/6.dead/1.Poisoned/5.png',
            'assets/img/sharky/6.dead/1.Poisoned/6.png',
            'assets/img/sharky/6.dead/1.Poisoned/7.png',
            'assets/img/sharky/6.dead/1.Poisoned/8.png',
            'assets/img/sharky/6.dead/1.Poisoned/9.png',
            'assets/img/sharky/6.dead/1.Poisoned/10.png',
            'assets/img/sharky/6.dead/1.Poisoned/11.png',
            'assets/img/sharky/6.dead/1.Poisoned/12.png'
        ]
    },

    /** Contains the parallax background layers for every level. */
    backgrounds: {
        levelOne: {
            far: 'assets/img/backgrounds/Layers/5. Water/water_complete_lvl_1.png',
            back: 'assets/img/backgrounds/Layers/4.Fondo 2/fondo_complete_lvl_1_v2.png',
            middle: 'assets/img/backgrounds/Layers/3.Fondo 1/fondo_complete_lvl_1.png',
            front: 'assets/img/backgrounds/Layers/1. Light/complete_light.png',
            floor: 'assets/img/backgrounds/Layers/2. Floor/floor0_complete_lvl_1.png'
        },
        levelTwo: {
            far: 'assets/img/backgrounds/Layers/5. Water/water_complete_lvl_2.png',
            back: 'assets/img/backgrounds/Layers/4.Fondo 2/fondo_complete_lvl_2_v2.png',
            middle: 'assets/img/backgrounds/Layers/3.Fondo 1/fondo_complete_lvl_2.png',
            front: 'assets/img/backgrounds/Layers/1. Light/complete_light.png',
            floor: 'assets/img/backgrounds/Layers/2. Floor/floor0_complete_lvl_2.png'
        }
    },

    /** Contains sprite sequences for regular enemies and the end boss. */
    enemies: {
        default:
            'assets/img/enemies/1.Puffer fish (3 color options)/1.Swim/1.swim1.png',
        pufferFish: {
            swim: [
                'assets/img/enemies/1.Puffer fish (3 color options)/1.Swim/1.swim1.png',
                'assets/img/enemies/1.Puffer fish (3 color options)/1.Swim/1.swim2.png',
                'assets/img/enemies/1.Puffer fish (3 color options)/1.Swim/1.swim3.png',
                'assets/img/enemies/1.Puffer fish (3 color options)/1.Swim/1.swim4.png',
                'assets/img/enemies/1.Puffer fish (3 color options)/1.Swim/1.swim5.png'
            ],
            transition: [
                'assets/img/enemies/1.Puffer fish (3 color options)/2.transition/1.transition1.png',
                'assets/img/enemies/1.Puffer fish (3 color options)/2.transition/1.transition2.png',
                'assets/img/enemies/1.Puffer fish (3 color options)/2.transition/1.transition3.png',
                'assets/img/enemies/1.Puffer fish (3 color options)/2.transition/1.transition4.png',
                'assets/img/enemies/1.Puffer fish (3 color options)/2.transition/1.transition5.png'
            ],
            inflatedSwim: [
                'assets/img/enemies/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim1.png',
                'assets/img/enemies/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim2.png',
                'assets/img/enemies/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim3.png',
                'assets/img/enemies/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim4.png',
                'assets/img/enemies/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim5.png'
            ],
            dead: [
                'assets/img/enemies/1.Puffer fish (3 color options)/4.DIE/1.Dead 1 (can animate by going up).png',
                'assets/img/enemies/1.Puffer fish (3 color options)/4.DIE/1.Dead 2 (can animate by going down to the floor after the Fin Slap attack).png',
                'assets/img/enemies/1.Puffer fish (3 color options)/4.DIE/1.Dead 3 (can animate by going down to the floor after the Fin Slap attack).png'
            ]
        },
        jellyFish: {
            swim: [
                'assets/img/enemies/2 Jelly fish/Regular damage/Lila 1.png',
                'assets/img/enemies/2 Jelly fish/Regular damage/Lila 2.png',
                'assets/img/enemies/2 Jelly fish/Regular damage/Lila 3.png',
                'assets/img/enemies/2 Jelly fish/Regular damage/Lila 4.png'
            ],
            dead: [
                'assets/img/enemies/2 Jelly fish/Dead/Lila/L1.png',
                'assets/img/enemies/2 Jelly fish/Dead/Lila/L2.png',
                'assets/img/enemies/2 Jelly fish/Dead/Lila/L3.png',
                'assets/img/enemies/2 Jelly fish/Dead/Lila/L4.png'
            ]
        },
        jellyFishYellow: {
            swim: [
                'assets/img/enemies/2 Jelly fish/Regular damage/Yellow 1.png',
                'assets/img/enemies/2 Jelly fish/Regular damage/Yellow 2.png',
                'assets/img/enemies/2 Jelly fish/Regular damage/Yellow 3.png',
                'assets/img/enemies/2 Jelly fish/Regular damage/Yellow 4.png'
            ],
            dead: [
                'assets/img/enemies/2 Jelly fish/Dead/Yellow/y1.png',
                'assets/img/enemies/2 Jelly fish/Dead/Yellow/y2.png',
                'assets/img/enemies/2 Jelly fish/Dead/Yellow/y3.png',
                'assets/img/enemies/2 Jelly fish/Dead/Yellow/y4.png'
            ]
        },
        jellyFishPink: {
            swim: [
                'assets/img/enemies/2 Jelly fish/Super dangerous/Pink 1.png',
                'assets/img/enemies/2 Jelly fish/Super dangerous/Pink 2.png',
                'assets/img/enemies/2 Jelly fish/Super dangerous/Pink 3.png',
                'assets/img/enemies/2 Jelly fish/Super dangerous/Pink 4.png'
            ],
            dead: [
                'assets/img/enemies/2 Jelly fish/Dead/Pink/P1.png',
                'assets/img/enemies/2 Jelly fish/Dead/Pink/P2.png',
                'assets/img/enemies/2 Jelly fish/Dead/Pink/P3.png',
                'assets/img/enemies/2 Jelly fish/Dead/Pink/P4.png'
            ]
        },
        endboss: {
            introduce: [
                'assets/img/enemies/3 Final Enemy/1.Introduce/1.png',
                'assets/img/enemies/3 Final Enemy/1.Introduce/2.png',
                'assets/img/enemies/3 Final Enemy/1.Introduce/3.png',
                'assets/img/enemies/3 Final Enemy/1.Introduce/4.png',
                'assets/img/enemies/3 Final Enemy/1.Introduce/5.png',
                'assets/img/enemies/3 Final Enemy/1.Introduce/6.png',
                'assets/img/enemies/3 Final Enemy/1.Introduce/7.png',
                'assets/img/enemies/3 Final Enemy/1.Introduce/8.png',
                'assets/img/enemies/3 Final Enemy/1.Introduce/9.png',
                'assets/img/enemies/3 Final Enemy/1.Introduce/10.png'
            ],
            floating: [
                'assets/img/enemies/3 Final Enemy/2.floating/1.png',
                'assets/img/enemies/3 Final Enemy/2.floating/2.png',
                'assets/img/enemies/3 Final Enemy/2.floating/3.png',
                'assets/img/enemies/3 Final Enemy/2.floating/4.png',
                'assets/img/enemies/3 Final Enemy/2.floating/5.png',
                'assets/img/enemies/3 Final Enemy/2.floating/6.png',
                'assets/img/enemies/3 Final Enemy/2.floating/7.png',
                'assets/img/enemies/3 Final Enemy/2.floating/8.png',
                'assets/img/enemies/3 Final Enemy/2.floating/9.png',
                'assets/img/enemies/3 Final Enemy/2.floating/10.png',
                'assets/img/enemies/3 Final Enemy/2.floating/11.png',
                'assets/img/enemies/3 Final Enemy/2.floating/12.png',
                'assets/img/enemies/3 Final Enemy/2.floating/13.png'
            ],
            attack: [
                'assets/img/enemies/3 Final Enemy/Attack/1.png',
                'assets/img/enemies/3 Final Enemy/Attack/2.png',
                'assets/img/enemies/3 Final Enemy/Attack/3.png',
                'assets/img/enemies/3 Final Enemy/Attack/4.png',
                'assets/img/enemies/3 Final Enemy/Attack/5.png',
                'assets/img/enemies/3 Final Enemy/Attack/6.png'
            ],
            hurt: [
                'assets/img/enemies/3 Final Enemy/Hurt/1.png',
                'assets/img/enemies/3 Final Enemy/Hurt/2.png',
                'assets/img/enemies/3 Final Enemy/Hurt/3.png',
                'assets/img/enemies/3 Final Enemy/Hurt/4.png'
            ],
            dead: [
                'assets/img/enemies/3 Final Enemy/Dead/Mesa de trabajo 2.png',
                'assets/img/enemies/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png',
                'assets/img/enemies/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png',
                'assets/img/enemies/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png',
                'assets/img/enemies/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png',
                'assets/img/enemies/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png'
            ]
        }
    },

    /** Contains static and animated collectible assets. */
    collectibles: {
        coin: 'assets/img/collectibles/1. Coins/1.png',
        coinAnimation: [
            'assets/img/collectibles/1. Coins/1.png',
            'assets/img/collectibles/1. Coins/2.png',
            'assets/img/collectibles/1. Coins/3.png',
            'assets/img/collectibles/1. Coins/4.png'
        ],
        poisonBottle: 'assets/img/collectibles/Poison/Animada/1.png',
        poisonBottleAnimation: [
            'assets/img/collectibles/Poison/Animada/1.png',
            'assets/img/collectibles/Poison/Animada/2.png',
            'assets/img/collectibles/Poison/Animada/3.png',
            'assets/img/collectibles/Poison/Animada/4.png',
            'assets/img/collectibles/Poison/Animada/5.png',
            'assets/img/collectibles/Poison/Animada/6.png',
            'assets/img/collectibles/Poison/Animada/7.png',
            'assets/img/collectibles/Poison/Animada/8.png'
        ]
    },

    /** Contains finish and barrier assets used by level objects. */
    levelObjects: {
        finish: '',
        barriers: {
            horizontalPair:
                'assets/img/backgrounds/Barrier/barrier_1.png',
            floorRock:
                'assets/img/backgrounds/Barrier/barrier_2.png',
            verticalRock:
                'assets/img/backgrounds/Barrier/barrier_3.png'
        }
    },

    /** Contains visual assets for player attacks. */
    attacks: {
        finSlap: '',
        poisonShot:
            'assets/img/sharky/4.Attack/Bubble trap/Poisoned Bubble (for whale).png',
        bubbleTrap:
            'assets/img/sharky/4.Attack/Bubble trap/Bubble.png'
    },

    /** Contains interface icons and status-bar sequences. */
    ui: {
        logo: '',
        heartIcon: '',
        coinIcon: '',
        poisonIcon: '',
        shopIcon: '',
        statusBars: {
            health: [
                'assets/img/collectibles/green/Life/0_  copia 3.png',
                'assets/img/collectibles/green/Life/20_ copia 4.png',
                'assets/img/collectibles/green/Life/40_  copia 3.png',
                'assets/img/collectibles/green/Life/60_  copia 3.png',
                'assets/img/collectibles/green/Life/80_  copia 3.png',
                'assets/img/collectibles/green/Life/100_  copia 2.png'
            ],
            coins: [
                'assets/img/collectibles/green/Coin/0_  copia 4.png',
                'assets/img/collectibles/green/Coin/20_  copia 2.png',
                'assets/img/collectibles/green/Coin/40_  copia 4.png',
                'assets/img/collectibles/green/Coin/60_  copia 4.png',
                'assets/img/collectibles/green/Coin/80_  copia 4.png',
                'assets/img/collectibles/green/Coin/100_ copia 4.png'
            ],
            poison: [
                'assets/img/collectibles/green/poisoned bubbles/0_ copia 2.png',
                'assets/img/collectibles/green/poisoned bubbles/20_ copia 3.png',
                'assets/img/collectibles/green/poisoned bubbles/40_ copia 2.png',
                'assets/img/collectibles/green/poisoned bubbles/60_ copia 2.png',
                'assets/img/collectibles/green/poisoned bubbles/80_ copia 2.png',
                'assets/img/collectibles/green/poisoned bubbles/100_ copia 3.png'
            ],
            bossHealth: [
                'assets/img/collectibles/Purple/0_ .png',
                'assets/img/collectibles/Purple/20__1.png',
                'assets/img/collectibles/Purple/40_ .png',
                'assets/img/collectibles/Purple/60_ .png',
                'assets/img/collectibles/Purple/80_ .png',
                'assets/img/collectibles/Purple/100_ .png'
            ]
        }
    },

    /** Reserves music and sound-effect paths for audio integration. */
    audio: {
        music: {
            mainTheme: ''
        },
        sounds: {
            coin: '',
            poisonBottle: '',
            damage: '',
            finSlap: '',
            poisonShot: '',
            bubbleTrap: '',
            shop: '',
            win: '',
            gameOver: ''
        }
    }
};