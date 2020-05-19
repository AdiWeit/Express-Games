// import {
//   guessTheValueKartenspiel
// } from 'guessTheValue.js';
const guessTheValue = require('./guessTheValue');

const express = require('express');
//var app = express();
const app = express.Router();

// const bodyParser = require('body-parser');
// app.use(bodyParser.json());

var guessTheValueInstance = new guessTheValue(addBroadcast, addMessage);

var clientIds = [];

var messageQueue = {};

app.get('/', function(req, res) {
  res.sendFile('static/guessTheValue.html', {
    root: __dirname
  });
});

app.post('/login', function(req, res) {
  let clientId = req.body.clientId;
  console.log("Login incoming: UserID: " + clientId);
  res.json({
    a: "DEINEMUDDA"
  });
  clientIds.push(clientId);
  messageQueue[clientId] = [];

  guessTheValueInstance.onJoin({
    sessionId: clientId
  });
});
app.post('/logout', function(req, res) {
  let clientId = req.body.clientId;
  console.log("Logout incoming: UserID: " + clientId);
  res.json({
    a: "DEINEMUDDA"
  });
  //  clientIds.push(clientId);
  messageQueue[clientId] = undefined;

  guessTheValueInstance.onLeave({
    sessionId: clientId
  });
});
app.post('/message-queue', function(req, res) {
  let messages = messageQueue[req.body.clientId];
  res.json(messages);
  messageQueue[req.body.clientId] = [];
});

app.post('/message', function(req, res) {
  guessTheValueInstance.onMessage(req.body.clientId, req.body.content)
  res.json({
    success: true
  });
});

// app.listen(3000, function() {
//   console.log('Example app listening on port 3000!');
// });


function addBroadcast(obj) {
  for (let clientId in messageQueue) {
  //   console.log("clientId: " + clientId);
  //   console.log(messageQueue);
  // //  console.log(Object.keys(messageQueue).includes(clientId));
  //   console.log();
    if (messageQueue[clientId] == undefined) {
//      console.log("nicht gepusht weil leave");
    }
    else {
      messageQueue[clientId].push(obj);
    }
  }
}

function addMessage(clientId, obj) {
  console.log("sending message to ", clientId);
  if (messageQueue[clientId] == undefined) {
  //  console.log("nicht gepusht weil leave");
  }
  else {
    messageQueue[clientId].push(obj);
  }
}

module.exports = app;
