import { Sprite } from "./Sprite"

const gravity = 0.75

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
        })

        this.velocity = velocity
        this.width = 55
        this.height = 130
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.sprites = sprites
        this.currentSprite = 'idle'
        this.currentStatus = {
            lastMove: '',
            isMovingForward: false,
            isMovingBackward: false,
            isJumping: false,
            isAttacking: false,
            isDefending: false
        }

        this.dead = false

        // this.isJumping = false;
        // this.isDefending = false;
        // this.isAttacking = false
        // this.lastkey = '';

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    draw() {

        if (this.isImageLoaded) { 
            this.ctx.drawImage(
                this.image,
                this.framesCurrent * (this.image.width / this.framesMax),
                0,
                this.image.width / this.framesMax,
                this.image.height,
                this.position.x - this.offset.x,
                this.position.y - this.offset.y,
                (this.image.width / this.framesMax) * this.scale,
                this.image.height * this.scale
            );
        }
    }

    animateFrames() {
        this.framesElapsed++;

        if (this.framesElapsed % this.sprites[this.currentSprite].framesHold === 0) {

            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else if (!this.isJumping ) {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw()
        if (!(this.dead && this.framesCurrent === 5)) this.animateFrames()

        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y


        this.ctx.fillStyle = "red"

        // // draw the attack box
        // this.ctx.fillRect(
        //   this.attackBox.position.x,
        //   this.attackBox.position.y,
        //   this.attackBox.width,
        //   this.attackBox.height
        // )

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // gravity function
        if (this.position.y + this.height + this.velocity.y >= this.ctx.canvas.height - 81) {
            this.velocity.y = 0
        } else this.velocity.y += gravity;
    }

    attack() {
        if (!this.currentStatus.isDefending) {
            this.switchSprite('attack1');
        }
    }

    takeHit() {
        if (this.currentStatus.isDefending) {
            this.health -= 2.5;
            if (this.health <= 0) {
                this.switchSprite('death');
            }
        } else {
            this.health -= 10;
            if (this.health <= 0) {
                this.switchSprite('death');
            } else this.switchSprite('takeHit')
        }



    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true
            return
        }

        if (
            this.image === this.sprites.death.image &&
            this.framesCurrent < this.sprites.death.framesMax - 1
        )
            return

        // overriding all other animations with the attack animation
        if (
            this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1
        )
            return

        // override when fighter gets hit
        if (
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        )
            return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                    this.currentSprite = 'idle'
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                    this.currentSprite = 'run'
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                    this.currentSprite = 'jump'
                }
                break

            case 'fall':
                if (this.image !== this.sprites.fall.image) {

                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                    this.currentSprite = 'fall'
                }
                break

            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                    this.currentSprite = 'attack1'

                }
                break

            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                    this.currentSprite = 'takeHit'
                }
                break

            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                    this.currentSprite = 'death'
                }
                break

            case 'defend':
                if (this.image !== this.sprites.defend.image) {
                    this.image = this.sprites.defend.image
                    this.framesMax = this.sprites.defend.framesMax
                    this.framesCurrent = 0
                    this.currentSprite = 'defend'
                }
                break
        }
    }
}