(function(){
  function asy(){
    this.promiseArr=[];
  }
  asy.prototype.on=function(fn){
     return new Promise(function(resolve,reject){
     	fn(resolve,reject);
     });
  }
  asy.prototype.all=function(){
   var _arg=Array.prototype.slice.call(arguments);
   for(var i=0;i<_arg.length;i++){
      this.promiseArr.push(new Promise(function(resolve,reject){
          _arg[i](resolve,reject);
     }))
   }
   return this;
  }
  asy.prototype.down=function(){
   var _arg=Array.prototype.slice.call(arguments);
   for(var i=0;i<_arg.length;i++){
   	this.promiseArr[i].then((function(arg){
          return function (res){
            arg(res);
          }
   	})(_arg[i]));
   }
  }
  function getasy(){
  	return new asy();
  }
  var asyob=getasy();
  var f1=function(resolve,reject){
   	setTimeout(function(){
          resolve(1)
   	},1000)
   }
  var f2=function(resolve,reject){
   	setTimeout(function(){
          resolve(4)
   	},2000)
   }
  var callback=function(res){
      console.log(res+1);
  } 
  var callback2=function(res){
      console.log(res+2);
  }  
   asyob.all(f1,f2).down(callback,callback2);

})()