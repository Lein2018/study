<template>
  <div>
  	<audio id="biu" src="static/biu.wav"></audio>
  	<div class="chat_box">
  		<div class="panel_left">
  				<div class="left_bar">
  					<div class="current_head">
  						<img :src="'static/headimg/'+myHead"/>
  					</div>
  					<ul class="icon_list">
  						<li @click="changeCur(index)" v-for="(item,index) in icon_list">
  							<img v-show="icon_show!=index" :src="'static/icon/'+icon_list[index]+'.png'"/>
  							<img v-show="icon_show==index" :src="'static/icon/'+icon_list_[index]+'.png'"/>
  						</li>
  					</ul>
  					<div class="more" @click="morebox_show ? morebox_show=0:morebox_show=1">
  						<span></span>
  						<span></span>
  						<span></span>
  					</div>
  					<div class="more_box" v-show="morebox_show" @click="morebox_show=0">
  						<div @click="feedback_show=1">意见反馈</div>
  						<div >关于作者</div>
  					</div>
  				</div>
  				<div class="online_box" @click="morebox_show=0,feedback_show=0">
  					<div class="search_box">
  						<div class="search_bar">
  							<input type="text" placeholder="搜索" @focus="search" @focusout="search_flag=0" :class="{'focus':search_flag}" v-model="search_text"/>
  							<div class="add">+</div>
  							<div class="search_icon"></div>
  						</div>
  					</div>
  					<ul class="online_list">
  						<li v-for="(item,index) in filterName" @click="chooseChat(index)" :class="[{'top':index==0},{'current':currentChat==index}]">
  							<div class="info">
  								<div class="user_head"><img :src="'static/headimg/'+item.userhead"/><span class="fubiao" v-show="item.fubiao_flag"></span></div>
  								<div class="user_info">
  									<div class="user_name">{{item.username}}</div>
  									<div class="user_msg" v-html="item.usermsg.body"></div>
  								</div>
  							</div>
  							<div class="other">
  								<div class="time">{{item.usermsg.time}}</div>
  							</div>
  						</li>
  					</ul>
  				</div>
  		</div>
  		<div class="panel_right" @click="feedback_show=0">
  			<div class="chatTitle_bar">
  				<div class="title">{{chat_title}}</div>
  				<v-close @click="feedback_show=0"></v-close>
  				<div class="notice" v-show="notice">{{notice}}</div>
  			</div>

  			<div class="msg_box" id="msgbox">
  				<div class="more_record" @click="more_record" v-show="currentChat==0&&pageshow">查看更多消息</div>
  				<div v-for="(item,index) in curRoom" :class="['other_msg',{'my_msg':myName==curRoom[index].username}]">
  					<div class="the_head"><img :src="'static/headimg/'+item.userhead"/></div>
  					<div class="msg_body">
  						<div class="name">{{item.username}} <span>{{item.usermsg.time}}</span></div>
  						<div class="text" v-html="item.usermsg.body"></div>
  					</div>
  				</div>

  				<!--<div class="other_msg my_msg">
  					<div class="the_head"><img :src="'static/headimg/'+$route.params.headimg"/></div>
  					<div class="msg_body">
  						<div class="name">自己 <span>15:36</span></div>
  						<div class="text">日月盈仄，辰宿列张。</div>
  					</div>
  				</div>!-->

  			</div>
  			<div :class="['send_box',{'focus':write_flag}]">
  				<div class="top_bar">
  					<div class="face_icon" title="表情"></div>
  				</div>
  				<textarea v-model="myMsg" class="text_box" @focus="write_flag=1" @focusout="write_flag=0"></textarea>
  				<div class="send_btn" @click="send_msg">发送</div>
  				<div class="sendEmpty" v-show="sendEmptyFlag">不能发送空白信息</div>
  			</div>
  		</div>
  		<div class="feedback" v-show="feedback_show">
  			<div class="top_bar">
  				<div class="title">意见反馈</div>
  				<div class="close" @click="feedback_show=0">
						<span></span>
						<span></span>
					</div>
  			</div>
  			<textarea class="feedbacktext" v-model="feedbacktext"></textarea>
  			<div class="btn_group">
  				<div :class="['sure',{'sure2':feedbacktext}]" @click="send_feedback">确定</div>
  				<div class="back" @click="feedback_show=0">取消</div>
  			</div>
  		</div>
  	</div>
  </div>
</template>

<script>
import close from '@/components/close.vue'

export default {
  name: 'login',
  data () {
    return {
      icon_list:['chat_icon','user_icon','box_icon'],
      icon_list_:['chat_icon_','user_icon_','box_icon_'],
      icon_show:0,
      search_flag:0,
      myHead:'',
      myName:'',
      onlinecount:0,
      online_list:[

      ],
      currentChat:0,
      write_flag:0,
      myMsg:'',
      msg_list:[],
      single_msg:{

      },
      pagecount:0,
      pageshow:1,
      search_text:'',
      morebox_show:0,
      feedback_show:0,
      feedbacktext:'',
      sendEmptyFlag:0,
      notice:''
    }
  },
  computed: {
  	chat_title: function(){
  		if(this.currentChat==0){
   			return '聊天室('+(this.online_list.length-1)+')人';
   		}else{
   			return this.filterName[this.currentChat].username;
   		}
  	},
   	curRoom: function(){
   		if(this.currentChat==0){
   			return this.msg_list;
   		}else{
   			if(this.single_msg[this.chat_title]){
   				return this.single_msg[this.chat_title];
   			}else{
   				this.single_msg[this.chat_title]=[];
   				return this.single_msg[this.chat_title];
   			}
   		}
   	},
   	filterName:function(){
	    var arr=[];
	    var _this=this;
	    this.online_list.forEach(function (item){
	    		if(item.username=='聊天室'){
	    			 arr.push(item);
	    		}
	        if(item.username.indexOf(_this.search_text)!=-1&&item.username!='聊天室'){
	            arr.push(item);
	        }
	    })
	    return arr;
		},
		socketid:function(){
			for(var i=0;i<this.online_list.length;i++){
				if(this.online_list[i].username==this.myName){
					return this.online_list[i].socketid;
				}
			}
		}
	},
  components:{
		'v-close' : close,
	},
	mounted: function(){
		var biu=document.getElementById('biu');
		var _this=this;
		//var userinfo=JSON.parse(localStorage.getItem("curUser"));
		if(this.$route.params.headimg){
			this.myHead=this.$route.params.headimg;
			this.myName=this.$route.params.userName;
		}/*else{
			this.myHead=userinfo.headimg;
			this.myName=userinfo.userName;
		}*/

		//表情启动
		var _this=this;
    var obj=new Face({
        el:document.querySelector('.face_icon'),
        callBack:function (face) {
            _this.myMsg+="〖"+face.title+"〗";
            document.querySelector('.face-warp').style.display='none';
        }
    })

		// 当接收到有人连接进来
		socket.on('connected', function (single_id) {
	    console.log(single_id-1);
		});
		// 当接收到有人断开后
		socket.on('disconnected', function (info) {
			if(info==_this.chat_title){
				_this.currentChat=0;
			}
	    console.log(info+' 离开了');
	    _this.notice=info+' 离开了~';
		});

		var box=document.getElementById("msgbox");
		//接收分页聊天记录
		socket.on('chat_record', function (record) {
			if(record.length<10){
				_this.pageshow=0;
			}
			for(var i=0;i<record.length;i++){
				record[i].usermsg.body=obj.replaceFace(record[i].usermsg.body);
				var time=record[i].usermsg.time;
				var d=new Date(time);
				time=_this.formatDateAll(d);
				record[i].usermsg.time=time;
			}
			if(_this.pagecount>0){
				_this.msg_list=record.concat(_this.msg_list);
				//box页面底部的距离
				var boxdown=box.scrollHeight-box.scrollTop;
				//回到刚刚的位置
				setTimeout(function(){
					box.scrollTop=box.scrollHeight-boxdown;
				},0);
			}else {
				_this.msg_list=_this.msg_list.concat(record);
			}
		});

		// 接收消息
		socket.on('message', function (information) {
      if(information.type=='msg'){
      	information.usermsg.body=obj.replaceFace(information.usermsg.body);
      	var time=information.usermsg.time;
				var d=new Date(time);
				time=_this.formatDate(d);
				information.usermsg.time=time;

				_this.online_list[0].fubiao_flag=0;
				if(_this.currentChat!=0){
      		_this.online_list[0].fubiao_flag=1;
      		biu.play();
      	}
      	_this.msg_list.push(information);

	  		var tempbody=information.username+':'+information.usermsg.body;
	  		_this.online_list[0].usermsg.body=tempbody;
	  		_this.online_list[0].usermsg.time=information.usermsg.time;
	  		setTimeout(function(){
		  		box.scrollTop=box.scrollHeight;
		  	},0);
     }else if(information.type=='single_msg'){
      	information.usermsg.body=obj.replaceFace(information.usermsg.body);
      	var time=information.usermsg.time;
				var d=new Date(time);
				time=_this.formatDate(d);
				information.usermsg.time=time;

				for(var i=0;i<_this.online_list.length;i++){

					//自己收到自己的消息不触发红点
					if(information.username==_this.online_list[i].username&&information.username!=information.to&&_this.currentChat!=i){
						if(information.username!=_this.myName){
							_this.online_list[i].fubiao_flag=1;
							//任意操作才能触发小红点更新，我也不知道为什么
							_this.icon_show=1;
	  					_this.icon_show=0;

	  					//新消息置顶
	  					var room=_this.online_list[0];
	  					_this.online_list.splice(0,1);
	  					var key=_this.online_list[i-1];
	  					_this.online_list.splice(i-1,1);
	  					_this.online_list.unshift(key);
	  					_this.online_list.unshift(room);
	  					//新消息提示音
	  					biu.play();
						}
					}
				}

				if(!_this.single_msg[information.username]){
					_this.single_msg[information.username]=[]
				}

      	if(information.to!=_this.myName){
      		_this.single_msg[information.to].push(information);
      	}else {
      		_this.single_msg[information.username].push(information);
      	}

      	//列表消息预览
      	for(var i=0;i<_this.online_list.length;i++){
      		if(_this.online_list[i].username==information.username&&information.username!=_this.myName){
      			_this.online_list[i].usermsg=information.usermsg;
      		}else if(_this.online_list[i].username==information.to&&information.username==_this.myName){
      			_this.online_list[i].usermsg=information.usermsg;
      		}
      	}

      }else{
      	if(information.who){
      		console.log(information.who+" 登录了");
      		_this.notice=information.who+" 登录了~";
      	}
      	for(var i=0;i<information.body.length;i++){
      		var time=information.body[i].usermsg.time;
					var d=new Date(time);
					time=_this.formatDate(d);
					information.body[i].usermsg.time=time;
					for(var j=0;j<_this.online_list.length;j++){
						if(information.body[i].username==_this.online_list[j].username){
							information.body[i].usermsg.body=_this.online_list[j].usermsg.body;
							if(_this.online_list[j].fubiao_flag==1){
								information.body[i].fubiao_flag=_this.online_list[j].fubiao_flag;

								//新消息置顶
		  					var room=information.body[0];
		  					information.body.splice(0,1);
		  					var key=information.body[i-1];
		  					information.body.splice(i-1,1);
		  					information.body.unshift(key);
		  					information.body.unshift(room);

							}
						}
					}
      	}
      	_this.online_list=information.body;

      }
      setTimeout(function(){
	  		//if(information.username==_this.chat_title){
	  			box.scrollTop=box.scrollHeight;
	  		//}
	  	},0);

	  	//强制刷新计算函数
	  	var temp=_this.currentChat;
	  	_this.currentChat=0;
	  	_this.currentChat=temp;
		});

		//监听回车
    document.onkeyup = function (e) {
			var code = e.charCode || e.keyCode;
			if (code == 13) {
			   _this.send_msg();
			}
    }
    //监听后退
    window.onpopstate = function(event) {
		  window.location.href=window.location.href.split('#')[0];
		};

	},
  methods: {
  	changeCur(index){
  		this.icon_show=index;
  	},
  	chooseChat(index){
  		this.currentChat=index;
  		this.filterName[index].fubiao_flag=0;
  		var box=document.getElementById("msgbox");
      setTimeout(function(){
	  		box.scrollTop=box.scrollHeight;
	  	},0);
  	},
  	send_msg(){
  		var _this=this;
  		if(this.myMsg.replace(/\s+/g,"")==""){
  			if(this.sendEmptyFlag==0){
  				this.sendEmptyFlag=1;
					var sendEmptyTimer=setTimeout(function(){
	  				_this.sendEmptyFlag=0;
	  				clearTimeout(sendEmptyTimer);
	  			},2500);
  			};
  			return;
  		}
  		var clearMsg=this.myMsg;
  		clearMsg=clearMsg.replace(new RegExp('<','gm'),'&lt')

  		var myInformation = {
  			type:'msg',
        username:this.myName,
        userhead:this.myHead,
        usermsg:{body:clearMsg,time:'0:00'}
     	};
     	if(this.currentChat!=0){
  			myInformation.type='single_msg';
  			myInformation.to=this.chat_title;
  		}
  		if(this.myMsg){
  			//this.msg_list.push(myInformation);
  			// 发送本机的消息
        socket.emit('message', myInformation);
        this.myMsg='';
  		}
  	},
  	more_record(){
  		socket.emit('pagecount', {pagecount:this.pagecount,socketid:this.socketid,curnum:this.msg_list.length});
  		this.pagecount++;
  	},
  	formatDate(now) {
			var hour=now.getHours();
			var minute=now.getMinutes();
			if(minute<10){
				minute='0'+minute;
			}
			return hour+":"+minute;
		},
		formatDateAll(now) {
			var year=now.getFullYear();
			var month=now.getMonth()+1;
			var day=now.getDate();
			var hour=now.getHours();
			var minute=now.getMinutes();
			if(minute<10){
				minute='0'+minute;
			}
			return year+'年'+month+'月'+day+'日 '+hour+":"+minute;
		},
		toxig(){
			window.open('https://mooc.study.163.com/smartSpec/detail/1202816603.htm');
		},
		send_feedback(){
			if(this.feedbacktext){
				this.feedback_show=0;
				var feedbackinfo={
					username:this.myName,
					feedback:this.feedbacktext
				};
				socket.emit('feedback', feedbackinfo);
				this.feedbacktext='';
			}
		},
		search(){
			this.search_flag=1;
			this.currentChat=0;
		}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.clear {
		clear: both;
	}
	.chat_box {
		width: 900px;
    height: 640px;
    overflow: hidden;
    border-radius: 4px;
    background: #f5f5f5;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		-webkit-transform: translate(-50%,-50%);
		box-shadow: 0 0 10px 0px #999;
	}
	.panel_left {
		width: 310px;
		height: 100%;
		float: left;
		background: #ebe9e8;
	}
	.panel_left .left_bar {
		width: 60px;
		height: 100%;
		background: #2c2726;
		float: left;
		position: relative;
	}
	.online_box {
		float: right;
		width: 250px;
		height: 100%;
	}
	.online_box .search_box {
		width: 100%;
		height: 62px;
		background: #eeeae8;
		overflow: hidden;
	}
	.panel_right {
		width: 590px;
		height: 100%;
		float: right;
	}
	.chatTitle_bar {
		width: 100%;
		height: 62px;
		border-bottom: 1px solid #e1e1e1;
		position: relative;
	}
	.chatTitle_bar .title {
		float: left;
		font-size: 20px;
		margin-top: 24px;
		margin-left: 30px;
	}
	.current_head {
		width: 35px;
		height: 35px;
		background: #ccc;
		margin: 20px auto 21px;
	}
	.icon_list {
		width: 35px;
		margin: 0 auto;
	}
	.icon_list li {
		margin-bottom: 10px;
		cursor: pointer;
	}
	.left_bar .more {
		width: 35px;
		height: 35px;
		position: absolute;
		bottom: 7px;
		left: 12px;
		cursor: pointer;
	}
	.left_bar .more span {
		width: 16px;
		height: 1px;
		background: #7e7e7f;
		display: block;
		margin: 0 auto 5px;
	}
	.left_bar .more span:nth-child(1) {
		margin-top: 10px;
	}
	.search_bar {
		width: 226px;
		height: 25px;
		margin: 25px auto 0;
		position: relative;
	}
	.search_bar>* {
		background: #e5e2e2;
		box-sizing: border-box;
		border: 1px solid #c7c7c7;
		height: 100%;
	}
	.search_bar input {
		width: 190px;
		outline: none;
		font-size: 12px;
		padding-left: 2px;
		float: left;
	}
	.search_bar .search_icon {
		width: 25px;
		position: absolute;
		top: 0;
		right: 36px;
		background: url(../../static/icon/find.png);
		background-size: 100% 100%;
		border: none;
	}
	.search_bar .focus {
		background: #f2efee;
	}
	.search_bar .add {
		width: 25px;
		height: 25px;
		float: right;
		cursor: pointer;
		text-align: center;
		line-height: 22px;
		font-weight: lighter;
		font-size: 22px;
		color: #666;
	}
	.online_list {
		width: 100%;
		height: 578px;
		overflow: auto;
	}
	.online_list li {
		width: 100%;
		height: 64px;
		padding: 12px;
		box-sizing: border-box;
		position: relative;
	}
	.online_list .current {
		background: #c9c9c9;
	}
	.online_list .current:hover {
		background: #c9c9c9;
	}
	.online_list li:hover {
		background: #d8d8d8;
	}
	.online_list li .info {
		width: 184px;
		height: 40px;
		float: left;
	}
	.online_list li .other {
		width: 40px;
		height: 40px;
		float: right;
		position: absolute;
		right: 12px;
	}
	.online_list li .time {
		width: 100%;
		font-size: 12px;
		color: #aaa;
		text-align: right;
	}
	.online_list li .info .user_head {
		width: 40px;
		height: 40px;
		float: left;
		position: relative;
	}
	.online_list li .info .user_info {
		width: 144px;
		height: 40px;
		font-size: 14px;
		float: right;
		color: #111;
		padding-left: 10px;
		box-sizing: border-box;
	}
	.online_list li .info .user_msg {
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		font-size: 12px;
		margin-top: 4px;
		color: #999;
	}
	.panel_right .msg_box {
		width: 100%;
		height: 432px;
	}
	.panel_right .send_box {
		width: 100%;
		height: 145px;
		border-top: 1px solid #e1e1e1;
		background: #f5f5f5;
		position: relative;
	}
	.panel_right .send_box .top_bar {
		width: 100%;
		height: 40px;
		padding: 14px 0 0 30px;
		box-sizing: border-box;
		position: relative;
	}
	.panel_right .send_box .top_bar .face_icon {
		width: 18px;
		height: 18px;
		background: url(../../static/icon/face_icon.png);
		background-size: 100% 100%;
		cursor: pointer;
	}
	.panel_right .send_box .top_bar .face_icon:hover {
		background: url(../../static/icon/face_icon_.png);
		background-size: 100% 100%;
	}
	.panel_right .send_box .text_box {
		width: 554px;
		height: 68px;
		margin-left: 30px;
		outline: none;
		resize:none;
		font-size: 14px;
		border: none;
		background: none;
	}
	.panel_right .focus {
		background: #fff;
	}
	.panel_right .send_box .send_btn {
		width: 68px;
		height: 25px;
		background: #f5f5f5;
		border: 1px solid #e1e1e1;
		font-size: 14px;
		color: #666;
		text-align: center;
		line-height: 25px;
		position: absolute;
		right: 30px;
		bottom: 10px;
		border-radius: 2px;
		cursor: pointer;
	}
	.panel_right .send_box .send_btn:hover {
		background: #129611;
		color: #fff;
		border: 1px solid #129611;
	}
	.panel_right .msg_box {
		padding: 0 30px;
		box-sizing: border-box;
		overflow: auto;
	}
	.panel_right .msg_box .other_msg {
		float: left;
		width: 350px;
		margin-top: 12px;
	}
	.panel_right .msg_box .other_msg .the_head {
		width: 36px;
		height: 36px;
		margin-top: 4px;
		float: left;
	}
	.msg_box>div:last-child {
		margin-bottom: 12px;
	}
	.msg_box .other_msg .msg_body {
		float: left;
		max-width: 304px;
		margin-left: 10px;
	}
	.msg_box .other_msg .msg_body .name {
		font-size: 12px;
		color: #999;
		width: 20px;
    white-space: nowrap;
	}
	.msg_box .other_msg .msg_body .text {
		margin-top: 4px;
		font-size: 14px;
		color: #111;
		background: #fff;
		padding: 8px;
		box-sizing: border-box;
		border: 1px solid #e6e6e6;
		border-radius: 2px;
	}
	.panel_right .msg_box .my_msg {
		float: right;
	}
  .panel_right .msg_box .my_msg .the_head {
		float: right;
	}
  .msg_box .my_msg .msg_body {
		float: right;
		margin-right: 10px;
		margin-left: 0;
	}
	.msg_box .my_msg .msg_body .name {
		width: 100%;
		float: right;
		text-align: right;
	}
	.msg_box .my_msg .msg_body .text {
		float: right;
		background: #9eea6a;
	}
	.facebox {
		width: 400px;
		height: 200px;
		position: absolute;
		top: -200px;
		left: 0;
		background: #ccc;
	}
	.fubiao {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		position: absolute;
		background: #ff3b30;
		right: -5px;
		top: -5px;
	}
	.online_list .top {
		background: #dedede;
	}
	.more_record {
		text-align: center;
		font-size: 12px;
		color: #2c90ff;
		margin-top: 6px;
		cursor: pointer;
	}
	.left_bar .more_box {
		width: 134px;
		height: 92px;
		background: #323232;
		position: absolute;
		z-index: 1000;
		left: 59px;
		bottom: 14px;

	}
	.left_bar .more_box>div {
		width: 100%;
		height: 46px;
		color: #8c8c8c;
		font-size: 14px;
		line-height: 46px;
		padding-left: 12px;
		box-sizing: border-box;
		cursor: pointer;
	}
	.left_bar .more_box>div:hover {
		background: #3c3c3c;
	}
	.feedback {
		width: 360px;
		height: 250px;
		background: #f5f5f5;
		box-shadow: 0 0 8px 0px #d3d3d3;
		z-index: 10;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		-webkit-transform: translate(-50%,-50%);
		border-radius: 2px;
		border: 1px solid #ccc;
	}
	.feedback .top_bar {
		width: 100%;
		height: 40px;
		box-sizing: border-box;
	}
	.feedback .top_bar .title {
		float: left;
		font-size: 12px;
		margin-left: 12px;
		line-height: 40px;
		color: #333;
	}
	.feedback .close>span {
		width: 10px !important;
	}
	.feedback .feedbacktext {
		width: 338px;
		height: 150px;
		margin: 0 auto;
		outline: none;
		resize:none;
		font-size: 14px;
		border: 1px solid #dcdcdc;
		background: #fff;
		display: block;
		padding: 24px 16px;
		box-sizing: border-box;
	}
	.feedback .btn_group {
		width: 150px;
		height: 26px;
		margin-top: 16px;
		margin-left: 200px;
	}
	.feedback .btn_group>div {
		float: left;
		width: 70px;
		height: 100%;
		background: #fff;
		font-size: 14px;
		text-align: center;
		line-height: 26px;
		color: #666;
		cursor: pointer;
	}
	.feedback .btn_group .back {
		float: right;
		border: 1px solid #dcdcdc;
	}
	.feedback .btn_group .back:hover {
		background: #f5f5f5;
	}
	.feedback .btn_group .sure {
		background: #87d087;
		color: #fff;
	}
	.feedback .btn_group .sure2 {
		background: #1aad19;
	}
	.feedback .close span {
		width: 10px !important;
		height: 2px;
		background: #777;
	}
	.feedback .close:hover span {
		background: #fff;
	}
	.sendEmpty {
		width: 114px;
		height: 34px;
		background: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 12px;
		text-align: center;
		line-height: 34px;
		position: absolute;
		right: 12px;
		bottom: 46px;
		box-shadow: 0 2px 4px 0px #d3d3d3;
	}
	.sendEmpty:after {
		content: "";
		width: 8px;
		height: 8px;
		background: #fff;
		transform: rotate(45deg);
		-webkit-transform: rotate(45deg);
		position: absolute;
		bottom: -5px;
		right: 20px;
		border-right: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
		box-shadow: 2px 2px 2px 0px #d3d3d3;
	}
	.notice {
		width: 200px;
		height: 20px;
		background: #d4d4d4;
		position: absolute;
		left: 50%;
		margin-left: -100px;
		top:  29px;
		font-size: 12px;
		border-radius: 16px;
		color: #fff;
		text-align: center;
		line-height: 20px;
	}
</style>
