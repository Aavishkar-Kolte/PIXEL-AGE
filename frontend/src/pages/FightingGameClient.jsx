import React, { useState, useRef } from "react";
import { Canvas } from "../components/Canvas";
import { determineWinner } from "../game/Utils";
import { initGameObjects } from "../game/GameObjects";
import { drawAllElements } from "../game/DrawAllElements";
import { updateKnightSprite } from "../game/UpdateKnightSprite";


const FightingGameClient = (props) => {

    const [ctx, setCtx] = useState(null);

    const gameOverText = useRef(null);
    const timer = useRef(null);
    const gameOver = useRef(false);
    let time = useRef(180);

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

    const prevPlayerPosition = useRef({ x: player.position.x, y: player.position.y });
    const prevEnemyPosition = useRef({ x: enemy.position.x, y: enemy.position.y });


    const draw = () => {
        if (ctx) {

            let temp = props.getGameState();

            if (temp !== null) {
                gameState.current = temp;
            }

            time.current = gameState.current.time;
            gameOver.current = gameState.current.gameOver;
            currentStatus.current.isAttacking = gameState.current.player.currentStatus.isAttacking;

            player.currentStatus = gameState.current.player.currentStatus;
            player.currentSprite = gameState.current.player.currentSprite;
            player.health = gameState.current.player.health;

            if (prevPlayerPosition.current !== gameState.current.player.position) {
                player.position.y = gameState.current.player.position.y;
                player.position.x = 849 - gameState.current.player.position.x - player.width;
                player.velocity.y = gameState.current.player.velocity.y;
                player.velocity.x = gameState.current.player.velocity.x * -1;
            }

            player.dead = gameState.current.player.dead

            enemy.currentStatus = gameState.current.enemy.currentStatus;
            enemy.currentSprite = gameState.current.enemy.currentSprite;
            enemy.health = gameState.current.enemy.health;

            if (prevEnemyPosition.current !== gameState.current.enemy.position) {
                enemy.position.y = gameState.current.enemy.position.y;
                enemy.position.x = 849 - gameState.current.enemy.position.x - enemy.width;
                enemy.velocity.y = gameState.current.enemy.velocity.y;
                enemy.velocity.x = gameState.current.enemy.velocity.x * -1;
            }

            enemy.dead = gameState.current.enemy.dead
            enemyHealth.offset.x = gameState.current.enemyHealthOffsetX;

            if (time.current > 0) {
                if (timer.current) {
                    timer.current.innerHTML = time.current;
                }
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
            });

            if (time.current <= 0 || enemy.health <= 0 || player.health <= 0) {
                if (!gameOver.current) {
                    determineWinner(gameOverText, HandleKeyDown, HandleKeyUp, { player, playerName: playerName.current, enemy, enemyName: enemyName.current, time: time.current });
                    gameOver.current = true
                }
                return;
            }


            updateKnightSprite(player, enemy)



            if (player.currentStatus.takeHit) {
                player.switchSprite({ sprite: 'takeHit' });
                player.currentStatus.takeHit = false;
            }

            if (enemy.currentStatus.takeHit) {
                enemy.switchSprite({ sprite: 'takeHit' });
                enemy.currentStatus.takeHit = false;
            }

            if (enemy.currentStatus.isAttacking && enemy.framesCurrent === 3) {
                enemy.currentStatus.isAttacking = false;
            }

            // if player misses
            if (player.currentStatus.isAttacking && player.framesCurrent === 3) {
                player.currentStatus.isAttacking = false;
            }

            prevPlayerPosition.current = gameState.current.player.position;
            prevEnemyPosition.current = gameState.current.enemy.position;
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
