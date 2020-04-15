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
// this.broadcast({
// "type": "KartenZiehen",
// "data": AblageListe[0]
// });
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
