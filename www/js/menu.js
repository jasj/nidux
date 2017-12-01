// Main menu
$("#header_menu_btn").tapend(function () {
    // alert($("#main_menu").css("left"));
    if (true) {
        $("#main_menu").animate({"left": "0px"})
        $("#modal").show()
    }
})

$("#modal").tapend(function () {
    $("#main_menu").animate({"left": "-250px"})
    $("#modal").hide()
    $("#user_config").hide()
})

$(document).on("tapend", "[section-target]", function (ev) {
    this_ = $(this)
    if (checkPress(ev)) {
        var sectionTarget = $("[section-name=" + $(this).attr("section-target") + "]")
        var title = $(this).hasAttr("section-title") ? ($(this).attr("section-title") == "KEEP_LAST_VALUE" ? title :  $.t($(this).attr("section-title"))): $(this).text()
            color = $(this).hasAttr("section-color") ? ($(this).attr("section-color") == "KEEP_LAST_VALUE" ? color :  $.t($(this).attr("section-color"))): "#d7c101"
        console.log(color)
        var tabToGo  = $(this).hasAttr("section-tabToGo") ? $.t($(this).attr("section-tabToGo")) : "0"
        $("#header").css({"background-color": color})
        if ($(this).hasClass("menu_nav")) {
            $(".nav_li_selected").removeClass("nav_li_selected")
            $(this).addClass("nav_li_selected") 
        }

        if (sectionTarget.attr("avoid-autoscroll") != "true" && this_.attr("avoid-autoscroll") != "true") {
            sectionTarget.find(".get-nicer .nice-wrapper").css({"transform": "translate3d(0px, 0px, 0px)"})
        }


        $(".with_error").removeClass("with_error")

        setTimeout(function () {
            $("#header_section_description").html(title)
            $("#main_menu").animate({"left": "-250px"})
            $("#modal").hide()
            $(".section_active").removeClass("section_active")
            sectionTarget.addClass("section_active")
            sectionTarget.find(".tablist>li:eq("+tabToGo+")").trigger("tapend")
            sectionTarget.find(".get-nicer").getNiceScroll().resize()
        }, 100) // to avoid focus
        if ($(this).hasAttr("section-fx")) {
            eval($(this).attr("section-fx") + "(this" + ($(this).hasAttr("section-fx-parameters") ? "," + $(this).attr("section-fx-parameters") : "") + ")")
        } else if (eval("typeof " + $(this).attr("section-target") + '.init == "function"')) {
            eval($(this).attr("section-target") + ".init(this" + ($(this).hasAttr("section-fx-parameters") ? "," + $(this).attr("section-fx-parameters") : "") + ")")
        }
    }
})

// tab menu
$(document).on("tapend", ".tablist>li:not(.active)", function () {
    $(".tablist[tab-group=" + $(this).parent().attr("tab-group") + "]>li.active").removeClass("active")
    $(this).addClass("active")

    $(this).parent().parent().parent().find("[tab-name]").hide()
    $("[tab-name=" + $(this).attr("tab-target") + "]").show()
    $(".get-nicer").getNiceScroll().resize()

    if($(this).hasAttr("tab-fx")) {eval($(this).attr("tab-fx"))}
})

$("#slide_menu").swipe({
    // Generic swipe handler for all directions
    swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
        if (distance > 125) {
            $("#main_menu").animate({"left": "0px"})
        } else {
            $("#main_menu").animate({"left": "-250px"})
            $("#modal").hide()
            console.log("here")
        }
    },
    swipeStatus: function (event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
        console.log(distance)
        if (direction == "right" && distance < 250) {
            $("#modal").show()
            $("#main_menu").css({"left": (-250 + distance) + "px"})
        } else {
            return 0
        }
    },
    threshold: 0
})
