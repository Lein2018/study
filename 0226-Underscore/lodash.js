(function(root) {
	var _ = function(obj){    //构造函数
		if (!(this instanceof _)) {
			return new _(obj);
		}
		this.wrap = obj;
	}
	//数组数据的去重  [1,2,3,4,5,2,3,4,5]
	_.uniq = function(target, callback) {     //对象
		var result = [];
		var computed;
		for (var i = 0; i < target.length; i++) {
			computed = callback ? callback(target[i]) : target[i];
			if (result.indexOf(computed) === -1) {
				result.push(computed);
			}
		}
		return result;   //数组
	}
	
	 _.reduce = function(){
		 console.log("lalalalalla")
	 }
	 
	 //开启链接式的调用
	 _.chain = function(obj){
		var instence = _(obj);
		instence._chain = true;    //开启链接式
		return instence;
	 }
	 _.prototype.value = function(){
		 return this.wrap;
	 }
	 
	 //辅助函数   实例对象    instence 对象   this.wrap  _chain
	 _.result = function(instence, obj){
		 console.log(obj)
		return  instence._chain ? _(obj).chain() : obj;
	 }
	 
	 _.each = function(arr, callback){
		 console.log(arr)
		for(var i=0; i<arr.length; i++){
			callback.call(arr, arr[i]);
		}
	 }
	 _.functions = function(obj){
		 var result = [];
		 for(var key in obj){
			 result.push(key);
		 }
		 return result;
	 }
	 //自身扩展的方法    [属性名,属性名,属性名] 添加到原型对象中
	 _.mixin = function(obj){
		 _.each(_.functions(obj), function(key){
			  var func = obj[key];   //_.uniq
			  obj.prototype[key] = function(){
				  var args = [this.wrap];  //[目标源数据,arguments成员回调]
				  //数组合并
				  Array.prototype.push.apply(args, arguments);
				  //实例对象      instence
				  return _.result(this, func.apply(this, args));   //[]
			  }
		 });
	 }
	 _.mixin(_);
	root._ = _;
})(this);
