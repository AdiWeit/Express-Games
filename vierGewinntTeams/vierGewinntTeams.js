var Reihenfolge = [];

class vierGewinntTeams  {
  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
    this.player = [];
  }

  onJoin(client) {
    this.broadcast(`${client.sessionId} joined.`);
    let newPlayer = {
      id: client.sessionId,
      client: client,
    };
    this.player.push(newPlayer);
    if (this.player.length > 1)  {
      Reihenfolge = [];
      console.log("Spieler online: " + this.player.length);
      for (var pPlayer of this.player) {
        this.send(pPlayer.client, {type: "yourID", id: pPlayer.id});
        Reihenfolge.push(pPlayer.id);
      }
      if (this.player.length == 3) {
        this.send(this.player[0].client, {type: "setPlayerPosition", teamNumber: 0, z: [[1, 0]]});
        this.send(this.player[1].client, {type: "setPlayerPosition", teamNumber: 0, z: [[3, 2]]});
        this.send(this.player[2].client, {type: "setPlayerPosition", teamNumber: 1, z: [[3, 2], [0, 1]]});
        Reihenfolge.push(this.player[2].id);
      }
      if (this.player.length == 4) {
        this.send(this.player[0].client, {type: "setPlayerPosition", teamNumber: 0, z: [[1, 0]]});
        this.send(this.player[1].client, {type: "setPlayerPosition", teamNumber: 1, z: [[1, 0]]});
        this.send(this.player[2].client, {type: "setPlayerPosition", teamNumber: 1, z: [[3, 2]]});
        this.send(this.player[3].client, {type: "setPlayerPosition", teamNumber: 0, z: [[3, 2]]});
      }
      if (this.player.length == 5) {
        this.send(this.player[0].client, {type: "setPlayerPosition", teamNumber: 0, z: [[0]]});
        this.send(this.player[1].client, {type: "setPlayerPosition", teamNumber: 1, z: [[3, 2], [0]]});
        this.send(this.player[2].client, {type: "setPlayerPosition", teamNumber: 0, z: [[1]]});
        this.send(this.player[3].client, {type: "setPlayerPosition", teamNumber: 0, z: [[1]]});
        this.send(this.player[4].client, {type: "setPlayerPosition", teamNumber: 1, z: [[3, 2]]});
        Reihenfolge.push(this.player[1].id);
      }
      if (this.player.length == 6) {
        this.send(this.player[0].client, {type: "setPlayerPosition", teamNumber: 0, z: [[0]]});
        this.send(this.player[1].client, {type: "setPlayerPosition", teamNumber: 1, z: [[0]]});
        this.send(this.player[2].client, {type: "setPlayerPosition", teamNumber: 1, z: [[1]]});
        this.send(this.player[3].client, {type: "setPlayerPosition", teamNumber: 0, z: [[1]]});
        this.send(this.player[4].client, {type: "setPlayerPosition", teamNumber: 0, z: [[3, 2]]});
        this.send(this.player[5].client, {type: "setPlayerPosition", teamNumber: 1, z: [[3, 2]]});
      }
      if (this.player.length == 7) {
        this.send(this.player[0].client, {type: "setPlayerPosition", teamNumber: 0, z: [[0]]});
        this.send(this.player[1].client, {type: "setPlayerPosition", teamNumber: 0, z: [[0]]});
        this.send(this.player[2].client, {type: "setPlayerPosition", teamNumber: 1, z: [[3], [1]]});
        this.send(this.player[3].client, {type: "setPlayerPosition", teamNumber: 1, z: [[1]]});
        this.send(this.player[4].client, {type: "setPlayerPosition", teamNumber: 0, z: [[2]]});
        this.send(this.player[5].client, {type: "setPlayerPosition", teamNumber: 0, z: [[2]]});
        this.send(this.player[6].client, {type: "setPlayerPosition", teamNumber: 1, z: [[3]]});
        Reihenfolge.push(this.player[2].id);
      }
      if (this.player.length == 8) {
        this.send(this.player[0].client, {type: "setPlayerPosition", teamNumber: 0, z: [[0]]});
        this.send(this.player[1].client, {type: "setPlayerPosition", teamNumber: 1, z: [[0]]});
        this.send(this.player[2].client, {type: "setPlayerPosition", teamNumber: 1, z: [[1]]});
        this.send(this.player[3].client, {type: "setPlayerPosition", teamNumber: 0, z: [[1]]});
        this.send(this.player[4].client, {type: "setPlayerPosition", teamNumber: 0, z: [[2]]});
        this.send(this.player[5].client, {type: "setPlayerPosition", teamNumber: 1, z: [[2]]});
        this.send(this.player[6].client, {type: "setPlayerPosition", teamNumber: 1, z: [[3]]});
        this.send(this.player[7].client, {type: "setPlayerPosition", teamNumber: 0, z: [[3]]});
      }
      if (pPlayer) this.broadcast({type: `setPlayer`, ids: Reihenfolge});
      // var spielmodi = ["runterrutschen", "Plätchen"];
      // this.broadcast(`Spielmodus:` + spielmodi[Math.floor(Math.random() * 2)]);
      // this.send(client, `player` + this.player[1].id + "player" + this.player[2].id);
    }
  }

  onLeave(client) {
    this.broadcast(`${client.sessionId} left.`);
    console.log(this.player);
    this.player.forEach((pPlayer, i) => {
      if (client.sessionId == pPlayer.id) this.players.splice(i, 1);
    });

    console.log(this.player);
  }

  onMessage(client, data) {

    // if (!(this.player[1] && this.player[2])) return this.broadcast("Es fehlt noch ein Spieler!");
/*    if (client === this.player[1].id) {
      if (!rules[data.message]) {
        return this.broadcast(`${client} sagt: ${data.message}`);
      }
      else {
        this.player[1].wahl = data.message;
        this.broadcast(Du hast " + data.message + " gewählt!");
      this.send(this.player[2].client, data.message);
    }
    }
    if (client === this.player[2].id3) {
      if (!rules[data.message]) {
        return this.broadcast(`${client} sagt: ${data.message}`);
      }
       else {
      //  this.player[2].wahl = data.message;
      //  this.send(client, "Du hast " + data.message + " gewählt!");
      this.send(this.player[1].client, data.message);
    }
  } */

    /* if (this.player[1].wahl && this.player[2].wahl) {
      //es kommt zum Match :P

      //für player1:
      let result = rules[this.player[1].wahl][this.player[2].wahl];
      this.send(this.player[1].client, this.resultString(result) + " für dich!");

      //für this.player[2]:
      result = rules[this.player[2].wahl][this.player[1].wahl];
      this.send(this.player[2].client, this.resultString(result) + " für dich!");

      this.player[1].wahl = false;
      this.player[2].wahl = false;

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
    console.log(data.type);
    if (data.type == "mode" && [3, 5, 7].includes(this.player.length)) {
      Reihenfolge.pop();
      this.broadcast({type: `setPlayer`, ids: Reihenfolge});
    }
    if (data.type == "3DsetStone") this.broadcast(data)
    if (data.message == "Spielerwechsel") {
    console.log(data.message);
    Reihenfolge.push(Reihenfolge[0]);
    Reihenfolge.shift();
  this.broadcast({type: `setPlayer`, ids: Reihenfolge});
  }
  else if (data.message == this.player[1].id + "hat gewonnen") {

    this.send(this.player[2].client, this.player[1].id + "hat gewonnen");
  }
  else if (data.message == this.player[2].id + "hat gewonnen") {

    this.send(this.player[1].client, this.player[2].id + "hat gewonnen");
  }
  else if (data.message.length == 3 && data.message.includes("-")) {  //?
    console.log(client);
    console.log(client + "legt" + data.message);
    if (client == this.player[1].id) this.send(this.player[2].client, "koord: " + data.message);
    else  this.send(this.player[1].client, "koord: " + data.message);
  //  this.send(client, "koord: " + data.message);
  }
  else if (data.message == this.player[1].id + " hat gewonnen!") {
    this.send(this.player[2].client, this.player[1].id + " hat gewonnen!");
  }
  else if (data.message == this.player[2].id + " hat gewonnen!")  this.send(this.player[1].client, this.player[1].id + " hat gewonnen!");
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
module.exports = vierGewinntTeams;
