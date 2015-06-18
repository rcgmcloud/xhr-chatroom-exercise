//alert('Hello');

$(function() {
  var $form = $('<form>');
  var $body = $('body');
  var $div1 = $('<div class="div1"></div>');
  var $image = $('<img src= "https://lh6.ggpht.com/z19p1xutLClxg702BnC1Y43ylFoyigGko972FnF-youfHysvkjSaQFSLyLlWnxvVVUg=w300">');
  var $greeting = $('<h1>WELL,<br> HELLO THERE.</h1>');
  var $subheader = $('<h2>Please sign in.</h2>');
  $body.append($div1);
  $div1.append($greeting, $subheader, $image, $form, $inputRoom, $inputName);

  var $inputRoom = $('<input name="room">').attr('placeholder', 'Room');

  var $inputName = $('<input name="name">').attr('placeholder', 'Name');
  var $button = $('<button  type="submit">submit</button>').attr('type', 'submit').text('Sign In');

  $form.append($inputRoom, $inputName, $button);

  $form.on('submit', function(event){
    event.preventDefault();
    console.log(postLocation);
    var postLocation = "http://localhost:3000/chatrooms/"+ $inputRoom.val();
     console.log(postLocation);
    chatPage($inputName.val(), postLocation);
    this.reset();

  });
});

function chatPage(name, postLocation) {
  var $div2 = $('<div class=div2</div>');
  var $form = $('<form>');
  var $body = $('body');
  var $list = $('<ul>');
  var $greeting = $('<h1>Welcome to the Chat Room.</h1>');

  $body.append($div2,$greeting, $form);
  $div2.append($greeting, $form);

  var $inputMessage = $('<textarea name="inputMessage">').attr('placeholder', 'Say something!');
  var $button = $('<button type="submit">submit</button>').attr('type', 'submit').text('Submit');

  $form.append($inputMessage, $button, $list);

  $form.on('submit', function(event){
    event.preventDefault();
    //debugger;
    var payload = {
      name: name,
      message: $inputMessage.val()
    };
    sendMessage(payload);
    getMessages();
    this.reset();
  });


//send message to server
  function sendMessage(payload){

    $.ajax({
      type: 'POST',
      contentType: "application/json",
      url: postLocation,
      data: JSON.stringify(payload),
      //success: messageAdd,
      error: function(){
      alert("my dearest apologies. it could not work properly.");
     }
    });
  }
//get messages from server
  function getMessages(){
    //$list.empty();
    $.get(postLocation, function(data){
      $.each(data.filter(isNewMsg), function(keys, value){
        $list.append('<li>name: '+value.name + '<br>message: ' + value.message+ '</li>');
      });
      function isNewMsg(message){
        if(message.id >= $('li').length){
          return true;
        }
      }
    });
  }
  setInterval(getMessages, 2000);
}