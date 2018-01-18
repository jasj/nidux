$(".jasj_categorie_menu .fa-tag").tapend(function(){
    $(".jasj_select_categorie").fadeOut()
})

$(".jasj_categorie_menu .fa-tag").tapend(function(){
    $(".jasj_categorie_menu").addClass("active")
    $(".jasj_categorie_categorie.active").removeClass("active")
    $(".jasj_categorie").removeClass("active")
    $("#selectCat").attr("class","add_btn fa fa-tag fa-fw")
    $("#searchShopsNav div").html($(this).text())
    $(".jasj_select_categorie").fadeOut()
    selectedCategory = "ALL"
    searchPage = 1
    search()
})

$(document).on("tapend",".jasj_categorie",function(ev) {
    if(checkPress(ev)) {
        if($(this).find(".jasj_categorie_categories").hasClass("open")) {
            $(this).find(".jasj_categorie_categories").slideUp().removeClass("open")
        } else {
            $(".jasj_categorie").find(".jasj_categorie_categories.open").slideUp()
            $(this).find(".jasj_categorie_categories").slideDown().addClass("open")
        }
    }   
})

$(document).on("tapend",".jasj_categorie_categorie",function(ev) {
    if(checkPress(ev)) {
        ev.stopPropagation()
        $(".jasj_categorie_menu.active").removeClass("active")
        $(".jasj_categorie_categorie.active").removeClass("active")
        $(".jasj_categorie").not($(this).parents(".jasj_categorie")).removeClass("active")
        $(this).parents(".jasj_categorie").addClass("active")
        $(this).addClass("active")

        $("#searchShopsNav div").html($(this).text())
        $("#selectCat").attr("class",$(this).parents(".jasj_categorie").find("i").attr("class")+" add_btn")
    
        $(".jasj_select_categorie").fadeOut()

        selectedCategory =  $(this).parents(".jasj_categorie").find(".jasj_categorie_header span").attr("i18Trans")+">"+ $(this).attr("i18Trans")
        searchPage = 1
        search()
    }
})
