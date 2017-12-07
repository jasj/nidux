function onDeviceReady () {
    try {

        document.addEventListener("offline", onOffline, false);
        document.addEventListener("online", onLine, false);

        document.addEventListener("backbutton", backbutton, true)
        document.addEventListener("menubutton", menubutton, true)
        document.addEventListener("resume", onResume, false)
        document.addEventListener("pause", onPause, false)

        
        onDeviceReady_db()
        onDeviceReady_dw()
        onDeviceReady_fm()
        onDeviceReady_mp()
        onDeviceReady_pn()
        onDeviceReady_au()

        
      
    } catch (e) {
        console.log(e)
    }
    setTimeout(function () { $(".wConteiner div p").show() }, 3000)
    checkPreviusLogin()
    console.log("onDeviceReady")
}

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    document.addEventListener("deviceready", onDeviceReady, false)
} else {
    onDeviceReady() // this is the browser
    console.log("we are heare")
}
