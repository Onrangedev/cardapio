const dias = document.querySelectorAll('.dia-container');
const prevBtn = document.querySelector('.nav-btn.prev');
const nextBtn = document.querySelector('.nav-btn.next');
const indicators = document.querySelectorAll('.indicator');
const carouselInner = document.querySelector('.carousel-inner');
let activeIndex = 2; // Começa no terceiro dia (Quarta)

// Função para atualizar o carrossel
function updateCarousel() {
    // Atualizar os dias no carrossel
    dias.forEach((dia, index) => {
        dia.classList.remove('active');
        dia.style.opacity = 0.7; // Reiniciar opacidade
        dia.style.transform = 'scale(0.8)'; // Diminuir a escala

        if (index === activeIndex) {
            dia.classList.add('active');
            dia.style.opacity = 1; // Total para o ativo
            dia.style.transform = 'scale(1.3)'; // Aumentar a escala do ativo
        }
    });

    // Atualizar indicadores
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === activeIndex) {
            indicator.classList.add('active');
        }
    });

    // Atualizar a posição do carrossel
    const carouselWidth = carouselInner.offsetWidth; // Largura do container visível do carrossel
    const diaWidth = dias[0].offsetWidth; // Largura de cada dia
    const offset = -activeIndex * diaWidth + (carouselWidth - diaWidth) / 2;

    carouselInner.style.transform = `translateX(${offset}px)`;
}

// Funções de navegação
prevBtn.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + dias.length) % dias.length;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % dias.length;
    updateCarousel();
});

// Inicializar o carrossel
updateCarousel();
