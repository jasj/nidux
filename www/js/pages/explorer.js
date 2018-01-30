



explorer = {
    init : function(t,tt){
        var homeSearch = $.t("<input id='myShopsSearch' type='search' placeholder='Buscar'> <i class='search_input fa fa-search'></i>")
        backSection = $(t).parents("[section-name]").attr("section-name")
        $("#explorerNav .fa-chevron-left").attr("section-target",backSection)
        $("#explorerNav .fa-chevron-left").attr("section-title",backSection=="home" ? homeSearch : shop_name )
        $("#explorerNav .fa-chevron-left").attr("section-color",backSection=="home" ? "" : "KEEP_LAST_VALUE" )
        
        var eURL =  $(t).attr("explorer-href") 
        eURL += /\?.+?$/.test(eURL) ? "&inapp=1" : "?inapp=1"
        loginInfo(info => {
            eURL += "&sso="+ info.userId
            $("#exporerIframe").attr("src", eURL)
            console.log( eURL)
           // window.frames['exporerIframe'].contentWindow.postMessage("MOBILIZE", $(t).attr("explorer-href"));
        })    
    }
}

