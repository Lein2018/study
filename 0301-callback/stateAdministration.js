(function(root) {
	var optionsCache = {};
	var spaceExp = /\s+/;
	var _ = {
		callbackList: function(options) {
			options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : {};
			var list = [];
			var index, length, memory, start, testing;
			var fire = function(data) {
				memory = options.memory && data;
				index = start || 0;
				start = 0;
				testing = true;
				length = list.length;
				for (; index < length; index++) {
					// 参数传递给处理函数
					if (list[index].apply(data[0], data[1]) === false && options.stopOnfalse) {
						break;
					}
				}
			}
			var self = {
				add: function() {
					var args = Array.prototype.slice.call(arguments); //each
					start = list.length;
					args.forEach(function(fn) {
						if (toString.call(fn) === "[object Function]") {
							list.push(fn);
						}
					});
					memory && fire(memory);
					return this;
				},
				fireWith: function(context, arguments) { //处理函数的绑定上下文对象
					var args = [context, arguments]
					if (!options.once || !testing) { // options.once   == true false
						fire(args); //执行处理函数
					}

				},
				fire: function() { //处理函数的参数传递
					self.fireWith(this, arguments);
				}
			}
			return self;
		},
		state: function() { //state 对象    状态管理对象
			var _this = this;
			var promise = {
				promise: function(obj){
					return  typeof obj ==="object" ? Object.assign(obj,promise) : promise;
				}
			}
			//状态管理集合
			var tuples = [
				["resolve", "done", _this.callbackList("once memory"), "resolve"],
				["reject", "fail", _this.callbackList("once memory"), "reject"],
				["notify", "porgess", _this.callbackList("once memory")]
			]
			var state = {};
			tuples.forEach(function(tuple) {
				var list = _this.callbackList("once memory");
				state[tuple[0]] = list.fire;    //参数传递
				state[tuple[0]+"With"] = list.fire;   //上下文的绑定
				//promise.done  promise.fail  promise.porgess
				promise[tuple[1]] = list.add;
			});
			promise.promise(state);
			return state;
		},
		when: function(state){
			return state.promise();
		}
	};

	function createOptions(options) { //once memory
		var object = optionsCache[options] = {};
		options.split(spaceExp).forEach(function(value) {
			object[value] = true;
		});
		return object;
	}
	root._ = _;
})(this);
