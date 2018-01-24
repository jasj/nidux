

/*
	Autor: Juan Andrés Segreda Johanning
	Empresa: Efika Solutions
	enero 2018
*/

$.fn.originalOrder = []
$.fn.JASJSwipper = function (options){
		var this_ = $(this)
		var startX_
		
		
		var time_
		$.fn.originalOrder = []
		
		 $(this).find('.jasj-slide[jasj-slide-copy]').remove()
		
		if(options.operacion != "update"){
			$(options.prevNav).tapend(function(){
				this_.movePrev()
			})
			
			$(options.nextNav).tapend(function(){
				this_.moveNext()
			})
			
			$(this)[0].addEventListener('touchstart', function(event) {
				startX_ =  event.changedTouches[0].pageX
				time_ = event.timeStamp
			}, false);
			
			$(this)[0].addEventListener('touchmove', function(event) {
				
				var delta = event.changedTouches[0].pageX - startX_
			   this_.find('.swiper-wrapper').css({"margin-left" :  ((window.innerWidth * -1)+ delta) + "px"})
			}, false);
			
			
			$(this)[0].addEventListener('touchend', function(event) {
				var deltaT = event.timeStamp -  time_
				var delta = event.changedTouches[0].pageX - startX_
				if(deltaT < 500) {
					if(delta < -20 ){
						this_.moveNext()
					}else if(delta > 20){
						this_.movePrev()
					}
				}
				else{
					this_.find('.swiper-wrapper').animate({"margin-left" :  window.innerWidth * -1, width: window.innerWidth * 3})
				}
			}, false);
		}
			
			pagesCnt = ""
			this_.find('.jasj-slide').each(function(){
				pagesCnt += '<div class="pageIndicator"></div>'
				
				this_.originalOrder.push($(this).attr("id"))
			})
			
			this_.find(".swiper-pagination").html(pagesCnt)
			
			
			this_.find('.swiper-wrapper').css({"margin-left" :  window.innerWidth * -1, width: window.innerWidth * 3})
			this_.find(".pageIndicator").css({background : "dimgray"})
			this_.find(".pageIndicator:eq(0)").css({background : "red"})
			
		
			
			// clonar 3 veces cuando es solo un slide
			if(this_.find('.jasj-slide').length == 1){
				this_.find('.jasj-slide')
						.clone()
							.attr("jasj-slide-copy",true)
							.appendTo($(this).find('.swiper-wrapper'))
						.end()
						.clone()
							.attr("jasj-slide-copy",true)
							.appendTo($(this).find('.swiper-wrapper'))
				
				
			}
			//colonar 2 veces el juego para cuando hay solo dos slides
			if(this_.find('.jasj-slide').length == 2){
				this_.find('.jasj-slide')
					.clone()
						.attr("jasj-slide-copy",true)
						.appendTo($(this).find('.swiper-wrapper'))
			}
		
			
			var last = $(this).find('.jasj-slide').last()
			last.prependTo($(this).find('.swiper-wrapper'))
			
},
		
		


$.fn.moveNext = function (){
	var this_ = $(this)
	var  wrapper = $(this).find('.swiper-wrapper')
	var first = $(this).find('.jasj-slide').first()
	wrapper.animate({"margin-left" : (window.innerWidth*-2)+"px"},500,function(){
		first.appendTo(wrapper)
			wrapper.css({"margin-left" : window.innerWidth * -1 })
			var iPage = this_.originalOrder.indexOf(  this_.find('.jasj-slide').eq(1).attr("id"))
			this_.find(".pageIndicator").css({background : "dimgray"})
			this_.find(".pageIndicator").eq(iPage).css({background : "red"})
			console.log(iPage)
			
	})
	

}



$.fn.movePrev = function (){
	var this_ = $(this)
	var wrapper = $(this).find('.swiper-wrapper')
	var last = $(this).find('.jasj-slide').last()
	wrapper.animate({"margin-left" : "0px"},500,function(){
		last.prependTo(wrapper)
		wrapper.css({"margin-left" : window.innerWidth * -1 })
		var iPage = this_.originalOrder.indexOf(  this_.find('.jasj-slide').eq(1).attr("id"))
		this_.find(".pageIndicator").css({background : "dimgray"})
		this_.find(".pageIndicator").eq(iPage).css({background : "red"})
	})
}