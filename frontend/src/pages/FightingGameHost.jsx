import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas } from "../components/Canvas";
import { initGameObjects } from "../game/GameObjects";
import { rectangularCollision, determineWinner } from "../game/Utils";
import { decreaseTimer } from "../utils/Timer";
import { drawAllElements } from "../game/DrawAllElements";
import { updateKnightSprite } from "../game/UpdateKnightSprite";

const FightingGameHost = (props) => {

    const [ctx, setCtx] = useState(null);

    const gameOverText = useRef(null);
    const timer = useRef(null);
    const gameOver = useRef(false);
    const winner = useRef(null);
    let time = useRef(180);
    let timerId = useRef()

    let tempStr = props.getPlayerName();
    const playerName = useRef(tempStr.charAt(0).toUpperCase() + tempStr.slice(1).toLowerCase())
    tempStr = props.getEnemyName();
    const enemyName = useRef(tempStr.charAt(0).toUpperCase() + tempStr.slice(1).toLowerCase())


    const establishContext = (context) => {
        setCtx(context);
    };

    const {
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
    } = initGameObjects(ctx);


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


    useEffect(() => {
        decreaseTimer(time, timerId, timer, gameOver);
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


    const draw = () => {
        if (ctx) {

            let temp = props.getClientState();

            if (temp !== null) {
                enemy.currentStatus = temp;
            }

            drawAllElements({
                ctx,
                background,
                torch1,
                torch2,
                tallCandle,
                playerHealthBarBG,
                enemyHealthBarBG,
                playerWeaponIcon,
                enemyWeaponIcon,
                playerHealth,
                enemyHealth,
                playerHealthBar,
                enemyHealthBar,
                player,
                enemy,
                playerName,
                enemyName,
                gameOver
            })




            player.velocity.x = 0;
            enemy.velocity.x = 0;


            if (time.current <= 0 || enemy.health <= 0 || player.health <= 0) {
                if (!gameOver.current) {
                    winner.current = determineWinner(gameOverText, HandleKeyDown, HandleKeyUp, { player, playerName: playerName.current, enemy, enemyName: enemyName.current, timerId: timerId.current, time: time.current });
                    gameOver.current = true
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


            updateKnightSprite(player, enemy);


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
