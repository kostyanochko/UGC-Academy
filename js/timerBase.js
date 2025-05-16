export class TimerBase {
    constructor({ tick, ended }) {
      this.tick = tick;
      this.ended = ended;
      this.storageKey = 'ugc_academy_timer_data';
      this.durationDays = 3; // Таймер на 3 дня
      
      // Привязка методов
      this.updateTimerValues = this.updateTimerValues.bind(this);
      this.cleanup = this.cleanup.bind(this);
      this.pluralizeDays = this.pluralizeDays.bind(this);
  
      // Инициализация времени
      const savedData = localStorage.getItem(this.storageKey);
      
      if (savedData) {
        const { endTime } = JSON.parse(savedData);
        this.timeLeft = endTime - Date.now();
      } else {
        // Устанавливаем таймер на 3 дня (72 часа)
        const endTime = Date.now() + (this.durationDays * 24 * 60 * 60 * 1000);
        this.timeLeft = endTime - Date.now();
        localStorage.setItem(this.storageKey, JSON.stringify({ endTime }));
      }
  
      this.interval = null;
      this.timerValues = {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0
      };
    }
  
    // Плюрализация для испанского языка
    pluralizeDays(count) {
      if (!count) return '';
      
      return count === 1 ? 'día' : 'días';
    }
  
    updateTimerValues(timeLeft) {
      const seconds = Math.floor((timeLeft / 1000) % 60);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  
      this.timerValues = { seconds, minutes, hours, days };
    }
  
    init() {
      if (this.timeLeft <= 0) {
        this.cleanup();
        return;
      }
  
      this.updateTimerValues(this.timeLeft);
      this.interval = setInterval(() => {
        this.timeLeft -= 1000;
        if (this.timeLeft <= 0) {
          this.cleanup();
        } else {
          this.updateTimerValues(this.timeLeft);
          this.tick(this.timer);
        }
      }, 1000);
    }
  
    cleanup() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      localStorage.removeItem(this.storageKey);
      if (typeof this.ended === 'function') {
        this.ended();
      }
    }
  
    destroy() {
      this.cleanup();
    }
  
    get timer() {
      const { days, hours, minutes, seconds } = this.timerValues;
      
      return {
        days,
        daysWord: this.pluralizeDays(days),
        hours: hours >= 10 ? hours : `0${hours}`,
        minutes: minutes >= 10 ? minutes : `0${minutes}`,
        seconds: seconds >= 10 ? seconds : `0${seconds}`
      };
    }
  }