'use strict';

const ASSET_CONFIG = {
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
            ]
        },

        jellyFish: {
            swim: [
                'assets/img/enemies/2 Jelly fish/Regular damage/Lila 1.png',
                'assets/img/enemies/2 Jelly fish/Regular damage/Lila 2.png',
                'assets/img/enemies/2 Jelly fish/Regular damage/Lila 3.png',
                'assets/img/enemies/2 Jelly fish/Regular damage/Lila 4.png'
            ]
        },

        endboss: ''
    },

    collectibles: {
        coin: '',
        poisonBottle: ''
    },

    levelObjects: {
        finish: ''
    },

    attacks: {
        finSlap: '',

        poisonShot:
            'assets/img/sharky/4.Attack/Bubble trap/Poisoned Bubble (for whale).png',

        bubbleTrap:
            'assets/img/sharky/4.Attack/Bubble trap/Bubble.png'
    },

    ui: {
        logo: '',
        heartIcon: '',
        coinIcon: '',
        poisonIcon: '',
        shopIcon: ''
    },

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