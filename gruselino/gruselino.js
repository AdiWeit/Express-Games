var AnzahlSpieler = 0;
var zählerListe = [];
class gruselino {
  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
  }

  onJoin(client) {
    AnzahlSpieler++;
    console.log(AnzahlSpieler);
    let newPlayer = {
      id: client.sessionId,
      client: client,
    };
    if ((this.player1 == null)) this.player1 = newPlayer;
  else if ((this.player2 == null)) this.player2 = newPlayer;
  else if ((this.player3 == null)) this.player3 = newPlayer;
  else if ((this.player4 == null)) this.player4 = newPlayer;
    console.log(" - " + this.player1 + " - " + this.player2 + " - " + this.player3 + " - " + this.player4 + " - ")
    if (AnzahlSpieler > 1) {
      console.log(this.player2.client + " - " + this.player2.id);
        this.send(this.player1.client, {type:"player", data:0});
        this.send(this.player2.client, {type:"player", data:1});
        if (AnzahlSpieler > 2 && !(this.player3 == null)) this.send(this.player3.client, {type:"player", data:2});
        if (AnzahlSpieler > 3 && !(this.player4 == null)) this.send(this.player4.client, {type:"player", data:3});
        this.broadcast({type: "AnzahlSpieler", data: AnzahlSpieler});
    }
}

  onLeave(client) {
    console.log(client);
    if (!(client == null || client == undefined)) {
    AnzahlSpieler--;
    console.log(client.sessionId + " - " + client);
    if (client.sessionId === this.player1.id) this.player1 = null
    else if (client.sessionId === this.player2.id) this.player2 = null
    else if (client.sessionId === this.player3.id) this.player3 = null
    else if (client.sessionId === this.player4.id) this.player4 = null
  }
    console.log("a Player left");
    console.log(AnzahlSpieler);
    console.log(this.player1  + " - " + this.player2  + " - " + this.player3  + " - " + this.player4)
  }

  onMessage(client, data) {
    console.log(data.message);
    this.broadcast(data.message);
  }

  onDispose() {
    console.log("Dispose BasicRoom");
  }

}
module.exports = gruselino;
