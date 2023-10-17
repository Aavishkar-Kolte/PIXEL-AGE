export function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

export function determineWinner(gameOverRef, HandleKeyDown, HandleKeyUp, { player, enemy, timerId, time }) {
    clearTimeout(timerId);
    window.removeEventListener('keydown', HandleKeyDown);
    window.removeEventListener('keyup', HandleKeyUp);
    player.velocity.x = 0;
    enemy.velocity.x = 0;
    gameOverRef.current.style.display = 'flex';
    if (player.health === enemy.health) {
        gameOverRef.current.innerHTML = 'Tie';
        player.currentSprite = 'idle'
        enemy.currentSprite = 'idle'
        player.switchSprite('idle')
        enemy.switchSprite('idle')
    } else if (player.health > enemy.health) {
        gameOverRef.current.innerHTML = 'Player 1 Wins';
        player.currentSprite = 'idle'
        enemy.currentSprite = 'death'
        enemy.switchSprite('death');
        player.switchSprite('idle')
        enemy.dead = true;
    } else if (player.health < enemy.health) {
        gameOverRef.current.innerHTML = 'Player 2 Wins';
        player.currentSprite = 'death';
        enemy.currentSprite = 'idle';
        player.switchSprite('death');
        enemy.switchSprite('idle')
        player.dead = true;
    }
}
