export const timer = (time, timerId, timerSpan, setCancelFlag, cancelFlag) => {
    if (time.current >= 0) {
        timerId.current = setTimeout(() => {
            time.current++;
            if (timerSpan.current) {
                timerSpan.current.innerHTML = Math.floor(time.current / 60) + ":" + (time.current % 60 < 10 ? '0' : '') + (time.current % 60);
            }
            if (time.current > 120 && !cancelFlag) {
                setCancelFlag(true);
            }
            timer(time, timerId, timerSpan, setCancelFlag, cancelFlag);
        }, 1000);
    }
    else {
        return;
    }
}


export const decreaseTimer = (time, timerId, timer, gameOver) => {
    if (time.current > 0 && gameOver.current === false) {
        timerId.current = setTimeout(() => {
            time.current--;
            if (timer.current) {
                timer.current.innerHTML = time.current;
            }
            decreaseTimer(time, timerId, timer, gameOver);
        }, 1000);
    }
    else {
        return;
    }
}