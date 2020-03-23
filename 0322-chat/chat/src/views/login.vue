<template>
  <div>
  	<div class="login_box">
  		<div class="top_bar">
  			<div class="name">前端微专业聊天室</div>
  			<v-close></v-close>
  		</div>
  		<div class="choose_head">
  			<div class="headimg">
  				<img :src="'static/headimg/'+headimgArr[current_head]"/>
  			</div>
  			<div class="to_left to" @click="change_head(-1)">〈</div>
  			<div class="to_right to" @click="change_head(1)">〉</div>
  		</div>
  		<div class="btn_group">
  			<input type="text" class="btn" name="" id="" v-model="login_name" placeholder="请输入您的名字" maxlength="8"/>
  			<div class="login_btn btn" @click="login">登录</div>
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
      login_name:'',
      current_head:0,
      headimgArr:[
      	'timg_1.jpg',
      	'timg_2.jpg',
      	'timg_3.jpg',
      	'timg_4.jpg',
      	'timg_5.jpg',
      	'timg_6.jpg',
      	'timg_7.jpg',
      	'timg_8.jpg',
      	'timg_9.jpg',
      	'timg_10.jpg'
      ]
    }
  },
  components: {
		'v-close' : close,
	},
	mounted: function(){
		this.current_head=Math.floor(Math.random()*this.headimgArr.length);
	},
  methods: {
  	change_head(lr){
  		if(lr==1){
  			this.current_head++;
				if(this.current_head>=this.headimgArr.length){
					this.current_head=0;
				}
  		}else{
  			if(this.current_head<=0){
					this.current_head=this.headimgArr.length;
				}
  			this.current_head--;
  		}
  	},
  	login(){
  		var _this=this;
  		if(_this.login_name==''){
  			_this.login_name='路人'+(100000+ Math.floor(Math.random()*899999));
  		}
  		socket.emit('login',_this.login_name);
  		socket.on('loginYZCG',function(loginInfo){
  			if(loginInfo.status==1){
  				var userinfo={userName:_this.login_name, headimg:_this.headimgArr[_this.current_head]};
		  		//localStorage.setItem("curUser", JSON.stringify(userinfo));
		  		//登陆后立即发送用户信息去服务端
					socket.emit('message', {type:'onlinelist',username:userinfo.userName,userhead:userinfo.headimg,usermsg:{body:'',time:''}});
		  		_this.$router.push({ name: 'chat', params: userinfo});
  			}
  		});
  		socket.on('loginYZSB',function(loginInfo){
				_this.login_name='';
				alert(loginInfo.info);
				window.location.reload(true);
  		});
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.login_box {
		width: 350px;
		height: 500px;
		background: #f5f5f5;
		border-radius: 4px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		-webkit-transform: translate(-50%,-50%);
		overflow: hidden;
		box-shadow: 0 0 10px 0px #999;
	}
	.top_bar {
		width: 100%;
		height: 64px;
	}
	.top_bar .name {
		float: left;
		font-size: 20px;
		line-height: 64px;
		margin-left: 26px;
		color: #4a4a4a;
	}
	.choose_head {
		width: 100%;
		height: 114px;
		position: relative;
		margin-top: 50px;
	}
	.choose_head .headimg {
		width: 114px;
		height: 114px;
		margin: 0 auto;
		background: #999;
	}
	.choose_head .to {
		position: absolute;
		top: 36px;
		font-size: 32px;
		font-weight: bold;
		color: #1aad19;
		cursor: pointer;
	}
	.choose_head .to_left {
		left: 30px;
	}
	.choose_head .to_right {
		right: 30px;
	}
	.btn_group {
		width: 262px;
		height: 124px;
		margin: 0 auto;
		margin-top: 50px;
	}
	.btn_group .btn {
		width: 100%;
		height: 50px;
		text-align: center;
		border-radius: 3px;
		font-size: 16px;
	}
	.btn_group input {
		outline: none;
		border: 1px solid #e1e1e1;
		color: #878787;
		box-sizing: border-box;
	}
	.btn_group .login_btn {
		margin-top: 24px;
		background: #1aad19;
		line-height: 50px;
		color: #fff;
		cursor: pointer;
	}
</style>
