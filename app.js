var express = require('express');
var socket = require('socket.io');
var app = express();
var server = require('http').createServer(app);
var io = socket.listen(server);

server.listen(process.env.PORT);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(client) {
  console.log('Client connected...');

  // add listener to name and set it
  client.on('name', function(name) {
    client.set('name', name);
  });

  // add listener that broadcasts message to all clients
  client.on('text', function(data) {
    client.get('name', function(err, name) {
      client.broadcast.emit('text', name + ': ' + data );
    });
    console.log('broadcasted ', data);
  });

});
