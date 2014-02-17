var express = require('express');
var socket = require('socket.io');
var path = require('path');
var redis = require('redis-url');
var redisClient = redis.connect('redis://redistogo:1ff658470d583528198c85be815ffccb@pearlfish.redistogo.com:9682/');
var app = express();
var server = require('http').createServer(app);
var io = socket.listen(server);

server.listen(process.env.PORT);
app.use('/', express.static(path.join(__dirname, 'public/')));

var clientsConnected = 0;

// listen for connection
io.sockets.on('connection', function(client) {
  
  // update num of clinets and send it, then show latest msgs
  clientsConnected++;
  client.emit('clientsConnected', clientsConnected);
  redisClient.lrange('messages', 0, -1, function(err, messages) {
    messages = messages.reverse();
    messages.forEach(function(message) {
      client.emit('message', message);
    });
  });
  
  // *** log it ***
  console.log('Client connected...');
  console.log(clientsConnected + ' currently connected');

  // listen for name and then set it
  client.on('name', function(name) {
    
    client.set('name', name);
    client.broadcast.emit('name', name + ' has joined the chat');
    
    // *** log it ***
    client.broadcast.emit('clientsConnected', clientsConnected);
  });

  // listen for the message and broadcast out to other clients
  client.on('message', function(data) {
    
    client.get('name', function(err, name) {
      redisClient.lpush('messages', name + ': ' + data, function(err, res) {
        redisClient.ltrim('messages', 0, 10);
      });
      client.broadcast.emit('message', name + ': ' + data );
    });
    
    // *** log it ***
    console.log('broadcasted ', data);
  });

  // listen for disconnect
  client.on('disconnect', function(data) {
    
    client.get('name', function(err, name) {
      client.broadcast.emit('disconnect', name + ' has left the chat');
    });
    clientsConnected--;
    client.broadcast.emit('clientsConnected', clientsConnected);
    
    // *** log it ***
    console.log('Client disconnected...');
    console.log(clientsConnected + ' currently connected');
  });

});