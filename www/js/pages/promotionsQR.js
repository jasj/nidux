function getPromotionCodeAndDi(promotionId){
    loginInfo(function (doc) {
        var tempObj = {
            loginId: doc.loginId,
            type: "C",
            uuid: device.uuid,
            userId : doc.userId, 
            promotionId: promotionId
        }
        console.log("tempObj",tempObj)
        _consolePost(beServices.PUBLIHED_PROMOTIONS.REQUEST_PROMOTION,tempObj,function (data) {
        $("#qrPromotionCode").html("")
        new QRCode(document.getElementById("qrPromotionCode"),{text: JSON.stringify({"qrValue" : data.qrCode}), colorDark : "#000",correctLevel : QRCode.CorrectLevel.M ,width: window.innerWidth - 80 ,width: window.innerWidth - 80});
        $("#promotionDisclamer").html("disclosure")
        })
   })
}

promotionsQR = {
    init : function(t){
       $("#promotionQRImage").attr("src", $(t).parent().find("img").attr("src"))
       $("#promotionsQRNav div").html($(t).parent().find("h4").html())
       getPromotionCodeAndDi($(t).attr("niduxPromoCode"))
    }
}