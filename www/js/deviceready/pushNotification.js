var pushNotification

function onDeviceReady_pn () {
    pushNotification = window.plugins.pushNotification
    RegisterPN()
    console.log(device.platform)
}

function RegisterPN () {
    if (device.platform == "android" || device.platform == "Android" || device.platform == "amazon-fireos") {
        pushNotification.register(
            successHandler,
            errorHandler,
            {
                "senderID": "74150433827",
                "ecb": "onNotification"
            })
    } else if (device.platform == "blackberry10") {
        pushNotification.register(
            successHandler,
            errorHandler,
            {
                invokeTargetId: "replace_with_invoke_target_id",
                appId: "replace_with_app_id",
                ppgUrl: "replace_with_ppg_url", // remove for BES pushes
                ecb: "pushNotificationHandler",
                simChangeCallback: replace_with_simChange_callback,
                pushTransportReadyCallback: replace_with_pushTransportReady_callback,
                launchApplicationOnPush: true
            })
    } else {
        pushNotification.register(
            tokenHandler,
            errorHandler,
            {
                "badge": "true",
                "sound": "true",
                "alert": "true",
                "ecb": "onNotificationAPN"
            })
    }
}

// iOS
function onNotificationAPN (event) {
    // cordova.plugins.notification.badge.set(100);
    ;
    window.plugins.toast.showLongBottom(event.alert, function (a) { console.log("toast success: " + a) }, function (b) { console.log("toast error: " + b) })
    if (event.alert) {
        navigator.notification.console.log(event.alert)
    }

    if (event.sound) {
        var snd = new Media(event.sound)
        snd.play()
    }

    if (event.badge) {
       // pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, 300);
    }
}

// Android and Amazon Fire OS
function onNotification (e) {
    console.log("<li>EVENT -> RECEIVED:" + e.event + "</li>")

    switch (e.event) {
        case "registered":
            if (e.regid.length > 0) {
                console.log("<li>REGISTERED -> REGID:" + e.regid + "</li>")
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
                console.log("regID = " + e.regid)
                PN = e.regid 
            }
            break

        case "message":
        // cordova.plugins.notification.badge.set(200);
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            console.log(e)
            pushDriver(e)

            if (e.foreground) {
                console.log("<li>--INLINE NOTIFICATION--" + "</li>")
                console.log(e)
                window.plugins.toast.showLongBottom(e.payload.message, function (a) { console.log("toast success: " + a) }, function (b) { console.log("toast error: " + b) })

            // on Android soundname is outside the payload.
            // On Amazon FireOS all custom attributes are contained within payload
          //  var soundfile = e.soundname || e.payload.sound;
            // if the notification contains a soundname, play it.
          //  var my_media = new Media("/android_asset/www/"+ soundfile);
          //  my_media.play();
            } else {  // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart) {
                    console.log("<li>--COLDSTART NOTIFICATION--" + "</li>")
                } else {
                    console.log("<li>--BACKGROUND NOTIFICATION--" + "</li>")
                }
            }

            console.log("<li>MESSAGE -> MSG: " + e.payload.message + "</li>")
           // Only works for GCM
            console.log("<li>MESSAGE -> MSGCNT: " + e.payload.msgcnt + "</li>")
       // Only works on Amazon Fire OS
            break

        case "error":
            console.log("<li>ERROR -> MSG:" + e.msg + "</li>")
            break

        default:
            console.log("<li>EVENT -> Unknown, an event was received and we do not know what it is</li>")
            break
    }
}

// BlackBerry10
function pushNotificationHandler (pushpayload) {
    var contentType = pushpayload.headers["Content-Type"],
        id = pushpayload.id,
        data = pushpayload.data// blob

    // If an acknowledgement of the push is required (that is, the push was sent as a confirmed push
    // - which is equivalent terminology to the push being sent with application level reliability),
    // then you must either accept the push or reject the push
    if (pushpayload.isAcknowledgeRequired) {
        // In our sample, we always accept the push, but situations might arise where an application
        // might want to reject the push (for example, after looking at the headers that came with the push
        // or the data of the push, we might decide that the push received did not match what we expected
        // and so we might want to reject it)
        pushpayload.acknowledge(true)
    }
};

function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    console.log("device token = " + result)
    PN = result
    alert(PN)
}
/*
if(device.platform == "Win32NT"){
    pushNotification.register(
        channelHandler,
        errorHandler,
        {
            "channelName": channelName,
            "ecb": "onNotificationWP8",
            "uccb": "channelHandler",
            "errcb": "jsonErrorHandler"
        });
}
*/
// handle MPNS notifications for WP8
function onNotificationWP8 (e) {
    if (e.type == "toast" && e.jsonContent) {
        pushNotification.showToastNotification(successHandler, errorHandler,
            {
                "Title": e.jsonContent["wp:Text1"], "Subtitle": e.jsonContent["wp:Text2"], "NavigationUri": e.jsonContent["wp:Param"]
            })
    }

    if (e.type == "raw" && e.jsonContent) {
        console.log(e.jsonContent.Body)
    }
}

try {
    cordova.plugins.notification.badge.hasPermission(function (granted) {
		 console.log("Permission has been granted: " + granted)
    })

    cordova.plugins.notification.badge.registerPermission(function (granted) {
		 console.log("Permission has been granted: " + granted)
    })
} catch (e) {
    $("#Waiting").hide()
}

function jsonErrorHandler (error) {
    console.log('<li style="color:red;">error:' + error.code + "</li>")
    console.log('<li style="color:red;">error:' + error.message + "</li>")
}
	
function successHandler (result) {
    console.log("result = " + result)
}

function errorHandler (error) {
    console.log("error = " + error)
}
