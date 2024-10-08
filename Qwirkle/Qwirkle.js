var Reihenfolge;
var j, x, i;
var AblageListe = [];
var sender = 0;
var kartenSpieler = [];
var zählerListe = [];
var noGap
var votes;
let mode;
var turntype = "";
var newTiles;
var currentWords = [];
var wordIndexes = {};
var beginning = true;
var firstPlacingRound = true;
var points = {now: 0, required: 0, before:0, got: [0, 0, 0, 0]};
var field;
var player = {0: {}, 1: {}, 2: {}, 3:{}};
var beutel = [];
var placeDirection = {coords: [], string: ""};
var newPlaceDirection;
var snake;
var revenge = [0, 0, 0, 0];
var playerBattle = 0;
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
    {letter: "A", points:1, amount: 5},
    {letter: "B", points:3, amount: 2},
    {letter: "C", points:4, amount: 2},
    {letter: "D", points:1, amount: 4},
    {letter: "E", points:1, amount: 15},
    {letter: "F", points:4, amount: 2},
    {letter: "G", points:2, amount: 3},
    {letter: "H", points:2, amount: 4},
    {letter: "I", points:1, amount: 6},
    {letter: "J", points:6, amount: 1},
    {letter: "K", points:4, amount: 2},
    {letter: "L", points:2, amount: 3},
    {letter: "M", points:3, amount: 4},
    {letter: "N", points:1, amount: 9},
    {letter: "O", points:2, amount: 3},
    {letter: "P", points:4, amount: 1},
    {letter: "Q", points:10, amount: 1},
    {letter: "R", points:1, amount: 6},
    {letter: "S", points:1, amount: 7},
    {letter: "T", points:1, amount: 6},
    {letter: "U", points:1, amount: 6},
    {letter: "V", points:6, amount: 1},
    {letter: "W", points:3, amount: 1},
    {letter: "X", points:8, amount: 1},
    {letter: "Y", points:10, amount: 1},
    {letter: "Z", points:3, amount: 1},
    {letter: "Ä", points:6, amount: 1},
    {letter: "Ö", points:8, amount: 1},
    {letter: "Ü", points:6, amount: 1},
    {letter: "?", points:0, amount: 90, type: "joker"},
  ]
}
var colours = ["red", "green", "blue", "yellow", "#B45F04", "purple"];
var spielerOnline = 0;
var deletedPieces = [];


class Qwirkle {

  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
    this.player = [];
    this.everythingToPlayer = (playerId, connectionLost) => {
      this.player.forEach((playerNow, i) => {
      if (playerNow.id == playerId) {
        this.send(this.player[i].client, {
          "type": "spielerDu",
          connectionLost: connectionLost,
          "data": (i - 1),
          id: playerNow.id
        });
        this.send(this.player[i].client, {
          "type": "AnzahlSpieler",
          "data": spielerOnline
        });
        this.send(this.player[i].client, {
          "type": "selectedMode",
          "data": mode
        });
        this.send(this.player[i].client, {
          "type": "fieldSync",
          "data": field
        });
        this.send(this.player[i].client, {
          "type": "steinePlayer",
          // "player": playerI,
          data: player[i - 1].steine
        });
        points.got.forEach((points, i1) => {
          this.send(this.player[i].client, {
            "type": "pointsPlayer",
            "player": i1,
            data: points
          });
        });
        this.send(this.player[i].client, {
          "type": "Reihenfolge",
          "data": Reihenfolge
        });
      }
    });
    }
    this.voteFunc = (data) => {
      if (data.pointsToWin) points.required += data.pointsToWin;
      console.log("pointsRequired: " + points.required);
      votes[data.easyMode]++;
      var voteConverter = {0: false, 1: true};
      if (votes.true + votes.false >= spielerOnline) {
        console.log(spielerOnline);
        if (data.pointsToWin) points.required = Math.round(points.required/spielerOnline);
        console.log("pointsRequired: " + points.required);
        if (votes.true > votes.false) mode = "easy";
        else if (votes.true < votes.false) mode = "normal";
        if (mode) {
          console.log(mode + " wins vote!");
          this.broadcast({
            type: "selectedMode",
            data: mode,
            pointsToWin: points.required
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
      if (mode == "easy") {
      for (var i = 0; i < 106/steine[mode].length/6; i++) {
        for (var stein of steine[mode]) {
          colours = ["red", "green", "blue", "yellow", "#B45F04", "purple"];
          for (var i2 = 0; i2 < 6; i2++) {
            var index = Math.round(Math.random() * (colours.length - 1));
            stein.colour = colours[index];
            colours.splice(index, 1);
            beutel.push(JSON.parse(JSON.stringify(stein)));
          }
        }
      }
    }
    else {
      for (var stein of steine.normal) {
        for (var i = 0; i < stein.amount; i++) {
          beutel.push(stein);
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
      firstPlacingRound = true;
      turntype = "";
      field = [];
      newTiles = [];
      revenge = [0, 0, 0, 0];
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
      snake = {x: {shapes: [], colours: []}, y: {shapes: [], colours: []}};
      if (!field[data.coord.x]) field[data.coord.x] = [];
      newPlaceDirection = {string: placeDirection.string, coords: newTiles};
      if (newTiles.length < 2) {
        if (!newTiles.length && beginning) points.now++;
        if (newTiles[0] && (data.coord.x - newTiles[0].x)) newPlaceDirection.string = "x";
        else newPlaceDirection.string = "y";
      }
      console.log("newPlaceDirection: " + newPlaceDirection.string);
      noGap = false;
      this.checkStein(data.coord.x, data.coord.y, newPlaceDirection, true);
      var sameLine = false;
        if (!newTiles.length || ((!(data.coord.x - newPlaceDirection.coords[newPlaceDirection.coords.length - 1].x) && newPlaceDirection.string == 'y') || (!(data.coord.y - newPlaceDirection.coords[newPlaceDirection.coords.length - 1].y) && newPlaceDirection.string == 'x'))) {
          sameLine = true;
        }
        for (var newTile of newTiles) {
        this.checkStein(newTile.x, newTile.y, newPlaceDirection);
      }
      if (!newTiles.length) noGap = true;
      console.log("in line " + placeDirection.string + " : " + sameLine);
      console.log("noGap: " + noGap);
      var rules = {
        x: {
        sameColour: ((!snake.x.shapes.length || !snake.x.shapes.includes(player[data.player].steine[data.steinI].name)) && (!snake.x.colours.length || (snake.x.colours.includes(player[data.player].steine[data.steinI].colour) && snake.x.colours.length == 1))),
        sameShape: ((snake.x.shapes.length < 2 && (!snake.x.shapes.length || player[data.player].steine[data.steinI].name == snake.x.shapes[0])) && (!snake.x.colours.length || !snake.x.colours.includes(player[data.player].steine[data.steinI].colour)))
      },
        y: {
        sameColour: ((!snake.y.shapes.length || !snake.y.shapes.includes(player[data.player].steine[data.steinI].name)) && (!snake.y.colours.length || (snake.y.colours.includes(player[data.player].steine[data.steinI].colour) && snake.y.colours.length == 1))),
        sameShape: ((snake.y.shapes.length < 2 && (!snake.y.shapes.length || player[data.player].steine[data.steinI].name == snake.y.shapes[0])) && (!snake.y.colours.length || !snake.y.colours.includes(player[data.player].steine[data.steinI].colour)))
      }
      };
      if (mode != "normal") {
        if (!sameLine) {
          return "You are not allowed to place the pieces around a corner. ";
        }
      }
      if (data.player != Reihenfolge) {
        return "It's not your turn. ";
      }
      if (turntype == "newStein") {
        return "you already swaped a piece. Therefore you are not allowed to place a piece on the board this round. You can reverse the swapping of the pieces and then place pieces instead. "
      }
      console.log(snake);
      console.log(rules);
      return /*check Feld belegt*/(!field[data.coord.x][data.coord.y] || !field[data.coord.x][data.coord.y].stein) && (!(!snake.x.shapes.length && !snake.y.shapes.length) || beginning) && (((rules.x.sameColour || rules.x.sameShape) && (rules.x.sameColour || rules.x.sameShape) && (rules.y.sameColour || rules.y.sameShape) && (rules.y.sameColour || rules.y.sameShape)) || (mode == "normal" && (snake.x.shapes.length || snake.y.shapes.length || beginning)))
    }
    this.checkStein = (x, y, newPlaceDirection, forRules) => {
      console.log("check Stein " + x + " - " + y);
      var totalLength = {x: 0, y: 0};
      var pointsMiddle = 0;
      this.checkDirection({x: x + 1, y: y}, "x", {x: 1, y: 0}, forRules, totalLength)
      this.checkDirection({x: x - 1, y: y}, "x", {x: - 1, y: 0}, forRules, totalLength)
      this.checkDirection({x: x, y: y + 1}, "y", {x: 0, y: 1}, forRules, totalLength)
      this.checkDirection({x: x, y: y - 1}, "y", {x: 0, y: - 1}, forRules, totalLength)
    console.log("totalLength: ");
    console.log(totalLength);
    if (totalLength.x + 1 == 6) {
      console.log("x-Achse qwirkle!");
      points.now += 6;
    }
    if (totalLength.y + 1 == 6) {
      console.log("y-Achse qwirkle!");
      points.now += 6;
    }
  // }
    }
    this.checkDirection = (i, axis, direction, forRules, totalLength) => {
      // console.log(field[i.x] && field[i.x][i.y] && field[i.x][i.y].stein);
      var startingI = JSON.parse(JSON.stringify(i));
      for (var i = i; field[i.x] && field[i.x][i.y] && field[i.x][i.y].stein; i[axis] += direction[axis]) {
        totalLength[axis]++;
        if (forRules && mode == "easy" && newPlaceDirection && newPlaceDirection.string == axis && JSON.stringify(newTiles).includes('x":' + i.x + ',"y":' + i.y)) noGap = true;
        if (forRules || newPlaceDirection.string != axis) {
        if (mode == "easy") {
        points.now++;
        console.log(i.x + " - " + i.y + " --> 1 Punkt");
        // if (Math.abs(i - x) + 1 == 6) points.now += 6;
        if (i[axis] == startingI[axis]) {
          console.log("forRules: " + forRules);
          console.log("Richtung: " + axis + ", direction: " + direction[axis]);
          console.log("ausgansgspunkt: " + (startingI.x - direction.x) + " - " + (startingI.y - direction.y));
          console.log("check field " + (startingI.x - direction.x - direction.x) + " - " + (startingI.y - direction.y - direction.y) + " and " + (i.x - direction.x + direction.x) + " - " + (i.y - direction.y + direction.y));
        }
        if (i[axis] == startingI[axis] && !(field[startingI.x - direction.x - direction[axis]] && field[startingI.x - direction.x - direction[axis]][startingI.y - direction.y - direction[axis]] && field[startingI.x - direction.x - direction[axis]][startingI.y - direction.y - direction[axis]].stein && field[startingI.x - direction.x + direction[axis]] && field[i.x - direction.x + direction[axis]][i.y - direction.y + direction[axis]] && field[i.x - direction.x + direction[axis]][i.y - direction.y + direction[axis]].stein)) {
          points.now++;
          console.log("1 Punkt für Ecke bzw. Rand " + i.x + " - " + i.y + "(jezt einen weiter rechts)");
        }
        else if (i[axis] == i[axis] + direction[axis] && !pointsMiddle) {
          console.log("point placed stone (in middle)");
          points.now++;
          pointsMiddle++;
        }
        }
        if (forRules) {
        if (!snake[axis].shapes.includes(field[i.x][i.y].stein.name)) snake[axis].shapes.push(field[i.x][i.y].stein.name);
        if (!snake[axis].colours.includes(field[i.x][i.y].stein.colour)) snake[axis].colours.push(field[i.x][i.y].stein.colour);
      }
      }
    }
    }
    this.getWord = (x, y) => {
      // var newPlaceDirection = JSON.parse(JSON.stringify(placeDirection));
      // if (newTiles.length < 2) {
      //   if (newTiles[0] && (data.coord.x - newTiles[0].x)) newPlaceDirection.string = "x";
      //   else newPlaceDirection.string = "y";
      // }
      this.getWordLine(x, y, "x", {x: 1, y: 0});
      this.getWordLine(x, y, "y", {x: 0, y: 1});
      // console.log("check words from letter " + field[x][y].stein.letter + " at position " + x + " - " + y);
      // var direction = -1;
      // currentWords.push("");
      // var wordNowIndexes = [];
      // // var replace = false;
      // var newIncluded = false;
      // var hadToGoUp = false;
      // var highestNew = {};
      // for (var highest = x; field[highest] && field[highest][y] && field[highest][y].stein; highest--) {
      //   if (JSON.stringify(newTiles).includes('"x":' + highest + ',"y":' + y)) highestNew = {x: highest, y: y};
      // }
      // console.log(highestNew);
      //   for (var i = x; field[i] && field[i][y] && field[i][y].stein; i += direction) {
      //     if (direction == -1 && !(field[i - 1] && field[i - 1][y] && field[i - 1][y].stein)) {
      //       if (i != x) hadToGoUp = true;
      //       direction = 1;
      //       console.log("topReached: " + i);
      //     }
      //     if (direction == 1) {
      //       console.log("going down");
      //       if (JSON.stringify(newTiles).includes('"x":' + i + ',"y":' + y)) {
      //         // console.log(i + " - " + y + " is new");
      //         newIncluded = true;
      //       }
      //       if ((x == highestNew.x && y == highestNew.y)) {
      //         currentWords[currentWords.length - 1] += field[i][y].stein.letter;
      //         console.log("add letter " + field[i][y].stein.letter + " to wordNowIndexes");
      //         wordNowIndexes.push({x: i, y: y});
      //       // replace = true;
      //     }
      //     }
      //   }
      //   if (!newIncluded || currentWords[currentWords.length - 1].length == 1) {
      //     console.log("remove word " + currentWords[currentWords.length - 1]);
      //     currentWords.pop();
      //   }
      //   else /*if (!hadToGoUp)*/  wordIndexes[currentWords[currentWords.length - 1]] = wordNowIndexes;
      //   currentWords.sort((a, b) => a.length - b.length);
      //   for (var i = 0; i < currentWords.length; i++) {
      //     if (currentWords[currentWords.length - 1].includes(currentWords[i]) && currentWords[i].length < currentWords[currentWords.length - 1].length) {
      //       // console.log("remove i " + i);
      //       delete wordIndexes[currentWords[i]];
      //       currentWords.splice(i, 1);
      //       i = 0;
      //     }
      //   }
      //
      // currentWords.push("");
      // wordNowIndexes = [];
      // direction = -1;
      // newIncluded = false;
      // hadToGoUp = false;
      // highestNew = {};
      // for (var highest = y; field[x] && field[x][highest] && field[x][highest].stein; highest--) {
      //   if (JSON.stringify(newTiles).includes('"x":' + x + ',"y":' + highest)) highestNew = {x: x, y: highest};
      // }
      // console.log(highestNew);
      // // console.log("check y");
      //   for (var i = y; field[x] && field[x][i] && field[x][i].stein; i += direction) {
      //     if (direction == -1 && !(field[x] && field[x][i - 1] && field[x][i - 1].stein)) {
      //       console.log("top reached: " + i);
      //       if (i != y) hadToGoUp = true;
      //       direction = 1;
      //     }
      //     if (direction == 1) {
      //       console.log("going down: " + i);
      //       if (JSON.stringify(newTiles).includes('"x":' + x + ',"y":' + i)) {
      //         newIncluded = true;
      //         // console.log(x + " - " + i + " is new");
      //       }
      //       // console.log("check ");
      //       // console.log(newTiles);
      //       // console.log(" includes " + x + " - " + highest);
      //       console.log("check if " + x + " - " + y + " is highest new tile");
      //       if ((x == highestNew.x && y == highestNew.y)) {
      //         currentWords[currentWords.length - 1] += field[x][i].stein.letter;
      //         console.log("add letter " + field[x][i].stein.letter + " to wordNowIndexes");
      //         wordNowIndexes.push({x: x, y: i});
      //     }
      //     }
      //   }
      //   if (!newIncluded || currentWords[currentWords.length - 1].length == 1) {
      //     console.log("remove word " + currentWords[currentWords.length - 1]);
      //     currentWords.pop();
      //   }
      //   else /*if (!hadToGoUp)*/  {
      //     wordIndexes[currentWords[currentWords.length - 1]] = wordNowIndexes;
      //   }
      //   currentWords.sort((a, b) => a.length - b.length);
      //   for (var i = 0; i < currentWords.length; i++) {
      //     if (currentWords[currentWords.length - 1].includes(currentWords[i]) && currentWords[i].length < currentWords[currentWords.length - 1].length) {
      //       // console.log("remove i " + i);
      //       delete wordIndexes[currentWords[i]];
      //       currentWords.splice(i, 1);
      //       i = 0;
      //     }
      //   }
        // currentWords = currentWords.filter((c, index) => currentWords.indexOf(c) === index);
    }
    this.getWordLine = (x, y, axis, directions) => {
      console.log("check words from letter " + field[x][y].stein.letter + " at position " + x + " - " + y);
      var i = {x: x, y: y}
      var direction = -1;
      currentWords.push("");
      var wordNowIndexes = [];
      // var replace = false;
      var newIncluded = false;
      var hadToGoUp = false;
      var highestNew = {};
      for (var i = i; field[i.x] && field[i.x][i.y] && field[i.x][i.y].stein; i[axis]--) {
        if (JSON.stringify(newTiles).includes('"x":' + i.x + ',"y":' + i.y)) highestNew = {x: i.x, y: i.y};
      }
      console.log(highestNew);
        for (var i = {x: x, y: y}; field[i.x] && field[i.x][i.y] && field[i.x][i.y].stein; i[axis] += direction) {
          if (direction == -1 && !(field[i.x - directions.x] && field[i.x - directions.x][i.y  - directions.y] && field[i.x - directions.x][i.y - directions.y].stein)) {
            if ((axis == "x" && i.x != x) || (axis == "y" && i.y != y)) hadToGoUp = true;
            direction = 1;
            console.log("topReached: " + i[axis]);
          }
          if (direction == 1) {
            console.log("going down");
            if (JSON.stringify(newTiles).includes('"x":' + i.x + ',"y":' + i.y)) {
              // console.log(i + " - " + y + " is new");
              newIncluded = true;
            }
            if ((x == highestNew.x && y == highestNew.y)) {
              currentWords[currentWords.length - 1] += field[i.x][i.y].stein.letter;
              console.log("add letter " + field[i.x][i.y].stein.letter + " to wordNowIndexes");
              wordNowIndexes.push({x: i.x, y: i.y});
            // replace = true;
          }
          }
        }
        if (!newIncluded || currentWords[currentWords.length - 1].length == 1) {
          console.log("remove word " + currentWords[currentWords.length - 1]);
          currentWords.pop();
        }
        else /*if (!hadToGoUp)*/  wordIndexes[currentWords[currentWords.length - 1]] = wordNowIndexes;
        currentWords.sort((a, b) => a.length - b.length);
        for (var i = 0; i < currentWords.length; i++) {
          if (currentWords[currentWords.length - 1].includes(currentWords[i]) && currentWords[i].length < currentWords[currentWords.length - 1].length) {
            // console.log("remove i " + i);
            delete wordIndexes[currentWords[i]];
            currentWords.splice(i, 1);
            i = 0;
          }
        }
    }
    this.getLetterPoints = () => {
      for (var word of currentWords) {
        for (var currentLetter of word) {
          for (var stein of steine.normal) {
            if (stein.letter == currentLetter) {
              points.now += stein.points;
            }
          }
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
      this.getSteine(Reihenfolge, deletedPieces.length, true);
      deletedPieces = [];
      if (turntype == "placeStein") firstPlacingRound = false;
      if (mode == "normal" && turntype == "placeStein") {
        inSpielerwechsel = true;
        turntype = "protestTime";
        this.broadcast({
           "type": "timeForProtest"
        });
        (async () => {
          await waitforme(7000);
          if (turntype == "protestTime") {
            turntype = "";
            console.log("time over!");
            this.spielerwechsel();
          }
          await waitforme(3000);
          inSpielerwechsel = await false;
        })()
      }
      else if (turntype != "protestTime") {
      points.got[Reihenfolge] += points.now;
      if (points.got[Reihenfolge] >= points.required) {
        this.broadcast({
           "type": "winner",
           "player": Reihenfolge,
        });
      }
      points.now = 0;
      this.broadcast({
         "type": "pointsPlayer",
         "player": Reihenfolge,
         data: points.got[Reihenfolge]
      });
      if (player[Reihenfolge].steine.length != undefined) this.getSteine(Reihenfolge, 6 - player[Reihenfolge].steine.length);
      turntype = "";
      newTiles = [];
      placeDirection = {coords: [], string: ""};
      console.log("changing playing player");
      Reihenfolge++;
      if (Reihenfolge == spielerOnline) Reihenfolge = 0;
      if (player[Reihenfolge].aussetzen) {
        player[Reihenfolge].aussetzen = false;
        console.log("Spieler " + (Reihenfolge + 1) + " setzt aus!");
        this.spielerwechsel();
      }
      this.broadcast({
        "type": "Reihenfolge",
        "data": Reihenfolge
      });
    }
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
      this.spielerOnlineGleich0--;
      this.everythingToPlayer(client.sessionId);
    //   var rejoinedPlayer = -1;
    //   if (client.sessionId == this.player[1].id) rejoinedPlayer = 1;
    // if (client.sessionId == this.player[2].id) {
    //   this.send(this.player[2].client, {
    //     "type": "spielerDu",
    //     "data": 1
    //   });
    // }
    // if (this.player[3] != null && client.sessionId == this.player[3].id) {
    //   this.send(this.player[3].client, {
    //     "type": "spielerDu",
    //     "data": 2
    //   });
    // }
    // if (this.player[4] != null && client.sessionId == this.player[4].id) {
    //   this.send(this.player[4].client, {
    //     "type": "spielerDu",
    //     "data": 3
    //   });
    // }
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
      // this.broadcast({
      //   "type": "setAblageListe[4]AfterRejoin"
      // });

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
      playerBattle = spielerOnline;
      votes = {true:0, false:0};
      points = {now: 0, required: 0, before:0, got: [0, 0, 0, 0]};
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
          newRound: true,
          id: this.player[3].id
        });
      }
      if (spielerOnline > 3) {
        this.send(this.player[4].client, {
          "type": "spielerDu",
          "data": 3,
          newRound: true,
          id: this.player[4].id
        });
      }
      this.send(this.player[1].client, {
        type: "spielerDu",
        data: 0,
        newRound: true,
        id: this.player[1].id
      });
      this.send(this.player[2].client, {
        type: "spielerDu",
        data: 1,
        newRound: true,
        id: this.player[2].id
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
      // console.log(client);
      // console.log(this.player[1].client);
      // console.log(this.player[2].client);
      points.before = JSON.parse(JSON.stringify(points.now));
      if (data.message.type == "getAllData") this.everythingToPlayer(data.message.playerId, true);
      else if (data.message.type == "vote") {
        this.voteFunc(data.message);
     }
     else if (data.message.type == "revenge") {
       revenge[data.message.playerNumber] = data.message.revenge;
       console.log("revenge: " + revenge.reduce((a, b) => a + b));
       if (playerBattle != this.spielerOnlineGleich0 || !data.message.revenge) {
         this.player[1] = null; this.player[2] = null; this.player[3] = null; this.player[4] = null; spielerOnline = 0; console.log("remove room");
         this.broadcast({"type": "noRevenge"});
       }
       if (revenge.reduce((a, b) => a + b) == playerBattle) {
         points = {now: 0, required: points.required, before:0, got: [0, 0, 0, 0]};
         this.setup();
         console.log("sending data to players");
         console.log(this.player);
         for (var thePlayer of this.player) {
           console.log(thePlayer);
           if (thePlayer) console.log("data to " + thePlayer.id);
           if (thePlayer) this.everythingToPlayer(thePlayer.id, true);
         }
       }
     }
     else if (data.message.type == "protest" && turntype == "protestTime") {
       console.log("protest!");
       turntype = "rejected";
       var allInDuden = true;
       var wrongWords = [];
       (async () => {
         for (var currentWord of currentWords) {
           if (!(await wordInDuden(currentWord)) && (!currentWord.includes('ss') || !(await wordInDuden(currentWord.replace('SS', 'ß'))))) {
             allInDuden = false;
             wrongWords.push(currentWord);
           }
         }
         if (!allInDuden) {
           this.broadcast({
             "type": "removeTiles",
             "wrongWords": wrongWords,
             wordIndexes: wordIndexes
           });
           for (var wrongWord of wrongWords) {
             for (var newTile of wordIndexes[wrongWord]) {
               console.log("remove " + newTile.x + " - " + newTile.y + "(" + field[newTile.x][newTile.y].stein.letter + ")");
               if (JSON.stringify(newTiles).includes('"x":' + newTile.x + ',"y":' + newTile.y)) {
                 console.log("really remove " + newTile.x + " - " + newTile.y + "(" + field[newTile.x][newTile.y].stein.letter + ")");
                 delete field[newTile.x][newTile.y].stein;
                 newTiles.forEach((newTileNow, i) => {
                   if (newTileNow.x == newTile.x && newTileNow.y == newTile.y) newTiles.splice(i, 1);
                 });

               }
             }
           }
           console.log(newTiles);
           points.now = 0;
           currentWords = [];
           wordIndexes = {};
           if (newTiles.length) this.canPlace({steinI: 0, player: Reihenfolge, coord: newTiles[newTiles.length - 1]});
           for (var tile of newTiles) {
             this.getWord(tile.x, tile.y);
           }
           this.getLetterPoints();
           beginning = true;
         }
         else player[data.message.player].aussetzen = true;
         console.log("Spielerwechsel nach Protest");
         this.spielerwechsel();
       })()
     }
     else if (data.message.type == "setLetter" && this.player[Reihenfolge + 1].client == client && player[data.message.player].steine[data.message.steinI].type == "joker") {
       console.log(data.message);
       console.log(player[data.message.player].steine);
       var steine = JSON.parse(JSON.stringify(player[data.message.player].steine));
       steine[data.message.steinI].letter = data.message.letter;
       player[data.message.player].steine = JSON.parse(JSON.stringify(steine));
       console.log(player[data.message.player].steine[data.message.steinI].letter);

       // player[data.message.player].steine[data.message.steinI].letter = letter
       console.log(player[data.message.player].steine);
       // console.log(field[newTiles[0].x][newTiles[0].y]);
     }
     else if (data.message.type == "placeStein" && this.player[Reihenfolge + 1].client == client) {
     points.now = 0;
     var bCanPlace = this.canPlace(data.message);
       if (bCanPlace == true/* && JSON.stringify(player[data.message.player].steine).includes(JSON.stringify(data.message.card) && !(field[data.message.i][data.message.i1]))*/) {
         newTiles.push(data.message.coord);
         turntype = "placeStein";
         beginning = false;
       var stein = JSON.parse(JSON.stringify(player[data.message.player].steine[data.message.steinI]));
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
       if (newTiles.length == 2) {
        if ((newTiles[1].x - newTiles[0].x)) placeDirection.string = "x";
        else placeDirection.string = "y";
       }
       if (mode == "normal") {
       currentWords = [];
       wordIndexes = {};
       for (var tile of newTiles) {
         this.getWord(tile.x, tile.y);
       }
       currentWords = currentWords.filter(x => x.length > 1);
       console.log("filtered words: ");
       console.log(currentWords);
       console.log(wordIndexes);
       if (JSON.stringify(Object.keys(wordIndexes).sort()) != JSON.stringify(currentWords.sort())) console.warn("error: wordIndexes List and currentWords are not the same!");
       this.getLetterPoints();
     }
       if (data.message.coord.x == field.length - 1) {
         field.push(new Array(field[data.message.coord.x].length));
         // field.length++;
       }
       if (data.message.coord.x == 0) {
         field.unshift(new Array(field[data.message.coord.x].length));
         for (var word of Object.keys(wordIndexes)) {
           wordIndexes[word] = wordIndexes[word].map(val => ({x: val.x + 1, y: val.y}));
         }
           newTiles = newTiles.map(val => ({x: val.x + 1, y: val.y}));
       }
       // if (data.message.coord.y == 0 || data.message.coord.y == field[0].length - 1) field[0].length++;

       if (data.message.coord.y == 0) {
         field.map(x => x.unshift({}));
         for (var word of Object.keys(wordIndexes)) {
           wordIndexes[word] = wordIndexes[word].map(val => ({x: val.x, y: val.y + 1}));
         }
           newTiles = newTiles.map(val => ({x: val.x, y: val.y + 1}));
       }
       if (data.message.coord.y == field[data.message.coord.x].length - 1) {
         field.map(x => x.push({}));
       }
     }
     else {
      points.now = points.before;
      if (bCanPlace != false) {
        this.send(this.player[Reihenfolge + 1].client, {type: "alert", data: bCanPlace});
      }
     }
     }
     else if (data.message.type == "newStein" && !newTiles.length && this.player[Reihenfolge + 1].client == client) {
       turntype = "newStein";
       this.send(this.player[Reihenfolge + 1].client, {type: "jokerConfirmed", data: true})
       deletedPieces.push(player[data.message.player].steine[data.message.steinI]);
       player[data.message.player].steine.splice(data.message.steinI, 1);
     }
     else if (data.message.type == "newStein") this.send(this.player[Reihenfolge + 1].client, {type: "jokerConfirmed", data: false})
     else if (data.message.type == "undo" && this.player[Reihenfolge + 1].client == client) {
      if (turntype == "placeStein") {
        this.broadcast({
          "type": "undo",
          x: newTiles[newTiles.length - 1].x,
          y: newTiles[newTiles.length - 1].y,
          player: Reihenfolge
        });
        player[Reihenfolge].steine.push(field[newTiles[newTiles.length - 1].x][newTiles[newTiles.length - 1].y].stein);
        if (player[Reihenfolge].steine[player[Reihenfolge].steine.length - 1].type == "joker") player[Reihenfolge].steine[player[Reihenfolge].steine.length - 1].letter = "?";
        delete field[newTiles[newTiles.length - 1].x][newTiles[newTiles.length - 1].y].stein;
        newTiles.pop();
        points.now = 0;
        if (newTiles.length < 2) placeDirection.string = "";
        if (newTiles.length) this.canPlace({steinI: 0, player: Reihenfolge, coord: newTiles[newTiles.length - 1]});
        else if (firstPlacingRound) beginning = true;
        if (mode == "normal") {
        currentWords = [];
        wordIndexes = {};
      }
        for (var tile of newTiles) {
          this.getWord(tile.x, tile.y);
        }
        if (mode == "normal") this.getLetterPoints();
      }
      else {
        console.log(deletedPieces);
        player[Reihenfolge].steine.push(deletedPieces[deletedPieces.length - 1]);
        deletedPieces.pop();
        this.send(this.player[Reihenfolge + 1].client, {
          "type": "steinePlayer",
          data: player[Reihenfolge].steine
        });
        if (!deletedPieces.length) turntype = "";
      }
     }
     else if (data.message.type == "spielerwechsel" && !inSpielerwechsel && this.player[Reihenfolge + 1].client == client) {
       console.log("Spielerwechsel durch Spielerinput");
       this.spielerwechsel();
     }
    else if (/*data.message.type == "Gebot" || */data.message.type == "namenSpieler") {
    //  console.log("Empfänger" + data.message.Empfänger)
      if (data.message.Empfänger == 0) this.send(this.player[1].client, data.message);
      if (data.message.Empfänger == 1) this.send(this.player[2].client, data.message);
      if (data.message.Empfänger == 2 /*&& this.player[3].client == undefined == false*/ ) this.send(this.player[3].client, data.message);
      if (data.message.Empfänger == 3 /* && this.player[4].client == undefined == false*/ ) this.send(this.player[4].client, data.message);
    } else {
      this.broadcast(data.message);
    }
    if (data.message.type == "endGame" || data.message.type == "winner" || (data.message == "" && data.message.includes("gewonnen"))) {this.player[1] = null; this.player[2] = null; this.player[3] = null; this.player[4] = null; spielerOnline = 0; console.log("remove room");}
  }
  onDispose() {
    console.log("Dispose BasicRoom");
  }
}
var inSpielerwechsel = false;
// scrape DUDEN
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const db = mongoose.connection;
const messageSchema = new mongoose.Schema({
  title: String,
  content: String,
  mailAdress: String,
  creationDate: Date
});
const Message = mongoose.model('Message', messageSchema);
function initDB() {
  db.on('error', console.error.bind(console, 'connection error:'));
  // db.once('open', function() {
  //   console.log("angeschlossen!");
  // });
  // mongoose.connect('mongodb+srv://mongoose:MM9pKwQLz49jCv2@cluster0.im29l.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
}
async function wordInDuden(word) {
  initDB();
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  // useUnifiedTopology: true
});
const page = await browser.newPage();
await page.goto('https://www.duden.de/suchen/dudenonline/' + word);

// await page.goto('https://www.duden.de/');
var content = await page.content();
var $ = cheerio.load(content);
// console.log($('h2.vignette__title').contents().text().split('  ').map(x => replaceAll(x.toLowerCase().replace('\n', '').split('').filter(char => /[a-zßüÜöÖäÄ]/.test(char)).toString(), ',', '')).filter(x => x.length && !x.includes('\n')));
var suggestionList = $('h2.vignette__title').contents().text().split('  ').map(x => replaceAll(x.toLowerCase().replace('\n', '').split('').filter(char => /[a-zßüÜöÖäÄ]/.test(char)).toString(), ',', '')).filter(x => x.length && !x.includes('\n'));
await browser.close();
await db.close();
console.log(suggestionList);
if (suggestionList.includes(word.toLowerCase())) return await true;
else return await false;
// await page.type('#edit-search-api-fulltext--2', word);
// await Promise.all([
//   page.click('button[class="form-asap__button"]'),
//   page.waitForNavigation({
//     waitUntil: 'load'
//   })
// ]);
// console.log("new page loaded!");
// var content = await page.content();
// var $ = cheerio.load(content);
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}
function waitforme(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}
module.exports = Qwirkle;
