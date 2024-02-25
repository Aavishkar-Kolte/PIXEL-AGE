
export const updateKnightSprite = (player, enemy) => {

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
}