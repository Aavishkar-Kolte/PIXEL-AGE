// Function to start the timer
export const timer = (time, timerId, timerSpan, setCancelFlag, cancelFlag) => {
    if (time.current >= 0) {
        // Increment the time by 1 second
        timerId.current = setTimeout(() => {
            time.current++;

            // Update the value of the html span element
            if (timerSpan.current) {
                timerSpan.current.innerHTML = Math.floor(time.current / 60) + ":" + (time.current % 60 < 10 ? '0' : '') + (time.current % 60);
            }

            // Check if the time has exceeded 2 minutes and set the cancel flag
            if (time.current > 120 && !cancelFlag) {
                setCancelFlag(true);
            }

            // Recursive call to continue the timer
            timer(time, timerId, timerSpan, setCancelFlag, cancelFlag);
        }, 1000);
    } else {
        return;
    }
}

// Function to decrease the timer
export const decreaseTimer = (time, timerId, timer, gameOver) => {
    if (time.current > 0 && gameOver.current === false) {
        // Decrement the time by 1 second
        timerId.current = setTimeout(() => {
            time.current--;

            // Update the value of the html span element
            if (timer.current) {
                timer.current.innerHTML = time.current;
            }

            // Recursive call to continue decreasing the timer
            decreaseTimer(time, timerId, timer, gameOver);
        }, 1000);
    } else {
        return;
    }
}