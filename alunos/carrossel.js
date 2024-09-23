$(document).ready(function() {
    // const $num = $('.my-card').length;
    const date = new Date();

    if (numDia()) {
        $('.my-card:nth-child(' + numDia() +')').addClass('active');
        $('.my-card:nth-child(' + numDia() +')')[0].childNodes[1].childNodes[1].style.background = 'var(--green)';
        $('.my-card:nth-child(' + numDia() +')')[0].childNodes[1].childNodes[1].textContent = 'HOJE';
        handleCardClick($('.my-card:nth-child(' + numDia() +')'));
    } else {
        $('.my-card:nth-child(1)').addClass('active');
        handleCardClick($('.my-card:nth-child(1)'));
    }

    updateCarousel();

    // Click event nos cartões
    $('.my-card').click(function() {
        handleCardClick($(this));
    });

    // Agurada evento de clique em nav-point
    document.querySelectorAll('.nav-point').forEach((point) => {
        point.addEventListener('click', () => {
            handleCardClick($('.my-card:nth-child(' + point.dataset.day + ')'))
        });
    });

    // Suporte a gestos de toque
    let startX, isDragging = false;

    $('.card-carousel').on('touchstart', function(event) {
        startX = event.changedTouches[0].screenX;
        isDragging = true;
        event.preventDefault();
    });

    $('.card-carousel').on('touchmove', function(event) {
        if (isDragging) {
            const currentX = event.changedTouches[0].screenX;
            const diff = startX - currentX;

            if (Math.abs(diff) > 50) { // Detecta a direção do arrasto
                if (diff > 0) {
                    $('.active').next().trigger('click'); // Arrasto para a esquerda
                } else {
                    $('.active').prev().trigger('click'); // Arrasto para a direita
                }
                isDragging = false;
            }
            event.preventDefault();
        }
    });

    $('.card-carousel').on('touchend', function() {
        isDragging = false;
    });

    // Suporte ao teclado
    $('html body').keydown(function(e) {
        if (e.keyCode == 37) {
            $('.active').prev().trigger('click'); // Seta esquerda
        } else if (e.keyCode == 39) {
            $('.active').next().trigger('click'); // Seta direita
        }
    });

    // Função que retorna o número do dia útil (1-5) ou null se for fim de semana
    function numDia() {
        const day = date.getDay();
        return day >= 1 && day <= 5 ? day : null;
    }

    // Lida com o clique no cartão
    function handleCardClick(card) {
        const $carousel = $('.card-carousel');

        // Remove classes 'prev', 'active' e 'next' de todos os cartões
        card.removeClass('prev next');
        card.siblings().removeClass('prev active next');

        // Define o cartão clicado como ativo
        card.addClass('active');
        card.prev().addClass('prev');
        card.next().addClass('next');

        updateCarousel();
    }

    // Atualiza a posição do carrossel para centralizar o cartão ativo
    function updateCarousel() {
        const $activeCard = $('.active');
        const $carousel = $('.card-carousel');
        const carouselWidth = $carousel.width();
        const cardWidth = $activeCard.width();

        // Calcula o deslocamento para centralizar o cartão ativo
        const offset = $activeCard.index() * cardWidth - (carouselWidth / 2) + (cardWidth / 2);
        $carousel.stop(true, true).animate({ left: -offset }, 300);
        
        updateNavPoit($activeCard[0].dataset.day);
    }

    function updateNavPoit(num) {
        if (document.querySelector('.nav-active')) {
            document.querySelector('.nav-active').classList.remove('nav-active');
        }

        document.querySelectorAll('.nav-point').forEach((point) => {
            if (point.dataset.day == num) {
                point.classList.add('nav-active');
            }
        });
    }
});
