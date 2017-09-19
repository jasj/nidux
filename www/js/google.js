$(".loginBtn--google").tapend(function(){
  window.plugins.googleplus.login(
      {

      },
      function (result) {
		   tempObj = {
			"googleKey"  : HexWhirlpool(result.userId),
			uuid : typeof device !== 'undefined' ? device.uuid : "Browser",
			pushNumber : typeof device !== 'undefined' ? PN : "Browser" 
		}
       _post("/security/login",tempObj,function(data,status){
		$("#login").fadeOut();
		console.log(data)
		 fillUserConfig(data)
		loginId = data.loginId;
		loginObj= data
			db.bulkDocs([
				Object.assign({"_id" : "googleObj"},result),
				Object.assign({"_id" : "loginInfo"},data)
			])
			//db.upsert('loginInfo',data).then(function(doc){console.log(doc)})
		},function(e){
			socialRegister({"googleKey"  : HexWhirlpool(result.userId)})
		})
        console.log(result); // do something useful instead of alerting 
      },
      function (msg) {
        alert('error: ' + msg);
      }
  );
})