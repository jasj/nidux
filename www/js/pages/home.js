function replaceAdsProducts(products){
    console.log(products)
    for(productIndex in products) {
       var product  = products[productIndex]
       var productDOM =  $("#dashboard .product-card").eq(productIndex -1)
       
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

function replaceAdsBanner(banners){
    for(bannerIndex in banners) {
        var banner  = banners[bannerIndex]
        console.log(bannerIndex)
        if (1 == 1){
            $("#portada .nivoSlider a").eq(bannerIndex -1).attr("href","https://www.nidux.com/inicio/")
            $("#portada .nivoSlider img").eq(bannerIndex).attr("src","https://dividendappreciation.com/wp-content/uploads/2017/05/For-Sale-Oldcastle.gif")            
        }else{
            $("#portada .nivoSlider a").eq(bannerIndex -1).attr("href",banner.href)
            $("#portada .nivoSlider img").eq(bannerIndex).attr("src",banner.imageURL) 
        }
    }

}

function getEstateIdentifier (estates, id) {
    return estates.filter(function (estate) { return estate.estateId == id })[0].identifier
}


function getSavedDashboardInfo(){
    db.get("adsProducts").then(function(products){
        replaceAdsProducts(products.products)
        console.log(products.version,products.products)
        db.get("adsBanners").then(function(banners){
            replaceAdsBanner(banners.banners)
            requestDashboardInfo(0,products.products,banners.version,banners.banners)
        }).catch(function(){
            console.log(products.version,products.products)
            requestDashboardInfo(0,products.products,0,{})
        })
        
    }).catch(function(){
        requestDashboardInfo(0,{},0,{})
    })
}


function requestBanners(versionBanner,oldBannerData){
    _consolePost(beServices.DASHBOARD.GET_BANNER_LIST, {version : versionBanner}, function (newBannerData) {
        if(!$.isEmptyObject(newBannerData)){
             replaceAdsBanner(newBannerData.banners)
             console.log(oldBannerData,newBannerData.banners)
             var mergedBanners = {
                 banners : Object.assign(oldBannerData,newBannerData.banners),
                 version : newBannerData.version
             }
             db.upsert("adsBanners",Object.assign(oldBannerData,newBannerData))
        }

       
    })
}


function requestDashboardInfo (versionProducts,oldProductData,versionBanner,oldBannerData) {
    console.log(versionProducts,oldProductData,versionBanner,oldBannerData)
    loginInfo(function (doc) {
         
        _consolePost(beServices.DASHBOARD.GET_PRODUCT_LIST, {version : versionProducts}, function (newProductData) {
            
            $(".get-nicer").getNiceScroll().resize()
                replaceAdsProducts(newProductData.products)
               if($.isEmptyObject(newProductData)){
                    requestBanners(versionBanner,oldBannerData)
               }else{
                    console.log(oldProductData, newProductData.products)
                    var mergedProducts = {
                        products: Object.assign(oldProductData, newProductData.products),
                        version: newProductData.version 
                    }
                    db.upsert("adsProducts", mergedProducts,function(){
                        requestBanners(versionBanner,oldBannerData)
                    })
                    
               }
               
                $(".get-nicer").getNiceScroll().resize()
            })

        
        })
}





home = {
    init: function () {
        getSavedDashboardInfo()
    }
}
