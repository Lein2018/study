(function(root,factory,plug){
	factory.call(root,root.jQuery,plug)
})(this,function($,plug){

	var __DEFS__ = {
		text : "未设置",
		placeholder : "请选择..."
	};

	function cascade(selector,parentCode,url){
		//http://127.0.0.1:8080/cascadeTest/area/loadAreasByParentCode.do
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

	$.fn[plug] = function(options){

		this.each(function(){
			var $this = $(this);//当前渲染的对象
			$this.attr("type","hidden")
			var url = $this.data("cc-url");
			var __TEMP__ = '<div class="cascade-box">'+
								'<span class="addon">'+($this.data("cc-text")||__DEFS__.text)+'</span>'+
								'<input class="text" readonly="" placeholder="'+($this.data("cc-placeholder")||__DEFS__.placeholder)+'">'+
								'<div class="selector" style="display: none;">'+
								'</div>'+
							'</div>';

			$this.wrap(__TEMP__);
			//组件容器
			var $cascades = $this.parents(".cascade-box:first");
			var $selector = $cascades.find(".selector");
			$.each(options.data,function(i,d){
				$selector.append('<dl class="'+d.name+'">'+
									'<dt>'+d.text+'</dt>'+
									'<dd></dd>'+
								 '</dl>');
			});

			$cascades.find(".text").on('click',function(){
				$(this).nextAll(".selector").slideToggle();//如果selector显示，我就隐藏，如果隐藏的，我就显示
				return false;
			});

			cascade('.province',0,url);//级联
		});
		$(".cascade-box .selector dl dd").on('click','.data-group li[data-code]',function(){
			var $cascades = $(this).parents(".cascade-box:first");
			var code = $(this).data('code');
			var $next = $(this).parents("dl").next();//找到下一级容器
			var url = $cascades.find(":hidden").data("cc-url");
			if($next.length==1){
				cascade('.'+$next.get(0).className,code,url);
			}else{
				code&&$cascades.find("[type=hidden]").val(code)
				code&&$cascades.find(".text").val($(this).text());
				$cascades.find(".selector").slideUp();
			}
		});

		$(".cascade-box .selector dl dd").on('click','.letter-group li a',function(){
			$(this).parents(".letter-group").next().find("li").hide().filter("."+$(this).text()).show();
		});
	}
},"cascade");