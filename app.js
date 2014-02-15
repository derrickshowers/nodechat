var express = require('express');
var socket = require('socket.io');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = socket.listen(server);

server.listen(process.env.PORT);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.use('/img',express.static(path.join(__dirname, 'public/img')));
app.use('/js',express.static(path.join(__dirname, 'public/js')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));

var clientsConnected = 0;

io.sockets.on('connection', function(client) {
  console.log('Client connected...');
  clientsConnected++;
  console.log(clientsConnected + ' currently connected');

  // add listener to name and set it
  client.on('name', function(name) {
    client.set('name', name);
    client.broadcast.emit('name', name + ' has joined the chat');
  });

  // add listener that broadcasts message to all clients
  client.on('text', function(data) {
    client.get('name', function(err, name) {
      client.broadcast.emit('text', name + ': ' + data );
    });
    console.log('broadcasted ', data);
  });

  // listen for disconnect
  client.on('disconnect', function(data) {
    client.get('name', function(err, name) {
      client.broadcast.emit('disconnect', name + ' has left the chat');
    });
    console.log('Client disconnected...');
    clientsConnected--;
    console.log(clientsConnected + ' currently connected');
  });

});
