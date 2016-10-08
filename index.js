var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = {};
var messages = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('user is connected');

  socket.on('registerUser', function(name, callback) {
    if(!users.hasOwnProperty(name)) {
      users[name] = socket;
      socket.user = name;

      updateusers();
      callback(true, name);
    } else {
      callback(false);
    }
  });

  var updateusers = function() {
    var usersArray = Object.keys(users);

    io.emit('updateUsers', usersArray);
  };

  socket.on('sendMessage', function(msg) {
    messages.push(msg);
    io.emit('newMessage', socket.user, msg);
  });

  socket.on('sendMessagePrivate', function(from, to, msg) {
    users[from].emit('newMessagePrivate', from, msg);
    users[to].emit('newMessagePrivate', from, msg);
  });

});

http.listen(4000, function() {
  console.log('Listening 4000...');
});