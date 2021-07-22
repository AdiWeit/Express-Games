var Reihenfolge;
var j, x, i;
var AblageListe = [];
var sender = 0;
var kartenSpieler = [];
var zählerListe = [];
var votes;
let mode;
var turntype = "";
var beginning = true;
var points = {now: 0, before:0, got: [0, 0, 0, 0]};
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
  ],
  normal: [
    {letter: "A", points:1, amount: 1}
  ]
}
var colours = ["red", "green", "blue", "yellow", "orange", "purple"];
var spielerOnline = 0;


class Qwirkle {

  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
    this.player = [];
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
        this.getSteine(i, 6);
      }
      beginning = true;
    }
    this.getSteine = (playerI, number, doNotSend) => {
      for (var i1 = 0; i1 < number; i1++) {
        player[playerI].steine.push(beutel[0]);
        beutel.shift();
      }
      if (!doNotSend) {
        this.send(this.player[playerI + 1].client, {
          "type": "steinePlayer",
          // "player": playerI,
          data: player[playerI].steine
        });
    }
    }
    this.canPlace = (data) => {
      console.log("check if stein can be placed");
      var snake = {right: {shapes: [], colours: []}, left: {shapes: [], colours: []}, up: {shapes: [], colours: []}, down: {shapes: [], colours: []}};
      if (!field[data.coord.x]) field[data.coord.x] = [];
      this.checkStein(data.coord.x, data.coord.y, undefined, snake, true);
      var sameLine = false;
      var newPlaceDirection = JSON.parse(JSON.stringify(placeDirection));
      if (placeDirection.coords.length < 2) {
        if (!placeDirection.coords.length && beginning) points.now++;
        if (placeDirection.coords[0] && (data.coord.x - placeDirection.coords[0].x)) newPlaceDirection.string = "x";
        else newPlaceDirection.string = "y";
      }
        if (!placeDirection.coords.length || ((!(data.coord.x - placeDirection.coords[placeDirection.coords.length - 1].x) && newPlaceDirection.string == 'y') || (!(data.coord.y - placeDirection.coords[placeDirection.coords.length - 1].y) && newPlaceDirection.string == 'x'))) sameLine = true;
      if (placeDirection.coords[0]) {
        this.checkStein(placeDirection.coords[0].x, placeDirection.coords[0].y, newPlaceDirection, snake);
      }
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
      return data.player == Reihenfolge && turntype != "newStein" && sameLine && (!field[data.coord.x][data.coord.y] || !field[data.coord.x][data.coord.y].stein) && (!(!snake.right.shapes.length && !snake.left.shapes.length && !snake.up.shapes.length && !snake.down.shapes.length) || beginning) && (rules.right.sameColour || rules.right.sameShape) && (rules.left.sameColour || rules.left.sameShape) && (rules.up.sameColour || rules.up.sameShape) && (rules.down.sameColour || rules.down.sameShape)
    }
    this.checkStein = (x, y, newPlaceDirection, snake, forRules) => {
      for (var i = x + 1; (forRules || newPlaceDirection.string != "x") && field[i] && field[i][y] && field[i][y].stein; i++) {
        if (mode == "easy") points.now++;
        if (mode == "easy" && i == x + 1) points.now++;
        if (forRules) {
        if (!snake.right.shapes.includes(field[i][y].stein.name)) snake.right.shapes.push(field[i][y].stein.name);
        if (!snake.right.colours.includes(field[i][y].stein.colour)) snake.right.colours.push(field[i][y].stein.colour);
      }
      }
      for (var i = x -1; (forRules || newPlaceDirection.string != "x") && field[i] && field[i][y] && field[i][y].stein; i--) {
        if (mode == "easy") points.now++;
        if (mode == "easy" && i == x - 1) points.now++;
        if (forRules) {
        if (!snake.left.shapes.includes(field[i][y].stein.name)) snake.left.shapes.push(field[i][y].stein.name);
        if (!snake.left.colours.includes(field[i][y].stein.colour)) snake.left.colours.push(field[i][y].stein.colour);
      }
      }
      for (var i = y + -1; (forRules || newPlaceDirection.string != "y") && field[x][i] && field[x][i].stein; i--) {
        if (mode == "easy") points.now++;
        if (mode == "easy" && i == y - 1) points.now++;
        if (forRules) {
        if (!snake.up.shapes.includes(field[x][i].stein.name)) snake.up.shapes.push(field[x][i].stein.name);
        if (!snake.up.colours.includes(field[x][i].stein.colour)) snake.up.colours.push(field[x][i].stein.colour);
      }
      }
      for (var i = y + 1; (forRules || newPlaceDirection.string != "y") && field[x][i] && field[x][i].stein; i++) {
        if (mode == "easy" && i == y + 1) points.now++;
        if (mode == "easy") points.now++;
        if (forRules) {
        if (!snake.down.shapes.includes(field[x][i].stein.name)) snake.down.shapes.push(field[x][i].stein.name);
        if (!snake.down.colours.includes(field[x][i].stein.colour)) snake.down.colours.push(field[x][i].stein.colour);
      }
      }
    }
    this.spielerwechsel = () => {
      // if (turntype == "newStein") {
      //   this.broadcast({
      //   "type": "steinePlayer",
      //   "player": Reihenfolge,
      //   data: player[Reihenfolge].steine
      //   });
      // }
      points.got[Reihenfolge] += points.now;
      points.now = 0;
      this.broadcast({
         "type": "pointsPlayer",
         "player": Reihenfolge,
         data: points.got[Reihenfolge]
      });
      if (player[Reihenfolge].steine.length) this.getSteine(Reihenfolge, 6 - player[Reihenfolge].steine.length);

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
  // this.player[1] = null;
  // this.player[2] = null;
  // this.player[3] = null;
  // this.player[4] = null;
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
    if ([this.player[1], this.player[2], this.player[3], this.player[4]].some(p => p && p.id && (p.id == client.sessionId))) {
      console.log(client + " - " + client.sessionId + " - " + this.player[1].id + " - " + this.player[2].id);
      if (client.sessionId == this.player[1].id) {
      this.send(this.player[1].client, {
        "type": "spielerDu",
        "data": 0
      });
    }
    if (client.sessionId == this.player[2].id) {
      this.send(this.player[2].client, {
        "type": "spielerDu",
        "data": 1
      });
    }
    if (this.player[3] != null && client.sessionId == this.player[3].id) {
      this.send(this.player[3].client, {
        "type": "spielerDu",
        "data": 2
      });
    }
    if (this.player[4] != null && client.sessionId == this.player[4].id) {
      this.send(this.player[4].client, {
        "type": "spielerDu",
        "data": 3
      });
    }
      // if (client.sessionId == this.player[1].id) {
      //   this.send(this.player[2].client, {
      //     "type": "sendDataToRejoinedPlayer"
      //   });
      // }
      // else {
      //   this.send(this.player[1].client, {
      //     "type": "sendDataToRejoinedPlayer"
      //   });
      // }
      this.broadcast({
        "type": "setAblageListe[4]AfterRejoin"
      });

      console.warn("Rejoin, skipping usual onJoin…");
      return;
    }

    console.log(!this.player[1] + " - " + !this.player[2] + " - " + !this.player[3] + " - " + !this.player[4] + " - ")
    if (!this.player[1]) {
      this.player = [, newPlayer];
      this.spielerOnline = 0;
      console.log("create spielerOnlineGleich0");
      this.spielerOnlineGleich0 = 1;
    } else if (this.player.length < 5) this.player.push(newPlayer);
    spielerOnline++;
    console.log("spielerOnline: " + spielerOnline);
        console.log(!this.player[1] + " - " + !this.player[2] + " - " + !this.player[3] + " - " + !this.player[4] + " - ")
    if ((this.player[1] != null || this.player[1] != undefined) && (this.player[2] != null || this.player[2] != undefined)/* && spielerOnline > 1*/) {
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
        this.send(this.player[3].client, {
          "type": "spielerDu",
          "data": 2,
          newRound: true
        });
      }
      if (spielerOnline > 3) {
        this.send(this.player[4].client, {
          "type": "spielerDu",
          "data": 3,
          newRound: true
        });
      }
      this.send(this.player[1].client, {
        type: "spielerDu",
        data: 0,
        newRound: true
      });
      this.send(this.player[2].client, {
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
    // if (spielerOnline == 2 && client.sessionId === this.player[1].id) console.log(`${client.sessionId + "(0)"} left.`);
    // else console.log(`${client.sessionId + "(1)"} left.`);
    // this.broadcast(`${client.sessionId} left`);
    // //if (this.player[1] != undefined) console.log(client.sessionId + " - " + this.player[1].id);
    // if (Reihenfolge.includes(client.sessionId)) console.log("nothingSpacial");
    // else {
    //   console.log("war inaktiev");
    //   spielerOnline++;
    //   if (this.player[1] != null && client.sessionId == this.player[1].id) this.player[1] = null;
    //   if (this.player[2] != null && client.sessionId == this.player[2].id) this.player[2] = null;
    //   if (this.player[3] != null && client.sessionId == this.player[3].id) this.player[3] = null;
    //   if (this.player[4] != null && client.sessionId == this.player[4].id) this.player[4] = null;
    // }
    // // if (this.player[2] != undefined) console.log(this.player[2]);
    // // else {
    // //   console.log("nur 1 Spieler");
    // //   this.player[1] = null;
    // //   spielerOnline = 1;
    // // }
    // if (this.player[3] != undefined) console.log(this.player[3].id);
    // if (this.player[4] != undefined) console.log(this.player[4].id);
    // if (spielerOnline == 4 && this.player[3] != null && client.sessionId === this.player[3].id) {
    //   this.player[3] = this.player[4];
    //   console.log("spieler3 weg - aufrücken (4 Spieler)");
    //   this.player[4] = null;
    // }
    // if (spielerOnline == 4 && this.player[2] != null && client.sessionId === this.player[2].id) {
    //   console.log("spieler2 weg - aufrücken (4 Spieler)");
    //   this.player[2] = this.player[3];
    //   this.player[3] = this.player[4];
    //   this.player[4] = null;
    // }
    // if (spielerOnline == 4 && this.player[1] != null && client.sessionId === this.player[1].id) {
    //   console.log("spieler1 weg - aufrücken (4 Spieler)");
    //   this.player[1] = this.player[2];
    //   this.player[2] = this.player[3];
    //   this.player[4] = null;
    // }
    // if (spielerOnline == 3 && this.player[2] != null && client.sessionId === this.player[2].id) {
    //   console.log("spieler2 weg- aufrücken (3 Spieler)");
    //   this.player[1] = this.player[2];
    //   this.player[2] = this.player[3];
    //   //  this.player[3] = null;
    // }
    // if (spielerOnline == 3 && this.player[1] != null && client.sessionId === this.player[1].id) {
    //   console.log("spieler1 weg - aufrücken (3 Spieler)");
    //   this.player[1] = this.player[2];
    //   this.player[2] = this.player[3];
    //   this.player[3] = null;
    // }
    // if (spielerOnline == 4 && this.player[4] != null && client.sessionId === this.player[4].id) this.player[4] = null;
    // if (spielerOnline == 3 && this.player[3] != null && client.sessionId === this.player[3].id) this.player[3] = null;
    // if (spielerOnline == 2 && this.player[2] != null && client.sessionId === this.player[2].id) this.player[2] = null;
    // if (spielerOnline == 2 && this.player[2] != null && client.sessionId === this.player[1].id) {
    //   this.player[1] = this.player[2];
    //   this.player[2] = null;
    // }
    // /*  if (client.sessionId === this.player[1].id) this.player[1] = null;
    //   else if (client.sessionId === this.player[2].id) this.player[2] = null;
    //   else if (client.sessionId === this.player[3].id) this.player[3] = null;
    //   else this.player[4] = null; */
    // spielerOnline--;
    if (this.player[2] != undefined) this.spielerOnlineGleich0--;
    //  if (this.spielerOnlineGleich0 != undefined && this.spielerOnlineGleich0 == 0) {this.player[1] = null; this.player[2] = null; this.player[3] = null; this.player[4] = null; spielerOnline = 0; console.log("remove room");}
    // /*  if (!this.player[2]) {
    //     Reihenfolge = [];
    //     var j, x, i;
    //     //  return beutel;
    //     sender = 0;
    //     kartenSpieler = [];
    //     zählerListe = [];
    //     spielerOnline = 0;
    //   } */
    // //  }
    // console.log(spielerOnline + " - " + this.player[1] + "/" + this.player[2] + "/" + this.player[3] + "/" + this.player[4] + "/");
    // if ((spielerOnline == NaN)) {
    //   this.send(this.player[1].client, {
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
        this.send(this.player[1].client, {"type": "zahl", "data": data.message.data + 1});
      }
    else if (data.message.adressant == 1) {
        this.send(this.player[2].client, {"type": "zahl", "data": data.message.data + 1});
      }

    else if (data.message.adressant == 2) {
        this.send(this.player[3].client, {"type": "zahl", "data": data.message.data + 1});
      }
      else {
        this.send(this.player[4].client, {"type": "zahl", "data": data.message.data + 1});
      }
    }*/

    if (!(this.player[1] && this.player[2])) return this.broadcast("Es fehlt noch ein Spieler!");
    /*  if (data.message.type == "stayActive") {
        AblageListe[1] = "stayActive";
        setTimeout(function () {
          AblageListe[1] = "abgebrochen";
        }, 500);
      } */
      // TODO: spielerwechsel: check if right player initiates it
      // console.log(client);
      // console.log(this.player[1].client);
      // console.log(this.player[2].client);
      points.before = JSON.parse(JSON.stringify(points.now));
      if (data.message.type == "vote") {
        this.voteFunc(data.message);
     }
     else if (data.message.type == "placeStein") {
     points.now = 0;
       if (this.canPlace(data.message)/* && JSON.stringify(player[data.message.player].steine).includes(JSON.stringify(data.message.card) && !(field[data.message.i][data.message.i1]))*/) {
         turntype = "placeStein";
         beginning = false;
       var stein = player[data.message.player].steine[data.message.steinI];
       stein.new = true;
       this.broadcast({
         "type": "placeStein",
         "coord": data.message.coord,
         stein: stein,
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
       console.log("xFieldSize: " + field.length);
       if (data.message.coord.x == field.length - 1) {
         field.push(new Array(field[data.message.coord.x].length));
         // field.length++;
       }
       if (data.message.coord.x == 0) {
         field.unshift(new Array(field[data.message.coord.x].length));
         // field.length++;
       }
       // if (data.message.coord.y == 0 || data.message.coord.y == field[0].length - 1) field[0].length++;

       if (data.message.coord.y == 0) {
         field.map(x => x.unshift({}));
       }
       console.log("yFieldSize: " + field[data.message.coord.x].length);
       if (data.message.coord.y == field[data.message.coord.x].length - 1) {
         field.map(x => x.push({}));
       }
     }
     else points.now = points.before;
     }
     else if (data.message.type == "newStein" && !placeDirection.coords.length) {
       turntype = "newStein";
       player[data.message.player].steine.splice(data.message.steinI, 1);
       this.getSteine(data.message.player, 1, true);
     }
     else if (data.message.type == "spielerwechsel") this.spielerwechsel();
    else if (/*data.message.type == "Gebot" || */data.message.type == "namenSpieler") {
    //  console.log("Empfänger" + data.message.Empfänger)
      if (data.message.Empfänger == 0) this.send(this.player[1].client, data.message);
      if (data.message.Empfänger == 1) this.send(this.player[2].client, data.message);
      if (data.message.Empfänger == 2 /*&& this.player[3].client == undefined == false*/ ) this.send(this.player[3].client, data.message);
      if (data.message.Empfänger == 3 /* && this.player[4].client == undefined == false*/ ) this.send(this.player[4].client, data.message);
    } else {
      this.broadcast(data.message);
    }
    if (data.message.type == "endGame" || data.message.type == "countingPoints" || (data.message == "" && data.message.includes("gewonnen"))) {this.player[1] = null; this.player[2] = null; this.player[3] = null; this.player[4] = null; spielerOnline = 0; console.log("remove room");}
  }
  onDispose() {
    console.log("Dispose BasicRoom");
  }
}

module.exports = Qwirkle;
