userType = "C"
ConsoleServerIP = "http://54.212.218.84:7521/ravel/1.0"
CondominiumIP = ""
loginObj = {}
condoSelected = 0
directory = "condo"
btToken = "sandbox_vcs5jw2p_8n4tk7sj3dw3g79s"

shopsReady = false
bannersReady = false
productsReady = false


MAIN_COLOR = "#D7C101"



captureCfg = {
    sampleRate: 44100,
    bufferSize: 16384,
    channels: 1,
    format: "PCM_16BIT",
    normalize: true,
    normalizationFactor: 32767,
    streamToWebAudio: false,
    audioContext: null,
    concatenateMaxChunks: 10,
    audioSourceType: 0
    
}

omitAuthServices = ["/security/login"]

//db.upsert("loginInfo",{ estates : [{ guestId : "ef74ab1308edc737de7daac980220ec7"}]})
