window = {
    crypto: {
        getRandomValues: function (array) {
            for (var i = 0; i < array.length; i++) {
                array[1] = parseInt(Math.random() * 999999999)
            }
        }
    }
}

$ = undefined

rng_psize = 256
importScripts("../globals.js")
importScripts("../../config/services.js")
importScripts("../../lib/rsa/rsa.js")
importScripts("../../lib/rsa/BigInt.js")
importScripts("../../lib/rsa/Barrett.js")
importScripts("../../lib/rsa/jsbn.js")
importScripts("../../lib/rsa/rng.js")
importScripts("../../lib/rsa/jsbn2.js")
importScripts("../../lib/rsa/prng4.js")
importScripts("../../lib/rsa/base64.js")
importScripts("../crypto/aes.js")
importScripts("../generics.js")
queueSendPendings = []
var i = 0

cordovaHTTP = {
    post: function (url, data, headers, callback, fail) {
        var xhr = new XMLHttpRequest()
        xhr.open("POST", url, false)
        xhr.setRequestHeader("Content-type", "application/json")
        try {
            xhr.send(JSON.stringify(data))
            console.log("status> ", xhr.status)
            if (xhr.status == 200) {
                console.log(callback)
                callback({data: xhr.responseText})
            } else {
                fail({error: xhr.status})
            }
        } catch (e) {
            fail({error: e})
        }
    }
}

function sendMessage (msg) {
    var retBool
    var newMsg = JSON.parse(JSON.stringify(msg))
    delete newMsg.endpoint
    var endpoint = msg.endpoint 
    _post(endpoint + beServices.CHAT.WRITE_APP, newMsg, function (data) {
        postMessage(JSON.stringify(data))
        retBool = false
    }, function (e) {
        retBool = true
        console.log("error", e)
    })
    return retBool
}

trySend = function () {
    queueSendPendings = queueSendPendings.filter(function (this_) {
        return sendMessage(this_)
    })
    if (queueSendPendings.length > 0) {
        setTimeout(trySend, 1000)
    }
}

onmessage = function (e) {
    // postMessage("id2")
    console.log("new message: ", e)
    queueSendPendings.push(JSON.parse(e.data))
    trySend()
}
