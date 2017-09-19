function pushDriver (ev) {
    console.log("ev", ev)
    var payload = ev.payload
    if (ev.coldstart) {
        console.log("<li>--COLDSTART NOTIFICATION--" + "</li>")
        console.log("cold", ev)
        console.log("<li>--COLDSTART NOTIFICATION--" + "</li>")
    } else {
        console.log("<li>--BACKGROUND NOTIFICATION--" + "</li>")
        console.log("back", ev)
        console.log("<li>--BACKGROUND NOTIFICATION--" + "</li>")
    }

    switch (payload.type) {
        case "chat":
            var inTheChat = false
            if (currentChat != null) {
                inTheChat = currentChat != null && ev.foreground && (currentChat.chatId == payload.chatId) && ($(".section_active").attr("section-name") == "msgChat")
            }
            console.log(inTheChat)
            console.log(ev.payload.chatId)
            getMessages(ev.payload.chatId, inTheChat, false)	
            chat.getChats()
            home.init()
            console.log(inTheChat)
            if (inTheChat) {
                $(".qtyNewMsg").attr("qty", (parseInt($(".qtyNewMsg").attr("qty")) + 1)).html($(".qtyNewMsg").attr("qty"))
            }
            break

        case "requestAuth":
            showAlert($.t("ENTRY_REQUEST"), payload.message, function () {
                var tempObj = {
                    "requestId": payload.requestId,
                    "guestId": loginObj.userId,
                    "description": payload.authDescription,
                    "type": payload.authType,
                    "value": payload.authValue,
                    "approved": true
                }
                console.log(tempObj)
                _condominiumPost(beServices.CONDOMINUS.GUEST_AUTHORIZATION_RESPONSE, tempObj, function (data) {
                    showInfoD($.t("AUTHORIZED_RES"), $.t("ENTRY_AUTHORIZED") + payload.authDescription)
                })
            }, function () {
                var tempObj = {
                    "requestId": payload.requestId,
                    "guestId": loginObj.userId,
                    "description": payload.authDescription,
                    "type": payload.authType,
                    "value": payload.authValue,
                    "approved": false
                }
                console.log("aquiTemp", tempObj)
                _condominiumPost(beServices.CONDOMINUS.GUEST_AUTHORIZATION_RESPONSE, tempObj, function (data) {
                    showInfoD($.t("REJECTED"), $.t("ENTRY_REJECTED") + payload.authDescription)
                })
            })
            break

        default:
            console.log("this version do not recognize the type: " + payload.type)
            chat.getChats()
            break
    }
}
