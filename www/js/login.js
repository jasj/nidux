function checkPreviusLogin () {
    home.init()
    db.get("loginInfoAdmin").then(function (doc) {
        loginId = doc.loginId
        tempObj = {
            loginId: doc.loginId,
            uuid: typeof device !== "undefined" ? device.uuid : "Browser"
        }
        console.log(tempObj)
        $("div#loadingPage .fa").eq(0).css({color : "white"})
        _consolePost(beServices.SECURITY.CHECK_LOGIN, tempObj, function (data) {
            $("div#loadingPage .fa").eq(0).css({color : "darkgoldenrod"})
            $("div#loadingPage .fa").eq(1).css({color : "white"})
            $("div#loadingPage p").html($.t("DOWNLOADING_SHOPS"))
            concurentWait(function(){return shopsReady&&productsReady&&bannersReady},function(){
                setTimeout(function(){ 
                    $("div#loadingPage .fa").eq(1).css({color : "darkgoldenrod"})
                    $("div#loadingPage .fa").eq(2).css({color : "white"})
                    $("div#loadingPage p").html($.t("READY_TO_LUNCH"))
                    setTimeout(function(){ 
                        $("#loadingPage").fadeOut()
                    },1000)
                },500)
            })
            loginObj = data
            fillUserConfigLogin(data) 
            home.init()
            
            if ("endpoints" in data && data.endpoints.length > 0) {
                condoSelected = data.endpoints[0].condoId
                setCondoEndpoint(condoSelected)
            }

            $("#login").fadeOut()
            $("#loadingPage").fadeOut()
            navigator.splashscreen.hide()
            if (cordova.platformId == "android") {
                StatusBar.backgroundColorByHexString("#4066b3")
            }
        }, function (e) {
            $("#login").fadeOut()
            showInfoD($.t("WARNING"),$.t("OFFLINE_MODE"))
            $("#loadingPage").fadeOut()
            if (cordova.platformId == "android") {
                StatusBar.backgroundColorByHexString("#b2431e")
            }
        })
    }).catch(function (err) {
        if(navigator.connection.type == "none"){
            $("div#loadingPage .fa").eq(0).css({color : "red"})
            $("div#loadingPage p").html($.t("NITHER_INTERNET_OR_PRE_LOGIN"))
            showInfoD($.t("ERROR"),$.t("NITHER_INTERNET_OR_PRE_LOGIN"))
        }else{
            $("#loadingPage").fadeOut()
        }

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
    //simDevice()
    if (emailRegEx.test($("#login_user").val())) {
        var tempObj = {
            user: $("#login_user").val().toLowerCase(),
            password: HexWhirlpool($("#login_psw").val()),
            type: userType,
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
                
                console.log(loginObj)
                db.bulkDocs([
                    Object.assign({"_id": "email"}, {email: tempObj.user}),
                    Object.assign({"_id": "loginInfoAdmin"}, data)
                ])
                removeCodesLogin()
                home.init()
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
