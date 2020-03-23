import axios from 'axios';
export default (function(){
 function qa(arr){
   var _iqaob= new _iqa();
   var _urlarr=arr;
   for(var i=0,len=_urlarr.length;i<len;i++){
     var _name=qa.getPathname(_urlarr[i]);
     (function(url){
        _iqaob[_name]=function(ob){
         _iqaob.sendMes.call(_iqaob,url,ob);
        }
     })(_urlarr[i]);
   }
   return _iqaob;
 }

   function _iqa(){
     this._vueob={};
   }
  _iqa.prototype.v=function(obj){
     this._vueob=obj;
     this.status=0;
     return this;
  }
  _iqa.prototype.sendMes=function(url,ob){
    var self=this;
    var _url=url||'';
    var _ob=ob||{};
    var _type=_ob.type||'get';
    var _data=_ob.data||{};
    var _name=qa.getPathname(url);
    var _sfn=_ob.suecc||function(){};
    var _efn=_ob.error||function(){};
    var _name=_ob.dataName||qa.getPathname(_url);
    var _isblock=ob.block||true;
    var status={
      get:function(){
        var _str=qa.myqs(_data);
        axios.get(_url+_str).then(function(res){
           self.status=0;
           var _result=_sfn.call(self._vueob,res);
           if(_result){
            self._vueob[_name]=_result;
           }else{
            self._vueob[_name]=res.data;
           }
        }).catch(function(err){
 
        })
      },
      post:function(){

      },
      delete:function(){

      }
    };
    if(self.status==0||!_isblock){
      if(_isblock){
        self.status=1;
      }
      status[_type](); 
    }else{
      
    }
  }
 qa.myqs=function(ob){
     var str='';
     if(JSON.stringify(ob)=='{}'){

     }else{
        str+="?";
        var len=0;
        for(var item in ob){
          if(len!=0){
           str+='&';          
          }
          str+=item;
          str+='=';
          str+=ob[item];
          len++;
        }     
     }
     return str;
 }
 qa.getPathname=function(url){
      var _arr=url.split('/');
      var _name=_arr[_arr.length-1];
      var _newname=_name.split('.')[0];
      return _newname;   
 }
 return qa;
})()
/*export default (function(){
	function qa(arr){
       var _iqa=new innerqa();
       var _urlarr=arr;
       //第二步
       for(var i=0,len=_urlarr.length;i<len;i++){
       	  var _name=qa.parseUrl(_urlarr[i]);
       	  (function(url){
	       	  _iqa[_name]=function(ob){
                _iqa.begin();
                return _iqa
		       	  }
       	  })(_urlarr[i]);
	
       }
       return _iqa;
	}
  //第二步
	function innerqa(){
       this._vob=null;
       this.status=0;
       this.waitarr=[];
 	};
  innerqa.prototype.begin=function(){
    this.sendMes(this.waitarr[0][0],this.waitarr[0][1]);
    this.waitarr.splice(0,1); 
  }
 	innerqa.prototype.sendMes=function(url,ob){
 		var self=this;
 		var _ob=ob||{};
        var _type=_ob.type||'get';
        var _data=_ob.data||{};
        var _sfn=_ob.suecc||function(){};
        var _efn=_ob.error||function(){};
        var _async=_ob.async||false;
 		var status={
 			get:function(){
		        var _promise=axios.get(url+qa.qs(_data)).then(function(res,fn){
              self._promise=_promise;
              self.status=0;
		          var _name=qa.parseUrl(url);
		          var _getres=_sfn.call(this,res);
		          if(_getres){
		          	self._vob[_name]=_getres;
		          }else{
		          	self._vob[_name]=res.data;
		          }
		        });
            self.hasfinish();
            return self;
 			},
 			post:function(){
		        axios.post(url,_data).then(function(res){
		          var _name=qa.parseUrl(url);
		          self._vob[_name]=res.data;
		        })
 			}
 		}
 		if(self.status==0||_async){
      if(!_async){
        self.status=1;
      }
 		  status[_type]();
 		}else{
            
 		}
 		return this;
 	};
 	innerqa.prototype.v=function(ob){
 		this._vob=ob;
 	}
  innerqa.prototype.hasfinish=function(){ 
    if(this.waitarr.length>0){
       this.begin();    
    }
  }
 	qa.parseUrl=function(url){
      var _arr=url.split('/');
      var _name=_arr[_arr.length-1];
      var _newname=_name.split('.')[0];
      return _newname;
 	}

 	qa.qs=function(ob){

      var str="?";
      var len=0;
      for(var item in ob){
      	if(len!=0){
      	 str+='&';      		
      	}
      	str+=item;
      	str+='=';
      	str+=ob[item];
      	len++;
      }
      return str;
 	}
	return qa;
})();*/