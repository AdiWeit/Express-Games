var Reihenfolge;
var j, x, i;
var AblageListe = [];
var sender = 0;
var kartenSpieler = [];
var zählerListe = [];
var votes;
let mode;
var field = [];
var player = {0: {}, 1: {}, 2: {}, 3:{}};
var beutel = [];
var steine = {
  easy: [
    {name: "rectangle"},
    {name: "circle"},
    // {name: "triangle", points: [{x: 0, y: 0}, {x: 30/2, y: 30}, {x: -30/2, y:30}]},
    {name: "triangle", points: [{x: 20, y: 10}, {x: 10, y: 30}, {x: 30, y:30}]},
    // {name: "star", points: [{x: 20, y: 20}, {x: 30, y: 20}, {x: 20, y: 25}, {x: 30, y: 30}, {x: 20, y: 35}, {x: 30, y: 30}, {x: 20, y: 40}, {x: 30, y: 40}]},
    {name: "spikes", points: [{x: 10, y: 30}, {x: 15, y: 10}, {x: 20, y: 30}, {x: 25, y: 10}, {x: 30, y: 30}]},
    {name: "butterfly", points: [{x: 10, y: 10}, {x: 10, y: 30}, {x: 20, y: 20}, {x: 30, y: 10}, {x: 30, y: 30}]},
    {name: "ring"},
  ]
}
var colours = ["red", "green", "blue", "yellow", "orange", "purple"];
var spielerOnline = 0;


class Qwirkle {

  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
    this.voteFunc = (data) => {
      votes[data.easyMode]++;
      var voteConverter = {0: false, 1: true};
      if (votes.true + votes.false >= spielerOnline) {
        if (votes.true > votes.false) mode = "easy";
        else if (votes.true < votes.false) mode = "normal";
        if (mode) {
          console.log(mode + " wins vote!");
          this.broadcast({
            type: "selectedMode",
            data: mode
          });
          this.setup();
        }
        else {
          console.log("voting draw!");
          this.voteFunc({easyMode: voteConverter[Math.round(Math.random()*1)]});
        }
      }
    }
    this.setup = () => {
      beutel = [];
      for (var i = 0; i < 106/steine[mode].length/6; i++) {
        for (var stein of steine[mode]) {
          colours = ["red", "green", "blue", "yellow", "orange", "purple"];
          for (var i2 = 0; i2 < 6; i2++) {
            var index = Math.round(Math.random() * (colours.length - 1));
            stein.colour = colours[index];
            colours.splice(index, 1);
            beutel.push(JSON.parse(JSON.stringify(stein)));
          }
        }
      }
      for (i = beutel.length - 1; i > 0; i--) {
        j = Math.round(Math.random() * (i + 1));
        x = beutel[i];
        beutel[i] = beutel[j];
        beutel[j] = x;
      }
      // for (var i = 0; i < 6; i++) {
      //   for (var i1 = 0; i1 < spielerOnline; i1++) {
      //     if (!player[i1].steine) player[i1].steine = [];
      //     player[i1].steine.push(beutel[0]);
      //     beutel.shift();
      //   }
      // }
      // for (var i = 0; i < spielerOnline; i++) {
      //   this.broadcast({
      //   "type": "steinePlayer",
      //   "player": i,
      //   data: player[i].steine
      //   });
      // }
      for (var i = 0; i < spielerOnline; i++) {
        player[i].steine = [];
        for (var i1=0; i1 < 6; i1++) {
          player[i].steine.push(beutel[0]);
          beutel.shift();
        }
        this.broadcast({
        "type": "steinePlayer",
        "player": i,
        data: player[i].steine
        });
      }
    }
    this.canPlace = (coord, stein, player) => {
      var snake = {shapes: [], colours: []};
      if (!field[coord.x]) field[coord.x] = [];
      for (var i = coord.x + 1; field[i] && field[i][coord.y] && field[i][coord.y].stein; i++) {
        if (!snake.shapes.includes(field[i][coord.y].stein.name)) snake.shapes.push(field[i][coord.y].stein.name);
        if (!snake.colours.includes(field[i][coord.y].stein.colour)) snake.colours.push(field[i][coord.y].stein.colour);
      }
      for (var i = coord.x + -1; field[i] && field[i][coord.y] && field[i][coord.y].stein; i--) {
        if (!snake.shapes.includes(field[i][coord.y].stein.name)) snake.shapes.push(field[i][coord.y].stein.name);
        if (!snake.colours.includes(field[i][coord.y].stein.colour)) snake.colours.push(field[i][coord.y].stein.colour);
      }
      for (var i = coord.y + -1; field[coord.x][i] && field[coord.x][i].stein; i--) {
        if (!snake.shapes.includes(field[coord.x][i].stein.name)) snake.shapes.push(field[coord.x][i].stein.name);
        if (!snake.colours.includes(field[coord.x][i].stein.colour)) snake.colours.push(field[coord.x][i].stein.colour);
      }
      for (var i = coord.y + 1; field[coord.x][i] && field[coord.x][i].stein; i++) {
        if (!snake.shapes.includes(field[coord.x][i].stein.name)) snake.shapes.push(field[coord.x][i].stein.name);
        if (!snake.colours.includes(field[coord.x][i].stein.colour)) snake.colours.push(field[coord.x][i].stein.colour);
      }
      var rules = {
        sameColour: ((!snake.shapes.length || !snake.shapes.includes(stein.name)) && (!snake.colours.length || snake.colours.includes(stein.colour))),
        sameShape: ((snake.shapes.length < 2 && (!snake.shapes.length || stein.name == snake.shapes[0])) && (!snake.colours.length || !snake.colours.includes(stein.colour)))
      };
      console.log(snake);
      console.log(rules);
      return player == Reihenfolge && (!field[coord.x][coord.y] || !field[coord.x][coord.y].stein) && (rules.sameColour || rules.sameShape)
    }
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
    console.log("this.spielerOnlineGleich0: " + this.spielerOnlineGleich0);
    if ([this.player1, this.player2, this.player3, this.player4].some(p => p && p.id && (p.id == client.sessionId))) {
      console.log(client + " - " + client.sessionId + " - " + this.player1.id + " - " + this.player2.id);
      if (client.sessionId == this.player1.id) {
      this.send(this.player1.client, {
        "type": "spielerDu",
        "data": 0
      });
    }
    if (client.sessionId == this.player2.id) {
      this.send(this.player2.client, {
        "type": "spielerDu",
        "data": 1
      });
    }
    if (this.player3 != null && client.sessionId == this.player3.id) {
      this.send(this.player3.client, {
        "type": "spielerDu",
        "data": 2
      });
    }
    if (this.player4 != null && client.sessionId == this.player4.id) {
      this.send(this.player4.client, {
        "type": "spielerDu",
        "data": 3
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
      this.broadcast({
        "type": "setAblageListe[4]AfterRejoin"
      });

      console.warn("Rejoin, skipping usual onJoin…");
      return;
    }

    console.log(!this.player1 + " - " + !this.player2 + " - " + !this.player3 + " - " + !this.player4 + " - ")
    if (!this.player1) {
      this.player1 = newPlayer;
      spielerOnline = 0;
      console.log("create this.spielerOnlineGleich0");
      this.spielerOnlineGleich0 = 1;
    } else if (!this.player2) {
      this.player2 = newPlayer;
    } else if (!this.player3) {
      this.player3 = newPlayer;
    } else if (!this.player4) {
      this.player4 = newPlayer;
    }
    spielerOnline++;
    console.log("spielerOnline: " + spielerOnline);
        console.log(!this.player1 + " - " + !this.player2 + " - " + !this.player3 + " - " + !this.player4 + " - ")
    if ((this.player1 != null || this.player1 != undefined) && (this.player2 != null || this.player2 != undefined)/* && spielerOnline > 1*/) {
      // für mehr als 2 Spieler:    setTimeout( () =>  { },1000);
      console.log("Mehr als 1 Spieler");
      votes = {true:0, false:0};
      this.broadcast({
        "type": "AnzahlSpieler",
        "data": spielerOnline
      });
      // Straßen: Typ, Wert(Geld wenn als Geld benutzt) ,Mieten,StraßenName, StraßenFarbe
      // Event Karten: Typ, Stichwort(z.B. "Los"), ausgeschriebeneFähigkeit, Wert(Geld wenn als Geld benutzt)
      //  T Miete: Typ, Farben, Wert(Geld wenn als Geld benutzt)

      if (spielerOnline > 2) {
        this.send(this.player3.client, {
          "type": "spielerDu",
          "data": 2,
          newRound: true
        });
      }
      if (spielerOnline > 3) {
        this.send(this.player4.client, {
          "type": "spielerDu",
          "data": 3,
          newRound: true
        });
      }
      this.send(this.player1.client, {
        type: "spielerDu",
        data: 0,
        newRound: true
      });
      this.send(this.player2.client, {
        type: "spielerDu",
        data: 1,
        newRound: true
      });
      Reihenfolge = Math.floor(Math.random() * spielerOnline);
      this.broadcast({
        "type": "Reihenfolge",
        "data": Reihenfolge
      });
      /*      while (kartenSpieler[1].length < 5) {
              kartenSpieler[1][kartenSpieler[1].length] = beutel[0];
              beutel.shift();
            } */
    }

  }

  onLeave(client) {
    //    if (!client.sessionId) {
    // if (spielerOnline == 2 && client.sessionId === this.player1.id) console.log(`${client.sessionId + "(0)"} left.`);
    // else console.log(`${client.sessionId + "(1)"} left.`);
    // this.broadcast(`${client.sessionId} left`);
    // //if (this.player1 != undefined) console.log(client.sessionId + " - " + this.player1.id);
    // if (Reihenfolge.includes(client.sessionId)) console.log("nothingSpacial");
    // else {
    //   console.log("war inaktiev");
    //   spielerOnline++;
    //   if (this.player1 != null && client.sessionId == this.player1.id) this.player1 = null;
    //   if (this.player2 != null && client.sessionId == this.player2.id) this.player2 = null;
    //   if (this.player3 != null && client.sessionId == this.player3.id) this.player3 = null;
    //   if (this.player4 != null && client.sessionId == this.player4.id) this.player4 = null;
    // }
    // // if (this.player2 != undefined) console.log(this.player2);
    // // else {
    // //   console.log("nur 1 Spieler");
    // //   this.player1 = null;
    // //   spielerOnline = 1;
    // // }
    // if (this.player3 != undefined) console.log(this.player3.id);
    // if (this.player4 != undefined) console.log(this.player4.id);
    // if (spielerOnline == 4 && this.player3 != null && client.sessionId === this.player3.id) {
    //   this.player3 = this.player4;
    //   console.log("spieler3 weg - aufrücken (4 Spieler)");
    //   this.player4 = null;
    // }
    // if (spielerOnline == 4 && this.player2 != null && client.sessionId === this.player2.id) {
    //   console.log("spieler2 weg - aufrücken (4 Spieler)");
    //   this.player2 = this.player3;
    //   this.player3 = this.player4;
    //   this.player4 = null;
    // }
    // if (spielerOnline == 4 && this.player1 != null && client.sessionId === this.player1.id) {
    //   console.log("spieler1 weg - aufrücken (4 Spieler)");
    //   this.player1 = this.player2;
    //   this.player2 = this.player3;
    //   this.player4 = null;
    // }
    // if (spielerOnline == 3 && this.player2 != null && client.sessionId === this.player2.id) {
    //   console.log("spieler2 weg- aufrücken (3 Spieler)");
    //   this.player1 = this.player2;
    //   this.player2 = this.player3;
    //   //  this.player3 = null;
    // }
    // if (spielerOnline == 3 && this.player1 != null && client.sessionId === this.player1.id) {
    //   console.log("spieler1 weg - aufrücken (3 Spieler)");
    //   this.player1 = this.player2;
    //   this.player2 = this.player3;
    //   this.player3 = null;
    // }
    // if (spielerOnline == 4 && this.player4 != null && client.sessionId === this.player4.id) this.player4 = null;
    // if (spielerOnline == 3 && this.player3 != null && client.sessionId === this.player3.id) this.player3 = null;
    // if (spielerOnline == 2 && this.player2 != null && client.sessionId === this.player2.id) this.player2 = null;
    // if (spielerOnline == 2 && this.player2 != null && client.sessionId === this.player1.id) {
    //   this.player1 = this.player2;
    //   this.player2 = null;
    // }
    // /*  if (client.sessionId === this.player1.id) this.player1 = null;
    //   else if (client.sessionId === this.player2.id) this.player2 = null;
    //   else if (client.sessionId === this.player3.id) this.player3 = null;
    //   else this.player4 = null; */
    // spielerOnline--;
    if (this.player2 != undefined) this.spielerOnlineGleich0--;
    //  if (this.spielerOnlineGleich0 != undefined && this.spielerOnlineGleich0 == 0) {this.player1 = null; this.player2 = null; this.player3 = null; this.player4 = null; spielerOnline = 0; console.log("remove room");}
    // /*  if (!this.player2) {
    //     Reihenfolge = [];
    //     var j, x, i;
    //     //  return beutel;
    //     sender = 0;
    //     kartenSpieler = [];
    //     zählerListe = [];
    //     spielerOnline = 0;
    //   } */
    // //  }
    // console.log(spielerOnline + " - " + this.player1 + "/" + this.player2 + "/" + this.player3 + "/" + this.player4 + "/");
    // if ((spielerOnline == NaN)) {
    //   this.send(this.player1.client, {
    //     "type": "reloadPage"
    //   });
    // }
    // console.log("spielerOnline: " + spielerOnline);
  }

  onMessage(client, data) {
    /*  if (data.message.type == "zahl") {
//      console.log("Adressant: " + data.message.adressant)
  //    this.broadcast({"type": "zahl", "data": data.message.data + 1})
      if (data.message.adressant == 0) {
        this.send(this.player1.client, {"type": "zahl", "data": data.message.data + 1});
      }
    else if (data.message.adressant == 1) {
        this.send(this.player2.client, {"type": "zahl", "data": data.message.data + 1});
      }

    else if (data.message.adressant == 2) {
        this.send(this.player3.client, {"type": "zahl", "data": data.message.data + 1});
      }
      else {
        this.send(this.player4.client, {"type": "zahl", "data": data.message.data + 1});
      }
    }*/

    if (!(this.player1 && this.player2)) return this.broadcast("Es fehlt noch ein Spieler!");
    /*  if (data.message.type == "stayActive") {
        AblageListe[1] = "stayActive";
        setTimeout(function () {
          AblageListe[1] = "abgebrochen";
        }, 500);
      } */
      if (data.message.type == "vote") {
        this.voteFunc(data.message);
     }
     else if (data.message.type == "placeStein") {
       if (this.canPlace(data.message.coord, player[data.message.player].steine[data.message.steinI], data.message.player)/* && JSON.stringify(player[data.message.player].steine).includes(JSON.stringify(data.message.card) && !(field[data.message.i][data.message.i1]))*/) {
       this.broadcast({
         "type": "placeStein",
         "coord": data.message.coord,
         stein: player[data.message.player].steine[data.message.steinI],
         steinI: data.message.steinI,
         player: data.message.player
       });
       if (!field[data.message.coord.x][data.message.coord.y]) field[data.message.coord.x][data.message.coord.y] = {};
       field[data.message.coord.x][data.message.coord.y].stein = player[data.message.player].steine[data.message.steinI];
       player[data.message.player].steine.splice(data.message.steinI, 1);
     }
     }
    else if (/*data.message.type == "Gebot" || */data.message.type == "namenSpieler") {
    //  console.log("Empfänger" + data.message.Empfänger)
      if (data.message.Empfänger == 0) this.send(this.player1.client, data.message);
      if (data.message.Empfänger == 1) this.send(this.player2.client, data.message);
      if (data.message.Empfänger == 2 /*&& this.player3.client == undefined == false*/ ) this.send(this.player3.client, data.message);
      if (data.message.Empfänger == 3 /* && this.player4.client == undefined == false*/ ) this.send(this.player4.client, data.message);
    } else {
      this.broadcast(data.message);
    }
    if (data.message.type == "endGame" || data.message.type == "countingPoints" || (data.message == "" && data.message.includes("gewonnen"))) {this.player1 = null; this.player2 = null; this.player3 = null; this.player4 = null; spielerOnline = 0; console.log("remove room");}
  }
  onDispose() {
    console.log("Dispose BasicRoom");
  }
}

module.exports = Qwirkle;
