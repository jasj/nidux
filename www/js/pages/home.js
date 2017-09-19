function getEstateIdentifier (estates, id) {
    return estates.filter(function (estate) { return estate.estateId == id })[0].identifier
}

function requestDashboardInfo () {
    loginInfo(function (doc) {
        var tempObj = {
            userId: doc.userId
        }
        _consolePost(beServices.SECURITY.DASHBOARD, tempObj, function (data) {
            $("#home_condos").find(".fa-home").html(" " + data.length)
            $(".get-nicer").getNiceScroll().resize()
            console.log(data)
        })
    })
}

home = {
    init: function () {
        requestDashboardInfo()
    }
}
