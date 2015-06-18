module.exports = {
  setDirectory: setDirectory,
  getDirectory: getDirectory,
  createRoom: createRoom,
  readChatroom: readChatroom,
  postMessage: postMessage,
  getUserMessages: getUserMessages
};

var fs = require('fs');
var path = require('path');
var _chatDirectory = null;

function setDirectory(directoryPath){
  //var directory = fs.statSync(path.resolve(directoryPath));
  var directory = null;
  var dirPath = path.resolve(directoryPath);

  try {
    directory = fs.statSync(dirPath);
  } catch (err){
    fs.mkdirSync(dirPath);
    directory = fs.statSync(dirPath);
  }

  var isDirectory = directory.isDirectory();

  if(isDirectory){
    _chatDirectory = directoryPath;
  }
  return isDirectory;
}

function getDirectory(){
  return _chatDirectory;
}

function createRoom(roomName){
  var messages = [];
  var filepath = path.resolve(_chatDirectory, roomName + '.json');
  fs.writeFileSync(filepath, JSON.stringify(messages));

  return messages;
}

function readChatroom(roomName, username){
  var filepath = path.resolve(_chatDirectory, roomName + '.json');
  var fileString = null;

  try{
    fileString = fs.readFileSync( filepath ).toString();
  } catch (err){
    return createRoom(roomName);
  }

  if(username !== undefined){
    //return only messages belong to certain user
    var allUsernameMsgs = JSON.parse(fileString);
    return allUsernameMsgs.filter(function (message){
      return message["name"] === username;
    });
  }

  return JSON.parse(fileString);
}

function postMessage(message, roomName){
  var messages = readChatroom(roomName);
  var newMessage = {
    name: message.name,
    message: message.message,
    id: messages.length + 1,
    timestamp: new Date().toString()
  };
  messages.push(newMessage);
  var filepath = path.resolve(_chatDirectory, roomName + '.json');
  fs.writeFileSync(filepath, JSON.stringify(messages));
  return messages;
}

function getUserMessages(username){
  var filesDir = fs.readdirSync(path.resolve(_chatDirectory));
  var fileNames = [];

  for(var i = 0; i<filesDir.length; i++){
    var name = filesDir[i].slice(0, -5);
    fileNames.push(name);
  }

  var msgs = [];
  for(var k=0; k<fileNames.length; k++){
    msgs = msgs.concat(readChatroom( fileNames[k], username));
  }
  return msgs;
}