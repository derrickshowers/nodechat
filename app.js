var express = require('express');
var socket = require('socket.io');
var app = express();
var server = require('http').createServer(app);
var io = socket.listen(server);

server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(client) {
  console.log('Client connected...');

  // add listener that broadcasts message to all clients
  client.on('text', function(data) {
    client.broadcast.emit('text', data );
    console.log('broadcasted ', data);
  });

});
