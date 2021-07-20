var Reihenfolge;
var j, x, i;
var AblageListe = [];
var sender = 0;
var kartenSpieler = [];
var zählerListe = [];
var votes;
let mode;
var turntype = "";
var field = [];
var player = {0: {}, 1: {}, 2: {}, 3:{}};
var beutel = [];
var placeDirection = {coords: [], string: ""};
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
        this.getCards(i, 6);
      }
    }
    this.getCards = (playerI, number) => {
      for (var i1 = 0; i1 < number; i1++) {
        player[playerI].steine.push(beutel[0]);
        beutel.shift();
      }
      this.broadcast({
      "type": "steinePlayer",
      "player": playerI,
      data: player[playerI].steine
      });
    }
    this.canPlace = (data) => {
      var snake = {right: {shapes: [], colours: []}, left: {shapes: [], colours: []}, up: {shapes: [], colours: []}, down: {shapes: [], colours: []}};
      if (!field[data.coord.x]) field[data.coord.x] = [];
      for (var i = data.coord.x + 1; field[i] && field[i][data.coord.y] && field[i][data.coord.y].stein; i++) {
        if (!snake.right.shapes.includes(field[i][data.coord.y].stein.name)) snake.right.shapes.push(field[i][data.coord.y].stein.name);
        if (!snake.right.colours.includes(field[i][data.coord.y].stein.colour)) snake.right.colours.push(field[i][data.coord.y].stein.colour);
      }
      for (var i = data.coord.x + -1; field[i] && field[i][data.coord.y] && field[i][data.coord.y].stein; i--) {
        if (!snake.left.shapes.includes(field[i][data.coord.y].stein.name)) snake.left.shapes.push(field[i][data.coord.y].stein.name);
        if (!snake.left.colours.includes(field[i][data.coord.y].stein.colour)) snake.left.colours.push(field[i][data.coord.y].stein.colour);
      }
      for (var i = data.coord.y + -1; field[data.coord.x][i] && field[data.coord.x][i].stein; i--) {
        if (!snake.up.shapes.includes(field[data.coord.x][i].stein.name)) snake.up.shapes.push(field[data.coord.x][i].stein.name);
        if (!snake.up.colours.includes(field[data.coord.x][i].stein.colour)) snake.up.colours.push(field[data.coord.x][i].stein.colour);
      }
      for (var i = data.coord.y + 1; field[data.coord.x][i] && field[data.coord.x][i].stein; i++) {
        if (!snake.down.shapes.includes(field[data.coord.x][i].stein.name)) snake.down.shapes.push(field[data.coord.x][i].stein.name);
        if (!snake.down.colours.includes(field[data.coord.x][i].stein.colour)) snake.down.colours.push(field[data.coord.x][i].stein.colour);
      }
      var sameLine = false;
      if (placeDirection.coords.length < 2) sameLine = true;
      else if ((!(data.coord.x - placeDirection.coords[placeDirection.coords.length - 1].x) && placeDirection.string == 'y') || (!(data.coord.y - placeDirection.coords[placeDirection.coords.length - 1].y) && placeDirection.string == 'x')) sameLine = true;
      console.log("in line " + placeDirection.string + " : " + sameLine);
      var rules = {
        right: {
        sameColour: ((!snake.right.shapes.length || !snake.right.shapes.includes(player[data.player].steine[data.steinI].name)) && (!snake.right.colours.length || (snake.right.colours.includes(player[data.player].steine[data.steinI].colour) && snake.right.colours.length == 1))),
        sameShape: ((snake.right.shapes.length < 2 && (!snake.right.shapes.length || player[data.player].steine[data.steinI].name == snake.right.shapes[0])) && (!snake.right.colours.length || !snake.right.colours.includes(player[data.player].steine[data.steinI].colour)))
      },
        left: {
        sameColour: ((!snake.left.shapes.length || !snake.left.shapes.includes(player[data.player].steine[data.steinI].name)) && (!snake.left.colours.length || (snake.left.colours.includes(player[data.player].steine[data.steinI].colour) && snake.left.colours.length == 1))),
        sameShape: ((snake.left.shapes.length < 2 && (!snake.left.shapes.length || player[data.player].steine[data.steinI].name == snake.left.shapes[0])) && (!snake.left.colours.length || !snake.left.colours.includes(player[data.player].steine[data.steinI].colour)))
      },
        up: {
        sameColour: ((!snake.up.shapes.length || !snake.up.shapes.includes(player[data.player].steine[data.steinI].name)) && (!snake.up.colours.length || (snake.up.colours.includes(player[data.player].steine[data.steinI].colour) && snake.up.colours.length == 1))),
        sameShape: ((snake.up.shapes.length < 2 && (!snake.up.shapes.length || player[data.player].steine[data.steinI].name == snake.up.shapes[0])) && (!snake.up.colours.length || !snake.up.colours.includes(player[data.player].steine[data.steinI].colour)))
      },
        down: {
        sameColour: ((!snake.down.shapes.length || !snake.down.shapes.includes(player[data.player].steine[data.steinI].name)) && (!snake.down.colours.length || (snake.down.colours.includes(player[data.player].steine[data.steinI].colour) && snake.down.colours.length == 1))),
        sameShape: ((snake.down.shapes.length < 2 && (!snake.down.shapes.length || player[data.player].steine[data.steinI].name == snake.down.shapes[0])) && (!snake.down.colours.length || !snake.down.colours.includes(player[data.player].steine[data.steinI].colour)))
      }
      };
      console.log(snake);
      console.log(rules);
      return data.player == Reihenfolge && turntype != "newStein" && sameLine && (!field[data.coord.x][data.coord.y] || !field[data.coord.x][data.coord.y].stein) && (rules.right.sameColour || rules.right.sameShape) && (rules.left.sameColour || rules.left.sameShape) && (rules.up.sameColour || rules.up.sameShape) && (rules.down.sameColour || rules.down.sameShape)
    }
    this.spielerwechsel = () => {
      turntype = "";
      placeDirection = {coords: [], string: ""};
      console.log("changing playing player");
      Reihenfolge++;
      if (Reihenfolge == spielerOnline) Reihenfolge = 0;
      this.broadcast({
        "type": "Reihenfolge",
        "data": Reihenfolge
      });
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
      turntype = "";
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
      // TODO: spielerwechsel: check if right player initiates it
      // console.log(client);
      // console.log(this.player1.client);
      // console.log(this.player2.client);
      if (data.message.type == "vote") {
        this.voteFunc(data.message);
     }
     else if (data.message.type == "placeStein") {
       if (this.canPlace(data.message)/* && JSON.stringify(player[data.message.player].steine).includes(JSON.stringify(data.message.card) && !(field[data.message.i][data.message.i1]))*/) {
         turntype = "placeStein";
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
       placeDirection.coords.push(data.message.coord);
       if (placeDirection.coords.length == 2) {
        if ((placeDirection.coords[1].x - placeDirection.coords[0].x)) placeDirection.string = "x";
        else placeDirection.string = "y";
       }
     }
     }
     else if (data.message.type == "newStein" && !placeDirection.coords.length) {
       turntype = "newStein";
       player[data.message.player].steine.splice(data.message.steinI, 1);
       this.getCards(data.message.player, 1);
     }
     else if (data.message.type == "spielerwechsel") this.spielerwechsel();
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
