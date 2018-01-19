searchPage = 1;
totalPage = 10;
var selectedCategory = "ALL"

function addShopInList(shop){
    $('<div class="shopInLst" id="'+shop.id+'"> <div class="shopInLst_shopName">'+
        shop.name+'</div><div class="shopInLst_mine fa '+(shop.mine  ? "fa-check" : "")+'" shopId="'+
        shop.id+'" myShopId="'+shop.myShopId+'"></div> </div>\\\\').appendTo(".shopsLst .nice-wrapper")
}

function search(){
    loginInfo(function(doc) {    
        var searchObj = {
            "loginId": doc.loginId,
            "uuid" : device.uuid,
            "type" : "C",
            "filter" : $("#searchForShop").val() || "",
            "userId" : doc.userId,
            "page" : searchPage,       
        }

       $(".shopsLst .nice-wrapper").html()

        if(selectedCategory != "ALL") {
            searchObj.category = selectedCategory;
        }

       _consolePost(beServices.SHOPS.SEARCH,searchObj,function(data) {
            $(".shopsLst .nice-wrapper").html("")
            totalPage = Math.ceil(data.t/10)
            if( data.r.length > 0 ) {
                for(var i = 0; i < data.r.length; i++) {
                    addShopInList(data.r[i])
                }
            } else {
                $(".shopsLst .nice-wrapper").html('<div class="showInMidle">'+$.t("CONTENT_NOT_FOUND")+' </div>')
            }

            $(".get-nicer").getNiceScroll().resize()
            $(".bottomBar .pageNo").html((data.r.length == 0 ? "0" : searchPage) + "/"+totalPage)
            if (totalPage == 1) {
                $(".bottomBar .fa-chevron-right").addClass("disabled")
                $(".bottomBar .fa-chevron-left").addClass("disabled")
            }
            if(searchPage == 1) {
                $(".bottomBar .fa-chevron-left").addClass("disabled")
            }
        })
    })
}

$("#selectCat").tapend(function (ev) {
    if(checkPress(ev)) {
        $(".jasj_select_categorie").fadeIn()
    }
})

$(".bottomBar .fa-chevron-left").tapend(function(ev) {
    if(searchPage > 1) {
        searchPage--
        $(".bottomBar .pageNo").html(searchPage + "/"+totalPage)
        search()
    }
    if(searchPage == 1) {
        $(".bottomBar .fa-chevron-left").addClass("disabled")
    }
    if(searchPage < totalPage ) {
        $(".bottomBar .fa-chevron-right").removeClass("disabled")
    }
})

$(".bottomBar .fa-chevron-right").tapend(function(ev) {
    if(searchPage < totalPage) {
        searchPage++
        $(".bottomBar .pageNo").html(searchPage + "/"+totalPage)
        search()
    }
    if(searchPage == totalPage) {
        $(".bottomBar .fa-chevron-right").addClass("disabled")
    }
    if(searchPage > 1) {
        $(".bottomBar .fa-chevron-left").removeClass("disabled")
    }
})

$(document).on("keypress","#searchForShop",function(ev) {    
    if(ev.which == 13) {
        searchPage = 1
        search()
    }    
})

$(document).on("tapend",".shopInLst_mine",function() {
    var this_ = $(this)
    if( $(this).hasClass("fa-check")) {
        showAlert($.t("REMOVE_STORE"),$.t("WHISH_DELETE_STORE")+" "+ $(this).parent().text().trimRight() + "?", function() {
            loginInfo(function(doc) {            
                var searchObj = {
                    "loginId": doc.loginId,
                    "uuid" : device.uuid,
                    "type" : "C",
                    "userId" : doc.userId,
                    "myShopId" : this_.attr("myShopId")                        
                }
                _consolePost(beServices.MY_SHOPS.REMOVE,searchObj,function(data) {
                    this_.removeClass("fa-check")
                })
            })
        })
    } else {
        showAlert($.t("ADD_STORE"),$.t("WHISH_ADD_STORE")+" "+ $(this).parent().text().trimRight() + "?", function() {
            loginInfo(function(doc) {                
                var searchObj = {
                    "loginId": doc.loginId,
                    "uuid" : device.uuid,
                    "type" : "C",
                    "userId" : doc.userId,
                    "shopId" : this_.attr("shopId")                            
                }
                _consolePost(beServices.MY_SHOPS.ADD,searchObj,function(data){
                        this_.attr("myShopId",data.myShopId)
                        this_.addClass("fa-check")
                })
            })
        })
    }
})

searchShops = {
    init : function(t){
        search()
    }
}
