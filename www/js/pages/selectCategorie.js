$(".jasj_categorie").tapend(function(ev){
    if($(this).find(".jasj_categorie_categories").hasClass("open")){
          $(this).find(".jasj_categorie_categories").slideUp().removeClass("open")

    }else{
          $(".jasj_categorie").find(".jasj_categorie_categories.open").slideUp()
          $(this).find(".jasj_categorie_categories").slideDown().addClass("open").css({"display" : "flex"})
    }
})

$(".jasj_categorie_categorie").tapend(function(ev){
    ev.stopPropagation()
    $(".jasj_categorie_categorie.active").removeClass("active")
    $(".jasj_categorie").not($(this).parents(.jasj_categorie)).removeClass("active")
    $(this).parents(".jasj_categorie").addClass("active")
    $(this).addClass("active")
})