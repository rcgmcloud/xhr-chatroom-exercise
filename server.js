var config = require('./config.json');
var express = require('express');
var app = express();
var server = app.listen(config.port, displayServerInfo);
var chatroomModule = require('./app/lib/chatroom.js');
var bodyParser = require('body-parser');
chatroomModule.setDirectory('./app/data');
var counter = 1;
//console.log(chatrooms);

app.use(express.static(__dirname + '/public'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.get('/', function(req, res){
  //response.send('Hello, World!');
  res.render('index');
});

//require the chatroom routes
app.use('/chatrooms', require('./app/routes/chatrooms.js'));
app.use('/users', require('./app/routes/users.js'));


app.get('/greet/:name', function(req, res){
  var name = req.params.name.toLowerCase();
  name = name[0].toUpperCase() + name.slice(1);
  //console.log(request.params);
  res.render('index', {name: name});
});

//app.listen(config.port);

function displayServerInfo(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://%s:%s', host, port)
}