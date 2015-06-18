var express = require('express');
var router = express.Router();
var chatroomModule = require('../lib/chatroom.js');

module.exports = router;

router.use(function(req, res, next){
  next();
});
router.route('/:chatroom')
  .get(function(req, res){
  //check if directory exists. if it doesn't exist, create chatroom
  //return readDirectory (use: res.json)

  //returns the chatroom's messages as a json's object
  var chatroomName = req.params.chatroom;
  var messages = chatroomModule.readChatroom(chatroomName);
  return res.json(messages);
  })
  .post(function(req, res){
  //var chatRoom = chatroom[req.params.chatroom];
  var message = {
    id: counter +=1,
    name: req.body.name,
    message: req.body.message,
    timestamp: new Date()
  };
  //message.push(object);
  var messages = chatroomModule.postMessage(message, req.params.chatroom);
  res.json(messages);
});

