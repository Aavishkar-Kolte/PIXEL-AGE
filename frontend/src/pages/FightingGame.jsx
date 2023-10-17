import React, { useState, useRef, useEffect, useMemo } from "react";
import Canvas from "../components/Canvas";
import gsap from "gsap";

import { Sprite } from "../game-js/Sprite";
import { Fighter } from "../game-js/Fighter";
import { rectangularCollision, determineWinner } from "../game-js/Utils";

const FightingGame = (props) => {

    const [ctx, setCtx] = useState(null);
    const gameOverText = useRef();
    const timer = useRef();
    const gameOver = useRef(false);

    let time = useRef(60);
    let timerId = useRef()
    const establishContext = (context) => {
        setCtx(context);
    };

    const keys = {
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        k: {
            pressed: false
        },
        ArrowRight: {
            pressed: false
        },
        ArrowLeft: {
            pressed: false
        },
        Enter: {
            pressed: false
        }
    }


    const playerHealthBar = new Sprite(ctx, {
        position: {
            x: 75,
            y: 24
        },
        imageSrc: '../img/bar.png',
        scale: 2.5,
        framesMax: 1
    });

    const enemyHealthBar = new Sprite(ctx, {
        position: {
            x: 480,
            y: 24
        },
        imageSrc: '../img/bar.png',
        scale: 2.5,
        framesMax: 1
    });

    const playerHealthBarBG = new Sprite(ctx, {
        position: {
            x: 90,
            y: 30
        },
        imageSrc: '../img/bar_background.png',
        scale: 2.7,
        framesMax: 1
    });

    const enemyHealthBarBG = new Sprite(ctx, {
        position: {
            x: 490,
            y: 30
        },
        imageSrc: '../img/bar_background.png',
        scale: 2.7,
        framesMax: 1
    });

    const playerHealth = new Sprite(ctx, {
        position: {
            x: 90,
            y: 31
        },
        imageSrc: '../img/health_bar_flipped.png',
        scale: 2.55,
        framesMax: 1
    });

    const enemyHealth = new Sprite(ctx, {
        position: {
            x: 504,
            y: 30
        },
        imageSrc: '../img/health_bar.png',
        scale: 2.55,
        framesMax: 1
    });

    const playerWeaponIcon = new Sprite(ctx, {
        position: {
            x: 15,
            y: 5
        },
        imageSrc: '../img/weapon_icon.png',
        scale: 1.25,
        framesMax: 1
    });

    const enemyWeaponIcon = new Sprite(ctx, {
        position: {
            x: 767,
            y: 5
        },
        imageSrc: '../img/weapon_icon.png',
        scale: 1.25,
        framesMax: 1
    });

    const background = new Sprite(ctx, {
        position: {
            x: 0,
            y: 0
        },
        imageSrc: '../img/background.png',
        scale: 1.91,
        framesMax: 1
    });


    const torch1 = new Sprite(ctx, {
        position: {
            x: 670,
            y: 200
        },
        imageSrc: '../img/big_torch.png',
        scale: 1.5,
        framesMax: 6
    });

    const torch2 = new Sprite(ctx, {
        position: {
            x: 120,
            y: 200
        },
        imageSrc: '../img/big_torch.png',
        scale: 1.5,
        framesMax: 6
    });


    const tallCandle = new Sprite(ctx, {
        position: {
            x: 413,
            y: 228
        },
        imageSrc: '../img/tall_candle.png',
        scale: 2,
        framesMax: 6
    });





    const player = new Fighter(ctx, {
        position: {
            x: 30,
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





    const enemy = new Fighter(ctx, {
        position: {
            x: 770,
            y: 100
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: 'blue',
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



    function HandleKeyDown(event) {
        if (event.repeat) return;

        if (!player.dead) {
            switch (event.key) {
                case 'd':
                    keys.d.pressed = true
                    player.lastKey = 'd'
                    // props.sendData(keys);
                    break
                case 'a':
                    keys.a.pressed = true
                    player.lastKey = 'a'
                    // props.sendData(keys);
                    break
                case 'w':
                    if(!keys.k.pressed)
                    player.velocity.y = -15

                    break
                case ' ':
                    player.attack()
                    break
                case 'k':
                    keys.k.pressed = true;
                    player.isDefending = true;
                    break
            }
        }

        if (!enemy.dead) {
            switch (event.key) {
                case 'ArrowRight':
                    keys.ArrowRight.pressed = true
                    enemy.lastKey = 'ArrowRight'
                    break
                case 'ArrowLeft':
                    keys.ArrowLeft.pressed = true
                    enemy.lastKey = 'ArrowLeft'
                    break
                case 'ArrowUp':
                    if(!enemy.isDefending)
                    enemy.velocity.y = -15
                    break
                case 'ArrowDown':
                    enemy.attack()
                    break
                case 'Enter':
                    keys.Enter.pressed = true;
                    enemy.isDefending = true;
                    break
            }
        }
    }

    function HandleKeyUp(event) {
        if (event.repeat) return;

        switch (event.key) {
            case 'd':
                keys.d.pressed = false
                break
            case 'a':
                keys.a.pressed = false
                break
            case 'k':
                keys.k.pressed = false;
                player.isDefending = false;
                break
        }

        // enemy keys
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = false
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false
                break
            case 'Enter':
                keys.Enter.pressed = false;
                enemy.isDefending = false;
                break
        }
    }

    window.addEventListener('keydown', HandleKeyDown);
    window.addEventListener('keyup', HandleKeyUp);

    const decreaseTimer = useMemo(() => {
        return () => {
            // console.log(time);

            if (time.current > 0) {
                timerId.current = setTimeout(() => {
                    time.current--;
                    if (timer.current) {
                        timer.current.innerHTML = time.current;
                    }
                    decreaseTimer(); // Schedule the next call
                }, 1000);
            }
            else {
                return
            }
        }
    }, [gameOverText])

    useEffect(() => {
        decreaseTimer();
    }, []);

    let opKeys = {};




    const draw = () => {
        if (ctx) {

            // opKeys = props.opKeys();

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            background.update();
            torch1.update();
            torch2.update();
            tallCandle.update()

            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


            if (gameOver.current === false || player.currentSprite === "idle" || player.currentSprite === "death") {
                player.update();
            }

            if (gameOver.current === false || enemy.currentSprite === "idle" || enemy.currentSprite === "death") {
                enemy.update();
            }



            playerHealthBarBG.update();
            enemyHealthBarBG.update();

            playerWeaponIcon.update();
            enemyWeaponIcon.update();

            playerHealth.ctx.drawImage(

                playerHealth.image,
                0,
                0,
                playerHealth.image.width,
                playerHealth.image.height,
                playerHealth.position.x - playerHealth.offset.x,
                playerHealth.position.y - playerHealth.offset.y,
                (playerHealth.image.width * player.health / 100) * playerHealth.scale,
                playerHealth.image.height * playerHealth.scale
            );


            enemyHealth.ctx.drawImage(
                enemyHealth.image,
                0,
                0,
                enemyHealth.image.width,
                enemyHealth.image.height,
                enemyHealth.position.x - enemyHealth.offset.x,
                enemyHealth.position.y - enemyHealth.offset.y,
                (enemyHealth.image.width * enemy.health / 100) * enemyHealth.scale,
                enemyHealth.image.height * enemyHealth.scale
            );

            playerHealthBar.update();
            enemyHealthBar.update();

            player.velocity.x = 0;
            enemy.velocity.x = 0;


            if (time.current <= 0) {
                if (!gameOver.current) {
                    determineWinner(gameOverText, HandleKeyDown, HandleKeyUp, { player, enemy, timerId: timerId.current, time: time.current });
                    gameOver.current = true
                }
                console.log("hi")
                return;
            }




            // player movement

            if (keys.a.pressed && player.lastKey === 'a' && player.position.x > 5) {
                if(player.isDefending){
                    player.velocity.x = -2;
                } else{
                    player.velocity.x = -5;
                    player.switchSprite('run');
                }
                
                
            } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x < 780) {
                if(player.isDefending){
                    player.velocity.x = 2;
                } else{
                    player.velocity.x = 5;
                    player.switchSprite('run');
                }
               
            }

            // jumping
            if (player.velocity.y < 0) {
                player.switchSprite('jump');
                player.isJumping = true;
            } else if (player.velocity.y > 0) {
                player.switchSprite('fall');
                player.isFalling = true;
            }

            if (player.position.y <= 105 && !(player.velocity.y > 0)) {
                player.velocity.y = 0
            }

            if (player.isAttacking === false && player.velocity.y === 0 && player.velocity.x === 0 && !player.isJumping) {
                player.switchSprite('idle');
            }

            if (player.velocity.y === 0) {
                player.isJumping = false;
                player.isFalling = false;
            }

            if(keys.k.pressed){
                player.switchSprite('defend')
                if(player.velocity.y < 0) player.velocity.y = 0;
            }




            // Enemy movement
            if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x > 20) {
                if(enemy.isDefending){
                    enemy.velocity.x = -2;
                } else{
                    enemy.velocity.x = -5;
                    enemy.switchSprite('run');
                }
                
            } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x < 795) {
                if(enemy.isDefending){
                    enemy.velocity.x = 2
                } else{
                    enemy.velocity.x = 5;
                    enemy.switchSprite('run');
                }
                
            }

            // jumping
            if (enemy.velocity.y < 0) {
                enemy.switchSprite('jump');
                enemy.isJumping = true;
            } else if (enemy.velocity.y > 0) {
                enemy.switchSprite('fall');
                enemy.isFalling = false;
            }

            if (enemy.position.y <= 105 && !(enemy.velocity.y > 0)) {
                enemy.velocity.y = 0
            }



            if (enemy.isAttacking === false && enemy.velocity.y === 0 && enemy.velocity.x === 0 && !enemy.isJumping) {
                enemy.switchSprite('idle');
            }

            if (enemy.velocity.y === 0) {
                enemy.isJumping = false;
                enemy.isFalling = false;
            }

            
            if(keys.Enter.pressed){
                enemy.switchSprite('defend')
                if(enemy.velocity.y < 0) enemy.velocity.y = 0;
            }

            // detect for collision & enemy gets hit
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: enemy
                }) &&
                player.isAttacking &&
                player.framesCurrent === 2
            ) {
                enemy.takeHit();
                player.isAttacking = false;
                enemyHealth.offset.x = enemyHealth.image.width * enemyHealth.scale * (enemy.health / 100 - 1);
            }

            // if player misses
            if (player.isAttacking && player.framesCurrent === 3) {
                player.isAttacking = false;
            }

            // enemyHealth is where our player gets hit
            if (
                rectangularCollision({
                    rectangle1: enemy,
                    rectangle2: player
                }) &&
                enemy.isAttacking &&
                enemy.framesCurrent === 2
            ) {
                player.takeHit();
                enemy.isAttacking = false;
            }

            // if player misses
            if (enemy.isAttacking && enemy.framesCurrent === 3) {
                enemy.isAttacking = false;
            }

            // end game based on health
            if (enemy.health <= 0 || player.health <= 0) {
                determineWinner(gameOverText, HandleKeyDown, HandleKeyUp, { player, enemy, timerId: timerId.current, time: time.current });
                gameOver.current = true;
            }
        }

    };


    return (
        <div className="game-container">
            <div>
                <div className="div1">

                    <p ref={timer} className="timer"> 60 </p>
                    <div></div>

                </div>

                <div ref={gameOverText} className="game-over-text"> Tie </div>
                <Canvas draw={draw} establishContext={establishContext} w="854px" h="480px" />

            </div>
        </div>
    )
};

export default FightingGame;
