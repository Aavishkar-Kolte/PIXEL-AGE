import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas } from "../components/Canvas";
import { Sprite } from "../game-js/Sprite";
import { Fighter } from "../game-js/Fighter";
import { rectangularCollision, determineWinner } from "../game-js/Utils";

const FightingGameHost = (props) => {

    const [ctx, setCtx] = useState(null);
    const gameOverText = useRef(null);
    const timer = useRef(null);
    const gameOver = useRef(false);
    let tempStr = props.getPlayerName();
    const playerName = useRef(tempStr.charAt(0).toUpperCase() + tempStr.slice(1).toLowerCase())
    tempStr = props.getEnemyName();
    const enemyName = useRef(tempStr.charAt(0).toUpperCase() + tempStr.slice(1).toLowerCase())
    const winner = useRef(null);
    let time = useRef(180);
    let timerId = useRef()

    const establishContext = (context) => {
        setCtx(context);
    };



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



    function HandleKeyDown(event) {
        if (event.repeat) return; // Executes keydown only once

        if (!player.dead) {
            switch (event.key) {
                case 'd':
                    player.currentStatus.isMovingForward = true
                    player.currentStatus.lastMove = 'forward';
                    break;
                case 'a':
                    player.currentStatus.isMovingBackward = true;
                    player.currentStatus.lastMove = 'backward';
                    break;
                case 'w':
                    if (!player.currentStatus.isDefending)
                        player.currentStatus.isJumping = true;
                    break;
                case ' ':
                    player.currentStatus.isAttacking = true;
                    break;
                case 'k':
                    player.currentStatus.isDefending = true;
                    break;
            }
        }
    }

    function HandleKeyUp(event) {
        if (event.repeat) return; // Executes keyup only once

        switch (event.key) {
            case 'd':
                player.currentStatus.isMovingForward = false;
                break;
            case 'a':
                player.currentStatus.isMovingBackward = false;
                break;
            case 'k':
                player.currentStatus.isDefending = false;
                break;
        }
    }

    window.addEventListener('keydown', HandleKeyDown);
    window.addEventListener('keyup', HandleKeyUp);

    // Game timer
    const decreaseTimer = useMemo(() => {
        return () => {
            if (time.current > 0 && gameOver.current === false) {
                timerId.current = setTimeout(() => {
                    time.current--;
                    if (timer.current) {
                        timer.current.innerHTML = time.current;
                    }
                    decreaseTimer();
                }, 1000);
            }
            else {
                return;
            }
        }
    }, [gameOverText])

    useEffect(() => {
        decreaseTimer();
    }, []);


    const playerHealthOffsetX = useRef(playerHealth.offset.x)

    enemy.currentStatus = {
        lastMove: '',
        isMovingForward: false,
        isMovingBackward: false,
        isJumping: false,
        isAttacking: false,
        isDefending: false
    }

    const gameState = useRef({
        player: {
            currentStatus: enemy.currentStatus,
            currentSprite: enemy.currentSprite,
            position: enemy.position,
            velocity: enemy.velocity,
            health: enemy.health
        },
        enemy: {
            currentStatus: player.currentStatus,
            currentSprite: player.currentSprite,
            position: player.position,
            velocity: player.velocity,
            health: player.health
        },
        enemyHealthOffsetX: playerHealthOffsetX.current,
        time: time.current,
        gameOver: gameOver.current,
        winner: "test"
    });

    const count = useRef(0);



    const draw = () => {
        if (ctx) {

            let temp = props.getClientState();
            if (temp !== null) {
                enemy.currentStatus = temp;
            }


            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            background.update();
            torch1.update();
            torch2.update();
            tallCandle.update()


            if (gameOver.current === false || enemy.currentSprite === "idle" || enemy.currentSprite === "death") {
                enemy.update();
            }

            if (gameOver.current === false || player.currentSprite === "idle" || player.currentSprite === "death") {
                player.update();
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

            ctx.font = "26px Papyrus";
            ctx.fillStyle = "white";
            ctx.fillText(playerName.current, 115, 31);

            ctx.fillStyle = "white";
            ctx.fillText(enemyName.current, 854 - ctx.measureText(enemyName.current).width - 114, 31);



            player.velocity.x = 0;
            enemy.velocity.x = 0;


            if (time.current <= 0 || enemy.health <= 0 || player.health <= 0) {
                if (!gameOver.current) {
                    winner.current = determineWinner(gameOverText, HandleKeyDown, HandleKeyUp, { player, playerName: playerName.current, enemy, enemyName: enemyName.current, timerId: timerId.current, time: time.current });
                    gameOver.current = true
                    // console.log("hello");
                } else {
                    gameState.current = {
                        player: {
                            currentStatus: enemy.currentStatus,
                            currentSprite: enemy.currentSprite,
                            position: enemy.position,
                            velocity: enemy.velocity,
                            health: enemy.health,
                            dead: enemy.dead
                        },
                        enemy: {
                            currentStatus: player.currentStatus,
                            currentSprite: player.currentSprite,
                            position: player.position,
                            velocity: player.velocity,
                            health: player.health,
                            dead: player.dead
                        },
                        enemyHealthOffsetX: playerHealthOffsetX.current,
                        time: time.current,
                        gameOver: gameOver.current,
                        winner: winner.current
                    }

                    gameState.current.gameOver = true;
                    gameState.current.winner = winner.current;
                    props.sendGameState(gameState.current);
                }
                return;
            }





            // Enemy movement
            if (enemy.currentStatus.isMovingForward && enemy.currentStatus.lastMove === 'forward' && enemy.position.x > 20) {
                if (enemy.currentStatus.isDefending) {
                    enemy.velocity.x = -2;
                } else {
                    enemy.velocity.x = -5;
                    if (!enemy.isAttacking)
                        enemy.switchSprite({ sprite: 'run' });
                }
            } else if (enemy.currentStatus.isMovingBackward && enemy.currentStatus.lastMove === 'backward' && enemy.position.x < 795) {
                if (enemy.currentStatus.isDefending) {
                    enemy.velocity.x = 2
                } else {
                    enemy.velocity.x = 5;
                    if (!enemy.isAttacking)
                        enemy.switchSprite({ sprite: 'run' });
                }
            }

            if (enemy.currentStatus.isJumping) {
                enemy.velocity.y = -15;
                enemy.currentStatus.isJumping = false;
            }

            // jumping
            if (enemy.velocity.y < 0) {
                enemy.switchSprite({ sprite: 'jump' });
            } else if (enemy.velocity.y > 0) {
                enemy.switchSprite({ sprite: 'fall' });
            }

            if (enemy.position.y <= 105 && !(enemy.velocity.y > 0)) {
                enemy.velocity.y = 0
            }

            if (enemy.currentStatus.isAttacking === false && enemy.velocity.y === 0 && enemy.velocity.x === 0 && !enemy.currentStatus.isJumping) {
                enemy.switchSprite({ sprite: 'idle' });
            }

            if (enemy.velocity.y === 0) {
                enemy.currentStatus.isJumping = false;
            }








            // player movement

            if (player.currentStatus.isMovingBackward && player.currentStatus.lastMove === 'backward' && player.position.x > 5) {
                if (player.currentStatus.isDefending) {
                    player.velocity.x = -2;
                } else {
                    player.velocity.x = -5;
                    if (!player.isAttacking)
                        player.switchSprite({ sprite: 'run' });
                }
            } else if (player.currentStatus.isMovingForward && player.currentStatus.lastMove === 'forward' && player.position.x < 780) {
                if (player.currentStatus.isDefending) {
                    player.velocity.x = 2;
                } else {
                    player.velocity.x = 5;
                    if (!player.isAttacking)
                        player.switchSprite({ sprite: 'run' });
                }
            }

            if (player.currentStatus.isJumping) {
                player.velocity.y = -15;
                player.currentStatus.isJumping = false;
            }

            // jumping
            if (player.velocity.y < 0) {
                player.switchSprite({ sprite: 'jump' });
            } else if (player.velocity.y > 0) {
                player.switchSprite({ sprite: 'fall' });
            }

            if (player.position.y <= 105 && !(player.velocity.y > 0)) {
                player.velocity.y = 0
            }

            if (player.currentStatus.isAttacking === false && player.velocity.y === 0 && player.velocity.x === 0 && !player.currentStatus.isJumping) {
                player.switchSprite({ sprite: 'idle' });
            }

            if (player.velocity.y === 0) {
                player.currentStatus.isJumping = false;
            }







            if (enemy.currentStatus.isDefending) {
                enemy.switchSprite({ sprite: 'defend' })
                if (enemy.velocity.y < 0) enemy.velocity.y = 0;
            }

            if (player.currentStatus.isDefending) {
                player.switchSprite({ sprite: 'defend' })
                if (player.velocity.y < 0) player.velocity.y = 0;
            }







            if (player.currentStatus.isAttacking) {
                player.attack();
            }

            if (enemy.currentStatus.isAttacking) {
                enemy.attack();
            }






            // enemyHealth is where our player gets hit
            if (
                rectangularCollision({
                    rectangle1: enemy,
                    rectangle2: player
                }) &&
                enemy.currentStatus.isAttacking &&
                enemy.framesCurrent === 2
            ) {
                player.takeHit();
                player.currentStatus.takeHit = true;
                enemy.currentStatus.isAttacking = false;
                if (player.health > 0)
                    playerHealthOffsetX.current = playerHealth.image.width * playerHealth.scale * (player.health / 100 - 1);
            }

            // detect for collision & enemy gets hit
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: enemy
                }) &&
                player.currentStatus.isAttacking &&
                player.framesCurrent === 2
            ) {
                enemy.takeHit();
                player.currentStatus.takeHit = true;
                player.currentStatus.isAttacking = false;
                if (enemy.health > 0)
                    enemyHealth.offset.x = enemyHealth.image.width * enemyHealth.scale * (enemy.health / 100 - 1);
            }




            gameState.current = {
                player: {
                    currentStatus: enemy.currentStatus,
                    currentSprite: enemy.currentSprite,
                    position: enemy.position,
                    velocity: enemy.velocity,
                    health: enemy.health,
                    dead: enemy.dead
                },
                enemy: {
                    currentStatus: player.currentStatus,
                    currentSprite: player.currentSprite,
                    position: player.position,
                    velocity: player.velocity,
                    health: player.health,
                    dead: player.dead
                },
                enemyHealthOffsetX: playerHealthOffsetX.current,
                time: time.current,
                gameOver: gameOver.current,
                winner: winner.current
            }

            props.sendGameState(gameState.current);


            count.current++;

            player.currentStatus.takeHit = false;
            enemy.currentStatus.takeHit = false;



            // if player misses
            if (enemy.currentStatus.isAttacking && enemy.framesCurrent === 3) {
                enemy.currentStatus.isAttacking = false;
            }

            // if player misses
            if (player.currentStatus.isAttacking && player.framesCurrent === 3) {
                player.currentStatus.isAttacking = false;
            }

        }

    };



    return (
        <div>
            <div className="game-container">

                <div className="div1">
                    <p ref={timer} className="timer"> 180 </p>
                    <div> </div>
                </div>

                <div ref={gameOverText} className="game-over-text"> Tie </div>
                <Canvas draw={draw} establishContext={establishContext} w="854px" h="480px" />
            </div>
        </div>

    )
};

export default FightingGameHost;
