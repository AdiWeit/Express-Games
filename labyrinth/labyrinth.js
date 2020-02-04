var ids = [];
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
    if (this.player1 == null && this.player2 == null && this.player3 == null && this.player4 == null) this.spielerOnline = 0;
    if (this.player1 == null) this.player1 = newPlayer;
    else if (this.player2 == null) this.player2 = newPlayer;
    else if (this.player3 == null) this.player3 = newPlayer;
    else if (this.player4 == null) this.player4 = newPlayer;
    this.spielerOnline++;
    console.log(this.player1 + " - " + this.player2 + " - " + this.player3 + " - " + this.player4);
    if (this.player2 != null && this.player2 != null) {
      if (this.spielerOnline < 2) this.spielerOnline = 2;
      console.log("spielerOnline: " + this.spielerOnline);
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
      ids = [this.player1.id, this.player2.id];
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
      //    if (!client.sessionId) {
      if (this.spielerOnline == 2 && client.sessionId === this.player1.id) console.log(`${client.sessionId + "(0)"} left.`);
      else console.log(`${client.sessionId + "(1)"} left.`);
      this.broadcast(`${client.sessionId} left`);
      //if (this.player1 != undefined) console.log(client.sessionId + " - " + this.player1.id);
      if (ids.includes(client.sessionId)) console.log("nothingSpacial");
      else {
        console.log("war inaktiev");
        if (this.spielerOnline == undefined) this.spielerOnline = 1;
        else this.spielerOnline++;
        if (this.player1 != null && client.sessionId == this.player1.id) this.player1 = null;
        if (this.player2 != null && client.sessionId == this.player2.id) this.player2 = null;
        if (this.player3 != null && client.sessionId == this.player3.id) this.player3 = null;
        if (this.player4 != null && client.sessionId == this.player4.id) this.player4 = null;
      }
      // if (this.player2 != undefined) console.log(this.player2);
      // else {
      //   console.log("nur 1 Spieler");
      //   this.player1 = null;
      //   this.spielerOnline = 1;
      // }
      if (this.player3 != undefined) console.log(this.player3.id);
      if (this.player4 != undefined) console.log(this.player4.id);
      if (this.spielerOnline == 4 && this.player3 != null && client.sessionId === this.player3.id) {
        this.player3 = this.player4;
        console.log("spieler3 weg - aufrücken (4 Spieler)");
        this.player4 = null;
      }
      if (this.spielerOnline == 4 && this.player2 != null && client.sessionId === this.player2.id) {
        console.log("spieler2 weg - aufrücken (4 Spieler)");
        this.player2 = this.player3;
        this.player3 = this.player4;
        this.player4 = null;
      }
      if (this.spielerOnline == 4 && this.player1 != null && client.sessionId === this.player1.id) {
        console.log("spieler1 weg - aufrücken (4 Spieler)");
        this.player1 = this.player2;
        this.player2 = this.player3;
        this.player4 = null;
      }
      if (this.spielerOnline == 3 && this.player2 != null && client.sessionId === this.player2.id) {
        console.log("spieler2 weg- aufrücken (3 Spieler)");
        this.player1 = this.player2;
        this.player2 = this.player3;
        //  this.player3 = null;
      }
      if (this.spielerOnline == 3 && this.player1 != null && client.sessionId === this.player1.id) {
        console.log("spieler1 weg - aufrücken (3 Spieler)");
        this.player1 = this.player2;
        this.player2 = this.player3;
        this.player3 = null;
      }
      if (this.spielerOnline == 4 && this.player4 != null && client.sessionId === this.player4.id) this.player4 = null;
      if (this.spielerOnline == 3 && this.player3 != null && client.sessionId === this.player3.id) this.player3 = null;
      if (this.spielerOnline == 2 && this.player2 != null && client.sessionId === this.player2.id) this.player2 = null;
      if (this.spielerOnline == 2 && this.player2 != null && client.sessionId === this.player1.id) {
        this.player1 = this.player2;
        this.player2 = null;
      }
      /*  if (client.sessionId === this.player1.id) this.player1 = null;
        else if (client.sessionId === this.player2.id) this.player2 = null;
        else if (client.sessionId === this.player3.id) this.player3 = null;
        else this.player4 = null; */
      this.spielerOnline--;
      /*  if (!this.player2) {
          Reihenfolge = [];
          var j, x, i;
          //  return kartenZiehen;
          sender = 0;
          kartenSpieler = [];
          zählerListe = [];
          this.spielerOnline = 0;
        } */
      //  }
      console.log(this.spielerOnline + " - " + this.player1 + "/" + this.player2 + "/" + this.player3 + "/" + this.player4 + "/");
      if ((this.spielerOnline == NaN)) {
        this.send(this.player1.client, {
          "type": "reloadPage"
        });
      }
      console.log("spielerOnline: " + this.spielerOnline);
    }
}

module.exports = labyrinth;
