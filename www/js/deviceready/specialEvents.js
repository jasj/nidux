onResume = function(){

}

onPause = function(){

} 

onLine = function(){
    showInfoD($.t("INTERNET"),$.t("CONECTION_BACK"))
    if (cordova.platformId == "android") {
        StatusBar.backgroundColorByHexString("#4066b3")
    }
} 
    
onOffline = function(){
    showInfoD($.t("NOT_INTERNET"),$.t("CONECTION_LOST"))
    if (cordova.platformId == "android") {
        StatusBar.backgroundColorByHexString("#b2431e")
    }

} 