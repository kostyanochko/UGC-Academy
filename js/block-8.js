const accordionInit = () => {
    const details = document.querySelectorAll('details.ui-spoiler');
  
    details.forEach(detail => {
      const summary = detail.querySelector('summary');
      const contentWrapper = detail.querySelector('.ui-spoiler__content-wrapper');
  
      // Инициализация при загрузке
      if (detail.hasAttribute('open') && contentWrapper) {
        contentWrapper.style.maxHeight = 'none';
      }
  
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Переключаем текущий аккордеон
        if (detail.open) {
          if (contentWrapper) {
            contentWrapper.style.maxHeight = '0';
          }
          setTimeout(() => detail.removeAttribute('open'), 300);
        } else {
          detail.setAttribute('open', '');
          
          if (contentWrapper) {
            // Временно показываем для вычисления высоты
            contentWrapper.style.maxHeight = 'none';
            const contentHeight = contentWrapper.scrollHeight;
            contentWrapper.style.maxHeight = '0';
            
            // Запускаем анимацию
            requestAnimationFrame(() => {
              contentWrapper.style.maxHeight = `${contentHeight}px`;
            });
          }
        }
      });
    });
  };
  
  document.addEventListener('DOMContentLoaded', accordionInit);