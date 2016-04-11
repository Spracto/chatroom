var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var app = express();

app.use(session({secret: 'murderboner'}));
app.use(express.static(path.join(__dirname, "./static")));
app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');
app.get('/', function(request, response){
  response.render('index')
});

var server = app.listen(8000, function(){
  console.log('listening on port 8000');
});

var io = require('socket.io').listen(server)
var counter = 0;
io.sockets.on('connection', function(socket){
  console.log('sockets are working')
  socket.on('got_a_new_user', function(user){
    counter += 1;
    var new_user ={
      id: counter,
      name: user.name
    };
    // console.log(new_user);
    socket.broadcast.emit('new_user', new_user);
  });
  socket.on('chat_message', function(message){
    io.emit('chat_response', message)
    console.log(message);
  })
});
