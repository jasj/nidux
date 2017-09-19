  /*window.fbAsyncInit = function() {
    FB.init({
      appId      : '298960577183466',
      xfbml      : true,
      version    : 'v2.9'
    });
    FB.AppEvents.logPageView();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "http://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

*/



$(".loginBtn--facebook").tapend(function(){
 CordovaFacebook.login({
   permissions: ['email', 'user_likes'],
   onSuccess: function(result) {
      if(result.declined.length > 0) {
         alert("The User declined something!");
      }else{
		  console.log(result)
		  
		 
		 tempObj = {
			facebookKey : HexWhirlpool(result.userID),
			uuid : typeof device !== 'undefined' ? device.uuid : "Browser",
			pushNumber : typeof device !== 'undefined' ? PN : "Browser" 
		}
       _post("/security/login",tempObj,function(data,status){
		   loginObj= data
		   fillUserConfig(data)
		$("#login").fadeOut();
		if (cordova.platformId == 'android') {
			StatusBar.backgroundColorByHexString("#4066b3");
		}
			console.log(data)
			loginId = data.loginId;
			
			token = {token: result.accessToken} 
			console.log(token)
			db.bulkDocs([
				Object.assign({"_id" : "fbkToken"},token),
				Object.assign({"_id" : "loginInfo"},data)
			])
		},function(e){
			socialRegister({facebookKey : HexWhirlpool(result.userID)})
		})
	}
      
   },
   onFailure: function(result) {
      if(result.cancelled) {
         alert("The user doesn't like my app");
      } else if(result.error) {
         alert("There was an error:" + result.errorLocalized);
      }
   }
});
  }) 
