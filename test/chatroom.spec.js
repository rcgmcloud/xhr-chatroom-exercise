var chai = require('chai');
var expect = chai.expect;

var fs = require('fs');
var path = require('path');

var chatModule = require('../app/lib/chatroom.js');

describe('Chat Module', function () {

    it('should create directory if none exists', function (){
      expect(chatModule.setDirectory('./test/tmp')).to.be.true;
      try{
      fs.rmdirSync( path.resolve( './test/tmp' ) );
      } catch (err){
        //the directory doesn't exist
      }
    });

    it('should know where to find Chatroom', function () {
      expect(chatModule.setDirectory('./test/data')).to.be.true;
      expect(chatModule.getDirectory(),'directory not set').to.equal( './test/data');
    });

  //});

  it('should be able to create a new Chatroom', function () {
    var messages = chatModule.createRoom('secret');
    expect(messages).to.be.an.instanceof(Array);
    expect(messages).to.have.length(0);
    fs.existsSync('./data/secret.json', function(exists){
      expect(exists, 'secret.json file does not exist').to.be.true;
    });
  });

  it('should create new JSON if Chatroom does not exist', function(){
    expect(chatModule.readChatroom('tmpchatroom')).to.deep.equal([]);
    fs.unlinkSync( path.resolve('./test/data/tmpchatroom.json'));
  });
  it('should get all messages from Chatroom',function(){
    expect(chatModule.readChatroom('secret')).to.deep.equal([]);
  });

  it('should be able to post a message to a Chatroom that does not exist',
    function(){
      var message = {
        name: "Anon",
        message: "Goodbye"
      };

    var messages = chatModule.postMessage(message, 'tmpchatroom');
    expect(messages).to.be.an.instanceof(Array);
    expect(messages).to.have.length(1);

    fs.unlinkSync( path.resolve('./test/data/tmpchatroom.json'));
  });

  it('should post a message to a Chatroom', function(){
    var firstMessage = {
      name: "Bob",
      message: "Hello"
    };
    var secondMessage = {
      name: "Alice",
      message: "World"
    };

    var messages = chatModule.postMessage(firstMessage, 'secret');
    expect(messages).to.be.an.instanceof(Array);
    expect(messages).to.have.length(1);
    expect(messages[0]).to.have.property('name', 'Bob');
    expect(messages[0]).to.have.property('message', 'Hello');
    expect(messages[0]).to.have.property('id', 1);
    expect(messages[0]).to.have.property('timestamp');
    expect(messages).to.deep.equal(chatModule.readChatroom('secret'));

    var messages = chatModule.postMessage(secondMessage, 'secret');
    expect(messages).to.be.an.instanceof(Array);
    expect(messages).to.have.length(2);
    expect(messages[1]).to.have.property('name', 'Alice');
    expect(messages[1]).to.have.property('message', 'World');
    expect(messages[1]).to.have.property('id', 2);
    expect(messages[1]).to.have.property('timestamp');
    expect(messages).to.deep.equal(chatModule.readChatroom('secret'));
  });

  it('should get all messages for a specific user', function () {
    expect(chatModule.readChatroom('secret', 'Alice')).to.have.length(1);
  });

  it('should get all user\'s messages for a specific user from all chatrooms', function () {
    expect(chatModule.getUserMessages('Alice')).to.have.length(1);

    var message = {
      name: 'Alice',
      message: 'Another message, Biznatches!'
    };
    chatModule.postMessage(message, 'secret');
    expect(chatModule.getUserMessages('Alice')).to.have.length(2);
    chatModule.postMessage(message, 'tmpchatroom');
    expect(chatModule.getUserMessages('Alice')).to.have.length(3);

    fs.unlinkSync( path.resolve('./test/data/tmpchatroom.json'));
  });
});