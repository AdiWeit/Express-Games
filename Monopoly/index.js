// import {
//   monopolyKartenspiel
// } from 'monopoly.js';
const monopolyKartenspiel = require('./monopoly');

const express = require('express');
//var app = express();
const app = express.Router();

// const bodyParser = require('body-parser');
// app.use(bodyParser.json());

var monopolyInstance = new monopolyKartenspiel(addBroadcast, addMessage);

var clientIds = [];

var messageQueue = {};

app.get('/', function(req, res) {
  res.sendFile('static/monopoly.html', {
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

  monopolyInstance.onJoin({
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

  monopolyInstance.onLeave({
    sessionId: clientId
  });
});
app.post('/message-queue', function(req, res) {
  let messages = messageQueue[req.body.clientId];
  res.json(messages);
  messageQueue[req.body.clientId] = [];
});

app.post('/message', function(req, res) {
  monopolyInstance.onMessage(req.body.clientId, req.body.content)
  res.json({
    success: true
  });
});

// app.listen(3000, function() {
//   console.log('Example app listening on port 3000!');
// });


function addBroadcast(obj) {
  for (let clientId in messageQueue) {
    messageQueue[clientId].push(obj);
  }
}

function addMessage(clientId, obj) {
  console.log("sending message to ", clientId);
  messageQueue[clientId].push(obj);
}

module.exports = app;
