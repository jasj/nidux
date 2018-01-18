promoSwiper = new Swiper("[section-name=promotions] .swiper-container", {
    speed: 400,
    spaceBetween: 30,
    pagination: '.swiper-pagination',
    
    // Navigation arrows
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    loop : true
});

function insertPublishPromotion(promo){
    console.log("promo",promo)
    if($("#ppromo_"+promo.promotionId).length == 0){
        var dom= $(`<div id="ppromo_`+promo.promotionId+`"  class="swiper-slide">
                         <img src="`+promo.image+`"/>
                         <h4>`+promo.header+`</h4>
                         <p>`+promo.description+`</p>
                         <div class="btn_get" section-target="promotionsQR" niduxPromoCode="`+promo.promotionId+`">`+$.t("GET")+`</div>
                  </div>`)
        if( $("#ppromo_"+promo.promotionId).length == 0){
            $('[section-name=promotions] .swiper-wrapper').append(dom)
        }
    }
}

function requestPublishPromotion(version, old){
    console.log("Publish old",old)
    _consolePost(beServices.PUBLIHED_PROMOTIONS.GET_PROMOTIONS,{"publicVersion" : version},function(data){
        console.log("Publish data",data)
        if(data.version != null){
			if(old != undefined){ 
				console.log("Publish old pp lst",old)
				var newIdexes = data.promos.map(function(t){return t.id})
				old.promos = old.promos.filter(function(t) {
                    return newIdexes.indexOf(t.promotionId) < 0 && data.deleted.indexOf(t.promotionId) <0 
                })
				console.log("Publishold pp lst new",old)
				data.promos = old.promos.concat(data.promos)
			}
            console.log("data.promos",data.promos)
			
			if(data.deleted != null){
				data.deleted.forEach(function(id){
					$("#ppromo_"+id).remove()
				})
			}
           
            for(var i = 0 ; i < data.promos.length;i++) {
                var promo = data.promos[i]
                if(promo.publishEndDate < dptime){
                    data.promos.slice(i,1)
                    try{
                     $("#ppromo_"+promo.promotionId).remove()
                    }catch(e){
    
                    }
                } else if(promo.publishStartDate < dptime){
                    insertPublishPromotion(promo)
                }
            }
            data.promos = data.promos.filter(function(t){return t.publishEndDate >= dptime})
            console.log("data.promos.filter",data.promos)
            db.upsert("publishedPromotions",data)           
		}
        promoSwiper.update();
    },function(){
        console.log("fallo de promo")
        promoSwiper.update();
    })
}

function getSavedPublishPromotion(){
    dptime = new Date().getTime()
    db.get("publishedPromotions").then(function(promos){
        requestPublishPromotion(promos.version,promos)
        console.log("oldPromos",promos)
        for(var i = 0 ; i < promos.promos.length; i++) {
            console.log("di2")
            var promo = promos.promos[i]
            if(promo.publishEndDate < dptime){
                console.log("di5")
                promos.promos.slice(i,1)
                try{
                 $("#ppromo_"+promo.promotionId).remove()
                }catch(e){
                      console.log(e)
                }
            } else if(promo.publishStartDate < dptime){
                console.log("di")
                insertPublishPromotion(promo)
            } else{
                console.log("di3")
            }
        }
        promoSwiper.update();
       // insertPublishPromotion(promos.promos)
    }).catch(function(e){
        console.log(e)
        requestPublishPromotion(0)
    })
}

promotions = {
    init : function () {
        getSavedPublishPromotion()
        setTimeout(function() {
            promoSwiper.update()
        }, 500);
    }
}
