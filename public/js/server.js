// configure server
var server = {};
if (document.URL.indexOf('localhost') > 0) {
  server.serverAddress = 'http://localhost:8080';
} else {
  server.serverAddress = 'http://dsnodechat.herokuapp.com/'; 
}
server = io.connect(server.serverAddress);