var Reihenfolge = [];
var j, x, i;
var AblageListe = [];
var sender = 0;
var kartenSpieler = [];
var zählerListe = [];
//var spielerOnline = 0;


class monopolyKartenspiel {

  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
  }

  // this.maxClients = 4;
  // this.player1 = null;
  // this.player2 = null;
  // this.player3 = null;
  // this.player4 = null;
  onInit(options) {
    console.log("BasicRoom created!", options);
  }
  onJoin(client) {
    console.log(`${client.sessionId} joined.`);
    let newPlayer = {
      id: client.sessionId,
      //client: client,
      client: client.sessionId
    };
    //let newPlayer = client;

    console.log(!this.player1 + " - " + !this.player2 + " - " + !this.player3 + " - " + !this.player4 + " - ")
    if (!this.player1) {
      this.player1 = newPlayer;
      this.spielerOnline = 0;
    } else if (!this.player2) {
      this.player2 = newPlayer;
    } else if (!this.player3) {
      this.player3 = newPlayer;
    } else if (!this.player4) {
      this.player4 = newPlayer;
    }
    this.spielerOnline++;
    console.log("spielerOnline: " + this.spielerOnline);
        console.log(!this.player1 + " - " + !this.player2 + " - " + !this.player3 + " - " + !this.player4 + " - ")
    if ((this.player1 != null || this.player1 != undefined) && (this.player2 != null || this.player2 != undefined)/* && this.spielerOnline > 1*/) {
      // für mehr als 2 Spieler:    setTimeout( () =>  { },1000);
      console.log("Mehr als 1 Spieler");
      this.broadcast({
        "type": "AnzahlSpieler",
        "data": this.spielerOnline
      });
      kartenSpieler = [];
      kartenSpieler[0] = [];
      kartenSpieler[1] = [];
      kartenSpieler[2] = [];
      kartenSpieler[3] = [];
      var kartenZiehen = [
        ["Straße", 2, [1, 3, 5], "Münchener Straße", "orange"],
        ["Z Ereigniskartekarte", "Los!", "Ziehen sie 2 zusätzliche Karten.", 1],
        ["Z Ereigniskartekarte", "Los!", "Ziehen sie 2 zusätzliche Karten.", 1],
        ["Z Ereigniskartekarte", "Los!", "Ziehen sie 2 zusätzliche Karten.", 1],
        ["Z Ereigniskartekarte", "Los!", "Ziehen sie 2 zusätzliche Karten.", 1],
        ["Z Ereigniskartekarte", "Los!", "Ziehen sie 2 zusätzliche Karten.", 1],
        ["Z Ereigniskartekarte", "Los!", "Ziehen sie 2 zusätzliche Karten.", 1],
        ["Z Ereigniskartekarte", "Los!", "Ziehen sie 2 zusätzliche Karten.", 1],
        ["Z Ereigniskartekarte", "Los!", "Ziehen sie 2 zusätzliche Karten.", 1],
        ["Z Ereigniskartekarte", "Los!", "Ziehen sie 2 zusätzliche Karten.", 1],
        ["Z Ereigniskartekarte", "Los!", "Ziehen sie 2 zusätzliche Karten.", 1],
        ["Z Ereigniskarte", "1€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 1],
        ["Z Ereigniskarte", "1€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 1],
        ["Z Ereigniskarte", "1€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 1],
        ["Z Ereigniskarte", "1€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 1],
        ["Z Ereigniskarte", "2€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 2],
        ["Z Ereigniskarte", "2€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 2],
        ["Z Ereigniskarte", "2€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 2],
        ["Z Ereigniskarte", "2€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 2],
        ["Z Ereigniskarte", "3€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 3],
        ["Z Ereigniskarte", "3€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 3],
        ["Z Ereigniskarte", "4€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 4],
        ["Z Ereigniskarte", "4€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 4],
        ["Z Ereigniskarte", "4€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 4],
        ["Z Ereigniskarte", "5€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 5],
        ["Z Ereigniskarte", "5€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 5],
        ["Z Ereigniskarte", "1€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 1],
        ["Z Ereigniskarte", "Nix Da", "Ausspielen sobald gegen sie eine Ereigniskarte ausgespielt wird.", 4],
        ["Z Ereigniskarte", "Nix Da", "Ausspielen sobald gegen sie eine Ereigniskarte ausgespielt wird.", 4],
        ["Z Ereigniskarte", "Nix Da", "Ausspielen sobald gegen sie eine Ereigniskarte ausgespielt wird.", 4],
        ["Z Ereigniskarte", "Nix Da", "Ausspielen sobald gegen sie eine Ereigniskarte ausgespielt wird.", 4],

        ["T Miete", ["all"], 3],
        ["T Miete", ["all"], 3],
        ["T Miete", ["all"], 3],
        ["T Miete", ["brown", "#00BFFF"], 1],
        ["T Miete", ["brown", "#00BFFF"], 1],
        ["T Miete", ["violet", "orange"], 1],
        ["T Miete", ["violet", "orange"], 1],
        ["T Miete", ["black", "#00FF40"], 1],
        ["T Miete", ["black", "#00FF40"], 1],
        ["T Miete", ["red", "yellow"], 1],
        ["T Miete", ["red", "yellow"], 1],
        ["T Miete", ["green", "blue"], 1],
        ["T Miete", ["green", "blue"], 1],

        ["Z Ereigniskartekarte", "Geburts- tag!", "Jeder Spieler schenkt dir 2€", 2],
        ["Z Ereigniskartekarte", "Geburts- tag!", "Jeder Spieler schenkt dir 2€", 2],
        ["Z Ereigniskartekarte", "Geburts- tag!", "Jeder Spieler schenkt dir 2€", 2],
        ["Z Ereigniskartekarte", "Geburts- tag!", "Jeder Spieler schenkt dir 2€", 2],
        ["Z Ereigniskartekarte", "Zwangs- tausch", "Ein Grundstück tauschen(nicht aus vollständigem Kartensatz)", 3],
        ["Z Ereigniskartekarte", "Zwangs- tausch", "Ein Grundstück tauschen(nicht aus vollständigem Kartensatz)", 3],
        ["Z Ereigniskartekarte", "Zwangs- tausch", "Ein Grundstück tauschen(nicht aus vollständigem Kartensatz)", 3],
        ["Z Ereigniskartekarte", "Schlau Geklaut", "Stehlen sie irgendeinem Spieler ein Grundstück", 3],
        ["Z Ereigniskartekarte", "Schlau Geklaut", "Stehlen sie irgendeinem Spieler ein Grundstück", 3],
        ["Z Ereigniskartekarte", "Schlau Geklaut", "Stehlen sie irgendeinem Spieler ein Grundstück", 3],
        ["Z Ereigniskartekarte", "Geldhai", "Sie können einem Spieler 5€ stehlen.", 5],
        ["Z Ereigniskartekarte", "Geldhai", "Sie können einem Spieler 5€ stehlen.", 5],
        ["Z Ereigniskartekarte", "Geldhai", "Sie können einem Spieler 5€ stehlen.", 5],
        ["Z Ereigniskarte", "10€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 10],
        ["Z Ereigniskartekarte", "Übernahme", "Stehlen sie einem Gegner einen vollständigen Kartensatz.", 5],
        ["Z Ereigniskartekarte", "Übernahme", "Stehlen sie einem Gegner einen vollständigen Kartensatz.", 5],

        ["Z Ereigniskarte", "Haus", "Auf vollständigen Karten- satz legen. Erhöht Miete um 3€", 3],
        ["Z Ereigniskarte", "Haus", "Auf vollständigen Karten- satz legen. Erhöht Miete um 3€", 3],
        ["Z Ereigniskarte", "Haus", "Auf vollständigen Karten- satz legen. Erhöht Miete um 3€", 3],
        ["Z Ereigniskarte", "Hotel", "Auf vollständigen Karten- satz legen. Erhöht Miete um 4€", 4],
        ["Z Ereigniskarte", "Hotel", "Auf vollständigen Karten- satz legen. Erhöht Miete um 4€", 4],

        ["Straße", 3, [2, 4, 6], "Schiller Straße", "yellow"],
        ["Straße", 3, [2, 4, 6], "Lessing Straße", "yellow"],
        ["Straße", 4, [3, 8], "Park Straße", "blue"],
        ["Straße", 4, [3, 8], "Schloss Allee", "blue"],
        ["Straße", 2, [1, 3, 5], "Berliner Straße", "orange"],
        ["Straße", 1, [1, 2], "Bad Straße", "brown"],
        ["Straße", 1, [1, 2], "Turm Straße", "brown"],
        ["Straße", 3, [2, 4, 6], "Goethe Straße", "yellow"],
        ["Straße", 2, [1, 3, 5], "Wiener Straße", "orange"],
        ["Straße", 1, [1, 2, 3], "Chaussee Straße", "#00BFFF"],
        ["Straße", 2, [1, 2], "Elektrizitäts Werk", "#00FF40"],
        ["Straße", 2, [1, 2], "Wasser Werk", "#00FF40"],
        ["Straße", 4, [2, 4, 7], "Haupt Straße", "green"],
        ["Straße", 4, [2, 4, 7], "Bahnhof Straße", "green"],
        ["Straße", 1, [1, 2, 3], "Post Straße", "#00BFFF"],
        ["Straße", 1, [1, 2, 3], "Elisen Straße", "#00BFFF"],
        ["Straße", 4, [2, 4, 7], "Rathaus Platz", "green"],
        ["Straße", 3, [2, 3, 6], "Museum Straße", "red"],
        ["Straße", 3, [2, 3, 6], "Theater Straße", "red"],
        ["Straße", 3, [2, 3, 6], "Opern Platz", "red"],
        ["Straße", 2, [1, 2, 4], "See Straße", "violet"],
        ["Straße", 2, [1, 2, 4], "Hafen Straße", "violet"],
        ["Straße", 2, [1, 2, 4], "Neue Straße", "violet"],
        ["Straße", 2, [1, 2, 3, 4], "Haupt Bahnhof", "black"],
        ["Straße", 2, [1, 2, 3, 4], "Süd Bahnhof", "black"],
        ["Straße", 2, [1, 2, 3, 4], "Nord Bahnhof", "black"],
        ["Straße", 2, [1, 2, 3, 4], "West Bahnhof", "black"],
        ["A Straße", 3, [
            [2, 4, 6],
            [2, 3, 6]
          ],
          ["yellow", "red"]
        ],
        ["A Straße", 3, [
            [2, 4, 6],
            [2, 3, 6]
          ],
          ["yellow", "red"]
        ],
        ["A Straße", 4, [
            [1, 2, 3],
            [1, 2, 3, 4]
          ],
          ["#00BFFF", "black"]
        ],
        ["A Straße", 4, [
            [1, 2, 3],
            [1, 2]
          ],
          ["#00BFFF", "brown"]
        ],
        ["A Straße", 1, [
            [3, 8],
            [2, 4, 7]
          ],
          ["blue", "green"]
        ],
        ["A Straße", 2, [
            [1, 2],
            [1, 2, 3, 4]
          ],
          ["#00FF40", "black"]
        ],
        ["A Straße", 2, [
            [1, 3, 5],
            [1, 2, 4]
          ],
          ["orange", "violet"]
        ],
        ["A Straße", 2, [
            [1, 3, 5],
            [1, 2, 4]
          ],
          ["orange", "violet"]
        ],
        ["A Straße", 4, [
            [2, 4, 7],
            [1, 2, 3, 4]
          ],
          ["green", "black"]
        ],

        ["A Joker"],
        ["A Joker"],

        ["Z Ereigniskarte", "3€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 3],
        ["Z Ereigniskarte", "2€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 2],
        ["Z Ereigniskarte", "1€", "überweise Geld auf dein Konto, um es zum Bezahen nutzen zu können. ", 1],
      ];
      // Straßen: Typ, Wert(Geld wenn als Geld benutzt) ,Mieten,StraßenName, StraßenFarbe
      // Event Karten: Typ, Stichwort(z.B. "Los"), ausgeschriebeneFähigkeit, Wert(Geld wenn als Geld benutzt)
      //  T Miete: Typ, Farben, Wert(Geld wenn als Geld benutzt)

      for (i = kartenZiehen.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = kartenZiehen[i];
        kartenZiehen[i] = kartenZiehen[j];
        kartenZiehen[j] = x;
      }
      var karten = [];
      console.log("neu geordnet")
      if (this.spielerOnline > 2) {
        this.send(this.player3.client, {
          "type": "spielerDu",
          "data": 2
        });
      }
      if (this.spielerOnline > 3) {
        this.send(this.player4.client, {
          "type": "spielerDu",
          "data": 3
        });
      }
      var Reihenfolge = Math.floor(Math.random() * this.spielerOnline);
      this.send(this.player1.client, {
        "type": "spielerDu",
        "data": 0
      });
      this.send(this.player2.client, {
        "type": "spielerDu",
        "data": 1
      });
      this.broadcast({
        "type": "Reihenfolge",
        "data": Reihenfolge
      });
      console.log("Kartenerteilung");
      zählerListe[0] = 0;
      while (zählerListe[0] < this.spielerOnline) {

        while (kartenSpieler[zählerListe[0]].length < 5) {
          // if (kartenZiehen[0] == 3) {
          //   console.log(3)
          // }
          kartenSpieler[zählerListe[0]][kartenSpieler[zählerListe[0]].length] = kartenZiehen[0];
          kartenZiehen.shift();
        }
        zählerListe[0]++;
      }
      /*      while (kartenSpieler[1].length < 5) {
              kartenSpieler[1][kartenSpieler[1].length] = kartenZiehen[0];
              kartenZiehen.shift();
            } */
      this.broadcast({
        "type": "kartenZiehen",
        "data": kartenZiehen
      });
      sender = 0;
      while (sender < this.spielerOnline) {
        this.broadcast({
          "type": "kartenSpieler",
          "data": kartenSpieler[sender],
          "sender": sender
        });
        sender++;
      }
    }

  }

  onLeave(client) {
    //    if (!client.sessionId) {
    if (this.spielerOnline == 2 && client.sessionId === this.player1.id) console.log(`${client.sessionId + "(0)"} left.`);
    else console.log(`${client.sessionId + "(1)"} left.`);
    this.broadcast(`${client.sessionId} left`);
    //if (this.player1 != undefined) console.log(client.sessionId + " - " + this.player1.id);
    if (Reihenfolge.includes(client.sessionId)) console.log("nothingSpacial");
    else {
      console.log("war inaktiev");
      this.spielerOnline++;
      if (this.player1 != null && client.sessionId == this.player1.id) this.player1 = null;
      if (this.player2 != null && client.sessionId == this.player2.id) this.player2 = null;
      if (this.player3 != null && client.sessionId == this.player3.id) this.player3 = null;
      if (this.player4 != null && client.sessionId == this.player4.id) this.player4 = null;
    }
    // if (this.player2 != undefined) console.log(this.player2);
    // else {
    //   console.log("nur 1 Spieler");
    //   this.player1 = null;
    //   this.spielerOnline = 1;
    // }
    if (this.player3 != undefined) console.log(this.player3.id);
    if (this.player4 != undefined) console.log(this.player4.id);
    if (this.spielerOnline == 4 && this.player3 != null && client.sessionId === this.player3.id) {
      this.player3 = this.player4;
      console.log("spieler3 weg - aufrücken (4 Spieler)");
      this.player4 = null;
    }
    if (this.spielerOnline == 4 && this.player2 != null && client.sessionId === this.player2.id) {
      console.log("spieler2 weg - aufrücken (4 Spieler)");
      this.player2 = this.player3;
      this.player3 = this.player4;
      this.player4 = null;
    }
    if (this.spielerOnline == 4 && this.player1 != null && client.sessionId === this.player1.id) {
      console.log("spieler1 weg - aufrücken (4 Spieler)");
      this.player1 = this.player2;
      this.player2 = this.player3;
      this.player4 = null;
    }
    if (this.spielerOnline == 3 && this.player2 != null && client.sessionId === this.player2.id) {
      console.log("spieler2 weg- aufrücken (3 Spieler)");
      this.player1 = this.player2;
      this.player2 = this.player3;
      //  this.player3 = null;
    }
    if (this.spielerOnline == 3 && this.player1 != null && client.sessionId === this.player1.id) {
      console.log("spieler1 weg - aufrücken (3 Spieler)");
      this.player1 = this.player2;
      this.player2 = this.player3;
      this.player3 = null;
    }
    if (this.spielerOnline == 4 && this.player4 != null && client.sessionId === this.player4.id) this.player4 = null;
    if (this.spielerOnline == 3 && this.player3 != null && client.sessionId === this.player3.id) this.player3 = null;
    if (this.spielerOnline == 2 && this.player2 != null && client.sessionId === this.player2.id) this.player2 = null;
    if (this.spielerOnline == 2 && this.player2 != null && client.sessionId === this.player1.id) {
      this.player1 = this.player2;
      this.player2 = null;
    }
    /*  if (client.sessionId === this.player1.id) this.player1 = null;
      else if (client.sessionId === this.player2.id) this.player2 = null;
      else if (client.sessionId === this.player3.id) this.player3 = null;
      else this.player4 = null; */
    this.spielerOnline--;
    /*  if (!this.player2) {
        Reihenfolge = [];
        var j, x, i;
        //  return kartenZiehen;
        sender = 0;
        kartenSpieler = [];
        zählerListe = [];
        this.spielerOnline = 0;
      } */
    //  }
    console.log(this.spielerOnline + " - " + this.player1 + "/" + this.player2 + "/" + this.player3 + "/" + this.player4 + "/");
    if ((this.spielerOnline == NaN)) {
      this.send(this.player1.client, {
        "type": "reloadPage"
      });
    }
    console.log("spielerOnline: " + this.spielerOnline);
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
    if (data.message.type == "kartenMitte") {
      zählerListe[0] = 0;
      AblageListe[0] = [];
      AblageListe[0][data.message.sender] = 0;
      while (zählerListe[0] < data.message.data.length) {
        if ( /*data.message.data[zählerListe[0]]*/!(data.message.data[zählerListe[0]][5] == undefined) && data.message.data[zählerListe[0]][5].length < data.message.data[zählerListe[0]][2].length == false) {
          AblageListe[0][data.message.sender]++;
        }
        zählerListe[0]++;
      }
      if (AblageListe[0][data.message.sender] > 0) {
        console.log(AblageListe[0][data.message.sender] + " Straßen vollständig Spieler " + data.message.sender);
      }
      if (AblageListe[0][data.message.sender] > 2) this.broadcast(data.message.sender + " hat gewonnen!!!")
    }
    if (/*data.message.type == "Gebot" || */data.message.type == "namenSpieler") {
    //  console.log("Empfänger" + data.message.Empfänger)
      if (data.message.Empfänger == 0) this.send(this.player1.client, data.message);
      if (data.message.Empfänger == 1) this.send(this.player2.client, data.message);
      if (data.message.Empfänger == 2 /*&& this.player3.client == undefined == false*/ ) this.send(this.player3.client, data.message);
      if (data.message.Empfänger == 3 /* && this.player4.client == undefined == false*/ ) this.send(this.player4.client, data.message);
    } else {
      this.broadcast(data.message);
    }
  }
  onDispose() {
    console.log("Dispose BasicRoom");
  }



}

module.exports = monopolyKartenspiel;
