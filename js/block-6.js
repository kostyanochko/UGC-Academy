document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.block-6__card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const item = this.closest('.block-6__item');
            if (!item) return;
            
            const wasActive = item.classList.contains('block-6__item--activate');
            
            // Закрываем все элементы
            document.querySelectorAll('.block-6__item--activate').forEach(activeItem => {
                activeItem.classList.remove('block-6__item--activate');
            });
            
            // Открываем текущий, если он не был активен
            if (!wasActive) {
                item.classList.add('block-6__item--activate');
            }
        });
    });
});