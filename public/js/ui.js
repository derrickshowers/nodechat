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

  // updates number of users currently in chat
  var numOfChatters = function(num) {

    if (document.getElementsByTagName('thead').length < 1) {
      var tempEl = document.createElement('thead');
      var tempElParent = document.getElementsByTagName('table')[0];
      tempElParent.insertBefore(tempEl, tempElParent.firstChild);
    }
   
    var numOfChattersEl = document.getElementsByTagName('thead')[0];

    if (num > 1)
      numOfChattersEl.innerHTML = '<tr class="warning"><td>There are currently ' + num + ' people connected</td></tr>';
    else
      numOfChattersEl.innerHTML = '<tr class="warning"><td>You\'re the only one here! Why not invite someone to chat with?</td></tr>';

  }

  // hide this element
  var hide = function() {
    for(var i=0; i<arguments.length; i++) {
      document.getElementById(arguments[i]).style.display = 'none'
      document.getElementById(arguments[i]).setAttribute('data-active', 'false');
    }
  }

  // show this element
  var show = function() {
    for(var i=0; i<arguments.length; i++) {
      document.getElementById(arguments[i]).style.display = 'block'
      document.getElementById(arguments[i]).setAttribute('data-active', 'true');
    }
  }

  // find a sibling
  var findSibling = function(el, tagName) {
    console.log(el);
    if (el.nextSibling.tagName === tagName.toUpperCase())
      return el.nextSibling;
    else
      return findSibling(el.nextSibling, tagName);
  }

  // enter sends name and message
  var enterKey = function() {
    var inputFields = document.getElementsByTagName('input');
    for (var i=0; i<inputFields.length; i++) {
      var thisOne = inputFields[i];
      thisOne.addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if (key == 13) {
          console.log(findSibling(this.parentNode, 'div'));
          //this.parentNode.nextSibling.nextSibling.childNodes[1].click();
        }
      });
    }
  }

  // start things up
  var startChat = function() {

    var name = document.getElementById('name').value;
    server = io.connect(server.serverAddress);
    server.emit('name', name);
    show('message', 'sendmsg');
    hide('sendname', 'name');

    // server events
    server.on('text', function(data) {
      insertText(data);
    });

    server.on('name', function(data) {
      insertText(data, 'info');
    });

    server.on('clientsConnected', function(num) {
      numOfChatters(num);
    });

    server.on('disconnect', function(data) {
      insertText(data, 'danger');
    });

  }

  var init = function() {

    // hide/show currect fields
    hide('message', 'sendmsg');
    show('sendname', 'name');

    // list for submit on name
    document.getElementById('sendname').addEventListener('click', startChat);

    // listen for submit on sending message
    document.getElementById('sendmsg').addEventListener('click', function(e) {
      var messageText = document.getElementById('message').value;
      server.emit('text', messageText);
      insertText('Me: ' + messageText);
      document.getElementById('message').value = "";
    });

    enterKey();

  }

  init();

})();