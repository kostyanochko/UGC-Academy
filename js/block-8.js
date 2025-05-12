document.querySelectorAll('.ui-spoiler').forEach(spoiler => {
    const summary = spoiler.querySelector('summary');
    const contentWrapper = spoiler.querySelector('.ui-spoiler__content-wrapper');
    
    // Проверка наличия элементов
    if (!summary || !contentWrapper) return;

    // Инициализация
    spoiler.style.height = `${summary.offsetHeight}px`;

    summary.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (spoiler.open) {
            // Анимация закрытия (300ms)
            spoiler.classList.add('closing');
            contentWrapper.style.maxHeight = '0';
            contentWrapper.style.opacity = '0';
            await new Promise(r => setTimeout(r, 300));
            spoiler.style.height = `${summary.offsetHeight}px`;
            spoiler.removeAttribute('open');
            spoiler.classList.remove('closing');
        } else {
            // Анимация открытия (500ms)
            spoiler.setAttribute('open', '');
            const contentHeight = contentWrapper.scrollHeight;
            spoiler.style.height = `${summary.offsetHeight + contentHeight}px`;
            contentWrapper.style.maxHeight = `${contentHeight}px`;
            contentWrapper.style.opacity = '1';
            await new Promise(r => setTimeout(r, 500));
        }
    });
});