var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var messages = [];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('user is connected');

  socket.user = 'akhan';

  socket.on('new message', function(message) {

    messages.push(message);
    io.emit('update messages', {messages: messages, user: socket.user});

  });

  socket.on('disconnect', function() {
    console.log('user is gone');
  });
});

http.listen(4000, function() {
  console.log('Listening 4000...');
});