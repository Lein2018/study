var xtag = (function(factory){
	return factory.call();
})(function(){
	var __DEFS__ = {
		lifecycle : {
			created : function(){},
			attributeChanged : function(){}
		},
		methods : {}
	};

	var __CORE__ = {
		register : function(tag,options){
			var thatDoc = document;
			var thisDoc = document.currentScript.ownerDocument;
			var template = thisDoc.querySelector('template').content;
			var element = Object.create(HTMLElement.prototype);//基于HTML元素的原型创建对象
			// var template = document.currentScript.ownerDocument.querySelector('template').content;
	        element.createdCallback = function() {
	            var shadowRoot = this.createShadowRoot(); // 创建shadow root节点
	            var clone = document.importNode(template, true);
	            shadowRoot.appendChild(clone);// 添加模板克隆对象到shadow root中
	            if(!options.methods){
	            	options.methods = __DEFS__.methods;
	            }
	            for(var method in options.methods){
	            	this[method] = options.methods[method];
	            }

	            if(options && options.lifecycle && options.lifecycle.created){
	            	options.lifecycle.created.call(this);
	            }else{
	            	__DEFS__.lifecycle.created.call(this);
	            }
	        };
	        element.attributeChangedCallback = function(a,o,n){
	        	if(options && options.lifecycle && options.lifecycle.attributeChanged){
	            	options.lifecycle.attributeChanged.call(this,a,o,n);
	            }else{
	            	__DEFS__.lifecycle.attributeChanged.call(this,a,o,n);
	            }
	        }
	        document.registerElement(tag, {//注册新组件
	            prototype: element
	        });
		}
	};

	return __CORE__;
});