
/*
Generics
*/

emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
filenameExtract = /(([^\/]*)\.([a-zA-Z0-9~]*?))$/
data64RegEx = /^(data:.*\/.*?;base64,)(.*)$/

phoneRegEx = /.*?(\d+).*?/g
function FormatInteger (num, length) {
    return (num / Math.pow(10, length)).toFixed(length).substr(2)
}

function concurentWait (testFx, cb, parameters) {
    if (testFx()) {
        cb(parameters)
    } else {
        setTimeout(function () { concurentWait(testFx, cb, parameters) }, 10)
    }
}

function getBase64Image (img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0)

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png")

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "")
}

function showInfoD (title, text, okFx) {
    $("#modal1Btn h2").html(title)
    $("#modal1Btn p").html(text)
    $("#modal1Btn").show()
    $(document).off("click", ".okBtn")
    $(document).on("click", ".okBtn", function () {
        $("#modal1Btn").hide()
        okFx()
    })
}

function showAlert (title, text, yesFn, noFn) {
    $("#modal2Btn h2").html(title)
    $("#modal2Btn p").html(text)
	
    $("#modal2Btn").show()
    $(document).off("click", ".yesBtn")
    $(document).on("click", ".yesBtn", function () {
        $("#modal2Btn").hide()
        yesFn()
    })
    $(document).off("click", ".noBtn")
    $(document).on("click", ".noBtn", function () {
        $("#modal2Btn").hide()
        noFn()
    })
}

function checkPress (ev) {
    try {
        var endX = ev.pageX || ev.originalEvent.changedTouches[0].pageX
        var endY = ev.pageY || ev.originalEvent.changedTouches[0].pageY
        return Math.abs(endX - startTap.X) < 10 && Math.abs(endY - startTap.Y) < 10	
    } catch (e) {
        return true
    }
}

function guid () {
    function s4 () {
        return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
    s4() + "-" + s4() + s4() + s4()
}

function giveJson (string) {
    if (typeof string == "object") {
        return string
    }
    try {
        return JSON.parse(string)
    } catch (e) {
        return false
    }
}

function generateAESPairs () {
    var key = []
    var iv = []
    for (var k = 0; k < 16; k++) {
        key.push(Math.floor(Math.random() * 255))
    }
    for (var k = 0; k < 16; k++) {
        iv.push(Math.floor(Math.random() * 255))
    }

    return {k: key, s: iv}
}

function RSAencript (text) {
    var rsa = new RSAKey()
    rsa.setPublic("00d4b948bff14a76c7f9ce6660c626ff52472d7a415326bb3c2fe8028a552513ccfe6bf168455cb08e2ee78fa50f10e268930236f14a39dff966a8cd8c79b2227c2f99af3ff709b78975d549155f0d0cdfde4ee3cb9b9639452de4151b293432ff4458dd0afe843011cee1032d6254968181b2dbfd7f3acc72e4e3019572adc5a087aa7f5274cecb9a97b84b0d728dee1464af2dbc5bba5a226590bf7f455b0ee476b16a4f0fcebf975e7cd5b00b67a7d612299a035a74ba6e3577f949191d102f82cdc66092bc7c9f37274b7e6e62728953c6da411db19679e0513748c11f0ee2a3c0b95101cae72e451850ab92a44ebb47ea9d0a22e286afe68528adf466e07f", "10001")
    var res = rsa.encrypt(text)
    if (res) {
        return hex2b64(res)
    }
}

function _consolePost (url, obj, cb, fail) {
    url = ConsoleServerIP + url
    _post(url, obj, cb, fail)
}

function _condominiumPost (url, obj, cb, fail) {
    url = CondominiumIP + url
    _post(url, obj, cb, fail)
}

function _post (url, obj, cb, fail) {
    addLoginInfo(obj)
    var pair = generateAESPairs()
    var textBytes = aesjs.utils.utf8.toBytes(JSON.stringify(obj))
    var aesOfb = new aesjs.ModeOfOperation.ofb(pair.k, pair.s)
    var encryptedBytes = aesOfb.encrypt(textBytes)
    if (cordovaHTTP != undefined) {
        return cordovaHTTP.post(url, {
            k: RSAencript(JSON.stringify(pair)),
            c: aesjs.utils.hex.fromBytes(encryptedBytes)
        }, {}, function (rs) { cb(JSON.parse(rs.data)) }, function(e){
			if((omitAuthServices && omitAuthServices.indexOf(url) == -1) && e.status == 401){
				db.destroy().then(function () { onDeviceReady_db() })
				$("#modal").trigger("tapend")
				clearWorkspace()
				$("#login").fadeIn();
			} else{
				fail(e)
			}
		})
    } else {
        return $.post(url, {
            k: RSAencript(JSON.stringify(pair)),
            c: aesjs.utils.hex.fromBytes(encryptedBytes)
        }, cb).fail(function(e){
			if((omitAuthServices && omitAuthServices.indexOf(url) == -1) && e.status == 401){
				db.destroy().then(function () { onDeviceReady_db() })
				$("#modal").trigger("tapend")
				clearWorkspace()
				$("#login").fadeIn();
			}else{
				fail(e)
			}
		})
    }
}

function addLoginInfo (obj) {
    obj.loginId = obj.loginId || loginObj.loginId
    obj.uuid = typeof device !== "undefined" ? device.uuid : "uuid()"
}

loginInfo = function (callback) {
    return db.get("loginInfoAdmin").then(callback)
}

function getNameFromUrl (url) {
    var m
    if ((m = filenameExtract.exec(url)) !== null) {
        return {
            fullName: m[1],
            name: m[2],
            ext: m[3]
        }
    }
    return {
        fullName: "some",
        name: "some.txt",
        ext: "txt"
    }
}

function simDevice () {
    window.device = {platform: "chrome", uuid: "uuid()"}
    window.cordova = {platformId: "chrome"}
    PN = "BROWSER" + uuid()
    navigator.splashscreen = { show: function () {}}
    window.cordovaHTTP = null
    dirc = {
        getDirectory: function (a, b, c, f) {
            f()
        }
    }

    window.plugins = {
        toast: {
            showLongCenter: function (m) { console.log("showLongCenter", m) }
        }
    }
    window.requestFileSystem = function (a, b, c, f) {
        c(dir)
    }
    onDeviceReady_db()
    checkPreviusLogin()
}

var observeDOM = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener

    return function (obj, callback) {
        if (MutationObserver) {
            // define a new observer
            var obs = new MutationObserver(function (mutations, observer) {
                if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) { callback() }
            })
            // have the observer observe foo for changes in children
            obs.observe(obj, { childList: true, subtree: true })
        } else if (eventListenerSupported) {
            obj.addEventListener("DOMNodeInserted", callback, false)
            obj.addEventListener("DOMNodeRemoved", callback, false)
        }
    }
})()

function escapeUnicode (str) {
    return str.replace(/[^\0-~]/g, function (ch) {
        return "\\u" + ("000" + ch.charCodeAt().toString(16)).slice(-4)
    })
}

function unescapeUnicode (str) {
    var r = /\\u([\d\w]{4})/gi
    str = str.replace(r, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16)) 
    })
    return unescape(str)
}

function zeroPad (num, places) {
    var zero = places - num.toString().length + 1
    return Array(+(zero > 0 && zero)).join("0") + num
}

function normalDateOnly (date) {
    var date_ = new Date(date)
    return date_.getUTCFullYear() + "-" + zeroPad(date_.getUTCMonth() + 1, 2) + "-" + zeroPad(date_.getUTCDate(), 2)
}

function normalDate (date) {
    var date_ = new Date(date)
    return date_.getUTCFullYear() + "-" + zeroPad(date_.getUTCMonth() + 1, 2) + "-" + zeroPad(date_.getUTCDate(), 2) + " " + zeroPad(date_.getUTCHours()) + ":" + zeroPad(date_.getUTCMinutes()) + ":" + zeroPad(date_.getSeconds())
}

function normalDateLocal (date) {
    var date_ = new Date(date)
    return date_.getFullYear() + "-" + zeroPad(date_.getMonth() + 1, 2) + "-" + zeroPad(date_.getDate(), 2) + " " + zeroPad(date_.getHours()) + ":" + zeroPad(date_.getMinutes()) + ":" + zeroPad(date_.getSeconds())
}

function normalDateOnlyLocal (date) {
    var date_ = new Date(date)
    return date_.getFullYear() + "-" + zeroPad(date_.getMonth() + 1, 2) + "-" + zeroPad(date_.getDate(), 2) 
}


function Int2Time (integer) {
    return {h: parseInt(integer / 100), m: integer % 100}
}

function imageContent(url,imageFx){
    db.get(HexWhirlpool(url)).then(function(base64){
        imageFx("data:image/jpeg;base64,"+base64.image)
    }).catch(function(){
         var img = new Image()
         img.setAttribute("crossOrigin","Anonymous")
         img.src = url
         img.onload = function(){
             var b64 = getBase64Image(img)
             imageFx("data:image/jpeg;base64,"+b64)
             db.upsert(HexWhirlpool(url),{image : b64})
         }
    })
}


function setCondoEndpoint (condoId) {
    for (var i = 0; i < loginObj.endpoints.length; i++) {
        var condo = loginObj.endpoints[i]
        if (condo.condoId == condoId) {
            CondominiumIP = condo.endpoint
            break
        }
    }
}

function binaryAgent (str) {
    var result = []
    for (var i = 0; i < str.length; i++) {
        result.push([str.charCodeAt(i)])
    }
    return result.join("")
}

function addStylesheetRule (rule) {
    var styleEl = document.createElement('style'),
        styleSheet;
  
    // Append style element to head
    document.head.appendChild(styleEl);
  
    // Grab style sheet
    styleSheet = styleEl.sheet;
  
  
  
      // Insert CSS Rule
      var l =  styleSheet.cssRules.length
      styleSheet.insertRule(rule,l);
      return l
  }

  function hexToHSL(color,upLigth){
    var hsl = rgbToHsl(parseInt("0x"+color.replace("#","").substr(0,2)),parseInt("0x"+color.replace("#","").substr(2,2)),parseInt("0x"+color.replace("#","").substr(4,2)))
 hsl[2] = (parseInt(hsl[2])+upLigth)+"%"
    return "hsl(" + hsl.join(",")+")"
 }


 function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) { h = s = 0; } 
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    return [(h*100+0.5)|0, ((s*100+0.5)|0) + '%', ((l*100+0.5)|0) + '%'];
}


Number.prototype.thousand = function () { return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }

if ($ != undefined) {

    $(document).on("tapend","[href]",function(ev){
        if(checkPress(ev)){
            ev.preventDefault()
            navigator.app.loadUrl($(this).attr("href"), { openExternal:true}); 
        }
    })

    $.fn.hasAttr = function (name) {  
        return this.attr(name) !== undefined
    }

    $.fn.hasScrollBar = function () {
        return this.get(0).scrollHeight > this.height()
    }

    $(".switch").tapend(function (ev) {
        if (checkPress(ev)) {
            ev.preventDefault()
            $(this).prop("checked", !$(this).prop("checked"))
        }
    })

    // Star in Tap
    startTap = {X: 0, Y: 0}
    $("*").tapstart(function (ev) {
        startTap.X = ev.pageX || ev.originalEvent.touches[0].pageX
        startTap.Y = ev.pageY || ev.originalEvent.touches[0].pageY
    })
}
