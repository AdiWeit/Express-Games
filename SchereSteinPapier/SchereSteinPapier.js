const rules = {
  "Schere": {
    "Schere": null,
    "Stein": false,
    "Papier": true
  },
  "Stein": {
    "Schere": true,
    "Stein": null,
    "Papier": false
  },
  "Papier": {
    "Schere": false,
    "Stein": true,
    "Papier": null
  }
};

class SchereSteinPapier {
  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
  }

  onJoin(client) {
    this.broadcast(`${client.sessionId} joined.`);
    let newPlayer = {
      id: client.sessionId,
      client: client,
    };
    if (!this.player1) this.player1 = newPlayer;
    else this.player2 = newPlayer;
  }

  onLeave(client) {
    this.broadcast(`${client.sessionId} left.`);
    if (client.sessionId === player1.id) this.player1 = null;
    else this.player2 = null;
  }

  onMessage(client, data) {

//    console.log("client: " + client + " player1Id: " + this.player1.id + " player2Id " + this.player2.id);

    if (!(this.player1 && this.player2)) return this.broadcast("Es fehlt noch ein Spieler!");

    if (client === this.player1.id) {
      console.log(data.message);
      if (!rules[data.message]) {
        return this.broadcast(`${client} sagt: ${data.message}`);
      }
      else {
        this.player1.wahl = data.message;
        this.send(client, "Du hast " + data.message + " gewählt!");
      }
    }
    if (client === this.player2.id) {
      if (!rules[data.message]) {
        return this.broadcast(`${client} sagt: ${data.message}`);
      }
      else {
        this.player2.wahl = data.message;
        this.send(client, "Du hast " + data.message + " gewählt!");
      }
    }

    if (this.player1.wahl && this.player2.wahl) {
      //es kommt zum Match :P

      //für player1:
      let result = rules[this.player1.wahl][this.player2.wahl];
      this.send(this.player1.client, this.resultString(result) + " für dich!");

      //für this.player2:
      result = rules[this.player2.wahl][this.player1.wahl];
      this.send(this.player2.client, this.resultString(result) + " für dich!");

      this.player1.wahl = false;
      this.player2.wahl = false;

    }
    else {
      this.send(client, "Gegner muss noch wählen");
    }


    // if (client) { //TODO istDran
    //   if (!rules[data.message]) {
    //     this.broadcast("Ignoriere...");
    //   }
    //   else {
    //
    //     this.broadcast(this.resultString(result));
    //   }
    // }
  }

  onDispose() {
    console.log("Dispose BasicRoom");
  }

  resultString(result) {
    if (result === null) return "Unentschieden";
    if (result === true) return "Gewonnen";
    if (result === false) return "Verloren";
    return "Fehler!";
  }
}
module.exports = SchereSteinPapier;
