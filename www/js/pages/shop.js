shopSwiper = new Swiper("[section-name=shop] .swiper-container", {
    speed: 400,
    spaceBetween: 30,
    pagination: '.swiper-pagination',
    
    // Navigation arrows
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    loop : true
});


$("[tab-target=shopPromo]").tapend(function(){
    setTimeout(function() {
        shopSwiper.update()
    }, 500);
  
})


function call(phoneNumber){
    phonedialer.dial(
       phoneNumber, 
      function(err) {
          if (err == "empty") alert($.t("UNKNOWN_PHONE_NUMBER"));
          else showInfoD($.t("ERROR_CALLING"),$.t("ERROR_GENERIC"))   
      },
        function(success) { }
  );
}

$(document).on("tapend",".callBtn",function(ev){
	if(checkPress(ev)){
        var phoneNumber = $(this).attr("phone-number")
        var permissions = cordova.plugins.permissions;
        console.log("llamando",phoneNumber)
        permissions.checkPermission(permissions.CALL_PHONE, function(status){
            if ( !status.hasPermission ) {
                permissions.requestPermission(permissions.CALL_PHONE, function(){
                    call(phoneNumber)
                }, function(){
                    showInfoD($.t("WARNING",$.t("SOME_FEATURES_WILL_NOT_WORK")))
                });
            }else{
                call(phoneNumber)
            }

        });
		
	}
})


$(document).on("tapend",".fa-map-marker",function(ev){
   
    
    if(checkPress(ev)){
        var directoryObj = { lat :  $(this).attr("map-lat"), lng :  $(this).attr("map-lng")}
        console.log(directoryObj)
        setTimeout(function(){
            map.animateCamera({
                target: {lat: directoryObj.lat, lng: directoryObj.lng},
                zoom: 17,
                tilt: 60,
                bearing: 140,
                duration: 1000
              }, function() {
                console.log(1)
            try{
                  mkr.remove();
            }catch(e){console.log(e)}
                // Add a maker
                console.log(2)
                map.addMarker({
                  position: {lat: directoryObj.lat, lng: directoryObj.lng},
                  title: "",
                  animation: plugin.google.maps.Animation.BOUNCE
                }, function(marker) {
                    mkr = marker
                    console.log(3)
                  // Show the info window
                  marker.showInfoWindow();
            
                  // Catch the click event
                  marker.on(plugin.google.maps.event.INFO_CLICK, function() {
            
                   
            
                  });
                });
              });
          },1600)
    }
   
})


$(document).on("search","#myShopsSearch",function(){
    $("[tab-target=myshops]").trigger("tapend")
    var tempr = new RegExp($(this).val(),"i")
    $("[tab-name=myshops]>div>div[shopId]").each(function(){
        if(tempr.test($(this).attr("section-title"))){
            $(this).show()
        }else{
            $(this).hide()
        }
    })
    
})

function requestShopProducts(version,oldProductData){
    loginInfo(function (doc) {
        var tempObj = {
            "shopId" : myShopSync.idShop,
            "version" : version
        }
        _consolePost(beServices.SHOPS.GET_PRODUCTS,tempObj,function(newProductData){
            if(!$.isEmptyObject(newProductData)){
                replaceAdsProducts(newProductData.products,"#myShopProducts")
                var mergedProducts = {
                    products: Object.assign(oldProductData.products, newProductData.products),
                    version: newProductData.version 
                }
                db.upsertPll(HexWhirlpool("myShopP" + myShopSync.idShop),mergedProducts)
            }

           
            

        })
    })
}

function requestShopBanner(version,oldBannerData){
    loginInfo(function (doc) {
        var tempObj = {
            "shopId" : myShopSync.idShop,
            "version" : version
        }
        _consolePost(beServices.SHOPS.GET_BANNERS,tempObj,function(newBannerData){
            if(!$.isEmptyObject(newBannerData)){
                replaceAdsBanner(newBannerData.shopBanners,"[section-name=shop]")
                var mergedBanner = {
                    shopBanners: Object.assign(oldBannerData.shopBanners, newBannerData.shopBanners),
                    version: newBannerData.version 
                }
                db.upsertPll(HexWhirlpool("myShopB" + myShopSync.idShop),mergedBanner)
            }
            

        })
    })
}



function insertShopPromotion(promo){
    console.log("promo",promo)
    if($("#ppromom_"+promo.promotionId).length == 0){
        var dom= $(`<div id="ppromo_`+promo.promotionId+`"  class="swiper-slide">
                         <img src="`+promo.image+`"/>
                         <h4>`+promo.header+`</h4>
                         <p>`+promo.description+`</p>
                         <div class="btn_get" section-target="promotionsQR" niduxPromoCode="`+promo.promotionId+`">`+$.t("GET")+`</div>
                  </div>`)
                if( $("#ppromo_"+promo.promotionId).length == 0){
                    $('.swiperShop-container .swiper-wrapper').append(dom)
                }
                  

    }
}

function requestShopPromotions(version,old){
    loginInfo(function (doc) {
        var tempObj = {
            "shopId" : myShopSync.idShop,
            "version" : version
        }
        var dptime = new Date().getTime()
        _consolePost(beServices.SHOPS.GET_PROMOTIONS,tempObj,function(data){
            if(data.version != null){
                if(old != undefined){
                    console.log("old pp lst",old)
                    var newIdexes = data.promos.map(function(t){return t.id})
                    old.promos = old.promos.filter(function(t){return newIdexes.indexOf(t.id) < 0 && data.deleted.indexOf(t.id) <0 })
                    data.promos = old.promos.concat(data.promos)
                }
                
                
                if(data.deleted != null){
                    data.deleted.forEach(function(id){
                        $("#ppromom_"+id).remove()
                    })
                }
               
                for(var i = 0 ; i < data.promos.length;i++)
                {
                    var promo = data.promos[i]
                    if(promo.dueTime < dptime){
                        data.promos.slice(i,1)
                        try{
                         $("#ppromom_"+promo.promotionId).remove()
                        }catch(e){
        
                        }
                    }
                    else{
                        insertShopPromotion(promo)
                    }
                }
                shopSwiper.update()
                db.upsertPll(HexWhirlpool("myShopM" + myShopSync.idShop),data)
            }
        })
    })
}


myShopSync = {
    idShop : 0,

    get :{
        products : function(){
            db.get(HexWhirlpool("myShopP" + myShopSync.idShop)).then(function(products){
                replaceAdsProducts(products.products,"#myShopProducts")
                requestShopProducts(products.version, products.products)
            }).catch(function(){
                requestShopProducts(0, {products : {} ,version: 0})
            })
         },

        banner : function(){
              db.get(HexWhirlpool("myShopB" + myShopSync.idShop)).then(function(banners){
                  console.log("oldbit",banners)
                replaceAdsBanner(banners.shopBanners,"[section-name=shop]")
                requestShopBanner( banners.version, banners.shopBanners)
               
            }).catch(function(){
                requestShopBanner(0, {shopBanners : {} ,version: 0})
            })
         },

        promotions: function(){
            $('.swiperShop-container .swiper-wrapper').html("")
            db.get(HexWhirlpool("myShopM" + myShopSync.idShop)).then(function(data){
                console.log(data)
                var dptime = new Date().getTime()
                for(var i = 0 ; i < data.promos.length;i++)
                {
                    var promo = data.promos[i]
                    if(promo.dueTime < dptime){
                        data.promos.slice(i,1)
                        try{
                         $("#ppromom_"+promo.promotionId).remove()
                        }catch(e){
        
                        }
                    }
                    else{
                        console.log("inserted",promo)
                        insertShopPromotion(promo)
                    }
                }
                shopSwiper.update()
                requestShopPromotions(data.version,data)
               // createPromoSlider("[section-name=shop]")
            }).catch(function(err){
                console.log(err)
                requestShopPromotions(0)
            })
        
        },
    },

    "do" : function() {
        //request each element independently
        myShopSync.get.products()
        myShopSync.get.banner()
        myShopSync.get.promotions()

    }

}







shop = {
    init : function(t,tt){
        shop_name = $(t).attr("section-title")
        myShopSync.idShop = $(t).attr("shopId")
        myShopSync.do()

        $(".callBtn").attr("phone-number",$(t).attr("phone-num"))
        $(".fa-map-marker").attr("map-lat",$(t).attr("map-lat"))
        $(".fa-map-marker").attr("map-lng",$(t).attr("map-lng"))
        
        $('#slider_shop').nivoSlider();
        addStylesheetRule("#shopNav .active { color: "+$(t).attr("section-color")+"; border-bottom: 2px solid "+$(t).attr("section-color")+"}")
        addStylesheetRule("[section-name=shop] .product-card{ color: "+$(t).attr("section-color")+";}")
        addStylesheetRule("[section-name=shop] .product-card{ color: "+$(t).attr("section-color")+";}")
        addStylesheetRule("[section-name=shop] .product-info h6{ background-color: "+$(t).attr("section-color")+";}")
        addStylesheetRule(".he_said{ background-color: "+hexToHSL(color,20)+";}")
        addStylesheetRule("[section-name=shop] .nicescroll-cursors{ background-color: "+$(t).attr("section-color")+" !important;}")
        addStylesheetRule("[section-name=shop] .chat_lst_element_msgQty{ background-color: "+$(t).attr("section-color")+" !important;}")
       // $("[section-name=shop] .products").css({ "top" : (50 + $("#slider_shop").outerHeight())+"px"} )
        $("[section-name=shop] .products").css({ "top" : 150+"px"} )
        $(".chat_action_bar>.fa").css({ "color" : color} )
        $(".btn_get").css({ "background-color" : color} )
        $("#chat_sender_btn").css({ "color" : color} )
        $("#select_attachment_type").css({ "color" : color} )
       

         
        
//temporal demo chat
          insertChat({
            id : 1000,
            isGroup: 1,
            name: "Ventas",
            message : "Gracias por su compra",
            writeDate : 1505783672732,
            messages: 2
        })

        insertChat({
            id : 1001,
            isGroup: 1,
            name: "Soporte",
            message : "Denos un segundo, para verificar lo que sucede",
            writeDate : 1505753662732,
            messages: 1
        })

        insertChat({
            id : 1003,
            isGroup: 1,
            name: "Transporte",
            message : "Listo ya me llegó &#x263a;",
            writeDate : 1505743662732,
            messages: 0
        })

        insertMsg("I", {
            from: "I",
            chatId: 3,
            fromType: "U",
            message: {
                type: "text",
                data: "Hola, hoy llegaba mi paquete, cierto?"
            },
            writeDate: 1505753662732,
            status: "R"
        })

        insertMsg("I", {
            from: "I",
            chatId: 5,
             name: "Esteban",
            fromType: "R",
            message: {
                type: "text",
                data: "La orden <a href='#124567'>#124567</a> esta programada para la tarde, debe de llegar en cualquer momento."
            },
            writeDate: 1893949485,
            status: "R"
        })

        insertMsg("I", {
            from: "I",
            chatId: 6,
            fromType: "U",
            message: {
                type: "text",
                data: "Listo ya me llegó &#x263a;"
            },
            writeDate: 1505743662732,
            status: "R"
        })


    }
}