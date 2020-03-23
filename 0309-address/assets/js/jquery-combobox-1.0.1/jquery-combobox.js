(function( global,factory,plug ){
	factory.call(global,global.jQuery,plug )
})( window , function($,plug){
	//封装函数，
	function cascade(selector,parentCode,url){
		url = parentCode?url+"?parentCode="+parentCode:url;
		$.getJSON(url, function(data){
			var letterStr = '<ul class="letter-group">';
			var dataStr = '<ul class="data-group">';
			var letter;
			for(var i=0;i<data.length;i++){
				var nletter = data[i].pinyin.substr(0,1);
				if(letter==undefined||letter!=nletter){
					letter = nletter;
					letterStr+='<li><a href="javascript:void(0);">'+letter+'</a></li>';
					dataStr+='<li class="group '+letter+'">'+letter+'</li>';
				}
				dataStr+='<li class="'+letter+'" data-code="'+data[i].code+'"><a href="javascript:void(0);">'+data[i].abbreviation+'</a></li>';
			}
			letterStr+='</ul>';
			dataStr+='</ul>';
			$(selector+" dd").html(letterStr+dataStr);
		});
	}

	var __DEFS__ = {
		text :"请设置"
	};
	//扩展了jquery的fn（prototype）的功能，功能的名字叫combobox
	$.fn[plug] = function(options){
		this.each(function(){
			var $this = $(this);//当前被渲染的对象
			var url = $this.data("cb-url");
			$this.attr("type","hidden");

			var __TEMP__ = '<div class="cascade-box">'+
							'	<span class="addon">'+($this.data("cb-text")||__DEFS__.text)+'</span>'+
							'	<input class="text" readonly="" placeholder="请选择范围">'+
							'	<div class="selector" style="display:none"></div>'+
							'</div>';
			$this.wrap(__TEMP__);

			var $cascades = $this.parents(".cascade-box:first");
			var $selector = $cascades.find(".selector");//数据区域

			$.each(options.data,function(i,d){
				$selector.append('<dl class="'+d.name+'">'+
									'<dt>'+d.text+'</dt>'+
									'<dd></dd>'+
								'</dl>');
			});
			$cascades.find(".text").on("click",function(){
				$selector.slideToggle();//
			});
			cascade("."+options.data[0].name,0,url);

			$("dl dd",$selector).on("click","ul.data-group li[data-code]",function(){
				var $this = $(this);
				var code = $this.data("code");
				var $next = $this.parents("dl:first").next();
				if($next.length==1){
					cascade("."+$next[0].className,code,url);
				}else{
					$cascades.find("[type=hidden]").val(code);
					$cascades.find(".text").val($this.text());
					$selector.slideUp();
				}
			});
			$("dl dd",$selector).on("click","ul.letter-group li a",function(){
				$(this).parents(".letter-group").next().find("li").hide().filter("."+$(this).text()).show();
			});
		});
	}

} , "combobox");