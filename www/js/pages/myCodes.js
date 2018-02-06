function addMyCodes(req,promoObject) {
    var dty = new Date().getTime()
    $("#promU"+req.promotionPerUserId).remove()
    if(dty < req.dueTime  && req.redeemed == null) {
        imageContent(promoObject[req.promotionId].image+"?promoid="+req.promotionId,function(image){
                $(`<div class="code_lst_elment" id="promU`+req.promotionPerUserId+`">
                    <div class="front">
                    <div class="ribbon">`+( Math.ceil(( req.dueTime - dty) / (1000 * 3600 * 24))  )+' '+$.t("DAYS")+`</div>
                    <h1>`+promoObject[req.promotionId].shopName +`</h1>
                
                    <img class="promoPictoure" src="`+image+`">                
                
                    <h3>`+promoObject[req.promotionId].header +`</h3>
                    <table>
                        <tbody>
                            <tr>
                                <th>` + $.t("CODE") + `</th>
                                <th>` + $.t("EXPIRES") + `</th>
                            </tr>
                            <tr>
                                <td>`+req.code+`</td>
                                <td>`+normalDateOnlyLocal(req.dueTime)+`</td>
                            </tr>
                        </tbody>
                    </table>

                    <p>`+promoObject[req.promotionId].description+`</p>
                
                    </div>
                    <div class="back">
                            <h3>`+promoObject[req.promotionId].header +`</h3>
                            <div class="codePosition"></div>
                            <div class="disclosure">`+promoObject[req.promotionId].disclosure +`</div> 
                    </div>
                </div>`).appendTo("#codeList .nice-wrapper")
                new QRCode($("#promU"+req.promotionPerUserId +" .codePosition").get(0),{text:  req.code, colorDark : "#000",correctLevel : QRCode.CorrectLevel.H ,width: window.innerWidth - 80 ,width: window.innerWidth - 80});
                $("#promU"+req.promotionPerUserId).flip()
                return req.promotionId
        })
    } else {
        $(`<div class="inactiveCodeElement">
            <h3>`+promoObject[req.promotionId].shopName+`</h3>
            <p>`+promoObject[req.promotionId].description+`</p>
            <table>
                <tbody><tr>
                    <th>`+(req.redeemed != null ? $.t("REDEEMED") : $.t("EXPIRED"))+`</th><td>`+normalDateOnlyLocal(req.redeemed != null ? req.redeemed : req.dueTime)+`</td>
                </tr>
                    </tbody></table>
            </div>`).prependTo("#codeListRedem .nice-wrapper")
            if(dty >= req.dueTime){

                imageContentRemove(promoObject[req.promotionId].image+"?promoid="+req.promotionId)
                console.log( promoObject[req.promotionId].image+"?promoid="+req.promotionId)
                console.log("|||°", req.promotionId,req.promotionPerUserId)
            }
        return null
    }
}

function requestNewMyCodes(version,oldPromo) {
    loginInfo(function(x){
        _consolePost("/core/shops/promotion/perUser/list", {
            loginId : x.loginId,
            type: "C",
            uuid : device.uuid,
            userId: x.userId,
            version:version},function(data){
                if(!$.isEmptyObject(data)){
                    oldPromo.version = data.version
                    Object.assign(oldPromo.promos, data.promos)
                    var newPromoRequest = data.promosPerUser.map(function(t){return t.promotionPerUserId})
                    var notUpdatedPromoRequest =  oldPromo.promosPerUser.filter(function(t){
                        return newPromoRequest.indexOf(t.promotionPerUserId) == -1 //&&
                               t.dueTime < new Date().getDate()
                    })
                    oldPromo.promosPerUser = notUpdatedPromoRequest.concat(data.promosPerUser)
                    for(var i = 0; i < oldPromo.promosPerUser.length; i++) {
                        addMyCodes(oldPromo.promosPerUser[i],oldPromo.promos)
                    }
                    db.upsert("promosPerUser",oldPromo)
                }
            }
        )
    })
}

function getSavedMyCodes() {
    db.get("promosPerUser").then(function(data){
        for(var i = 0; i < data.promosPerUser.length;i++){
            addMyCodes(data.promosPerUser[i],data.promos)
        }
        requestNewMyCodes(data.version,data) 
    }).catch(function(e){
        requestNewMyCodes(0,{promosPerUser: [], promos:{}}) 
    })  
}

function removeCodesLogin() {
    $("#codeList .nice-wrapper").html("")
    $("#codeListRedem .nice-wrapper").html("")
}

myCodes = {
    init : function(t){
        getSavedMyCodes()
    }
}
