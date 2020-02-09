  var AnzahlSpieler = 0;
class snakeGame  {
  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
  }
  onJoin(client) {
    console.log(`${client.sessionId} joined.`);
    AnzahlSpieler++;
    let newPlayer = {
      id: client.sessionId,
      client: client,
    };
    console.log(AnzahlSpieler);
    if (AnzahlSpieler < 2) {this.player1 = newPlayer;console.log("1. Spieler joined")}
    else if (AnzahlSpieler < 3) {this.player2 = newPlayer;console.log("2. Spieler joined")}
    else if (AnzahlSpieler < 4) {this.player3 = newPlayer;console.log("3. Spieler joined")}
    if (AnzahlSpieler > 1) {
      console.log(this.player1.client + " " + this.player2.client)
  /*    this.send(this.player1.client, { "type": "spielerDu", "data": 0 });
      this.send(this.player2.client, { "type": "spielerDu", "data": 1 });
      if (AnzahlSpieler > 2) {
        this.send(this.player3.client, { "type": "spielerDu", "data": 2 });
      } */
      this.broadcast({ "type": "2playersGetReady"});
      this.broadcast({ "type": "AnzahlSpieler", data: AnzahlSpieler});
    }
  }
  onMessage(client, data) {
    // if (data.message.type == "s"/* || data.message.type == "namenSpieler"*/) {
    //   console.log("Empfänger" + data.message.Empfänger)
    //   if (data.message.Empfänger == 0) this.send(this.player1.client, data.message);
    //   if (data.message.Empfänger == 1) this.send(this.player2.client, data.message);
    //   if (data.message.Empfänger == 2 /*&& this.player3.client == undefined == false*/) this.send(this.player3.client, data.message);
    //   if (data.message.Empfänger == 3/* && this.player4.client == undefined == false*/) this.send(this.player4.client, data.message);
    // }
    // else {
      this.broadcast(data.message);
  // }
  }
  onLeave(client) {
    console.log("A player left!" + " ( es sind " + AnzahlSpieler + " Spieler übrig!")
    this.broadcast({"type": 'a player left!'});
  /*  if (AnzahlSpieler == 4 && this.player4 == null == false && client.sessionId === this.player4.id) {this.player4 = null;console.log("4. Spieler")}
    else if (AnzahlSpieler == 3 && this.player3 == null == false && client.sessionId === this.player3.id) {this.player3 = null;console.log("3. Spieler")}
    else if (AnzahlSpieler == 2 && this.player2 == null == false && client.sessionId === this.player2.id) {this.player2 = null;console.log("2. Spieler")}
    else if (this.player1 == null == false && client.sessionId === this.player1.id) {this.player1 = null;console.log("1. Spieler")} */
    AnzahlSpieler--;
  }
}
module.exports = snakeGame;
