import { TimerBase } from './timerBase.js';

export class Timer {
    constructor({ timerWrapper, tickCallback }) {
        this.timerWrapper = timerWrapper;
        this.timerBlock = this.timerWrapper?.querySelector('[data-type=timer]') ?? this.timerWrapper;

        if (!this.timerBlock) {
            console.error('Timer block element not found');
            return;
        }

        this.timer = new TimerBase({
            tick: (time) => {
                if (tickCallback) {
                    tickCallback(time);
                } else {
                    this.defaultTick(time);
                }
            },
            ended: () => this.handleTimerEnd()
        });

        this.timer.init();
    }

    defaultTick({ days, daysWord, hours, minutes, seconds }) {
        if (this.timerBlock) {
            this.timerBlock.innerHTML = `${days ? `${days} ${daysWord} ` : ''}${hours}:${minutes}:${seconds}`;
        }
    }

    handleTimerEnd() {
        if (this.timerBlock) {
            this.timerBlock.textContent = "00:00:00";
        }
        this.destroy();
    }

    destroy() {
        if (this.timer) {
            this.timer.destroy();
            this.timer = null;
        }
    }
}