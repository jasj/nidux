$("#header_user_btn").tapend(function () {
    db.get("email").then(function (email) {
        $("#personalProfile span").html(email.email)
        var data = new Identicon(HexWhirlpool(email.email), 420).toString()
        $("#profilePicture").prop("src", "data:image/png;base64," + data)
    })

    loginInfo(function (doc) {
        console.log("doc: ", doc)
    })
    $("#modal").fadeIn()
    $("#user_config").fadeIn()
})

function fillUserConfig (obj) {
    requestDashboardInfo()
}

function fillUserConfigLogin(data) {
    var condos = 0
    if ("endpoints" in data) {
        condos = data.endpoints.length
    }
    $("#home_condos").find(".fa-home").html(" " + condos)
    $(".get-nicer").getNiceScroll().resize()
}

$(document).on("change", "#myCondos", function () {
    $("#condo_logo").trigger("tapend")
    $("#modal").trigger("tapend")
    condoSelected = $(this).find("option:selected").val()
    setCondoEndpoint(condoSelected)
    var condominiumName = $("#myCondos").find("option:selected").html()
    console.log(condominiumName)
    clearWorkspace()
    showInfoD($.t("SWITCH_CONDOMINIUM_HEADER"), $.t("YOU_ARE_IN_CONDOMINIUM") + condominiumName, function () {})
})

$(document).on("tapend", ".close_modal_btn", function () {
    $("#modal").trigger("tapend")
})

$(".authIntegration_key").tapend(function (ev) {
    if (checkPress(ev)) {
        showAlert($.t("UPDATED_CREDENTIALS"), "<table><tr><th>" + $.t("EMAIL") + '</th><td><input type="email" class="psw_input_usr"></td></tr><tr><th>' + $.t("PASSWORD") + '</th><td><input type="text" class="psw_input_usr"></td></tr></table>', function () {
            loginInfo(function (loginObj) {
                var tempObj = {
                    password: HexWhirlpool($(".psw_input_usr").eq(1).val()),
                    user: $(".psw_input_usr").eq(0).val(),
                    userId: loginObj.userId
                }
                console.log(tempObj)
                _consolePost(beServices.SECURITY.UPDATE_CREDENTIALS, tempObj, function (data, status) {
                    showInfoD($.t("SUCCESS"), $.t("UPDATED_CREDENTIALS_SUCCESS"))
                    if ("user" in tempObj && tempObj.user) {
                        db.upsert("email", {email: tempObj.user})
                    }
                    $("#personalProfile span").html(tempObj.user)
                }, function (e) {
                    showInfoD($.t("ERROR"), $.t("SOMETHING_WENT_WRONG_RETRY"))
                    console.log(e)
                })
            })
        })
    }
})
