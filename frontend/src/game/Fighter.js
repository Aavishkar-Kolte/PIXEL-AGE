import { Sprite } from "./Sprite";

const gravity = 0.75;

export class Fighter extends Sprite {
    constructor(ctx, {
        position,
        velocity,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super(ctx, {
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        });

        this.velocity = velocity;
        this.width = 55;
        this.height = 130;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        };
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.sprites = sprites;
        this.currentSprite = 'idle';
        this.currentStatus = {
            lastMove: '',
            isMovingForward: false,
            isMovingBackward: false,
            isJumping: false,
            isAttacking: false,
            isDefending: false,
            takeHit: false
        };
        this.dead = false;

        // Load sprite images
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    // Animate frames based on the current sprite
    animateFrames() {
        this.framesElapsed++;
        if (this.framesElapsed % this.sprites[this.currentSprite].framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else if (!this.isJumping || !this.dead) {
                this.framesCurrent = 0;
            }
        }
    }

    // Update the fighter's position, animation, and attack box
    update() {
        this.draw();
        if (!(this.dead && this.framesCurrent === 5)) {
            this.animateFrames();
        }

        // Update attack box position
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // Update fighter's position based on velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Apply gravity
        if (this.position.y + this.height + this.velocity.y >= this.ctx.canvas.height + 15) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }

    // Change to attack animation
    attack() {
        if (!this.currentStatus.isDefending) {
            this.switchSprite({ sprite: 'attack1' });
        }
    }

    // Function handle the fighter taking a hit
    takeHit() {
        if (this.currentStatus.isDefending) {
            this.health -= 2.5;
            if (this.health <= 0) {
                this.switchSprite({ sprite: 'death' });
            }
        } else {
            this.health -= 10;
            if (this.health <= 0) {
                this.switchSprite({ sprite: 'death' });
            } else {
                this.switchSprite({ sprite: 'takeHit' });
            }
        }
    }

    // Function switch to a different sprite animation
    switchSprite({ sprite, gameOver = false }) {
        // Override all other animations if the fighter is dead and already displaying the death animation
        if (this.dead && this.image === this.sprites.death.image) {
            return;
        }

        // Override all other animations with the attack animation
        if (!gameOver && (this.currentStatus.isAttacking || this.framesCurrent < this.framesMax - 1) && this.image === this.sprites.attack1.image) {
            return;
        }

        // Override when fighter gets hit
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1 && !this.dead) {
            return;
        }

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                    this.currentSprite = 'idle';
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                    this.currentSprite = 'run';
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                    this.currentSprite = 'jump';
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                    this.currentSprite = 'fall';
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                    this.currentSprite = 'attack1';
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                    this.currentSprite = 'takeHit';
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                    this.currentSprite = 'death';
                    this.dead = true;
                }
                break;
            case 'defend':
                if (this.image !== this.sprites.defend.image) {
                    this.image = this.sprites.defend.image;
                    this.framesMax = this.sprites.defend.framesMax;
                    this.framesCurrent = 0;
                    this.currentSprite = 'defend';
                }
                break;
            default:
                break;
        }
    }
}