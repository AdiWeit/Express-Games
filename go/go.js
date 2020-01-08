var reihenfolge = [];

class go {
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
this.send(this.player1.client, {
  type: "name",
  data: reihenfolge[0]
});
this.send(this.player2.client, {
  type: "name",
  data: reihenfolge[1]
});
this.broadcast({
type: "Reihenfolge",
data: reihenfolge
});
  }
}
  onMessage(client, data) {
console.log(data.message.type + " - " +      data.message.data[data.message.sender] + " - " + data.message.requiredPoints);
        if (data.message.type == "points" && data.message.data[data.message.sender] >=  data.message.requiredPoints)  {
      this.broadcast(data.message.sender + " wins!");
    }
    else this.broadcast(data.message);
  }
  onLeave(client) {
    if (!(this.player1 == null || this.client == undefined)) {
  if (this.client.sessionId == this.player1.id) {
      this.player1 = null;
  }
  else {
    this.player2 = null;
  }
}

}
}

module.exports = go;
