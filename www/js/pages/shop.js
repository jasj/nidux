$("[section-name=shop] .swiper-container").JASJSwipper({
    prevNav: "#shopPrevButton",
    nextNav : "#shopNextButton"
})



$("[tab-target=shopPromo]").tapend(function() {
    setTimeout(function() {
        $("[section-name=shop] .swiper-container").JASJSwipper({operacion: "update"})
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
        permissions.checkPermission(permissions.CALL_PHONE, function(status){
            if ( !status.hasPermission ) {
                permissions.requestPermission(permissions.CALL_PHONE, function(){
                    call(phoneNumber)
                }, function(){
                    showInfoD($.t("WARNING",$.t("SOME_FEATURES_WILL_NOT_WORK")))
                });
            } else {
                call(phoneNumber)
            }
        });
	}
})

$(document).on("tapend",".fa-map-marker",function(ev){
    if(checkPress(ev)){
        var directoryObj = { lat :  $(this).attr("map-lat"), lng :  $(this).attr("map-lng")}
        setTimeout(function() {
            map.animateCamera({
                target: {lat: directoryObj.lat, lng: directoryObj.lng},
                zoom: 17,
                tilt: 60,
                bearing: 140,
                duration: 1000
            }, function() {
                try {
                    mkr.remove();
                } catch(e) {
                    console.log(e)
                }
                // Add a maker
                map.addMarker({
                    position: {lat: directoryObj.lat, lng: directoryObj.lng},
                    title: "",
                    animation: plugin.google.maps.Animation.BOUNCE
                }, function(marker) {
                    mkr = marker
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
        } else {
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
                    products: Object.assign(oldProductData, newProductData.products),
                    version: newProductData.version 
                }
                db.upsertPll(HexWhirlpool("myShopP" + myShopSync.idShop), mergedProducts)
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
    if($("#spromo_"+promo.promotionId).length == 0){
        var dom= $(`<div id="spromo_`+promo.promotionId+`"  class="jasj-slide">
                    <img src="`+promo.image+`"/>
                    <h4>`+promo.header+`</h4>
                    <p>`+promo.description+`</p>
                    <div class="btn_get" section-target="promotionsQR" section-color="`+shop_color+`" section-title=`+shop_name+` niduxPromoCode="`+promo.promotionId+`">`+$.t("GET")+`</div>
            </div>`)
        if( $("#spromo_"+promo.promotionId).length == 0){
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
            if(data.version != null) {
                if(old != undefined){
                    var newIdexes = data.promos.map(function(t){return t.promotionId})
                    old.promos = old.promos.filter(function(t){return newIdexes.indexOf(t.promotionId) < 0 && data.deleted.indexOf(t.promotionId) <0 })
                    data.promos = old.promos.concat(data.promos)
                }
                
                if(data.deleted != null){
                    data.deleted.forEach(function(id){
                        $("#spromo_"+id).remove()
                    })
                }
               
                for(var i = 0 ; i < data.promos.length; i++) {
                    var promo = data.promos[i]
                    if(promo.dueTime < dptime) {
                        data.promos.slice(i,1)
                        try{
                            $("#spromo_"+promo.promotionId).remove()
                        } catch(e) {
        
                        }
                    } else {
                        insertShopPromotion(promo)
                    }
                }
                data.promos = data.promos.filter(function(t){return t.dueTime >= dptime})
                delete data.deleted
                $("[section-name=shop] .swiper-container").JASJSwipper({operacion: "update"})
                db.upsertPll(HexWhirlpool("myShopM" + myShopSync.idShop), data)
            } else {
                if(old != undefined) {
                    var size = old.promos.length
                    old.promos = old.promos.filter(function(t){return t.dueTime >= dptime})
                    if (size != old.promos.length) {
                        db.upsertPll(HexWhirlpool("myShopM" + myShopSync.idShop), old)
                    }
                }
            }
        })
    })
}


function requestChatList(old ){
    var old = (old == undefined ? {groupVersion: 0, chatVersion: 0, chats: [] } : old)
    loginInfo( info => {
        var tempObj = {
            "loginId": info.loginId,
            "uuid" : info.uuid,
            "type" : "C",
            "userId" : info.userId,
            "shopId" : myShopSync.idShop,
            "groupVersion": old.groupVersion,
            "chatVersion": old.chatVersion
         }
         console.log(old)
         var total = totalMessages(old.chats)
        _consolePost(beServices.CHAT.LIST_DEPARTMENTS,tempObj, function(newData){
            var updatedIdChats = newData.chats.map(chat => { return chat.chatGroupId }) 
            var oldChats = old.chats.filter(chat => {  //aquellos chats viejos que no se actualizan ni se borran
                return  (updatedIdChats.indexOf(chat.chatGroupId) < 0) && 
                         (newData.deleteGroups.indexOf(chat.chatGroupId) < 0)
            })

            console.log("updatedIdChats",updatedIdChats)
           
            newData.groupVersion =  newData.groupVersion == null  ? old.groupVersion : newData.groupVersion
            newData.chatVersion  =  newData.chatVersion  == null  ? old.chatVersion  : newData.chatVersion

            $("#chat_list .nice-wrapper").html()
            newData.chats = newData.chats.concat(oldChats)
            console.log("newData",newData)

            db.upsert("chat_"+ myShopSync.idShop,newData)
            total = totalMessages(newData.chats)
            $("#shopNav .tablist li:eq(3) .bubble").text(total)
            newData.chats.forEach( chat => {
                insertChat(chat)
            })
        },function(error){
            $("#shopNav .tablist li:eq(3) .bubble").text(total)
            console.log("error")
        })
    })
}

function getChatList(){
    $("#chat_list .nice-wrapper").html("")
    db.get("chat_"+ myShopSync.idShop).then(data => {
        data.chats.forEach( chat => {
            insertChat(chat)
        })
        requestChatList(data)       
    }).catch( error => {
        $("#shopNav .tablist li:eq(3) .bubble").text("0")
        requestChatList()
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
                replaceAdsBanner(banners.shopBanners,"[section-name=shop]")
                requestShopBanner( banners.version, banners.shopBanners)
            }).catch(function(){
                requestShopBanner(0, {shopBanners : {} ,version: 0})
            })
         },

        promotions: function(){
            $('.swiperShop-container .swiper-wrapper').html("")
            db.get(HexWhirlpool("myShopM" + myShopSync.idShop)).then(function(data){
                var dptime = new Date().getTime()
                for(var i = 0 ; i < data.promos.length;i++) {
                    var promo = data.promos[i]
                    if(promo.dueTime < dptime){
                        data.promos.slice(i,1)
                        try{
                            $("#spromo_"+promo.promotionId).remove()
                        }catch(e){
        
                        }
                    } else {
                        insertShopPromotion(promo)
                    }
                }
                $("[section-name=shop] .swiper-container").JASJSwipper({operacion: "update"})
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
        shop_color = $(t).attr("section-color")
        myShopSync.idShop = $(t).attr("shopId") ? $(t).attr("shopId") :  myShopSync.idShop
        myShopSync.do()

        $(".callBtn").attr("phone-number",$(t).attr("phone-num"))
        $(".fa-map-marker").attr("map-lat",$(t).attr("map-lat"))
        $(".fa-map-marker").attr("map-lng",$(t).attr("map-lng"))
        
        $('#slider_shop').nivoSlider();
        addStylesheetRule("#shopNav .active { color: "+shop_color+"; border-bottom: 2px solid "+shop_color+"}")
        addStylesheetRule("[section-name=shop] .product-card{ color: "+shop_color+";}")
        addStylesheetRule("[section-name=shop] .product-card{ color: "+shop_color+";}")
        addStylesheetRule("[section-name=shop] .product-info h6{ background-color: "+shop_color+";}")
        addStylesheetRule(".he_said{ background-color: "+hexToHSL(color,20)+";}")
        addStylesheetRule("[section-name=shop] .nicescroll-cursors{ background-color: "+shop_color+" !important;}")
        addStylesheetRule("[section-name=shop] .chat_lst_element_msgQty{ background-color: "+shop_color+" !important;}")
       // $("[section-name=shop] .products").css({ "top" : (50 + $("#slider_shop").outerHeight())+"px"} )
        $("[section-name=shop] .products").css({ "top" : 150+"px"} )
        $(".chat_action_bar>.fa").css({ "color" : color} )
        $(".btn_get").css({ "background-color" : color} )
        $("#chat_sender_btn").css({ "color" : color} )
        $("#select_attachment_type").css({ "color" : color} )


           //QR request as shop
           $("#promotionsQRNav .fa-chevron-left")
            .attr("section-target","shop")
            .attr("section-title",shop_name)
            .attr("section-color",shop_color)
        

        //Chat list
        getChatList()
        
        //temporal demo chat


    }
}
