(function() {
  
  // inserts text into a td and appends it to tbody
  var insertText = function(text) {
    
    var newText = document.createElement('tr');
    newText.innerHTML = '<td>' + text + '</td>';

    var allText = document.getElementsByTagName('tbody')[0];
    return allText.appendChild(newText);

  }

  // hide this element
  var hide = function() {
    for(var i=0; i<arguments.length; i++) {
      document.getElementById(arguments[i]).style.display = 'none'
    }
  }

  // show this element
  var show = function() {
    for(var i=0; i<arguments.length; i++) {
      document.getElementById(arguments[i]).style.display = 'block'
    }
  }

  // Hide the chat options on page load
  hide('message', 'sendmsg');

  // List for submit on name
  document.getElementById('sendname').addEventListener('click', function(e) {
    var name = document.getElementById('name').value;
    server.emit('name', name);
    show('message', 'sendmsg');
    hide('sendname', 'name');
  });

  // Listen for submit on sending message
  document.getElementById('sendmsg').addEventListener('click', function(e) {
    var messageText = document.getElementById('message').value;
    server.emit('text', messageText);
    insertText('Me: ' + messageText);
    document.getElementById('message').value = "";
  });

  // server events
  server.on('text', function(data) {
    console.log('server.on callback called');
    insertText(data);
  });

})();