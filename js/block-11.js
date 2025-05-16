import { Timer } from './timer.js';

// Функция инициализации таймера
function initTimer() {
  const timerWrapper = document.querySelector('.block-11__timer');
  
  if (!timerWrapper) {
    console.warn('Элемент таймера не найден');
    return;
  }

  try {
    // Создаем экземпляр таймера
    new Timer({
      timerWrapper: timerWrapper,
      tickCallback: ({ days, daysWord, hours, minutes, seconds }) => {
        // Форматируем вывод на испанском
        let timeString = '';
        
        if (days > 0) {
          timeString = `${days} ${daysWord} `;
        }
        
        timeString += `${hours}:${minutes}:${seconds}`;
        
        // Обновляем элемент таймера
        timerWrapper.textContent = timeString;
        
        // Добавляем класс при завершении
        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
          timerWrapper.classList.add('timer-ended');
        }
      }
    });
    
  } catch (error) {
    console.error('Ошибка инициализации таймера:', error);
    timerWrapper.textContent = '--:--:--';
    timerWrapper.classList.add('timer-error');
  }
}

// Обработчик для страницы
function handlePageLoad() {
  // Проверяем поддержку модулей
  if (!('noModule' in HTMLScriptElement.prototype)) {
    document.querySelector('.block-11__timer').textContent = 
      'Tu navegador no soporta módulos JavaScript. Actualiza a una versión más reciente.';
    return;
  }

  // Инициализируем таймер
  initTimer();
  
  const style = document.createElement('style');
  style.textContent = `
    .timer-ended {
      color: #d9534f;
    }
    .timer-error {
      color: #f0ad4e;
    }
    `;
  document.head.appendChild(style);
}

// Запускаем при полной загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handlePageLoad);
} else {
  handlePageLoad();
}