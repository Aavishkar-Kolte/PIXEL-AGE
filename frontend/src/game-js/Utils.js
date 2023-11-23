export function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

export function determineWinner(gameOverRef, HandleKeyDown, HandleKeyUp, { player, playerName, enemy, enemyName, timerId }) {

    if (timerId) {
        clearTimeout(timerId);
    }

    window.removeEventListener('keydown', HandleKeyDown);
    window.removeEventListener('keyup', HandleKeyUp);

    player.velocity.x = 0;
    enemy.velocity.x = 0;
    gameOverRef.current.style.display = 'flex';


    if (player.health === enemy.health) {
        gameOverRef.current.innerHTML = 'Tie';
        player.switchSprite({ sprite: 'idle', gameOver: true });
        enemy.switchSprite({ sprite: 'idle', gameOver: true });
        return "Tie";

    } else if (player.health > enemy.health) {
        gameOverRef.current.innerHTML = playerName + " wins";
        player.switchSprite({ sprite: 'idle', gameOver: true });
        enemy.switchSprite({ sprite: 'death', gameOver: true });
        enemy.dead = true;
        return playerName;

    } else if (player.health < enemy.health) {
        gameOverRef.current.innerHTML = enemyName + " wins";
        player.switchSprite({ sprite: 'death', gameOver: true });
        enemy.switchSprite({ sprite: 'idle', gameOver: true });
        player.dead = true;
        return enemyName;
    }
}