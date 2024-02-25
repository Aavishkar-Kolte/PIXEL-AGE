// Define a Sprite class
export class Sprite {
    constructor(ctx, {
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 }
    }) {
        this.ctx = ctx; // Store the rendering context
        this.position = position; // Store the position of the sprite
        this.width = 55; // Set the default width of the sprite
        this.height = 150; // Set the default height of the sprite
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5; // Set the number of frames to hold before changing to the next frame
        this.offset = offset; // Set the offset of the sprite

        // Set a callback function to execute when the image is loaded
        this.image.onload = () => {
            this.isImageLoaded = true; // Set the flag to indicate that the image is loaded
        };

        // Set a callback function to execute when there is an error loading the image
        this.image.onerror = function (e) {
            console.error("error", e); // Log the error to the console
        };
    }

    // Draw the sprite on the canvas
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

    // Animate the frames of the sprite
    animateFrames() {
        this.framesElapsed++; // Increment the elapsed frames

        if (this.framesElapsed % this.framesHold === 0) { // Check if it's time to change to the next frame
            this.framesCurrent = (this.framesCurrent + 1) % this.framesMax; // Update the current frame
        }
    }


    update() {
        this.draw(); // Draw the sprite
        this.animateFrames(); // Animate the frames
    }
}
