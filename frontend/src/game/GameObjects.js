import { Sprite } from "../game/Sprite";
import { Fighter } from "../game/Fighter";


export const initGameObjects = (ctx) => {
    // Player healthbar sprite
    const playerHealthBar = new Sprite(ctx, {
        position: {
            x: 90,
            y: 37
        },
        imageSrc: '../img/misc/bar.png',
        scale: 2.6,
        framesMax: 1
    });

    const playerHealthBarBG = new Sprite(ctx, {
        position: {
            x: 115,
            y: 44
        },
        imageSrc: '../img/misc/bar_background.png',
        scale: 2.6,
        framesMax: 1
    });

    const playerHealth = new Sprite(ctx, {
        position: {
            x: 115,
            y: 45
        },
        imageSrc: '../img/misc/health_bar_flipped.png',
        scale: 2.6,
        framesMax: 1
    });

    const playerWeaponIcon = new Sprite(ctx, {
        position: {
            x: 0,
            y: 0
        },
        imageSrc: '../img/misc/weapon_icon_flipped.png',
        scale: 2,
        framesMax: 1
    });

    // Enemy healthbar sprite
    const enemyHealthBar = new Sprite(ctx, {
        position: {
            x: 455,
            y: 37
        },
        imageSrc: '../img/misc/bar.png',
        scale: 2.6,
        framesMax: 1
    });

    const enemyHealthBarBG = new Sprite(ctx, {
        position: {
            x: 485,
            y: 44
        },
        imageSrc: '../img/misc/bar_background.png',
        scale: 2.6,
        framesMax: 1
    });

    const enemyHealth = new Sprite(ctx, {
        position: {
            x: 477,
            y: 45
        },
        imageSrc: '../img/misc/health_bar.png',
        scale: 2.6,
        framesMax: 1
    });

    const enemyWeaponIcon = new Sprite(ctx, {
        position: {
            x: 740,
            y: 0
        },
        imageSrc: '../img/misc/weapon_icon.png',
        scale: 2,
        framesMax: 1
    });

    // Background sprite
    const background = new Sprite(ctx, {
        position: {
            x: 0,
            y: 0
        },
        imageSrc: '../img/map/map1.png',
        scale: 1.91,
        framesMax: 1
    });

    // Torch and candle sprites
    const torch1 = new Sprite(ctx, {
        position: {
            x: 670,
            y: 200
        },
        imageSrc: '../img/map/big_torch.png',
        scale: 1.5,
        framesMax: 6
    });

    const torch2 = new Sprite(ctx, {
        position: {
            x: 120,
            y: 200
        },
        imageSrc: '../img/map/big_torch.png',
        scale: 1.5,
        framesMax: 6
    });

    const tallCandle = new Sprite(ctx, {
        position: {
            x: 413,
            y: 228
        },
        imageSrc: '../img/map/tall_candle.png',
        scale: 2,
        framesMax: 6
    });

    // Player Sprite
    const player = new Fighter(ctx, {
        position: {
            x: 80,
            y: 100
        },
        velocity: {
            x: 0,
            y: 0
        },
        imageSrc: '../img/Knight_1/Idle.png',
        framesMax: 4,
        scale: 2,
        offset: {
            x: 94,
            y: 127
        },
        sprites: {
            idle: {
                imageSrc: '../img/Knight_1/Idle.png',
                framesMax: 4,
                framesHold: 12
            },
            run: {
                imageSrc: '../img/Knight_1/Run.png',
                framesMax: 7,
                framesHold: 8
            },
            jump: {
                imageSrc: '../img/Knight_1/Jump2.png',
                framesMax: 2,
                framesHold: 20
            },
            fall: {
                imageSrc: '../img/Knight_1/Fall.png',
                framesMax: 1,
                framesHold: 5
            },
            attack1: {
                imageSrc: '../img/Knight_1/Attack 2.png',
                framesMax: 4,
                framesHold: 7
            },
            takeHit: {
                imageSrc: '../img/Knight_1/Hurt.png',
                framesMax: 2,
                framesHold: 12
            },
            death: {
                imageSrc: '../img/Knight_1/Dead.png',
                framesMax: 6,
                framesHold: 10
            },
            defend: {
                imageSrc: '../img/Knight_1/Defend.png',
                framesMax: 1,
                framesHold: 5
            }
        },
        attackBox: {
            offset: {
                x: 55,
                y: 10
            },
            width: 105,
            height: 75
        }
    });

    // Enemy sprite
    const enemy = new Fighter(ctx, {
        position: {
            x: 714,
            y: 100
        },
        velocity: {
            x: 0,
            y: 0
        },
        imageSrc: '../img/Knight_2/Idle.png',
        framesMax: 4,
        scale: 2,
        offset: {
            x: 107,
            y: 127
        },
        sprites: {
            idle: {
                imageSrc: '../img/Knight_2/Idle.png',
                framesMax: 4,
                framesHold: 12
            },
            run: {
                imageSrc: '../img/Knight_2/Run.png',
                framesMax: 7,
                framesHold: 8
            },
            jump: {
                imageSrc: '../img/Knight_2/Jump2.png',
                framesMax: 2,
                framesHold: 20
            },
            fall: {
                imageSrc: '../img/Knight_2/Fall.png',
                framesMax: 1,
                framesHold: 5
            },
            attack1: {
                imageSrc: '../img/Knight_2/Attack 2.png',
                framesMax: 4,
                framesHold: 7
            },
            takeHit: {
                imageSrc: '../img/Knight_2/Hurt.png',
                framesMax: 2,
                framesHold: 12
            },
            death: {
                imageSrc: '../img/Knight_2/Dead.png',
                framesMax: 6,
                framesHold: 10
            },
            defend: {
                imageSrc: '../img/Knight_2/Defend.png',
                framesMax: 1,
                framesHold: 5
            }
        },
        attackBox: {
            offset: {
                x: -105,
                y: 10
            },
            width: 105,
            height: 75
        }
    });

    return {
        playerHealthBar,
        playerHealthBarBG,
        playerHealth,
        playerWeaponIcon,
        enemyHealthBar,
        enemyHealthBarBG,
        enemyHealth,
        enemyWeaponIcon,
        background,
        torch1,
        torch2,
        tallCandle,
        player,
        enemy
    };
}
