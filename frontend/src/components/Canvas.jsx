import React, { useRef, useEffect, useState, useCallback } from "react";

export const Canvas = (props) => {
    const { draw, establishContext, establishCanvasWidth, w, h } = props;
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);

    // Function to resize the canvas based on the window size
    const resizeCanvas = useCallback((context) => {
        const canvas = context.canvas;
        const { width, height } = canvas.getBoundingClientRect();

        if (canvas.width !== w || canvas.height !== h) {
            const { devicePixelRatio: ratio = 1 } = window;
            canvas.width = height * ratio;
            canvas.height = width * ratio;
            if (establishCanvasWidth) {
                establishCanvasWidth(canvas.width);
            }
            context.scale(ratio, ratio);
            return true;
        }
        return false;
    }, [establishCanvasWidth, h, w]);

    useEffect(() => {
        // Check if the canvas reference is not null
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            setContext(ctx);
            canvas.width = 854 * 0.8;
            canvas.height = 480 * 0.8;
            ctx.scale(0.8, 0.8);
            if (establishContext) {
                establishContext(ctx);
            }
        }
    }, [establishContext]);

    useEffect(() => {
        let animationFrameId;

        // Check if the context is not null
        if (context) {
            // Render function to continuously draw on the canvas
            const render = () => {
                draw();
                animationFrameId = window.requestAnimationFrame(render);
            };
            render();
        }

        // Cleanup function to cancel the animation frame no exiting the component
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [draw, context, resizeCanvas]);

    return <canvas ref={canvasRef} style={{ backgroundColor: "#000" }} />;
};