

shop = {
    init : function(t,tt){
        shop_name = $(t).attr("section-title")
        
        $('#slider_shop').nivoSlider();
        addStylesheetRule("#shopNav .active { color: "+$(t).attr("section-color")+"; border-bottom: 2px solid "+$(t).attr("section-color")+"}")
        addStylesheetRule("[section-name=shop] .product-card{ color: "+$(t).attr("section-color")+";}")
        addStylesheetRule("[section-name=shop] .product-card{ color: "+$(t).attr("section-color")+";}")
        addStylesheetRule("[section-name=shop] .product-info h6{ background-color: "+$(t).attr("section-color")+";}")
        addStylesheetRule(".he_said{ background-color: "+hexToHSL(color,20)+";}")
        addStylesheetRule("[section-name=shop] .nicescroll-cursors{ background-color: "+$(t).attr("section-color")+" !important;}")
        addStylesheetRule("[section-name=shop] .chat_lst_element_msgQty{ background-color: "+$(t).attr("section-color")+" !important;}")
       // $("[section-name=shop] .products").css({ "top" : (50 + $("#slider_shop").outerHeight())+"px"} )
        $("[section-name=shop] .products").css({ "top" : 150+"px"} )
        $(".chat_action_bar>.fa").css({ "color" : color} )
        $(".btn_get").css({ "background-color" : color} )
        $("#chat_sender_btn").css({ "color" : color} )
        $("#select_attachment_type").css({ "color" : color} )
        var mySwiper = new Swiper ('.swiper-container', {
            loop: true,
            
            // If we need pagination
            pagination: '.swiper-pagination',
            
            // Navigation arrows
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',

        paginationClickable: true
        
          }) 
//temporal demo chat
          insertChat({
            id : 1000,
            isGroup: 1,
            name: "Ventas",
            message : "Gracias por su compra",
            writeDate : 1505783672732,
            messages: 2
        })

        insertChat({
            id : 1001,
            isGroup: 1,
            name: "Soporte",
            message : "Denos un segundo, para verificar lo que sucede",
            writeDate : 1505753662732,
            messages: 1
        })

        insertChat({
            id : 1003,
            isGroup: 1,
            name: "Transporte",
            message : "Listo ya me llegó &#x263a;",
            writeDate : 1505743662732,
            messages: 0
        })

        insertMsg("I", {
            from: "I",
            chatId: 3,
            fromType: "U",
            message: {
                type: "text",
                data: "Hola, hoy llegaba mi paquete, cierto?"
            },
            writeDate: 1505753662732,
            status: "R"
        })

        insertMsg("I", {
            from: "I",
            chatId: 5,
             name: "Esteban",
            fromType: "R",
            message: {
                type: "text",
                data: "La orden <a href='#124567'>#124567</a> esta programada para la tarde, debe de llegar en cualquer momento."
            },
            writeDate: 1893949485,
            status: "R"
        })

        insertMsg("I", {
            from: "I",
            chatId: 6,
            fromType: "U",
            message: {
                type: "text",
                data: "Listo ya me llegó &#x263a;"
            },
            writeDate: 1505743662732,
            status: "R"
        })


    }
}