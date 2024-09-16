var reihenfolge = [];
var AblageListe = [];
var j;
var x;
var i;
var players = []
var cards = [    
  {nr: 0, color: "black", visible: false, state: "normal"},
  {nr: 0, color: "white", visible: false, state: "normal"},
  {nr: 1, color: "black", visible: false, state: "normal"},
  {nr: 1, color: "white", visible: false, state: "normal"},
  {nr: 2, color: "black", visible: false, state: "normal"},
  {nr: 2, color: "white", visible: false, state: "normal"},
  {nr: 3, color: "black", visible: false, state: "normal"},
  {nr: 3, color: "white", visible: false, state: "normal"},
  {nr: 4, color: "black", visible: false, state: "normal"},
  {nr: 4, color: "white", visible: false, state: "normal"},
  {nr: 5, color: "black", visible: false, state: "normal"},
  {nr: 5, color: "white", visible: false, state: "normal"},
  {nr: 6, color: "black", visible: false, state: "normal"},
  {nr: 6, color: "white", visible: false, state: "normal"},
  {nr: 7, color: "black", visible: false, state: "normal"},
  {nr: 7, color: "white", visible: false, state: "normal"},
  {nr: 8, color: "black", visible: false, state: "normal"},
  {nr: 8, color: "white", visible: false, state: "normal"},
  {nr: 9, color: "black", visible: false, state: "normal"},
  {nr: 9, color: "white", visible: false, state: "normal"},
  {nr: 10,color:  "black", visible: false, state: "normal"},
  {nr: 10,color:  "white", visible: false, state: "normal"},
  {nr: 11,color:  "black", visible: false, state: "normal"},
  {nr: 11,color:  "white", visible: false, state: "normal"},
  // {nr: "-",color:  "black", visible: false, state: "normal"},
  // {nr: "-",color:  "white", visible: false, state: "normal"}
]
var playerNow;
  // shuffle cards
  for (let i = cards.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
  }
var pThis;
class davincicode {
  constructor(broadcastReceiver, sendReceiver) {
    pThis = this;
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
  }
  onJoin(client) {
  //  console.log(`${client.sessionId} joined.`);
    if (!players[0]) players[0] = {id: client.sessionId, client, cards: [], name: ""};
    else if (!players[1]) players[1] = {id: client.sessionId, client, cards: [], name: ""};
    else if (!players[2]) players[2] = {id: client.sessionId, client, cards: [], name: ""};
    else if (!players[3]) players[3] = {id: client.sessionId, client, cards: [], name: ""};
    else return;
    pThis.send(players[players.length - 1].client, {
      "type": "playerNr",
      data: players.length - 1,
    });
    // if (players.length > 1) {
      // console.log("Spiel beginnen");
        // getCards(i, 4);
        // if (players.length > 1) pullCards(players.length - 1);
        getCards(players.length - 1, 4);
        // }
        if (players.length == 2) {
          playerNow = -1;
          spielerwechsel();
        }
        if (players.length > 2) {
          pThis.broadcast({
            type: "playerNow",
            data: playerNow,
          });
        }
  // }
}
  onMessage(client, data) {
    if (data.type == "guess") {
      var card = players[data.playerI].cards[data.cardI];
      if (data.data == card.nr && client == players[playerNow].id && !card.visible) {
        guessedCorrectly = true;
        card.visible = true;
        card.state = "visible";
        pThis.broadcast({
          type: "revealNr",
          data: card.nr,
          playerI: data.playerI,
          cardI: data.cardI,
          correctGuess: true
        });
      }
      // guessed wrong nr
      else {
        // card.state = "guessMark";
        // realNr = JSON.parse(JSON.stringify(card.nr));
        // card.nr = guess.data;
        pThis.send(players[data.playerI].client, {
          "type": "showGuess",
          data: data.data,
          cardI: data.cardI,
        });
        // card.nr = ;
        setTimeout(() => {
          spielerwechsel();
        }, 3777);
        players[playerNow].cards.forEach((card, i) => {
          if (card.state == "new") {
            pThis.broadcast({
              type: "revealNr",
              data: card.nr,
              playerI: playerNow,
              cardI: i
            });
            card.visible = true;
            card.state = "visible";
          }
        });
      }
      for (let playerI = 0; playerI < players.length; playerI++) {
        if (playerI >= 0 && !players[playerI].cards.map(x => x.visible).includes(false)) {
          pThis.broadcast({
            type: "playerLost",
            data: playerI,
          });
        }
      }
    }
    if (data.type == "continueDecision" && guessedCorrectly) {
      if (!data.continue) {
        spielerwechsel();
      }
    }
    // this.broadcast(data.message);
  }
  onLeave(client) {
    players.forEach((player, i) => {
      if (player.id == client.sessionId) players.splice(i, 1);
    });
  }
}
var guessedCorrectly = false;
function getCards(playerI, amount=1) {
  for (let i = 0; i < amount; i++) {
    if (cards.length > 0) {
      var card = cards.shift();
      if (amount == 1) {
        card.state = "new";
      }
      players[playerI].cards.push(card);
      players[playerI].cards.sort((a, b) => a.nr - b.nr || (a.color === "black" ? -1 : a.color === "white" ? 1 : 0));
      // pThis.send(players[playerI].client, {
      //   "type": "getCard",
      //   data: card,
      //   // new: amount == 1,
      // });
      // var inkoCard = JSON.parse(JSON.stringify(card));
      // inkoCard.nr = "";
      // pThis.broadcast({
      //   "type": "getOpponentCard",
      //   data: inkoCard,
      //   // new: amount == 1,
      //   playerI: playerI,
      // });
    }
  }
  pullCards();
}
function pullCards(playerI) {
  for (let playerI = 0; playerI < players.length; playerI++) {
    var inkoPlayers = JSON.parse(JSON.stringify(players));
    for (let i = 0; i < players.length; i++) {
      players[i].cards.forEach((card, i1) => {
        if (!card.visible && i != playerI) inkoPlayers[i].cards[i1].nr = "";
      });
    }
    pThis.send(players[playerI].client, {
      "type": "pullingCards",
      data: inkoPlayers,
    });
  }
}
function spielerwechsel() {
  playerNow++;
  if (playerNow >= players.length) {
    playerNow = 0;
  }
  for (const card of players[playerNow].cards) {
    if (card.state == "new") {
      card.state = "normal";
    }
  }
  getCards(playerNow);
  pThis.broadcast({
    type: "playerNow",
    data: playerNow,
  });
}
module.exports = davincicode;
