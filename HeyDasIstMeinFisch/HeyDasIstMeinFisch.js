var Reihenfolge = [];
var j, x, i;
var AblageListe = [];
var sender = 0;
var zählerListe = [];
//var spielerOnline = 0;


class HeyDasIstMeinFisch {

  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
  }

  // this.maxClients = 4;
  // this.player1 = null;
  // this.player2 = null;
  // this.player3 = null;
  // this.player4 = null;
  onJoin(client) {
//    console.log(`${client.sessionId} joined.`);
    let newPlayer = {
      id: client.sessionId,
      //client: client,
      client: client.sessionId
    };
    //let newPlayer = client;

    this.spielerOnlineGleich0++;
    console.log("spielerOnlineGleich0: " + this.spielerOnlineGleich0);
    if ([this.player1, this.player2, this.player3, this.player4].some(p => p && p.id && (p.id == client.sessionId))) {
      console.log(client + " - " + client.sessionId + " - " + this.player1.id + " - " + this.player2.id);
      if (client.sessionId == this.player1.id) {
      this.send(this.player1.client, {
        "type": "spielerDu",
        "data": this.player1.id
      });
    }
    if (client.sessionId == this.player2.id) {
      this.send(this.player2.client, {
        "type": "spielerDu",
        "data": this.player2.id
      });
    }
    if (this.player3 != null && client.sessionId == this.player3.id) {
      this.send(this.player3.client, {
        "type": "spielerDu",
        "data": this.player3.id
      });
    }
    if (this.player4 != null && client.sessionId == this.player4.id) {
      this.send(this.player4.client, {
        "type": "spielerDu",
        "data": this.player4.id
      });
    }
      // if (client.sessionId == this.player1.id) {
      //   this.send(this.player2.client, {
      //     "type": "sendDataToRejoinedPlayer"
      //   });
      // }
      // else {
      //   this.send(this.player1.client, {
      //     "type": "sendDataToRejoinedPlayer"
      //   });
      // }

      console.warn("Rejoin, skipping usual onJoin…");
      return;
    }

    console.log(!this.player1 + " - " + !this.player2 + " - " + !this.player3 + " - " + !this.player4 + " - ")
    if (!this.player1) {
      this.player1 = newPlayer;
      this.spielerOnline = 0;
      console.log("create spielerOnlineGleich0");
      this.spielerOnlineGleich0 = 1;
    } else if (!this.player2) {
      this.player2 = newPlayer;
    } else if (!this.player3) {
      this.player3 = newPlayer;
    } else if (!this.player4) {
      this.player4 = newPlayer;
    }
    this.spielerOnline++;
    console.log("spielerOnline: " + this.spielerOnline);
        console.log(!this.player1 + " - " + !this.player2 + " - " + !this.player3 + " - " + !this.player4 + " - ")
    if ((this.player1 != null || this.player1 != undefined) && (this.player2 != null || this.player2 != undefined)/* && this.spielerOnline > 1*/) {
      // für mehr als 2 Spieler:    setTimeout( () =>  { },1000);
      console.log("Mehr als 1 Spieler");
      this.broadcast({
        "type": "AnzahlSpieler",
        "data": this.spielerOnline
      });
      var Reihenfolge = [this.player1.id, this.player2.id];
      if (/*this.spielerOnline > 2*/ this.player3) {
        Reihenfolge.push(this.player3.id);
        this.send(this.player3.client, {
          "type": "spielerDu",
          "data": this.player3.id,
          newRound: true
        });
      }
      if (/*this.spielerOnline > 3*/ this.player4) {
        Reihenfolge.push(this.player4.id);
        this.send(this.player4.client, {
          "type": "spielerDu",
          "data": this.player4.id,
          newRound: true
        });
      }
      this.send(this.player1.client, {
        "type": "spielerDu",
        "data": this.player1.id,
        newRound: true
      });
      this.send(this.player2.client, {
        "type": "spielerDu",
        "data": this.player2.id,
        newRound: true
      });
      this.broadcast({
        "type": "Reihenfolge",
        "data": Reihenfolge,
        join: true
      });
    }

  }

  onLeave(client) {
    //    if (!client.sessionId) {
    // if (this.spielerOnline == 2 && client.sessionId === this.player1.id) console.log(`${client.sessionId + "(0)"} left.`);
    // else console.log(`${client.sessionId + "(1)"} left.`);
    // this.broadcast(`${client.sessionId} left`);
    // //if (this.player1 != undefined) console.log(client.sessionId + " - " + this.player1.id);
    // if (Reihenfolge.includes(client.sessionId)) console.log("nothingSpacial");
    // else {
    //   console.log("war inaktiev");
    //   this.spielerOnline++;
    //   if (this.player1 != null && client.sessionId == this.player1.id) this.player1 = null;
    //   if (this.player2 != null && client.sessionId == this.player2.id) this.player2 = null;
    //   if (this.player3 != null && client.sessionId == this.player3.id) this.player3 = null;
    //   if (this.player4 != null && client.sessionId == this.player4.id) this.player4 = null;
    // }
    // // if (this.player2 != undefined) console.log(this.player2);
    // // else {
    // //   console.log("nur 1 Spieler");
    // //   this.player1 = null;
    // //   this.spielerOnline = 1;
    // // }
    // if (this.player3 != undefined) console.log(this.player3.id);
    // if (this.player4 != undefined) console.log(this.player4.id);
    // if (this.spielerOnline == 4 && this.player3 != null && client.sessionId === this.player3.id) {
    //   this.player3 = this.player4;
    //   console.log("spieler3 weg - aufrücken (4 Spieler)");
    //   this.player4 = null;
    // }
    // if (this.spielerOnline == 4 && this.player2 != null && client.sessionId === this.player2.id) {
    //   console.log("spieler2 weg - aufrücken (4 Spieler)");
    //   this.player2 = this.player3;
    //   this.player3 = this.player4;
    //   this.player4 = null;
    // }
    // if (this.spielerOnline == 4 && this.player1 != null && client.sessionId === this.player1.id) {
    //   console.log("spieler1 weg - aufrücken (4 Spieler)");
    //   this.player1 = this.player2;
    //   this.player2 = this.player3;
    //   this.player4 = null;
    // }
    // if (this.spielerOnline == 3 && this.player2 != null && client.sessionId === this.player2.id) {
    //   console.log("spieler2 weg- aufrücken (3 Spieler)");
    //   this.player1 = this.player2;
    //   this.player2 = this.player3;
    //   //  this.player3 = null;
    // }
    // if (this.spielerOnline == 3 && this.player1 != null && client.sessionId === this.player1.id) {
    //   console.log("spieler1 weg - aufrücken (3 Spieler)");
    //   this.player1 = this.player2;
    //   this.player2 = this.player3;
    //   this.player3 = null;
    // }
    // if (this.spielerOnline == 4 && this.player4 != null && client.sessionId === this.player4.id) this.player4 = null;
    // if (this.spielerOnline == 3 && this.player3 != null && client.sessionId === this.player3.id) this.player3 = null;
    // if (this.spielerOnline == 2 && this.player2 != null && client.sessionId === this.player2.id) this.player2 = null;
    // if (this.spielerOnline == 2 && this.player2 != null && client.sessionId === this.player1.id) {
    //   this.player1 = this.player2;
    //   this.player2 = null;
    // }
    // /*  if (client.sessionId === this.player1.id) this.player1 = null;
    //   else if (client.sessionId === this.player2.id) this.player2 = null;
    //   else if (client.sessionId === this.player3.id) this.player3 = null;
    //   else this.player4 = null; */
    // this.spielerOnline--;
    if (this.player2 != undefined) this.spielerOnlineGleich0--;
    //  if (this.spielerOnlineGleich0 != undefined && this.spielerOnlineGleich0 == 0) {this.player1 = null; this.player2 = null; this.player3 = null; this.player4 = null; this.spielerOnline = 0; console.log("remove room");}
    // /*  if (!this.player2) {
    //     Reihenfolge = [];
    //     var j, x, i;
    //     //  return kartenZiehen;
    //     sender = 0;
    //     kartenSpieler = [];
    //     zählerListe = [];
    //     this.spielerOnline = 0;
    //   } */
    // //  }
    // console.log(this.spielerOnline + " - " + this.player1 + "/" + this.player2 + "/" + this.player3 + "/" + this.player4 + "/");
    // if ((this.spielerOnline == NaN)) {
    //   this.send(this.player1.client, {
    //     "type": "reloadPage"
    //   });
    // }
    // console.log("spielerOnline: " + this.spielerOnline);
  }

  onMessage(client, data) {
    if (data.message.type == "Spielerwechsel") {
      var ablage = data.message.data[data.message.data.length - 1];
      if (data.message.data[3] != undefined) Reihenfolge[3] = data.message.data[2];
      if (data.message.data[2] != undefined) Reihenfolge[2] = data.message.data[1];
      Reihenfolge[1] = data.message.data[0];
      Reihenfolge[0] = ablage;
      this.broadcast({
        "type": "Reihenfolge",
        data: Reihenfolge,
        join: false
      });
    } else {
      this.broadcast(data.message);
    }
    if (data.message.type == "endGame"/* || data.message.type == "gewonnen"*/) {this.player1 = null; this.player2 = null; this.player3 = null; this.player4 = null; this.spielerOnline = 0; console.log("remove room");}
    if (data.message.type == "gewonnen") {
      this.broadcast({
        "type": "endGame",
        alert: false
      });
    }
  }



}

module.exports = HeyDasIstMeinFisch;
