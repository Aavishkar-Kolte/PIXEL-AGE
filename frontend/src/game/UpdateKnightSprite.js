export const updateKnightSprite = (player, enemy) => {

    // Enemy movement
    if (enemy.currentStatus.isMovingForward && enemy.currentStatus.lastMove === 'forward' && enemy.position.x > 20) {
        // Move enemy forward
        if (enemy.currentStatus.isDefending) {
            enemy.velocity.x = -2;
        } else {
            enemy.velocity.x = -5;
            if (!enemy.isAttacking)
                enemy.switchSprite({ sprite: 'run' });
        }
    } else if (enemy.currentStatus.isMovingBackward && enemy.currentStatus.lastMove === 'backward' && enemy.position.x < 795) {
        // Move enemy backward
        if (enemy.currentStatus.isDefending) {
            enemy.velocity.x = 2
        } else {
            enemy.velocity.x = 5;
            if (!enemy.isAttacking)
                enemy.switchSprite({ sprite: 'run' });
        }
    }

    if (enemy.currentStatus.isJumping) {
        // Make enemy jump
        enemy.velocity.y = -15;
        enemy.currentStatus.isJumping = false;
    }

    // Check enemy's vertical movement
    if (enemy.velocity.y < 0) {
        enemy.switchSprite({ sprite: 'jump' });
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite({ sprite: 'fall' });
    }

    if (enemy.position.y <= 105 && !(enemy.velocity.y > 0)) {
        // Stop enemy from falling through the ground
        enemy.velocity.y = 0
    }

    if (enemy.currentStatus.isAttacking === false && enemy.velocity.y === 0 && enemy.velocity.x === 0 && !enemy.currentStatus.isJumping) {
        // Set enemy to idle state
        enemy.switchSprite({ sprite: 'idle' });
    }

    if (enemy.velocity.y === 0) {
        enemy.currentStatus.isJumping = false;
    }

    // Player movement
    if (player.currentStatus.isMovingBackward && player.currentStatus.lastMove === 'backward' && player.position.x > 5) {
        // Move player backward
        if (player.currentStatus.isDefending) {
            player.velocity.x = -2;
        } else {
            player.velocity.x = -5;
            if (!player.isAttacking)
                player.switchSprite({ sprite: 'run' });
        }
    } else if (player.currentStatus.isMovingForward && player.currentStatus.lastMove === 'forward' && player.position.x < 780) {
        // Move player forward
        if (player.currentStatus.isDefending) {
            player.velocity.x = 2;
        } else {
            player.velocity.x = 5;
            if (!player.isAttacking)
                player.switchSprite({ sprite: 'run' });
        }
    }

    if (player.currentStatus.isJumping) {
        // Make player jump
        player.velocity.y = -15;
        player.currentStatus.isJumping = false;
    }

    // Check player's vertical movement
    if (player.velocity.y < 0) {
        player.switchSprite({ sprite: 'jump' });
    } else if (player.velocity.y > 0) {
        player.switchSprite({ sprite: 'fall' });
    }

    if (player.position.y <= 105 && !(player.velocity.y > 0)) {
        // Stop player from falling through the ground
        player.velocity.y = 0
    }

    if (player.currentStatus.isAttacking === false && player.velocity.y === 0 && player.velocity.x === 0 && !player.currentStatus.isJumping) {
        // Set player to idle state
        player.switchSprite({ sprite: 'idle' });
    }

    if (player.velocity.y === 0) {
        player.currentStatus.isJumping = false;
    }

    if (enemy.currentStatus.isDefending) {
        // Set enemy to defend state
        enemy.switchSprite({ sprite: 'defend' })
        if (enemy.velocity.y < 0) enemy.velocity.y = 0;
    }

    if (player.currentStatus.isDefending) {
        // Set player to defend state
        player.switchSprite({ sprite: 'defend' })
        if (player.velocity.y < 0) player.velocity.y = 0;
    }

    if (player.currentStatus.isAttacking) {
        // Player attacks
        player.attack();
    }

    if (enemy.currentStatus.isAttacking) {
        // Enemy attacks
        enemy.attack();
    }
}