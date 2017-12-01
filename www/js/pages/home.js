
controStepSave = 0

function replaceAdsProducts(products,where){
    console.log(products)
    for(productIndex in products) {
       var product  = products[productIndex]
       var productDOM =  $(where+" .product-card").eq(productIndex -1)
       
        if (product.empty == 1){
            
            productDOM.find("img").attr("src","https://dividendappreciation.com/wp-content/uploads/2017/05/For-Sale-Oldcastle.gif")
            productDOM.find("h6").html("CALL")
            productDOM.find("h5").html("")
            productDOM.attr("href","https://www.nidux.com/inicio/")
        }else{
            productDOM.attr("href",product.href)
            productDOM.find("img").attr("src",product.thumbnail)
            productDOM.find("h5").html(product.description)
            productDOM.find("h6").html(product.price + " "+ product.currency)
        }
    };
}

function replaceAdsBanner(banners,where){
    for(bannerIndex in banners) {
        var banner  = banners[bannerIndex]
        console.log(bannerIndex)
        if (banner.empty == 1){
            $(where +" .nivoSlider a").eq(bannerIndex -1).attr("href","https://www.nidux.com/inicio/")
            $(where +" .nivoSlider img").eq(bannerIndex -1).attr("src","https://dividendappreciation.com/wp-content/uploads/2017/05/For-Sale-Oldcastle.gif")            
        }else{
            $(where + " .nivoSlider a").eq(bannerIndex -1).attr("href",banner.href)
            $(where + " .nivoSlider img").eq(bannerIndex -1).attr("src",banner.imageURL) 
        }
    }

}

function getEstateIdentifier (estates, id) {
    return estates.filter(function (estate) { return estate.estateId == id })[0].identifier
}


function getSavedProductsDashboard(){
    db.get("adsProducts").then(function(products){
       replaceAdsProducts(products.products,"#dashboard")
       requestProductDashboard(products.version,products.products)
    }).catch(function(){
        requestProductDashboard(0,{})
    })
}

function getSavedBannersDashboard(){
    db.get("adsBanners").then(function(banners){
        replaceAdsBanner(banners.banners,"#portada")
        requestBannersDashboard(banners.version,banners.banners)
    }).catch(function(){
        requestBannersDashboard(0,{})
    })
}


function requestBannersDashboard(versionBanner,oldBannerData){
    _consolePost(beServices.DASHBOARD.GET_BANNER_LIST, {version : versionBanner}, function (newBannerData) {
        if(!$.isEmptyObject(newBannerData)){
             replaceAdsBanner(newBannerData.banners,"#portada")
             console.log(oldBannerData,newBannerData.banners)
             var mergedBanners = {
                 banners : Object.assign(oldBannerData,newBannerData.banners),
                 version : newBannerData.version
             }
             db.upsertPll("adsBanners",Object.assign(oldBannerData,newBannerData))
        }
    })
}


function requestProductDashboard (versionProducts,oldProductData) {
    loginInfo(function (doc) {
         
        _consolePost(beServices.DASHBOARD.GET_PRODUCT_LIST, {version : versionProducts}, function (newProductData) {
            
            $(".get-nicer").getNiceScroll().resize()
                replaceAdsProducts(newProductData.products,"#dashboard")
               if(!$.isEmptyObject(newProductData)){
                    console.log(oldProductData, newProductData.products)
                    var mergedProducts = {
                        products: Object.assign(oldProductData, newProductData.products),
                        version: newProductData.version 
                    }
                    db.upsertPll("adsProducts", mergedProducts,function(){})
               }
               
                $(".get-nicer").getNiceScroll().resize()
            })
        })
}


function addMyShops(shop){
    console.log("shop.image",shop.image)
    imageContent(shop.image,function(image){
        $("#myShop"+shop.myShopId).remove()
        console.log("getImage")
           $("#myShop"+shop.myShopId)
           $(`<div id="myShop`+shop.myShopId+`" shopId="`+shop.shopId+`"
                class="shop" style="background-image: url(`+image+`);"
                    section-target="shop"
                    section-title="`+shop.name+`"
                    section-color="`+shop.color+`">
                </div>`).appendTo("#myshops .nice-wrapper")
    })
}

function requestMyShops(version,old){
    loginInfo(function(x){  
        _consolePost(beServices.MY_SHOPS.GET_LIST,{
                loginId : x.loginId,
                type: "C",
                uuid : device.uuid,
                userId: x.userId,
                version:version},function(data){
            console.log(data,old)
            if(!$.isEmptyObject(data)){
                var newMyShops = data.myShops.map(function(t){return t.myShopId})
                var updatedMyShops =
                    old.myShops.filter(function(t){return data.deleted.indexOf(t.myShopId) == -1 && newMyShops.indexOf(t.myShopId)== -1}).concat(data.myShops)
                    db.upsertPll("myShops", {version : data.version, myShops : updatedMyShops})
                    for(var i= 0; i < data.myShops.length; i++){
                        addMyShops(data.myShops[i])
                    }

            }
        })
    })
}


function getSavedMyShops(){
    db.get("myShops").then(function(shops){
        for(var i= 0; i < shops.myShops.length; i++){
            addMyShops(shops.myShops[i])
        }
        requestMyShops(shops.version,shops)
        

    }).catch(function(){
        requestMyShops(0,{version:0 , deleted : [], myShops: []})
   })
}



home = {
    init: function () {
        getSavedProductsDashboard()
        getSavedBannersDashboard()
        getSavedMyShops()

    }
}
