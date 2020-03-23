// 引入express
var express = require('express');
// 获得express的实例
var app = express();
// 引入http模块
var http = require('http');
// 用http模块创建一个服务并把express的实例挂载上去
var server = http.Server(app);
// 引入socket.io并立即实例化，把server挂载上去
var io = require('socket.io')(server);
// 获取mongodb数据库驱动MongoClient的实例
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://username:password@localhost:27017/mychat';

//跨域
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if(req.method == 'OPTIONS') {
    res.send(200); //让options请求快速返回
  } else {
    next();
  }
});

app.use(express.static(__dirname));

// 路径映射
app.get('/', function(request, response) {
  response.send('关山难越，谁悲失路之人。萍水相逢，尽是他乡之客。');
});

var theonlinelist = {
  who: '',
  body: [{
      username: '聊天室',
      userhead: 'logo.jpg',
      usermsg: {
        body: '',
        time: new Date().getTime()
      }
    },
    {
      username: '前端组',
      userhead: 'timg_logo.jpg',
      usermsg: {
        body: '',
        time: new Date().getTime()
      }
    }
  ],
};
var allsocket = {};
// 新用户连接进来时
io.on('connection', function(socket) {
  //登录重名检测
  socket.on('login', function(loginInfo) {
    console.log(loginInfo);
    for(var i = 0; i < theonlinelist.body.length; i++) {
      if(theonlinelist.body[i].username == loginInfo) {
        console.log('登录重名，已返回!');
        socket.emit('loginYZSB', {
          'status': 0,
          'info': '名字已重复，请修改，谢谢！'
        });
        return;
      }
    }
    console.log('用户名检测通过');
    socket.emit('loginYZCG', {
      'status': 1,
      'info': '用户名检测通过'
    });
  });

  io.emit('connected', theonlinelist.body.length + 1);
  console.log(socket.id + ' user connected');
  var the_id = socket.id;
  allsocket[the_id] = socket;
  // 当有用户断开
  socket.on('disconnect', function() {
    console.log(socket.id + ' user disconnected');
    theonlinelist.who = '';
    for(var i = 0; i < theonlinelist.body.length; i++) {
      if(theonlinelist.body[i].socketid == socket.id) {
        console.log(theonlinelist.body[i].username + ' 离开了');
        io.emit('disconnected', theonlinelist.body[i].username);
        theonlinelist.body.splice(i, 1);
        io.emit('message', theonlinelist);
        return;
      }
    }
  });
  // 收到分页请求
  socket.on('pagecount', function(pageinfo) {
    console.log(pageinfo);
    //从数据库查询聊天室历史记录
    var selectData = function(db, callback) {
      //连接到表  
      var collection = db.collection('chat_msg');
      //查询数据
      var whereStr = {
        "type": 'msg'
      };
      collection.find(whereStr).sort({
        "usermsg.time": -1
      }).skip(pageinfo.curnum).limit(10).toArray(function(err, result) {
        if(err) {
          console.log('Error:' + err);
          return;
        }
        callback(result);
      });
    }
    MongoClient.connect(DB_CONN_STR, function(err, db) {
      selectData(db, function(result) {
        console.log("查询分页成功！");
        result = result.reverse();
        if(pageinfo.socketid) {
          allsocket[pageinfo.socketid].emit('chat_record', result);
        } else {
          console.log("丢失目标");
        }
        db.close();
      });
    });

  });

  //收到意见反馈
  socket.on('feedback', function(feedback) {
    feedback.time = new Date().getTime();
    console.log('意见反馈');
    console.log(feedback);
    //收到的公共聊天存到数据库
    var insertData = function(db, callback) {
      var collection = db.collection('chat_feedback');
      var data = [feedback];
      collection.insert(data, function(err, result) {
        if(err) {
          console.log('Error:' + err);
          return;
        }
        callback(result);
      });
    }
    MongoClient.connect(DB_CONN_STR, function(err, db) {
      insertData(db, function(result) {
        console.log('意见反馈插入成功！');
        db.close();
      });
    });
  });

  // 收到了客户端发来的消息
  socket.on('message', function(message) {
    // 给客户端发送消息
    message.usermsg.time = new Date().getTime();
    message.socketid = socket.id;
    console.log(message);

    if(message.to == '前端组') {
      message.usermsg.time = new Date().getTime();
      allsocket[message.socketid].emit('message', message);

      var url = encodeURI("http://www.tuling123.com/openapi/api?key=14cdf0b9a5d44e8ca0d07dab6de888c9&info=" + message.usermsg.body + '&userid=' + message.username);
      var data = '';
      var req = http.get(url, function(res) {
        res.on('data', function(chunk) {
          data += chunk;
        });
        res.on('end', function() {
          var result = JSON.parse(data);
          console.log(result.text);
          var timer = setTimeout(function() {
            allsocket[message.socketid].emit('message', {
              type: 'single_msg',
              username: '前端组',
              userhead: 'timg_logo.jpg',
              usermsg: {
                body: result.text,
                time: new Date().getTime()
              },
              to: message.username
            });
            clearTimeout(timer);
          }, 3000);
        });
      });
      req.end();

      return;
    }
    if(message.type == 'onlinelist') {
      for(var i = 0; i < theonlinelist.body.length; i++) {
        if(theonlinelist.body[i].username == message.username) {
          return;
        }
      }
      theonlinelist.who = message.username;
      theonlinelist.body.push(message);

      console.log(theonlinelist.who + ' 登录了');

      setTimeout(function() {
        allsocket[message.socketid].emit('message', {
          type: 'single_msg',
          username: '前端组',
          userhead: 'timg_logo.jpg',
          usermsg: {
            body: '欢迎大家来到网易云课堂，《前端高级开发工程师 》微专业直播公开课，我是网易唐雅琴',
            time: new Date().getTime()
          },
          to: message.username
        });
      }, 3000);
      io.emit('message', theonlinelist);

      return;
    }
    if(message.type == 'single_msg') {
      var curSocketId = '';
      for(var i = 0; i < theonlinelist.body.length; i++) {
        if(theonlinelist.body[i].username == message.to) {
          curSocketId = theonlinelist.body[i].socketid;
        }
      }
      if(curSocketId) {
        allsocket[curSocketId].emit('message', message);
      } else {
        io.emit('message', theonlinelist);
      }
      if(message.username != message.to) {
        allsocket[message.socketid].emit('message', message);
      }
      return;
    }
    io.emit('message', message);

    //收到的公共聊天存到数据库
    var insertData = function(db, callback) {
      var collection = db.collection('chat_msg');
      var data = [message];
      collection.insert(data, function(err, result) {
        if(err) {
          console.log('Error:' + err);
          return;
        }
        callback(result);
      });
    }
    MongoClient.connect(DB_CONN_STR, function(err, db) {
      insertData(db, function(result) {
        console.log('公聊记录插入成功！');
        db.close();
      });
    });
  });
});

var server = server.listen(4000, function() {
  console.log('服务端启动成功！端口4000');
});