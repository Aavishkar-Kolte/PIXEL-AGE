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

export function determineWinner(gameOverRef, HandleKeyDown, HandleKeyUp, { player, playerName, enemy, enemyName, timerId }) {
    clearTimeout(timerId);
    window.removeEventListener('keydown', HandleKeyDown);
    window.removeEventListener('keyup', HandleKeyUp);
    player.velocity.x = 0;
    enemy.velocity.x = 0;
    gameOverRef.current.style.display = 'flex';
    console.log(playerName, " - ", enemyName)
    if (player.health === enemy.health) {
        gameOverRef.current.innerHTML = 'Tie';

        player.currentSprite = 'idle'
        enemy.currentSprite = 'idle'

        player.image = player.sprites.idle.image
        player.framesMax = player.sprites.idle.framesMax
        player.framesCurrent = 0
        player.currentSprite = 'idle'

        enemy.image = enemy.sprites.idle.image
        enemy.framesMax = enemy.sprites.idle.framesMax
        enemy.framesCurrent = 0
        enemy.currentSprite = 'idle'

        return "Tie";

    } else if (player.health > enemy.health) {
        gameOverRef.current.innerHTML = playerName + " wins";
        player.currentSprite = 'idle'
        enemy.currentSprite = 'death'
        enemy.switchSprite('death');
        player.image = player.sprites.idle.image
        player.framesMax = player.sprites.idle.framesMax
        player.framesCurrent = 0
        player.currentSprite = 'idle'
        enemy.dead = true;
        return playerName;

    } else if (player.health < enemy.health) {
        gameOverRef.current.innerHTML = enemyName + " wins";
        player.currentSprite = 'death';
        enemy.currentSprite = 'idle';
        player.switchSprite('death');
        enemy.switchSprite('idle')
        enemy.image = enemy.sprites.idle.image
        enemy.framesMax = enemy.sprites.idle.framesMax
        enemy.framesCurrent = 0
        enemy.currentSprite = 'idle'
        player.dead = true;
        return enemyName;
    }
}



export function determineWinnerClientSide(gameOverRef, HandleKeyDown, HandleKeyUp, { player, enemy, winner, playerName, enemyName }) {
    window.removeEventListener('keydown', HandleKeyDown);
    window.removeEventListener('keyup', HandleKeyUp);
    player.velocity.x = 0;
    enemy.velocity.x = 0;
    console.log("Seeting flex")
    gameOverRef.current.style.display = 'flex';
    
    console.log(playerName, " - ", enemyName)

    switch (winner) {
        case "Tie":
            gameOverRef.current.innerHTML = 'Tie';

            player.currentSprite = 'idle'
            enemy.currentSprite = 'idle'

            player.image = player.sprites.idle.image
            player.framesMax = player.sprites.idle.framesMax
            player.framesCurrent = 0
            player.currentSprite = 'idle'

            enemy.image = enemy.sprites.idle.image
            enemy.framesMax = enemy.sprites.idle.framesMax
            enemy.framesCurrent = 0
            enemy.currentSprite = 'idle'
            console.log("Tie")
            break;
        case playerName:
            gameOverRef.current.innerHTML = playerName + " wins";
            player.currentSprite = 'idle'
            enemy.currentSprite = 'death'
            enemy.switchSprite('death');
            player.image = player.sprites.idle.image
            player.framesMax = player.sprites.idle.framesMax
            player.framesCurrent = 0
            player.currentSprite = 'idle'
            enemy.dead = true;
            console.log(playerName)

            break;
        case enemyName:
            gameOverRef.current.innerHTML = enemyName + " wins";
            player.currentSprite = 'death';
            enemy.currentSprite = 'idle';
            player.switchSprite('death');
            enemy.switchSprite('idle')
            enemy.image = enemy.sprites.idle.image
            enemy.framesMax = enemy.sprites.idle.framesMax
            enemy.framesCurrent = 0
            enemy.currentSprite = 'idle'
            player.dead = true;
            console.log(enemyName)
            break;

        default:
            console.log("default")
            break;
    }

}
