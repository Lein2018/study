(function(root) {
	//解析规则  <% js逻辑代码 %>  <%= 变量 %> <%- 逃逸 %>
	var templateSettings = {
		//执行体  js逻辑代码
		evalute: /<%([\s\S]+?)%>/g,
		//插入变量
		interpolate: /<%=([\s\S]+?)%>/g,
		//逃逸
		escape: /<%-([\s\S]+?)%>/g,
	}

	function extend() {
		var target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			option,
			key;
		if (typeof target !== "object") {
			target = {};
		}

		for (; i < length; i++) {
			if ((option = arguments[i]) != null) {
				for (key in option) {
					target[key] = option[key];
				}
			}
		}
		return target;
	}
	/* 
	text 待渲染模板 
	settings自定义模板引擎配置rules 
	*/
	var template = function(text, settings) {
		settings = extend({}, templateSettings, settings);
		// console.log(settings)
		var matcher = RegExp([
			settings.escape.source,
			settings.interpolate.source,
			settings.evalute.source, 
		].join("|"), "g");
		// console.log(matcher)

		//需要逃逸的字符
		var escapes = {
			"'": "'", //\\'
			"\r": "r", //\\\r  
			"\n": "n", //\\\n   
		}
		//逃逸的正则
		var escapersExp = /'|\r|\n/g;

		var escapeChar = function(match) {
			return '\\' + escapes[match];
		}
		//source     执行头
		var source = "_p+='";
		var index = 0;
		text.replace(matcher, function(match, escape, interpolate, evalute, offset) {
			source += text.slice(index, offset).replace(escapersExp, escapeChar);
			console.log(source)
			//重置起始点
			index = offset + match.length;
			if (escape) {

			} else if (interpolate) {
				source += "'+\n((_t=(" + interpolate + ")) ==null?'':_t)+\n'";
			} else if (evalute) {
				source += "';\n" + evalute + "\n_p+='";
			}
		});

		source += "';"; 
		//with 限定作用域
	   source = 'with(obj||{}){\n' + source + '}\n';
		source = "var _t,_p='';" + source + 'return _p;\n'; 
		console.log(source)
		//渲染函数
		var render = new Function(settings.variable || "obj", source);

		var template = function(data) {
			return render.call(this, data);
		}
		return template;
	}

	root.template = template;
})(this);
