(function(n) {var a=Math.min,s=Math.max;var e=function(n,a,e) {var s=e.length;for(var t=0;t<s;++t)n.setUint8(a+t,e.charCodeAt(t))};var t=function(t,e) {this.sampleRate=t;this.numChannels=e;this.numSamples=0;this.dataViews=[]};t.prototype.encode=function(r) {var t=r[0].length,u=this.numChannels,h=new DataView(new ArrayBuffer(t*u*2)),o=0;for(var e=0;e<t;++e)for(var n=0;n<u;++n) {var i=r[n][e]*32767;h.setInt16(o,i<0?s(i,-32768):a(i,32767),true);o+=2}this.dataViews.push(h);this.numSamples+=t};t.prototype.finish=function(s) {var n=this.numChannels*this.numSamples*2,t=new DataView(new ArrayBuffer(44));e(t,0,"RIFF");t.setUint32(4,36+n,true);e(t,8,"WAVE");e(t,12,"fmt ");t.setUint32(16,16,true);t.setUint16(20,1,true);t.setUint16(22,this.numChannels,true);t.setUint32(24,this.sampleRate,true);t.setUint32(28,this.sampleRate*4,true);t.setUint16(32,this.numChannels*2,true);t.setUint16(34,16,true);e(t,36,"data");t.setUint32(40,n,true);this.dataViews.unshift(t);var a=new Blob(this.dataViews,{type:"audio/wav"});this.cleanup();return a};t.prototype.cancel=t.prototype.cleanup=function() {delete this.dataViews};n.WavAudioEncoder=t})(self);

totalReceivedData = 0;
audioDataBuffer = [];

function onAudioInputCapture(evt) {
    try {
        if (evt && evt.data) {
            // Increase the debug counter for received data
            totalReceivedData += evt.data.length;

            // Add the chunk to the buffer
            audioDataBuffer = audioDataBuffer.concat(evt.data);
			console.log("totalReceivedData")
        }
    } catch (ex) {
        console.log("onAudioInputCapture ex: " + ex);
    }
}

function startRecoarding() {
	 try {
		totalReceivedData = 0;
		audioDataBuffer = [];
		audioinput.start(captureCfg);	
	} catch(e) {
		totalReceivedData = 0;
		audioDataBuffer = [];
		console.log("error",e)
	}
}

function stopRecoarding(tid,date,cb) {
	try {
        if (window.audioinput && audioinput.isCapturing()) {
			console.log("stop")
			audioinput.stop();
			date = date.getTime()
			console.log("Encoding WAV...");
            var encoder = new WavAudioEncoder(captureCfg.sampleRate, captureCfg.channels);
            encoder.encode([audioDataBuffer]);

            console.log("Encoding WAV finished");

            var blob = encoder.finish("audio/wav");
            console.log("BLOB created");
			var fileName =  date+ ".wav";
			dirc.getDirectory(directory, { create: true }, function (dirEntry) {
				dirEntry.getDirectory("wav", { create: true }, function (subDirEntry) {
				   	subDirEntry.getFile(fileName, {create: true}, function (file) {
						file.createWriter(function (fileWriter) {
							fileWriter.write(blob);
							readDataUrl(blob,function(data) {
								console.log(data)
								sendMessage(tid, date, "audio", data, fileName)
							});
							console.log(file.toURL())
							console.log("File created!");
							cb(fileName)
							goBottom()
						}, function () {
							console.log("FileWriter error!");
						});
					});
				}, function(e) {console.log(e)});
			}, function(e) {console.log(e)});
		}
	} catch(e) {
		console.log(e)
	}
}

function onDeviceReady_au() {
	window.addEventListener('audioinput', onAudioInputCapture, false);
}
