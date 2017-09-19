function checkPreviusLogin () {
    navigator.splashscreen.show()
    db.get("loginInfoAdmin").then(function (doc) {
        loginId = doc.loginId
        tempObj = {
            loginId: doc.loginId,
            uuid: typeof device !== "undefined" ? device.uuid : "Browser"
        }
        console.log(tempObj)
        _consolePost(beServices.SECURITY.CHECK_LOGIN, tempObj, function (data) {
            loginObj = data
            fillUserConfigLogin(data) 
            
            if ("endpoints" in data && data.endpoints.length > 0) {
                condoSelected = data.endpoints[0].condoId
                setCondoEndpoint(condoSelected)
            }

            $("#login").fadeOut()
            navigator.splashscreen.hide()
            if (cordova.platformId == "android") {
                StatusBar.backgroundColorByHexString("#4066b3")
            }
        }, function (e) {
            $("#login").fadeOut()
            navigator.splashscreen.hide()
            if (cordova.platformId == "android") {
                StatusBar.backgroundColorByHexString("#4066b3")
            }
        })
    }).catch(function (err) {
        navigator.splashscreen.hide()
    })
}

function logout () {
}

function sendPassword () {
}

$("#logout_btn").tapend(function () {
    showAlert($.t("LOGOUT"), $.t("LOGOUT_ASK"), function () {
        _consolePost(beServices.SECURITY.LOGOUT, {loginId: loginId}, function (data, status) {
            db.destroy().then(function () { onDeviceReady_db() })
            $("#modal").trigger("tapend")
            clearWorkspace()
            $("#login").fadeIn()
        }, function (e) {
            showInfoD($.t("ERROR"), $.t("SOMETHING_WENT_WRONG_RETRY"))
        })
    }, function () {

    })
})

$(".login_input input").focus(function () { $("#login_info_txt").html("") })

$(".login--Credentials").tapend(function () {
    simDevice()
    if (emailRegEx.test($("#login_user").val())) {
        var tempObj = {
            user: $("#login_user").val().toLowerCase(),
            password: HexWhirlpool($("#login_psw").val()),
            uuid: typeof device !== "undefined" ? device.uuid : "Browser",
            pushNumber: typeof device !== "undefined" ? PN : "Browser"
        }
        try {
            console.log(tempObj)
            _consolePost(beServices.SECURITY.LOGIN, tempObj, function (data, status) {
                $("#login").fadeOut()
                if (cordova.platformId == "android") {
                    StatusBar.backgroundColorByHexString("#4066b3")
                }

                loginId = data.loginId
                loginObj = data
                fillUserConfigLogin(data) 

                console.log("data length: ", data.endpoints.length)

                if ("endpoints" in data && data.endpoints.length > 0) {
                    condoSelected = data.endpoints[0].condoId
                    setCondoEndpoint(condoSelected)
                }

                db.bulkDocs([
                    Object.assign({"_id": "email"}, {email: tempObj.user}),
                    Object.assign({"_id": "loginInfoAdmin"}, data)
                ])
            }, function (e) {
                if (e.status == 401) {
                    $("#login_info_txt").html($.t("BAD_CREDENTIALS"))
                } else {
                    console.log(e)
                }
            })
        } catch (err) {
            console.log("error", err)
        }
    } else {
        $("#login_info_txt").html($.t("ERROR_EMAIL_VALIDATION"))
    }
})
