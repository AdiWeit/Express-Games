var spielerOnline = 0;
class uno {
  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
  }

  onInit(options) {
    console.log("BasicRoom created!", options);
  }

  onJoin(client) {
    console.log(`${client.sessionId} joined.`);
    let newPlayer = {
      id: client.sessionId,
      client: client,
    };
    spielerOnline++;
    // later up to 8
    if (this.player1 == null) {
      console.log("player1");
      this.player1 = newPlayer;
    } else if (this.player2 == null) {
      this.player2 = newPlayer;
      console.log("player2");
    } else if (this.player3 == null) {
      this.player3 = newPlayer;
      console.log("player3");
    } else if (this.player4 == null) {
      this.player4 = newPlayer;
      console.log("player4");
    }
    if (!(this.player1 == null) && !(this.player2 == null)) {
      console.log("Mehr als 1 Spieler");
      this.broadcast({
        "type": "AnzahlSpieler",
        "data": spielerOnline
      });
      if (spielerOnline > 2) {
        this.send(this.player3.client, {
          "type": "spielerDu",
          "data": 2
        });
      }
      if (spielerOnline > 3) {
        this.send(this.player4.client, {
          "type": "spielerDu",
          "data": 3
        });
      }
      // var Reihenfolge = Math.floor(Math.random() * spielerOnline);
      console.log(this.player1.client, this.player2.client);
      this.send(this.player1.client, {
        "type": "spielerDu",
        "data": 0
      });
      this.send(this.player2.client, {
        "type": "spielerDu",
        "data": 1
      });
      // this.broadcast({
      //   "type": "Reihenfolge",
      //   "data": Reihenfolge
      // });
}
  }
  onLeave(client) {
    //    if (!client.sessionId) {
    if (!(this.player1 == null && this.player2 == null) && (!(client == undefined))) {
    console.log(!(this.player1 == null && this.player2 == null) && (!(client == undefined)));
    if (spielerOnline == 2 && client.sessionId === this.player1.id) console.log(`${client.sessionId + "(0)"} left.`);
    else console.log(`${client.sessionId + "(1)"} left.`);
    this.broadcast(`${client.sessionId} left`);
    if (spielerOnline == 4 && client.sessionId === this.player3.id) {
      this.player3 = this.player4;
      console.log("spieler3 weg - aufrücken (4 Spieler)");
      this.player4 = null;
    }
    if (spielerOnline == 4 && client.sessionId === this.player2.id) {
      console.log("spieler2 weg - aufrücken (4 Spieler)");
      this.player2 = this.player3;
      this.player3 = this.player4;
      this.player4 = null;
    }
    if (spielerOnline == 4 && client.sessionId === this.player1.id) {
      console.log("spieler1 weg - aufrücken (4 Spieler)");
      this.player1 = this.player2;
      this.player2 = this.player3;
      this.player4 = null;
    }
    if (spielerOnline == 3 && client.sessionId === this.player2.id) {
      console.log("spieler2 weg- aufrücken (3 Spieler)");
      this.player1 = this.player2;
      this.player2 = this.player3;
      this.player3 = null;
    }
    if (spielerOnline == 3 && client.sessionId === this.player1.id) {
      console.log("spieler1 weg - aufrücken (3 Spieler)");
      this.player1 = this.player2;
      this.player2 = this.player3;
      this.player3 = null;
    }
    if (spielerOnline == 4 && this.player4 == null == false && client.sessionId === this.player4.id) this.player4 = null;
    if (spielerOnline == 3 && this.player3 == null == false && client.sessionId === this.player3.id) this.player3 = null;
    if (spielerOnline == 2 && this.player2 == null == false && client.sessionId === this.player2.id) this.player2 = null;
    if (spielerOnline == 2 && this.player2 == null == false && client.sessionId === this.player1.id) {
      this.player1 = this.player2;
      this.player2 = null;
    }
    /*  if (client.sessionId === this.player1.id) this.player1 = null;
      else if (client.sessionId === this.player2.id) this.player2 = null;
      else if (client.sessionId === this.player3.id) this.player3 = null;
      else this.player4 = null; */
      if (!(client == undefined))  spielerOnline--;
    /*  if (!this.player2) {
        Reihenfolge = [];
        var j, x, i;
        //  return kartenZiehen;
        sender = 0;
        kartenSpieler = [];
        zählerListe = [];
        spielerOnline = 0;
      } */
    //  }
    console.log(spielerOnline + " - " + this.player1 + "/" + this.player2 + "/" + this.player3 + "/" + this.player4 + "/");
    if ((spielerOnline == NaN)) {
      this.send(this.player1.client, {
        "type": "reloadPage"
      });
    }
    console.log("spielerOnline: " + spielerOnline);
  }
  else {
    console.log("Spieler war inaktiev");
  }
  }
  onMessage(client, data) {
    this.broadcast(data.message);
  }
  onDispose() {
    console.log("Dispose BasicRoom");
  }

}
module.exports = uno;
