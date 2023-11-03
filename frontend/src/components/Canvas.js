import React, { useRef, useEffect, useState } from "react";

const Canvas = (props) => {
    const { draw, fps = 30, establishContext, establishCanvasWidth, w , h , backgroundColor = '#000', ...rest } = props;
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);

    const resizeCanvas = (context) => {
        const canvas = context.canvas;
        const { width, height } = canvas.getBoundingClientRect();

        if (canvas.width !== w || canvas.height !== h) {
            const { devicePixelRatio: ratio = 1 } = window;
            canvas.width = height*ratio;
            canvas.height = width*ratio;
            if (establishCanvasWidth) {
                establishCanvasWidth(canvas.width);
            }
            context.scale(ratio, ratio);
            return true;
        }
        return false;
    };

    useEffect(() => {
        //i.e. value other than null or undefined
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            setContext(ctx);
            canvas.width = 854*0.8;
            canvas.height = 480*0.8;
            ctx.scale(0.8, 0.8);
            if (establishContext) {
                establishContext(ctx);
            }
            
        }
    }, []);

    useEffect(() => {
        let animationFrameId;

        // Check if null context has been replaced on component mount
        if (context) {
            //Our draw came here
            const render = () => {
                draw();
                animationFrameId = window.requestAnimationFrame(render);
            };
            render();
        }
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [draw, context, resizeCanvas]);
    
    return <canvas ref={canvasRef} style={{ backgroundColor: "#000" }} />;
};

export default Canvas;