document.getElementById.onload = function(){
    window.frames['exporerIframe'].contentWindow.postMessage("hello there!", "https://www.bufalosmojados.cr/a");
    console.log("loded")
}

explorer = {
    init : function(t,tt){
        console.log($(t))

        $("#exporerIframe").attr("src", $(t).attr("explorer-href"))
        console.log( $(t).attr("explorer-href"))
        window.frames['exporerIframe'].contentWindow.postMessage("MOBILIZE", $(t).attr("explorer-href"));
       
    }
}

