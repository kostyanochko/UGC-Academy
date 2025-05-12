document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.querySelector('.submit__bar');
    const formSection = document.querySelector('.application-form');
    const button = document.querySelector('.submit__button');

    // Плавный скролл к форме
    button.addEventListener('click', (e) => {
        e.preventDefault();
        formSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

    // Отслеживание видимости формы
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                submitButton.style.transform = 'translateY(100%)';
            } else {
                submitButton.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.5
    });

    observer.observe(formSection);

    // Проверка при загрузке страницы
    const rect = formSection.getBoundingClientRect();
    if(rect.top < window.innerHeight) {
        submitButton.style.transform = 'translateY(100%)';
    }
});