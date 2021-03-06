beServices = {
    "SECURITY": {
        "CHECK_LOGIN": "/security/checkLogin",
        "DASHBOARD": "/security/dashboard",
        "REGISTER": "/security/register",
        "LOGOUT": "/security/logout",
        "LOGIN": "/security/login",
        "UPDATE_CREDENTIALS": "/security/update/credentials" 
    },
    "CHAT": {
        "STATUS_DETAIL": "/chat/status/detail",
        "LIST_DEPARTMENTS": "/chat/list",
        "DELETE_MESSAGE_APP": "/chat/delete/message/app",
        "READ_MESSAGE_VALIDATE": "/chat/read/message/validate",
        "DOWNLOADER_READ_MESSAGE": "http://54.212.218.84:7591/downloader/1.0/read/message/",
        "DELETE_APP": "/chat/delete/app",
        "READ_MESSAGE": "/chat/read/app",
        "WRITE_APP": "/chat/write/app"
    },
    "DASHBOARD" : {
        "GET_PRODUCT_LIST" : "/core/promo/product/get",
        "GET_BANNER_LIST" : "/core/banner/get"
    },
    "MY_SHOPS" :{
        "GET_LIST"   : "/core/myShops/get",
        "ADD"        : "/core/myShops/add",
        "REMOVE"     : "/core/myShops/delete",
    },
    "SHOPS" : {
        "SEARCH"        : "/core/shops/get",
        "GET_PRODUCTS"  : "/core/shops/product/get",
        "GET_BANNERS"   : "/core/shops/banner/get",
        "GET_PROMOTIONS": "/core/shops/promotion/list"
    },
    "PUBLIHED_PROMOTIONS" : {
        "GET_PROMOTIONS" : "/core/promotion/publish/get",
        "REQUEST_PROMOTION" : "/core/shops/promotion/get"
    }
}
