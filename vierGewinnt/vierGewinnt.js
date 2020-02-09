var Reihenfolge = [];

class vierGewinnt  {
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
    if (this.player1 && this.player2)  {
      this.send(this.player1.client, "player1" + this.player1.id);
      this.send(this.player2.client, "player2" + this.player2.id);
      var spielmodi = ["runterrutschen", "Plätchen"];
      this.broadcast(`Spielmodus:` + spielmodi[Math.floor(Math.random() * 2)]);
      this.broadcast(`player` + this.player1.id + "player" + this.player2.id);
      this.send(client, `player` + this.player1.id + "player" + this.player2.id);
      Reihenfolge = ["player1", "player2"]
    }
  }

  onLeave(client) {
    this.broadcast(`${client.sessionId} left.`);
    if (client.sessionId === this.player1.id) this.player1 = null;
    else this.player2 = null;
  }

  onMessage(client, data) {

    if (!(this.player1 && this.player2)) return this.broadcast("Es fehlt noch ein Spieler!");
/*    if (client === this.player1.id) {
      if (!rules[data.message]) {
        return this.broadcast(`${client} sagt: ${data.message}`);
      }
      else {
        this.player1.wahl = data.message;
        this.broadcast(Du hast " + data.message + " gewählt!");
      this.send(this.player2.client, data.message);
    }
    }
    if (client === this.player2.id3) {
      if (!rules[data.message]) {
        return this.broadcast(`${client} sagt: ${data.message}`);
      }
       else {
      //  this.player2.wahl = data.message;
      //  this.send(client, "Du hast " + data.message + " gewählt!");
      this.send(this.player1.client, data.message);
    }
  } */

    /* if (this.player1.wahl && this.player2.wahl) {
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
    } */


    // if (client) { //TODO istDran
    //   if (!rules[data.message]) {
    //     this.broadcast("Ignoriere...");
    //   }
    //   else {
    //
    //     this.broadcast(this.resultString(result));
    //   }
    // }
    if (data.message == "Spielerwechsel") {
    console.log(data.message);
    console.log(Reihenfolge[0] == "player1");
      if (Reihenfolge[0] == "player1"){
       this.broadcast(`player` + this.player2.id + "player" + this.player1.id);
       console.log("player" + this.player2.id + "player" + this.player1.id)
        Reihenfolge = ["player2", "player1"];
  }
  else {
    this.broadcast(`player` + this.player1.id + "player" + this.player2.id);
    console.log("player " + this.player1.id + " player " + this.player2.id)
      Reihenfolge = ["player1", "player2"];
  }
  }
  else if (data.message == this.player1.id + "hat gewonnen") {

    this.send(this.player2.client, this.player1.id + "hat gewonnen");
  }
  else if (data.message == this.player2.id + "hat gewonnen") {

    this.send(this.player1.client, this.player2.id + "hat gewonnen");
  }
  else if (data.message.length == 3 && data.message.includes("-")) {  //?
    console.log(client);
    console.log(client + "legt" + data.message);
    if (client == this.player1.id) this.send(this.player2.client, "koord: " + data.message);
    else  this.send(this.player1.client, "koord: " + data.message);
  //  this.send(client, "koord: " + data.message);
  }
  else if (data.message == this.player1.id + " hat gewonnen!") {
    this.send(this.player2.client, this.player1.id + " hat gewonnen!");
  }
  else if (data.message == this.player2.id + " hat gewonnen!")  this.send(this.player1.client, this.player1.id + " hat gewonnen!");
  else if (data.message.includes("Markierungen: ")) {
    this.broadcast(data.message);
  }
  else {
    this.broadcast(data.message)
  }
}
  onDispose() {
    console.log("Dispose BasicRoom");
  }

  /* resultString(result) {
    if (result === null) return "Unentschieden";
    if (result === true) return "Gewonnen";
    if (result === false) return "Verloren";
    return "Fehler!";
  } */
}
module.exports = vierGewinnt;
