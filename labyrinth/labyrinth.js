class labyrinth {

  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
  }
  onJoin(client) {
    console.log(`${client.sessionId} joined.`);
    let newPlayer = {
      id: client.sessionId,
      //client: client,
      client: client.sessionId
    };
    if (this.player1 == null) this.player1 = newPlayer;
    else if (this.player2 == null) this.player2 = newPlayer;
    console.log(this.player1 + " - " + this.player2 + " - " + this.player3 + " - " + this.player4);
    if (this.player2 != null && this.player2 != null) {
      this.send(this.player1.client, {
        type: "name",
        data: this.player1.id
      });
      this.send(this.player2.client, {
        type: "name",
        data: this.player2.id
      });
      if (this.player3 != null) {
        this.send(this.player3.client, {
          type: "name",
          data: this.player3.id
        });
      }
      if (this.player4 != null) {
        this.send(this.player4.client, {
          type: "name",
          data: this.player4.id
        });
      }
      this.send(this.player1.client, {
        type: "player1",
        data: true
      });
      var ids = [this.player1.id, this.player2.id];
      if (this.player3 != null) ids.push(this.player3.id);
      if (this.player4 != null) ids.push(this.player4.id);
      this.broadcast({
        type: "ids",
        data: ids
      });
    }
  }
    onMessage(client, data) {
      this.broadcast(data.message);
    }
    onLeave(client) {
      if (this.player1 != undefined) console.log(client.sessionId + " - " + this.player1.id);
      else {
        console.log("war inaktiev");
        this.player1 = null;
        this.player2 = null;
        this.player3 = null;
        this.player4 = null;
      }
      if (this.player2 != undefined) console.log(this.player2);
      else {
        console.log("nur 1 Spieler");
        this.player1 = null;
      }

      if (this.player3 != null && client.sessionId === this.player3.id) {
        this.player3 = this.player4;
        console.log("spieler3 weg - aufrücken (4 Spieler)");
        this.player4 = null;
      }
      if (this.player2 != null && client.sessionId === this.player2.id) {
        console.log("spieler2 weg - aufrücken (4 Spieler)");
        this.player2 = this.player3;
        this.player3 = this.player4;
        this.player4 = null;
      }
      if (this.player1 != null && client.sessionId === this.player1.id) {
        console.log("spieler1 weg - aufrücken (4 Spieler)");
        this.player1 = this.player2;
        this.player2 = this.player3;
        this.player4 = null;
      }
      if (this.player2 != null && client.sessionId === this.player2.id) {
        console.log("spieler2 weg- aufrücken (3 Spieler)");
        this.player1 = this.player2;
        this.player2 = this.player3;
        //  this.player3 = null;
      }
      if (this.player1 != null && client.sessionId === this.player1.id) {
        console.log("spieler1 weg - aufrücken (3 Spieler)");
        this.player1 = this.player2;
        this.player2 = this.player3;
        this.player3 = null;
      }
      if (this.player4 == null == false && client.sessionId === this.player4.id) this.player4 = null;
      if (this.player3 == null == false && client.sessionId === this.player3.id) this.player3 = null;
      if (this.player2 == null == false && client.sessionId === this.player2.id) this.player2 = null;
      if (this.player2 == null == false && client.sessionId === this.player1.id) {
        this.player1 = this.player2;
        this.player2 = null;
      }
      console.log(this.player1 + " - " + this.player2 + " - " + this.player3 + " - " + this.player4);
    }
}

module.exports = labyrinth;
