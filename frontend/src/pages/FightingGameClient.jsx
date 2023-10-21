import React, { useState, useRef, useEffect, useMemo } from "react";
import Canvas from "../components/Canvas";

import { Sprite } from "../game-js/Sprite";
import { Fighter } from "../game-js/Fighter";
import { determineWinnerClientSide } from "../game-js/Utils";

const FightingGameClient = (props) => {

    const [ctx, setCtx] = useState(null);
    const gameOverText = useRef(null);
    const timer = useRef(null);
    const gameOver = useRef(false);
    const playerName = useRef(props.getPlayerName())
    const enemyName = useRef(props.getEnemyName())



    let time = useRef(180);
    const establishContext = (context) => {
        setCtx(context);
    };

    const playerHealthBar = new Sprite(ctx, {
        position: {
            x: 85,
            y: 34
        },
        imageSrc: '../img/bar.png',
        scale: 2.6,
        framesMax: 1
    });

    const enemyHealthBar = new Sprite(ctx, {
        position: {
            x: 460,
            y: 34
        },
        imageSrc: '../img/bar.png',
        scale: 2.6,
        framesMax: 1
    });

    const playerHealthBarBG = new Sprite(ctx, {
        position: {
            x: 110,
            y: 41
        },
        imageSrc: '../img/bar_background.png',
        scale: 2.6,
        framesMax: 1
    });

    const enemyHealthBarBG = new Sprite(ctx, {
        position: {
            x: 490,
            y: 41
        },
        imageSrc: '../img/bar_background.png',
        scale: 2.6,
        framesMax: 1
    });

    const playerHealth = new Sprite(ctx, {
        position: {
            x: 110,
            y: 42
        },
        imageSrc: '../img/health_bar_flipped.png',
        scale: 2.6,
        framesMax: 1
    });

    const enemyHealth = new Sprite(ctx, {
        position: {
            x: 482,
            y: 42
        },
        imageSrc: '../img/health_bar.png',
        scale: 2.6,
        framesMax: 1
    });

    const playerWeaponIcon = new Sprite(ctx, {
        position: {
            x: 25,
            y: 15
        },
        imageSrc: '../img/weapon_icon_flipped.png',
        scale: 1.3,
        framesMax: 1
    });

    const enemyWeaponIcon = new Sprite(ctx, {
        position: {
            x: 754,
            y: 15
        },
        imageSrc: '../img/weapon_icon.png',
        scale: 1.3,
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





    let player = new Fighter(ctx, {
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





    let enemy = new Fighter(ctx, {
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


    const currentStatus = useRef({
        lastMove: '',
        isMovingForward: false,
        isMovingBackward: false,
        isJumping: false,
        isAttacking: false,
        isDefending: false
    })


    function HandleKeyDown(event) {
        if (event.repeat) return;

        if (!player.dead) {
            switch (event.key) {
                case 'd':
                    currentStatus.current.isMovingForward = true
                    currentStatus.current.lastMove = 'forward';
                    props.sendClientState(currentStatus.current);
                    break;
                case 'a':
                    currentStatus.current.isMovingBackward = true;
                    currentStatus.current.lastMove = 'backward';
                    props.sendClientState(currentStatus.current);
                    break;
                case 'w':
                    if (!currentStatus.current.isDefending)
                        currentStatus.current.isJumping = true;
                    props.sendClientState(currentStatus.current);
                    currentStatus.current.isJumping = false;
                    break;
                case ' ':
                    currentStatus.current.isAttacking = true;
                    props.sendClientState(currentStatus.current);
                    currentStatus.current.isAttacking = false;
                    break;
                case 'k':
                    currentStatus.current.isDefending = true;
                    props.sendClientState(currentStatus.current);
                    break;
            }
        }
    }

    function HandleKeyUp(event) {
        if (event.repeat) return;

        switch (event.key) {
            case 'd':
                currentStatus.current.isMovingForward = false;
                props.sendClientState(currentStatus.current);
                break;
            case 'a':
                currentStatus.current.isMovingBackward = false;
                props.sendClientState(currentStatus.current);
                break;
            case 'k':
                currentStatus.current.isDefending = false;
                props.sendClientState(currentStatus.current);
                break;
        }
    }

    window.addEventListener('keydown', HandleKeyDown);
    window.addEventListener('keyup', HandleKeyUp);

    const flag = useRef(0);




    const gameState = useRef({
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
        time: time.current,
        gameOver: gameOver.current,
        winner: 'dummy'
    });



    const draw = () => {
        if (ctx) {

            let temp = props.getGameState();
            if (temp !== null) {
                gameState.current = temp;
            }
            // console.log(gameState.current)

            time.current = gameState.current.time;
            gameOver.current = gameState.current.gameOver;

            player.currentStatus = gameState.current.player.currentStatus;
            player.currentSprite = gameState.current.player.currentSprite;
            player.health = gameState.current.player.health;
            player.position.y = gameState.current.player.position.y;
            player.position.x = 849 - gameState.current.player.position.x - player.width;
            player.velocity.y = gameState.current.player.velocity.y;
            player.velocity.x = gameState.current.player.velocity.x * -1;
            player.dead = gameState.current.player.dead


            enemy.currentStatus = gameState.current.enemy.currentStatus;
            enemy.currentSprite = gameState.current.enemy.currentSprite;
            enemy.health = gameState.current.enemy.health;
            enemy.position.y = gameState.current.enemy.position.y;
            enemy.position.x = 849 - gameState.current.enemy.position.x - enemy.width;
            enemy.velocity.y = gameState.current.enemy.velocity.y;
            enemy.velocity.x = gameState.current.enemy.velocity.x * -1;
            enemy.dead = gameState.current.enemy.dead
            enemyHealth.offset.x = gameState.current.enemyHealthOffsetX;



            if (time.current > 0) {
                if (timer.current) {
                    timer.current.innerHTML = time.current;
                }
            }


            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            background.update();
            torch1.update();
            torch2.update();
            tallCandle.update()

            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);




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

            ctx.font = "24px VT323";
            ctx.fillStyle = "white"; 
            ctx.fillText(playerName.current, 100, 30);
            
            ctx.font = "24px VT323"; 
            ctx.fillStyle = "white"; 
            ctx.fillText(enemyName.current, 854-ctx.measureText(enemyName.current).width-104, 30);

            if (gameOver.current === true) {
                if (flag.current < 10) {
                    determineWinnerClientSide(gameOverText, HandleKeyDown, HandleKeyUp, { player, playerName: playerName.current, enemy, enemyName: enemyName.current, winner: gameState.current.winner });
                    flag.current++;
                }
                return;
            }



            // Enemy movement
            if (enemy.currentStatus.isMovingForward && enemy.currentStatus.lastMove === 'forward' && enemy.position.x > 20) {
                if (enemy.currentStatus.isDefending) {
                    enemy.velocity.x = -2;
                } else {
                    enemy.velocity.x = -5;
                    enemy.switchSprite('run');
                }
            } else if (enemy.currentStatus.isMovingBackward && enemy.currentStatus.lastMove === 'backward' && enemy.position.x < 795) {
                if (enemy.currentStatus.isDefending) {
                    enemy.velocity.x = 2
                } else {
                    enemy.velocity.x = 5;
                    enemy.switchSprite('run');
                }
            }

            if (enemy.currentStatus.isJumping) {
                enemy.velocity.y = -15;
                enemy.currentStatus.isJumping = false;
            }

            // jumping
            if (enemy.velocity.y < 0) {
                enemy.switchSprite('jump');
            } else if (enemy.velocity.y > 0) {
                enemy.switchSprite('fall');
            }

            if (enemy.position.y <= 105 && !(enemy.velocity.y > 0)) {
                enemy.velocity.y = 0
            }

            if (enemy.currentStatus.isAttacking === false && enemy.velocity.y === 0 && enemy.velocity.x === 0 && !enemy.currentStatus.isJumping) {
                enemy.switchSprite('idle');
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
                    player.switchSprite('run');
                }
            } else if (player.currentStatus.isMovingForward && player.currentStatus.lastMove === 'forward' && player.position.x < 780) {
                if (player.currentStatus.isDefending) {
                    player.velocity.x = 2;
                } else {
                    player.velocity.x = 5;
                    player.switchSprite('run');
                }
            }

            if (player.currentStatus.isJumping) {
                player.velocity.y = -15;
                player.currentStatus.isJumping = false;
            }

            // jumping
            if (player.velocity.y < 0) {
                player.switchSprite('jump');
            } else if (player.velocity.y > 0) {
                player.switchSprite('fall');
            }

            if (player.position.y <= 105 && !(player.velocity.y > 0)) {
                player.velocity.y = 0
            }

            if (player.currentStatus.isAttacking === false && player.velocity.y === 0 && player.velocity.x === 0 && !player.currentStatus.isJumping) {
                player.switchSprite('idle');
            }

            if (player.velocity.y === 0) {
                player.currentStatus.isJumping = false;
            }







            if (enemy.currentStatus.isDefending) {
                enemy.switchSprite('defend')
                if (enemy.velocity.y < 0) enemy.velocity.y = 0;
            }

            if (player.currentStatus.isDefending) {
                player.switchSprite('defend')
                if (player.velocity.y < 0) player.velocity.y = 0;
            }



            if (player.currentStatus.isAttacking) {
                player.attack();
            }

            if (enemy.currentStatus.isAttacking) {
                enemy.attack();
            }




            if (player.currentStatus.takeHit) {
                player.switchSprite('takeHit');
                player.currentStatus.takeHit = false;
            }

            if (enemy.currentStatus.takeHit) {
                enemy.switchSprite('takeHit');
                enemy.currentStatus.takeHit = false;
            }




            if (enemy.currentStatus.isAttacking && enemy.framesCurrent === 3) {
                enemy.currentStatus.isAttacking = false;
            }

            // if player misses
            if (player.currentStatus.isAttacking && player.framesCurrent === 3) {
                player.currentStatus.isAttacking = false;
            }

            console.log("End")


        };
    }

    return (
        <div className="game-container">
            <div>
                <div className="div1">

                    <p ref={timer} className="timer"> 180 </p>
                    <div></div>

                </div>

                <div ref={gameOverText} className="game-over-text"> Tie </div>
                <Canvas draw={draw} establishContext={establishContext} w="854px" h="480px" />

            </div>
        </div>
    )
};

export default FightingGameClient;
