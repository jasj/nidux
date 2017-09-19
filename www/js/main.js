$(document).ready(function () {
    /* 
    $("select").select2({
        placeholder: "Tipo de persona"
    });
    */
})

$(document).on("tapend", ".checkbox", function () {
    $(this).toggleClass("check")
})

$(".timepicker").tapend(function (e) {
    e.preventDefault()
    $(".jasj_time").show().attr("tmr-target", $(this).attr("id"))
})

function uuid () {
    var uuid = "", i, random
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0

        if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += "-"
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16)
    }
    return uuid
}

function clearWorkspace () {
    $(".people").remove()
    $("#resource_request_list .nice-wrapper").html("")
    $(".bill").remove()
    $("#service_request_list .nice-wrapper").html("")
    $("#chat_list .nice-wrapper").html("")
}

$(function () {
    $(".get-nicer").each(function () {
        var _this = $(this)
        _this.niceScroll(_this.find(".nice-wrapper"), {
            cursorwidth: "5px",
            enableobserver: true
        })

        observeDOM(this, function () {
            setTimeout(function () { _this.getNiceScroll().resize() }, 1000)
        })
    })
})

var addRippleEffect = function (e) {
    var target = e.target
    if (target.tagName.toLowerCase() !== "button") return false
    var rect = target.getBoundingClientRect()
    var ripple = target.querySelector(".ripple")
    if (!ripple) {
        ripple = document.createElement("span")
        ripple.className = "ripple"
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + "px"
        target.appendChild(ripple)
    }
    ripple.classList.remove("show")
    var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop
    var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft
    ripple.style.top = top + "px"
    ripple.style.left = left + "px"
    ripple.classList.add("show")
    return false
}

// Load Translated
$.i18n.init({lng: navigator.language, resGetPath: "language/__lng__/__lng__.json", fallbackLng: "es"}, function () {
    $('#slider').nivoSlider();
    $("[i18Trans]").each(function () {
        if ($(this).hasAttr("i18Target")) {
            $(this).attr($(this).attr("i18Target"), $.t($(this).attr("i18Trans")))
        } else {
            $(this).html($.t($(this).attr("i18Trans")))
        }
    })
    
    mt = [$.t("JANUARY"), $.t("FEBRUARY"), $.t("MARCH"), $.t("APRIL"), $.t("MAY"), $.t("JUNE"), $.t("JULY"), $.t("AUGUST"), $.t("SEPTEMBER"), $.t("OCTOBER"), $.t("NOVEMBER"), $.t("DECEMBER")]
    dict = {
        timeunits: {
            "MIN": $.t("MINUTES_DICT"),
            "HR": $.t("HOURS_DICT"),
            "DAYS": $.t("DAYS_DICT")
        },
        current: {
            "DAY": $.t("DAY_DIC"),
            "WEEK": $.t("WEEK_DIC"),
            "MONTH": $.t("MONTH_DIC")
        }
    }
})
