var express = require('express');
var router = express.Router();
var chatroomModule = require('../lib/chatroom.js');

module.exports = router;

router.get('/users/:username', function(req, res){
  //do stuff
});

router.post('/users/:username', function(req, res){
  //do stuff
});