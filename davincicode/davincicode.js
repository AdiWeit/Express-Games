var reihenfolge = [];
var AblageListe = [];
var j;
var x;
var i;

class davincicode {
  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
  }
  onJoin(client) {
  //  console.log(`${client.sessionId} joined.`);
    let newPlayer = {
      id: client.sessionId,
      client: client,
    };
    if (this.player1 == null) this.player1 = newPlayer;
    else if (this.player2 == null) this.player2 = newPlayer;
    if (!(this.player1 == null) && !(this.player2 == null)) {
      console.log("player1 + player2: " + this.player1.id + " - " + this.player2.id);
  console.log("Spiel beginnen");
  AblageListe[0] = [ [0,"black",false], [0,"white",false], [1,"black",false],[1,"white",false], [2,"black",false], [2,"white",false], [3,"black",false], [3,"white",false] , [4,"black",false], [4,"white",false] ,[5,"black",false], [5,"white",false], [6,"black",false], [6,"white",false] , [7,"black",false], [7,"white",false] , [8,"black",false] , [8,"white",false], [9,"black",false], [9,"white",false] , [10,"black",false] , [10,"white",false] , [11,"black",false] , [11,"white",false]];
  for (i = AblageListe[0].length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = AblageListe[0][i];
    AblageListe[0][i] = AblageListe[0][j];
    AblageListe[0][j] = x;
  }
  AblageListe[1] = [];
  AblageListe[2] = [];
  for (var i = 0; i < 4; i++) {
    AblageListe[1].push(AblageListe[0][0])
    AblageListe[0].shift();
  }
  for (var i = 0; i < 4; i++) {
    AblageListe[2].push(AblageListe[0][0])
    AblageListe[0].shift();
  }

  this.broadcast({
  "type": "KartenSpieler1",
  "data": AblageListe[1]
});
this.broadcast({
"type": "KartenSpieler2",
"data": AblageListe[2]
});
reihenfolge = [this.player1.id, this.player2.id];
this.broadcast({
"type": "Reihenfolge",
"data": reihenfolge
});
this.send(this.player1.client, {
  "type": "name",
  "data": reihenfolge[0]
});
this.send(this.player2.client, {
  "type": "name",
  "data": reihenfolge[1]
});
this.broadcast({
"type": "KartenZiehen",
"data": AblageListe[0]
});
  }
}
  onMessage(client, data) {
    this.broadcast(data.message);
  }
  onLeave(client) {
    if (!(this.player1 == null || client.sessionId == undefined)) {
  if (client.sessionId == this.player1.id) {
      this.player1 = null;
  }
  else {
    this.player2 = null;
  }
}

}
}

module.exports = davincicode;
