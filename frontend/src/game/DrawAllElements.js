// Function to draw all elements on the canvas
export const drawAllElements = ({
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
}) => {
    // Clear the canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Update and draw background elements
    background.update();
    torch1.update();
    torch2.update();
    tallCandle.update();

    // Update and draw health bar backgrounds
    playerHealthBarBG.update();
    enemyHealthBarBG.update();

    // Update and draw weapon icons
    playerWeaponIcon.update();
    enemyWeaponIcon.update();

    // Draw player health bar based on current health
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

    // Draw enemy health bar based on current health
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

    // Update and draw health bars
    playerHealthBar.update();
    enemyHealthBar.update();

    // Draw player name
    ctx.font = "26px Papyrus";
    ctx.fillStyle = "white";
    ctx.fillText(playerName.current, 115, 31);

    // Draw enemy name
    ctx.fillStyle = "white";
    ctx.fillText(enemyName.current, 854 - ctx.measureText(enemyName.current).width - 114, 31);

    // Draw enemy if game is not over or enemy is in idle or death state
    if (gameOver.current === false || enemy.currentSprite === "idle" || enemy.currentSprite === "death") {
        enemy.update();
    }

    // Draw player if game is not over or player is in idle or death state
    if (gameOver.current === false || player.currentSprite === "idle" || player.currentSprite === "death") {
        player.update();
    }
}
