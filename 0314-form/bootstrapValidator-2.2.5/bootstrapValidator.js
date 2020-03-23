(function(global , factory , plug){
	factory.call(global , global.jQuery , plug);
})(window , function($ , plug){
	//默认值
	var __DEFS__ = {
		__find__ : "input,select,list,textarea",
		__filter__ : "[type=submit],[type=reset],[type=button],[type=image]",
		__err__ : "-error",
		__hint__ : "* faild valided."
	};
	//默认配置项
	var __OPS__ = {
		raise : "change"
	};
	//规则引擎配置项（用户可扩展的）
	var __RULES__ = {
		"required" : function(){
			var val = this.val();
			return val!=null && val!=undefined && val!="";
		},// 必填项
		"email" : function(){
			return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.val());
		},//格式必须是邮箱地址
		"regex" : function(config){
			return new RegExp(config).test(this.val());
		},//格式必须符合正则表达式
		"integer" : function(){
			return false;
		},//必须是整数
		"number" : function(){
			return false;
		},//必须是数字
		"min" : function(){
			return false;
		},//最小值
		"max" : function(){
			return false;
		},//最大值
		"min-length" : function(){
			return false;
		},//最短几位
		"max-length" : function(){
			return false;
		}//最长几位
		//其他的规则...
	};
	//闭包
	$.fn[plug] = function(options){
		var $this = $(this);
		options = $.extend(__OPS__,options);//扩展
		var $fields = $this.find(__DEFS__.__find__).not(__DEFS__.__filter__);
		$fields.on(options.raise,function(){
			var $filed = $(this);//当前被校验的目标元素
			var $group = $filed.parents(".form-group").removeClass("has-success has-error");//找到group元素
			$filed.next(".help-block").remove();//清空提示信息
			var result,_e,_r = true;//当次校验结果，默认为成功
			$.each(__RULES__,function(rule , valid){//迭代
				_r = $filed.data(rule);
				if(_r){
					result = valid.call($filed,_r);
					$group.addClass(result?"has-success":"has-error");
					if(!result){
						_e = $filed.data(rule+__DEFS__.__err__)||__DEFS__.__hint__;
						$filed.after("<span class=\"help-block\">"+_e+"</span>");
					}
					return result;
				}
			});
		});
	}
} , "bootstrapValidator");