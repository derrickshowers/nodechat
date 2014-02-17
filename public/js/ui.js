(function() {
  
  // inserts text into a td and appends it to tbody
  var insertText = function(text, highlight) {
    
    var newText = document.createElement('tr');
    if (highlight === 'info') newText.setAttribute('class', 'info');
    if (highlight === 'danger') newText.setAttribute('class', 'danger');
    newText.innerHTML = '<td>' + text + '</td>';

    var allText = document.getElementsByTagName('tbody')[0];
    return allText.insertBefore(newText, allText.firstChild);

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

  // enter sends name and message
  var enterKey = function() {
    var inputFields = document.getElementsByTagName('input');
    for (var i=0; i<inputFields.length; i++) {
      var thisOne = inputFields[i];
      thisOne.addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if (key == 13) {
          dsHelpers.findChild(dsHelpers.findSibling(this.parentNode, 'div'), 'button').click();
        }
      });
    }
  }

  // start things up
  var startChat = function() {

    var nameInput = document.getElementById('name');
    
    if (dsHelpers.validateInput(nameInput)) {

      var name = nameInput.value;
      server = io.connect(server.serverAddress);
      server.emit('name', name);
      dsHelpers.show('message', 'sendmsg');
      dsHelpers.hide('sendname', 'name');

      // server events
      server.on('message', function(data) {
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

    } else {
      
      dsHelpers.showError(nameInput);
    
    }

  }

  var init = function() {

    // hide/show currect fields
    dsHelpers.hide('message', 'sendmsg');
    dsHelpers.show('sendname', 'name');

    // list for submit on name
    document.getElementById('sendname').addEventListener('click', startChat);

    // listen for submit on sending message
    document.getElementById('sendmsg').addEventListener('click', function(e) {
      
      var messageInput = document.getElementById('message');
      
      if (dsHelpers.validateInput(messageInput)) {
        
        var messageText = messageInput.value;
        server.emit('message', messageText);
        insertText('Me: ' + messageText);
        messageInput.style.border = 'none';
        messageInput.value = '';

      } else {

        dsHelpers.showError(messageInput);

      }
    });

    // add ability to use enter key to send messages and input name
    enterKey();

  }

  // lets do this!
  init();

})();