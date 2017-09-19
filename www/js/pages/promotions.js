promoSwiper = undefined
promotions = {
    init : function () {
        setTimeout(function() {
            if (promoSwiper == undefined){
                promoSwiper = new Swiper('[section-name=promotions] .swiper-container', {
                    speed: 400,
                    spaceBetween: 100,
                    pagination: '.swiper-pagination',
                    
                    // Navigation arrows
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    loop : true
                });
                alert(909) 
            }
        }, 500);
    }
}