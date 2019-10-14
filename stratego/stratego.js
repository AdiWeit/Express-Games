var reihenfolge;

class stratego {
  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
  }

    onJoin(client) {
      let newPlayer = {
        id: client.sessionId,
        client: client,
      };
      if (!this.player1) this.player1 = newPlayer;
      else this.player2 = newPlayer;
    if (!(this.player1 == null) && !(this.player2 == null)) {
      console.log("startGame");
      this.broadcast({
        "type": "spielerIds",
        "data": [this.player1.id, this.player2.id]
      });
      console.log(this.player1.client + " - " + this.player2.client);
      this.send(this.player1.client, {
        "type": "player1",
        "data": this.player1.id
      });
      this.send(this.player2.client, {
        "type": "player2",
        "data": this.player2.id
      });
      reihenfolge = ["player1", "player2"]

    }
  }
  onMessage(client, data) {
    if (!(data.message == "Spielerwechsel")) {
          this.broadcast(data.message);
    }
    else {
      console.log("Spielerwechsel");
      if (reihenfolge[0] == "player1") {
        this.broadcast({
          "type": "spielerIds",
          "data": [this.player2.id, this.player1.id]
        });
        reihenfolge = ["player2", "player1"];
      } else {
        this.broadcast({
          "type": "spielerIds",
          "data": [this.player1.id, this.player2.id]
        });
        reihenfolge = ["player1", "player2"];
      }
  }
}

    onLeave(client) {
      console.log("leave");
      console.log("client.sessionId: " + client.sessionId + ", player1: " + this.player1);
      if (!(this.player1 == null && this.player2 == null) && (!(client == undefined))) {
        this.broadcast({
          "type": "onLeave"
        });
    if (client.sessionId == this.player1.id) {
        this.player1 = null;
        console.log("logoutPlayer1");
    }
    else {
      this.player2 = null;
      console.log("logoutPlayer2");
    }
  }
    }


}
module.exports = stratego;
