export class Sprite {
    constructor(ctx, {
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 }
    }) {

        this.ctx = ctx;
        this.position = position;
        this.width = 55;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;

        this.image.onload = () => {
            // The image has fully loaded, you can now safely proceed
            this.isImageLoaded = true;
        };

        this.image.onerror = function (e) {
            console.error("error", e);
        };

    }

    draw() {
        if (this.isImageLoaded) { // Check if the image is loaded
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

        if (this.framesElapsed % this.framesHold === 0) {
            this.framesCurrent = (this.framesCurrent + 1) % this.framesMax;
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}
