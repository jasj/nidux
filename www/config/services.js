beServices = {
    "SECURITY": {
        "CHECK_LOGIN": "/security/checkLogin",
        "DASHBOARD": "/security/dashboard",
        "REGISTER": "/security/register",
        "LOGOUT": "/security/logout",
        "LOGIN": "/security/login",
        "UPDATE_CREDENTIALS": "/security/update/credentials" 
    },
    "CONDOMINUS": {
        "GUEST_ADDESTATE": "/condominus/guest/addEstate",
        "GUEST_AUTHORIZATION_RESPONSE": "/condominus/guest/authorization/response"
    },
    "CHAT": {
        "STATUS_DETAIL": ":2521/ravel/1.0/chat/status/detail",
        "READ_APP": ":2521/ravel/1.0/chat/read/app",
        "DELETE_MESSAGE_APP": ":2521/ravel/1.0/chat/delete/message/app",
        "READ_MESSAGE_VALIDATE": ":2521/ravel/1.0/chat/read/message/validate",
        "DOWNLOADER_READ_MESSAGE": "http://54.212.218.84:2591/downloader/1.0/read/message/",
        "DELETE_APP": ":2521/ravel/1.0/chat/delete/app",
        "READ_USERS_GROUPS": ":2521/ravel/1.0/chat/read/users/groups",
        "WRITE_APP": ":2521/ravel/1.0/chat/write/app"
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
