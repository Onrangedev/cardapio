$(document).ready(function() {
    const $num = $('.my-card').length;
    const $even = $num / 2;
    const $odd = ($num + 1) / 2;

    const date = new Date();
    

    // Inicializa o cartão ativo
    // if ($num % 2 == 0) {
    //     $('.my-card:nth-child(' + $even + ')').addClass('active');
    // } else {
    //     $('.my-card:nth-child(' + $odd + ')').addClass('active');
    // }

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

    $('.my-card').click(function() {
        handleCardClick($(this));
    });

    // Touch support
    let startX, isDragging = false;

    $('.card-carousel').on('touchstart', function(event) {
        startX = event.changedTouches[0].screenX;
        isDragging = true; // Inicia o arrasto
        event.preventDefault(); // Impede scroll da página
    });

    $('.card-carousel').on('touchmove', function(event) {
        if (isDragging) {
            const currentX = event.changedTouches[0].screenX;
            const diff = startX - currentX;

            if (Math.abs(diff) > 50) { // Detecta a direção do arrasto
                if (diff > 0) {
                    $('.active').next().trigger('click'); // Arrastando para a esquerda
                } else {
                    $('.active').prev().trigger('click'); // Arrastando para a direita
                }
                isDragging = false; // Finaliza o arrasto
            }
            event.preventDefault(); // Impede scroll da página durante o arrasto
        }
    });

    $('.card-carousel').on('touchend', function(event) {
        isDragging = false; // Finaliza o arrasto ao soltar
    });

    // Keyboard nav
    $('html body').keydown(function(e) {
        if (e.keyCode == 37) {
            $('.active').prev().trigger('click');
        } else if (e.keyCode == 39) {
            $('.active').next().trigger('click');
        }
    });

    function numDia() {
        if (date.getDay() !== 0 && date.getDay() !== 7) {
            return date.getDay();
        } else {
            return null;
        }
    }

    function handleCardClick(card) {
        const $slide = $('.active').width();
        const $carousel = $('.card-carousel');

        card.removeClass('prev next');
        card.siblings().removeClass('prev active next');

        card.addClass('active');
        card.prev().addClass('prev');
        card.next().addClass('next');     

        updateCarousel();
    }

    function updateCarousel() {
        const $activeCard = $('.active');
        const $carousel = $('.card-carousel');
        const carouselWidth = $carousel.width();
        const cardWidth = $activeCard.width();
        
        // Calcula o novo deslocamento para centralizar o cartão ativo
        const offset = $activeCard.index() * cardWidth - (carouselWidth / 2) + (cardWidth / 2);
        $carousel.stop(true, true).animate({ left: -offset }, 300); // Ajuste do tempo conforme desejado
    }
});