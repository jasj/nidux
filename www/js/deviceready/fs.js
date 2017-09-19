// device APIs are available
//

dirc = null

onFileSystemSuccess = function (dir) {
    if (device.platform.toLowerCase() == "android") {
        dirc = dir
    } else {
        dirc = dir.root
    }
}

function onDeviceReady_fm () {
    try {
        if (device.platform.toLowerCase() == "android") {
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, onFileSystemSuccess, failFS)
        } else {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, failFS)
        }
    } catch (e) {
        console.log(e)
    }
}

function pathToFileEntry (path, cb) {
    if (device.platform.toLowerCase() == "android") {
        window.resolveLocalFileSystemURL(path, cb, failFS)
    } else {
        window.requestFileSystem(path, 0, onFileSystemSuccess, failFS)
    }
}

function readDataUrl (file, cb) {
    var reader = new FileReader()
    reader.onloadend = function (evt) {
        console.log("Read as data URL")
        cb(evt.target.result)
    }
    reader.readAsDataURL(file)
}

jQuery.fn.extend({
    displayImageByFileURL: function (fileEntry) {
        this.prop("src", fileEntry.toURL())
    }
})

function download (fileEntry, uri, dcb) {
    var fileTransfer = new FileTransfer()
    var fileURL = fileEntry.toURL()

    fileTransfer.download(
        uri,
        fileURL,
        function (entry) {
            console.log("Successful download...")
            console.log("download complete: " + entry.toURL())
            dcb(entry)
        },
        function (error) {
            console.log("download error source " + error.source)
            console.log("download error target " + error.target)
            console.log("upload error code" + error.code)
            window.plugins.toast.showLongCenter("Error downloading file")
        },
        null, // or, pass false
        {
            // headers: {
            //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            // }
        }
    )
}

function saveDoc (url, dcb, fail) {
    var fn = getNameFromUrl(url)
    if (dirc == null) { onDeviceReady_fm() }
    dirc.getDirectory(directory, { create: true }, function (dirEntry) {
        dirEntry.getDirectory(fn.ext, { create: true }, function (subDirEntry) {
            subDirEntry.getFile(fn.fullName, { create: true, exclusive: false }, function (fileEntry) {
                download(fileEntry, url, dcb)
            }, fail)
        }, fail)
    }, fail)
}

function openDoc (file, mime) {
    var fn = getNameFromUrl(file)
    cordova.plugins.fileOpener2.open(
        dirc.nativeURL + directory + "/" + fn.ext + "/" + file,
        mime, 
        { 
            error: function (e) { 
                console.log("Error status: " + e.status + " - Error message: " + e.message)
            },
            success: function () {
                console.log("file opened successfully") 				
            }
        }
   )
}

function docExist (file, yesFx, noFx) {
    var fn = getNameFromUrl(file)
    if (dirc == null) { onDeviceReady_fm() }
    dirc.getDirectory(directory, { create: false }, function (dirEntry) {
        dirEntry.getDirectory(fn.ext, { create: false }, function (subDirEntry) {
            subDirEntry.getFile(fn.fullName, { create: false, exclusive: false }, function (fileEntry) {
                yesFx(fileEntry)
            }, noFx)
        }, noFx)
    }, noFx)
}
 
function failFS (e) {
    console.log(e)
    var msg = ""

    switch (e.code) {
        case FileError.NOT_FOUND_ERR:
            msg = "NOT_FOUND_ERR Error"
            break
        case FileError.SECURITY_ERR:
            msg = "SECURITY_ERR Error"
            break
        case FileError.ABORT_ERR:
            msg = "ABORT_ERR Error"
            break
        case FileError.NOT_READABLE_ERR:
            msg = "NOT_READABLE_ERR Error"
            break
        case FileError.ENCODING_ERR:
            msg = "ENCODING_ERR Error"
            break
        case FileError.NO_MODIFICATION_ALLOWED_ERR:
            msg = "NO_MODIFICATION_ALLOWED_ERR Error"
            break
        case FileError.INVALID_STATE_ERR:
            msg = "INVALID_STATE_ERR Error"
            break
        case FileError.SYNTAX_ERR:
            msg = "SYNTAX_ERR Error"
            break
        case FileError.INVALID_MODIFICATION_ERR:
            msg = "INVALID_MODIFICATION_ERR Error"
            break
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = "QUOTA_EXCEEDED_ERR Error"
            break
        case FileError.TYPE_MISMATCH_ERR:
            msg = "TYPE_MISMATCH_ERR Error"
            break
        case FileError.PATH_EXISTS_ERR:
            msg = "PATH_EXISTS_ERR"
            break
        default:
            msg = "Unknown Error"
            break
    }

    // alert('Error: ' + msg);
}
