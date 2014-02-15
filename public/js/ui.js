(function() {
  
  // inserts text into a td and appends it to tbody
  var insertText = function(text, highlight) {
    
    var newText = document.createElement('tr');
    if (highlight === 'info') newText.setAttribute('class', 'info');
    if (highlight === 'danger') newText.setAttribute('class', 'danger');
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

  var init = function() {

    // hide the chat options on page load
    hide('message', 'sendmsg');

    // list for submit on name
    document.getElementById('sendname').addEventListener('click', function(e) {
      var name = document.getElementById('name').value;
      server.emit('name', name);
      show('message', 'sendmsg');
      hide('sendname', 'name');
    });

    // listen for submit on sending message
    document.getElementById('sendmsg').addEventListener('click', function(e) {
      var messageText = document.getElementById('message').value;
      server.emit('text', messageText);
      insertText('Me: ' + messageText);
      document.getElementById('message').value = "";
    });

    // server events
    server.on('text', function(data) {
      insertText(data);
    });

    server.on('name', function(data) {
      insertText(data, 'info');
    });

    server.on('disconnect', function(data) {
      insertText(data, 'danger');
    });

  }

  init();

})();