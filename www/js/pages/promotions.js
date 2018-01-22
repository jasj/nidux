$(document).ready(function () {
    $('[section-name=promotions] .swiper-container').JASJSwipper({
         prevNav: "#promotionsPrevButton",
         nextNav : "#promotionsNextButton"
    })
})

function insertPublishPromotion(promo){
    ocPosPromotions.push("ppromo_"+promo.promotionId)
    if($("#ppromo_"+promo.promotionId).length == 0){
        var dom= $(`<div id="ppromo_`+promo.promotionId+`"  class="jasj-slide">
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
    _consolePost(beServices.PUBLIHED_PROMOTIONS.GET_PROMOTIONS,{"publicVersion" : version},function(data){
        if(data.version != null){
			if(old != undefined){
				var newIdexes = data.promos.map(function(t){return t.id})
				old.promos = old.promos.filter(function(t) {
                    return newIdexes.indexOf(t.promotionId) < 0 && data.deleted.indexOf(t.promotionId) <0 
                })
				data.promos = old.promos.concat(data.promos)
			}
			
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
            db.upsert("publishedPromotions",data)           
		}
        $('[section-name=promotions] .swiper-container').JASJSwipper({operacion: "update"})
    },function(){
        $('[section-name=promotions] .swiper-container').JASJSwipper({operacion: "update"})
    })
}

function getSavedPublishPromotion(){
    dptime = new Date().getTime()
    db.get("publishedPromotions").then(function(promos){
        requestPublishPromotion(promos.version,promos)
        for(var i = 0 ; i < promos.promos.length; i++) {
            var promo = promos.promos[i]
            if(promo.publishEndDate < dptime){
                promos.promos.slice(i,1)
                try{
                 $("#ppromo_"+promo.promotionId).remove()
                }catch(e){
                      console.log(e)
                }
            } else if(promo.publishStartDate < dptime){
                insertPublishPromotion(promo)
            } else{
                console.log("di3")
            }
        }
        $('[section-name=promotions] .swiper-container').JASJSwipper({operacion: "update"})
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
            $('[section-name=promotions] .swiper-container').JASJSwipper({operacion: "update"})
        }, 500);

        ocPosPromotions = []

        //QR request as shop
        $("#promotionsQRNav .fa-chevron-left")
            .attr("section-target","promotions")
            .attr("section-title",$.t("PROMOTION"))
            .attr("section-color",MAIN_COLOR)
    }
}
