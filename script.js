document.addEventListener("DOMContentLoaded", () => {
    
    /* =========================================
       1. СЛАЙДЕР З FADE-ЕФЕКТОМ
    ========================================= */
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const dots = document.querySelectorAll('.dot');
    
    let currentSlide = 0;
    const slideInterval = 4000; // 4 секунди згідно з ТЗ
    let sliderTimer;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (index + slides.length) % slides.length; 
        
        if(slides[currentSlide]) slides[currentSlide].classList.add('active');
        if(dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }
    function startSlider() { sliderTimer = setInterval(nextSlide, slideInterval); }
    function resetSlider() { clearInterval(sliderTimer); startSlider(); }

    if(slides.length > 0) {
        if(nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetSlider(); });
        if(prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetSlider(); });
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                showSlide(index);
                resetSlider();
            });
        });
        startSlider();
    }

    /* =========================================
       2. МОДАЛЬНЕ ВІКНО (ЗВОРОТНИЙ ЗВ'ЯЗОК)
    ========================================= */
    const feedbackBtn = document.querySelector('.feedback-btn');
    const overlay = document.querySelector('.overlay');
    const modal = document.querySelector('.feedback-modal');
    const closeBtn = document.querySelector('.close-btn');

    function openModal(e) {
        if(e) e.preventDefault();
        if(overlay) overlay.classList.add('show');
        if(modal) modal.classList.add('show');
    }

    function closeModal() {
        if(overlay) overlay.classList.remove('show');
        if(modal) modal.classList.remove('show');
    }

    if(feedbackBtn) feedbackBtn.addEventListener('click', openModal);
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(overlay) overlay.addEventListener('click', closeModal);
    /* --- ВАЛІДАЦІЯ ФОРМИ --- */
    const feedbackForm = document.querySelector('.form-content');
    
    if (feedbackForm) {
        // Обробка натискання кнопки "Надіслати"
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Зупиняємо стандартне відправлення форми

            let isValid = true;
            const requiredInputs = feedbackForm.querySelectorAll('[required]');

            // Перевіряємо кожне обов'язкове поле
            requiredInputs.forEach(input => {
                const group = input.closest('.input-group');
                if (!input.value.trim()) {
                    // Якщо поле порожнє - додаємо клас помилки
                    group.classList.add('error');
                    isValid = false;
                } else {
                    // Якщо заповнене - прибираємо
                    group.classList.remove('error');
                }
            });

            // Якщо всі поля заповнені успішно
            if (isValid) {
                alert('Дякуємо! Ваше повідомлення успішно надіслано.');
                feedbackForm.reset(); // Очищаємо форму
                closeModal(); // Закриваємо вікно
            }
        });

        // Прибираємо червону підсвітку одразу, як користувач починає вводити текст
        const allInputs = feedbackForm.querySelectorAll('input, textarea');
        allInputs.forEach(input => {
            input.addEventListener('input', function() {
                const group = this.closest('.input-group');
                if (group.classList.contains('error')) {
                    group.classList.remove('error');
                }
            });
        });
    }

    /* =========================================
       3. ПАГІНАЦІЯ ТОВАРІВ
    ========================================= */
    const products = Array.from(document.querySelectorAll('.product-card'));
    const paginationContainer = document.getElementById('pagination');
    
    // Показувати по 2 товари на сторінку
    const itemsPerPage = 6; 
    const totalPages = Math.ceil(products.length / itemsPerPage);
    let currentPage = 1;

    function showPage(page) {
        currentPage = page;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Ховаємо або показуємо картки
        products.forEach((product, index) => {
            if (index >= start && index < end) {
                product.style.display = 'flex'; 
            } else {
                product.style.display = 'none'; 
            }
        });

        renderPagination();
    }

    function renderPagination() {
        if (!paginationContainer || totalPages <= 1) return; // Не малюємо, якщо товарів мало
        paginationContainer.innerHTML = ''; 

        // Стрілочка Вліво
        const prevPageBtn = document.createElement('a');
        prevPageBtn.href = '#';
        prevPageBtn.className = 'page-arrow';
        prevPageBtn.innerHTML = '&laquo;';
        prevPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) showPage(currentPage - 1);
        });
        if (currentPage === 1) prevPageBtn.style.visibility = 'hidden'; // Ховаємо на 1-й сторінці
        paginationContainer.appendChild(prevPageBtn);

        // Кнопки сторінок
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.addEventListener('click', () => showPage(i));
            paginationContainer.appendChild(btn);
        }

        // Стрілочка Вправо
        const nextPageBtn = document.createElement('a');
        nextPageBtn.href = '#';
        nextPageBtn.className = 'page-arrow';
        nextPageBtn.innerHTML = '&raquo;';
        nextPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) showPage(currentPage + 1);
        });
        if (currentPage === totalPages) nextPageBtn.style.visibility = 'hidden'; // Ховаємо на останній сторінці
        paginationContainer.appendChild(nextPageBtn);
    }

    // Запускаємо пагінацію, якщо є товари
    if (products.length > 0) {
        showPage(1);
    }
});