/*!
 * jQuery JavaScript Library v3.3.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2018-01-20T17:24Z
 */

( function( global, factory ){
	//问题1，当前jquery源码有可能不运行在BOM环境下吗？
	//回答1.有可能，运行在nodejs（AMD CMD COMMONJS）环境
	//问题2，factory函数参数window有可能为undefined?
	//问题3，返回的jQuery对象是否就是$?
	"use strict";
	//非BOM环境走if
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		//BOM环境走else
		factory( global );
	}
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
	var
	version = "3.3.1",
	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};
	jQuery.fn = jQuery.prototype = {
		init: function(selector, context){
			var __arr__ = null;
			if(typeof selector === "string"){
				__arr__ = window.document.querySelectorAll(selector);
			}else{
				__arr__ = [selector];
			}
			var __leng = __arr__.length;
			__arr__.__proto__ = jQuery.fn;
			if(selector !== document){
				__arr__.prevObject = $(window.document);
			}
			__arr__.length = __leng;
			return __arr__;
		},
		addClass: function(){},
		removeClass: function(){},
		hasClass: function(){},
		on: function(event,active){}
	};

	if ( !noGlobal ) {
		//只提供给BOM使用
		window.nQuery = window.$n = jQuery;
	}
	return jQuery;
});
