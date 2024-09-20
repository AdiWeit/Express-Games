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
]
var playerNow;
  // shuffle cards
  for (let i = cards.length - 1; i >= 0; i--) {
      const j = Math.round(Math.random() * (i + 1));
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
    if (!players[0]) players[0] = {id: client.sessionId, client, cards: [], name: "player 1"};
    else if (!players[1]) players[1] = {id: client.sessionId, client, cards: [], name: "player 2"};
    else if (!players[2]) players[2] = {id: client.sessionId, client, cards: [], name: "player 3"};
    else if (!players[3]) players[3] = {id: client.sessionId, client, cards: [], name: "player 4"};
    else return;
    pThis.send(players[players.length - 1].client, {
      "type": "playerNr",
      data: players.length - 1,
    });
  // }
}
  beginGame() {
    // if (players.length > 1) {
  // console.log("Spiel beginnen");
    // getCards(i, 4);
    // if (players.length > 1) pullCards(players.length - 1);
    for (let i = 0; i < players.length; i++) {
      getCards(i, 4);
    }
    // }
    playerNow = -1;
    spielerwechsel();
      pThis.broadcast({
        type: "playerNow",
        data: playerNow,
      });
  }
  onMessage(client, data) {
    if (data.type == "useJokers" && !voted.includes(client)) {
      voting[data.data]++;
      voted.push(client);
      if (voted.length == players.length) {
        var playWithJoker = voting[true] > voting[false] || (voting[true] == voting[false] && Math.round(Math.random() * 1) == 0);
        if (playWithJoker) {
          addJokers();
        }
        setTimeout(() => {
          pThis.broadcast({
            type: "jokerAlert",
            data: playWithJoker,
          });
        }, 8000);
        this.beginGame();
      }
    }
    if (data.type == "guess") {
      var card = players[data.playerI].cards[data.cardI];
      if (data.data == card.nr && client == players[playerNow].id && !card.visible) {
        guessedCorrectly = true;
        card.visible = true;
        // card.state = "visible";
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
    if (data.type == "namePlayer") {
      players[data.playerI].name = data.data;
    }
    if (data.type == "jokerMoved") {
      var cards = players[data.playerI].cards;
      var card = cards[data.from];
      // checks if black joker is to the left of the white one if they are next to each other
      var blackWhiteOrder = !((cards[data.cardI + 1] && card.color == "white" && cards[data.cardI + 1].nr == "-") || (cards[data.cardI - 1] && card.color == "black" && cards[data.cardI - 1].nr == "-"));
      // checks if the joker is allowed to be moved because it is new
      var newJoker = card.nr == "-" && ((card.state == "new" && data.playerI == playerNow) || cards.length <= 5) && blackWhiteOrder;
      // checks if the joker is allowed to be exchanged with new card
      var nextToJoker = cards[data.to].nr == "-" && Math.abs(data.from - data.to) <= 1 && card.state == "new" && data.playerI == playerNow;
      if (newJoker || nextToJoker) {
        // deleting joker
        cards.splice(data.from, 1);
        // inserting joker in the new place
        cards.splice(data.to, 0, card);
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
var voting = {true: 0, false: 0};
var voted = [];
var guessedCorrectly = false;
function addJokers() {
  cards.push({nr: "-",color:  "black", visible: false, state: "normal"});
  cards.push({nr: "-",color:  "white", visible: false, state: "normal"});
}
function getCards(playerI, amount=1) {
  for (let i = 0; i < amount; i++) {
    if (cards.length > 0) {
      var card = cards.shift();
      if (amount == 1) {
        card.state = "new";
      }
      // sort card in players card array
      var pCards = players[playerI].cards;
      // console.log("cards: " + pCards);
      var sorted = false;
      for (let i1 = 0; i1 < pCards.length && !sorted; i1++) {
        var pCard = players[playerI].cards[i1];
        // console.log("checking room to insert");
        if (pCard.nr == card.nr && pCard.color == "white") {
          // console.log("same Nr! Inserting left to white");
          // console.log(pCards);
          pCards.splice(i1, 0, card);
          // console.log(pCards);
          sorted = true;
        }
        if (card.nr < pCard.nr) {
          // console.log("right border of elements with smaller values found! Inserting to the right of it");
          // console.log(pCards);
          pCards.splice(i1, 0, card);
          // console.log(pCards);
          sorted = true;
        }
      }
      if (!sorted) {
        // console.log(pCards);
        // console.log("insert in the end");
        pCards.splice(pCards.length, 0, card);
        // console.log(pCards);
      }
      // players[playerI].cards.push(card);

    //   players[playerI].cards.sort((a, b) => {
    //     // If `nr` is "-", leave the item in its original position
    //     if (a.nr === "-" || b.nr === "-") return 0;
    
    //     // Sort by number if both numbers are not "-"
    //     return a.nr - b.nr || (a.color === "black" ? -1 : a.color === "white" ? 1 : 0);
    // });
      // players[playerI].cards.sort((a, b) => a.nr - b.nr || (a.color === "black" ? -1 : a.color === "white" ? 1 : 0));
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
// TODO: delay of displaying opponten's cards in first round
function pullCards(showOpponentCards) {
  for (let playerI = 0; playerI < players.length; playerI++) {
    var inkoPlayers = JSON.parse(JSON.stringify(players));
    for (let i = 0; i < players.length; i++) {
      if (players[0].cards.length <= 5 && (!players[1] || players[1].cards.length <= 4) && i != playerI && !showOpponentCards) {
        setTimeout(() => {
          pullCards(true);
        }, 7777);
        inkoPlayers[i].cards = [];
        continue;
      }
      for (let i1 = 0; i1 < players[i].cards.length; i1++) {
        var inkoCards = inkoPlayers[i].cards;
        var inkoCard = inkoCards[i1];
        if (i == playerI && inkoCard.visible) {
          inkoCard.state = "visible";
        }
        if (i != playerI && inkoCard != undefined) {
          if (!inkoCard.visible) {
            inkoCard.nr = "";
          }
          // dont't show new card to oppontens before the round is over (because if it is a joker, changing it's position would be obvious)
          if (i == playerNow && inkoCard.state == "new") {
            inkoCards.splice(i1, 1);
            i1--;
          }
        }
      };
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
