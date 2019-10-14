var reihenfolge = [];
var kartenSpieler2 = [];
var kartenSpieler1 = [];
var j, x, i;
//  return kartenZiehen;


class heldenDesOlymp {
  constructor(broadcastReceiver, sendReceiver) {
    this.broadcast = broadcastReceiver;
    this.send = sendReceiver;
  }

  // this room supports only 2 clients connected
  // maxClients = 2;
  //
  // player1 = null;
  // player2 = null;

  onInit(options) {
    console.log("BasicRoom created!", options);
  }

  onJoin(client) {
    console.log(`${client.sessionId} joined.`);
    let newPlayer = {
      id: client.sessionId,
      client: client,
    };
    if (!this.player1) this.player1 = newPlayer;
    else this.player2 = newPlayer;
    if (this.player1 && this.player2) {
  //  console.log(this.player1.client + " - " + this.player2.client);
      var kartenZiehen = [
        [2, ["blue", "green"], "blue", 1, 3, "Im- mer wenn die Me- le- a- gros ge- gen- über- lie- gen- de Ein- heit ab- ge- legt wird, zie- he 1 Karte. ", "Held/-in"],
        /*  [2, ["yellow", "yellow"], "yellow", 1, 2,
            "Im- mer wenn du Eu- ry- di- ke wegen ih- rer Scha- dens- mar- ker ab- le- gen müs- stest, kannst du 1 Hand- karte ab- wer- fen, um alle Marker von ihr zu ent- fernen und sie auf einen freien Platz zu ver- schie- ben. ", "Held/-in"
          ], */
        [3, ["green", "red", "yellow"], "yellow", 1, 3, "Immer wenn Bellerophon an- greift, er- hälst du 1 Siegpunkt da- zu. ", "Held/-in"],
        [2, ["blue", "blue"], "blue", 1, 3, "Wenn Hylas ins Spiel kommt, ziehe 2 Karten. ", "Held/-in"],
        [2, ["blue", "blue"], "blue", 1, 3, "Wenn Hylas ins Spiel kommt, ziehe 2 Karten. ", "Held/-in"],
        [3, ["red", "green", "green"], "green", 1, 3, "Wenn Neoptolemos ins Spiel kommt, kannst du bis zu 2 Scha- den auf ein- em ei- ge- nen Hel- den hei- len. ", "Held/-in"],
        [1, ["yellow"], "yellow", 2, 2, "Wenn Alkmene ins Spiel kommt, zieht dein Gegner 1 Karte. ", "Held/-in"],
        [1, ["yellow"], "yellow", 2, 2, "Wenn Alkmene ins Spiel kommt, zieht dein Gegner 1 Karte. ", "Held/-in"],
        [2, ["red", "blue"], "red", 0, 3, "1 Ein- heit auf ei- nem zu Kyknos be- nach- bar- ten Platz kann bis zu 2X pro Runde an- grei- fen. ", "Held/-in"],
        [2, ["blue", "yellow"], "blue", 2, 1, "Wenn Orpheus ins Spiel kommt, kannst du eine geg- ne- ri- sche Ein- heit be- stim- men, die ma- xi- mal 2 Kar- ten kos- tet. Dein Geg- ner muss sie auf die Hand zur- rück- neh- men. ", "Held/-in"],
        [3, ["red", "green", "blue"], "red", 1, 4, "Wenn Kassandra ins Spiel kommt, fügt sie al- len Ein- hei- ten 1 Scha- den zu (auch ei- ge- nen). ", "Held/-in"],
        [3, ["yellow", "blue", "red"], "red", 1, 4, "Wenn Dolon angreift, fügt er je- der grünen Ein- heit 1 Scha- den zu (auch ei- ge- nen). ", "Held/-in"],
        [1, ["red"], "red", 1, 0, "Wenn das Schwert ins Spiel kommt, er- hältst du 1 Sieg- punkt. ", "Ausrüstung"],
        [1, ["yellow"], "yellow", 1, 0, "Wenn das Schwert ins Spiel kommt, er- hältst du 1 Sieg- punkt. ", "Ausrüstung"],
        [1, ["green"], "green", 1, 0, "Wenn das Schwert ins Spiel kommt, er- hältst du 1 Sieg- punkt. ", "Ausrüstung"],
        [1, ["blue"], "blue", 1, 0, "Wenn das Schwert ins Spiel kommt, er- hältst du 1 Sieg- punkt. ", "Ausrüstung"],
        [1, ["blue"], "blue", 1, 2, "Wenn die Atlantiden ins Spiel kommen, ziehe 1 Karte. ", "Soldat/-in"],
        [1, ["blue"], "blue", 1, 2, "Wenn die Atlantiden ins Spiel kommen, ziehe 1 Karte. ", "Soldat/-in"],
        [0, [], "green", 0, 2, "keine besonderheit. ", "Soldat/-in"],
        [0, [], "yellow", 0, 2, "keine besonderheit. ", "Soldat/-in"],
        [0, [], "blue", 0, 2, "keine besonderheit. ", "Soldat/-in"],
        [0, [], "green", 0, 2, "keine besonderheit. ", "Soldat/-in"],
        [0, [], "red", 0, 2, "keine besonderheit. ", "Soldat/-in"],
        [0, [], "red", 0, 2, "keine besonderheit. ", "Soldat/-in"],
        [0, [], "yellow", 0, 2, "keine besonderheit. ", "Soldat/-in"],
        [3, ["blue", "green", "yellow"], "yellow", 1, 3, "Im- mer wenn Kassiopeia an- greift, fügt sie kei- nen Scha- den zu, son- dern er- hält den Ge- biets- bon- nus. ", "Held/-in"],
        [4, ["red", "yellow", "blue", "green"], "green", 2, 3, "Wenn Diomedes ins Spiel kommt, kannst du bei al- len dei- nen Hel- den 1 Scha- den hei- len. ", "Held/-in"],
        [0, [], "blue", 1, 1, "keine besonderheit ", "Soldat/-in"],
        [0, [], "red", 1, 1, "keine besonderheit ", "Soldat/-in"],
        [0, [], "blue", 1, 1, "keine besonderheit ", "Soldat/-in"],
        [0, [], "green", 1, 1, "keine besonderheit ", "Soldat/-in"],
        [0, [], "green", 1, 1, "keine besonderheit ", "Soldat/-in"],
        [0, [], "blue", 1, 1, "keine besonderheit ", "Ausrüstung"],
        [0, [], "yellow", 1, 1, "keine besonderheit ", "Ausrüstung"],
        [0, [], "green", 1, 1, "keine besonderheit ", "Ausrüstung"],
        [1, ["blue"], "blue", 1, 1, "Immer wenn Pandora an- greift und Scha- den zufügt, ziehe 1 Karte. ", "Held/-in"],
        [1, ["blue"], "blue", 1, 1, "Immer wenn Telemachos an- greift und den Ge- biets- bonus er- hält, zie- he zu- sätz- lich 1 Karte. ", "Held/-in"],
        [2, ["yellow", "green"], "green", 2, 2, "Wenn Idmon ins Spiel kommt, kannst du 1 ei- ge- ne Ein- heit auf einen ei- ge- nen frei- en Platz ver- schie- ben. ", "Held/-in"],
        [2, ["green"], "green", 1, 2, "Wenn Idmon ins Spiel kommt, kannst du 1 ei- ge- ne Ein- heit auf einen ei- ge- nen frei- en Platz ver- schie- ben. ", "Held/-in"],
        [1, ["yellow"], "yellow", 1, 2, "Wenn die Myrmidonen ins Spiel kom- men, er- hältst du 1 Sieg- punkt da- zu. ", "Held/-in"],
        [1, ["yellow"], "yellow", 1, 2, "Wenn die Myrmidonen ins Spiel kom- men, er- hältst du 1 Sieg- punkt da- zu. ", "Held/-in"],
        [2, ["yellow", "green"], "green", 1, 2, "Wenn die Danaer ins Spiel kom- men, kannst du 1 Scha- den auf ei- ner ei- ge- nen Ein- heit hei- len. ", "Held/-in"],
        [2, ["yellow", "green"], "green", 1, 2, "Wenn die Danaer ins Spiel kom- men, kannst du 1 Scha- den auf ei- ner ei- ge- nen Ein- heit hei- len. ", "Held/-in"],
        [0, [], "yellow", 1, 1, "keine besonderheit ", "Soldat/-in"],
        [0, [], "yellow", 1, 1, "keine besonderheit ", "Soldat/-in"],
        [2, ["red", "green"], "green", 1, 3, "Im- mer wenn Iphigenie an- greift und eine rote Ein- heit als Geg- ner hat, fügt sie 1 Scha- den mehr zu. ", "Held/-in"],
        [2, ["green", "green"], "green", 2, 2, "Wenn Penelope ins Spiel kommt, kannst du 1 geg- ne- ri- sche Ein- heit auf einen frei- en Platz des Geg- ners ver- schie- ben. ", "Held/-in"],
        [1, ["green"], "green", 1, 2, "Wenn Penelope ins Spiel kommt, kannst du 1 geg- ne- ri- sche Ein- heit auf einen frei- en Platz des Geg- ners ver- schie- ben. ", "Held/-in"],
        [0, [], "red", 1, 1, "keine besonderheit ", "Ausrüstung"],
        [1, ["red"], "red", 1, 2, "Wenn Rhesos ins Spiel kommt, kann er ei- nem geg- ne- rischen Hel- den 1 Scha- den zu- fü- gen. ", "Held/-in"],
        [1, ["red"], "red", 1, 2, "Wenn Rhesos ins Spiel kommt, kann er ei- nem geg- ne- rischen Hel- den 1 Scha- den zu- fü- gen. ", "Held/-in"],
        [1, ["red"], "red", 1, 2, "Wenn Rhesos ins Spiel kommt, kann er ei- nem geg- ne- rischen Hel- den 1 Scha- den zu- fü- gen. ", "Held/-in"],
        [1, ["red"], "red", 1, 2, "Wenn Rhesos ins Spiel kommt, kann er ei- nem geg- ne- rischen Hel- den 1 Scha- den zu- fü- gen. ", "Held/-in"],
        [2, ["red", "red"], "red", 1, 2, "Wenn Euphorbos ins Spiel kommt, kann er ei- nem geg- ne- ri- schen Helden 2 Schaden zufügen. ", "Held/-in"],
        [2, ["red", "red"], "red", 1, 2, "Wenn Euphorbos ins Spiel kommt, kann er ei- nem geg- ne- ri- schen Helden 2 Schaden zufügen. ", "Held/-in"],
        [3, ["yellow", "green", "green"], "green", 0, 4, "Alle Ein- hei- ten auf ei- nem zu Nestor be- nach- bar- ten Platz grei- fen 2X pro Runde an. ", "Held/-in"],
        [0, [], "green", 0, 1, "Wenn der Helm ins Spiel kommt, kann er der ge- gen- ü- ber- lie- gen- den Ein- heit 1 Scha- den zu- fü- gen. ", "Ausrüstung"],
        [0, [], "yellow", 0, 1, "Wenn der Helm ins Spiel kommt, kann er der ge- gen- ü- ber- lie- gen- den Ein- heit 1 Scha- den zu- fü- gen. ", "Ausrüstung"],
        [0, [], "blue", 0, 1, "Wenn der Helm ins Spiel kommt, kann er der ge- gen- ü- ber- lie- gen- den Ein- heit 1 Scha- den zu- fü- gen. ", "Ausrüstung"],
        [0, [], "red", 0, 1, "Wenn der Helm ins Spiel kommt, kann er der ge- gen- ü- ber- lie- gen- den Ein- heit 1 Scha- den zu- fü- gen. ", "Ausrüstung"],
        [3, ["yellow", "green", "red"], "red", 0, 3, "Im- mer wenn Hekabe an- greift, kannst du vo- her 1 Hand- kar- te ab- wer- fen, damit sie einer geg- ne- ri- schen Ein- heit 2 Scha- den zufügt. ", "Held/-in"],
        /*  [],
          [], */

        [2, ["blue", "green"], "green", 1, 3, "Wenn die Danaer ins Spiel kom- men, kannst du 1 Scha- den auf ei- ner ei- ge- nen Ein- heit hei- len. ", "Held/-in"],
        [3, ["green", "red", "blue"], "blue", 1, 3, "Immer wenn Pollux ei- nen Hel- den an- greift, zie- he 1 Kar- te. ", "Held/-in"],
        [3, ["blue", "red", "red"], "red", 2, 3, "Wenn Aeneas ins Spiel kommt, kannst du ein- nen Sol- da- ten dei- nes Geg- ners auf den Ab- la- ge- sta- pel le- gen. ", "Held/-in"],
        [3, ["green", "yellow", "yellow"], "yellow", 0, 4, "Immer wenn Cheiron an- greift, kann er vor- her einer belie- bi- gen geg- ne- ri- chen Ein- hei 1 Scha- den zu- fü- gen. ", "Held/-in"],
        [4, ["yellow", "red", "blue", "green"], "green", 1, 3, "Immer wenn Elektra an- greift. kannst du vor- her 1 Scha- den von ei- ner ei- ge- nen Ein- heit hei- len. ", "Held/-in"],
        [3, ["green", "yellow", "blue"], "blue", 1, 2, "Wenn Telamon ins Spiel kommt, ziehe für jeden aus- lie- gen- den geg- ne- ri- schen Hel- den 1 Karte. ", "Held/-in"],
        [2, ["yellow", "yellow"], "yellow", 1, 3, "Jeglicher Schaden, der Euphemos von gel- ben Kar- ten zu- ge- fügt wür- de, wird ver- hin- dert. ", "Held/-in"],
        [2, ["red", "yellow"], "yellow", 1, 3, "Jeglicher Schaden, der Mopsos von ro- ten Kar- ten zu- ge- fügt würde, wird ver- hin- dert. ", "Held/-in"],
        [2, ["green", "yellow"], "yellow", 1, 3, "Jeglicher Schaden, der Ariadne von grü- nen Kar- ten zu- ge- fügt wer- den wür- de, wird ver- hin- dert. ", "Held/-in"],
        [2, ["blue", "yellow"], "yellow", 1, 3, "Jeglicher Scha- den, der Atalante von blau- en Kar- ten zu- ge- fügt wür- de, wird ver- hin- dert. ", "Held/-in"],
        [2, ["green", "red"], "red", 1, 3, "Immer wenn Andromache an- greift und ei- ne grü- ne Ein- heit als Geg- ner hat, er- höht sich ihr An- griffs- wert um 1 bis zum En- de des An- griffs. ", "Held/-in"],

        [2, ["red", "blue"], "blue", 3, 2, "Wenn Lynkeus ins Spiel kommt, kann er in die- ser Run- de kei- nen Geg- ner an- grei- fen. ", "Held/-in"],
        [3, ["red", "yellow", "blue"], "blue", 1, 3, "Immer wenn Kastor ei- nen Sol- da- ten an- greift, zie- he 1 Kar- te. ", "Held/-in"],
        [2, ["green", "blue"], "blue", 1, 3, "Immer wenn die Melagros ge- gen- ü- ber- lie- gen- de Ein- heit ab- ge- legt wird, zie- he 1 Karte. ", "Held/-in"],

        [3, ["red", "yellow"], "yellow", 1, 3, "Immer wenn Iolaos an- greift, zieht dein geg- ner 1 Karte. ", "Held/-in"],
        [3, ["red", "yellow", "green"], "green", 1, 4, "Wenn Patroklos ins Spiel kommt, fügt er je- der ro- ten Ein- heit 1 Scha- den zu (auch ei- ge- nen). ", "Held/-in"],


        [2, ["blue", "yellow", "red"], "red", 3, 1, "Lege Laodike am En- de dei- nes Spiel- zuges auf den Ab- la- ge- stapel. ", "Held/-in"],
        //    [3, ["red", "blue", "blue"], "blue", 1, 4, "Wenn Peleus ins Spiel kommt, wählt dein Geg- ner ei- ne sei- ner Hand- karten und gibt sie dir. Spielse sie sofort kos- ten- los aus oder gib ihm zurück. ", "Held/-in"],

        [5, ["green", "green", "yellow", "red", "blue"], "silver", 3, 5, "Solange Ajax im Spiel ist, ziehst du in Pha- se 3 im- mer eine Kar- te mehr. ", "Held/-in"],
        [4, ["red", "red", "green", "blue"], "silver", 1, 4, "Wenn Perseus ins Spiel kommt, kannst du ei- ne aus- lie- gen- de Ein- heit dei- nes Geg- ners auf den Ab- la- ge- sta- pel le- gen. ", "Held/-in"],
        [4, ["green", "red", "yellow", "yellow"], "silver", 2, 5, "Nachdem Helena an- ge- grif- fen hat, darfst du sie auf ei- nen frei- en Platz auf dei- ner Sei- te ver- schie- ben. ", "Held/-in"],
        [4, ["yellow", "blue", "red", "red"], "silver", 1, 5, "Wenn Paris ins Spiel kommt, fügt er allen geg- ne- ri- schen Ein- hei- ten 2 Scha- den und allen ei- ge- nen Ein- heit- tein 1 Scha- den zu. ", "Held/-in"],
        /* check */
        [4, ["yellow", "blue", "green", "green"], "silver", 1, 4, "Solange Achilleus im Spiel ist, ha- ben al- le dei- ne Hel- den +1 An- griffs- wert. ", "Held/-in"],
        /* check  [5, ["blue", "green", "red", "yellow", "yellow"], "silver", 2, 4, "Wenn Herakles an- greift, kann er vor- her zu- sätz- lich ei- ner Ein- heit 2 Scha- den zu- fü- gen. ", "Held/-in"], */
        [5, ["blue", "green", "yellow", "red", "red"], "silver", 1, 4, "Immer wenn Hektor an- greift, kann er vor- her zu- sätz- lich je- der Ein- heit dei- nes Geg- ners 1 Scha- den zu- fü- gen. ", "Held/-in"],

        [4, ["blue", "green", "yellow", "yellow"], "silver", 2, 5, "Immer wenn Theseus Scha- den zu- ge- fügt wür- de, wird die- ser um 1 ver- rin- gert. ", "Held/-in"],
        [4, ["red", "blue", "green", "green"], "silver", 2, 4, "Immer wenn Menelaos an- greift, kann er vor- her zu- sätz- lich allen ro- ten Ein- hei- ten dei- nes Geg- ners 1 Scha- den zu- fü- gen. ", "Held/-in"],
        [4, ["yellow", "green", "red", "red"], "silver", 2, 4, "Immer wenn Priamos an- greift, kann er vor- her zu- sätz- lich al- len grü- nen Ein- hei- ten dei- nes Geg- ners 1 Scha- den zu- fü- gen. ", "Held/-in"],

 /* AlreadyDone */ [4, ["red", "yellow", "green", "green"], "silver", 2, 4, "Wenn Agamemnon ins Spiel kommt, kannst du be- lie- big viele ei- ge- ne und geg- ne- ri- che Ein- hei- ten auf freie Plätze ver- schie- ben. ", "Held/-in"],
/* AlreadyDone */[4, ["red", "yellow", "blue", "blue"], "silver", 2, 3, "Wenn Odysseus ins Spiel kommt, ziehe eine Karte vom Nach- zieh- stapel. Diese kannst du so- fort kos- ten- los aus- spie- len. ", "Held/-in"],
  /* AlreadyDone */   [4, ["red", "green", "yellow", "blue"], "silver", 2, 4, "Solange Lason im Spiel ist, zieht dein geg- ner in Phase 3 eine Karte weniger. ", "Held/-in"],
  /* AlreadyDone */   [4, ["green", "red", "blue", "blue"], "silver", 1, 3, "Wenn Argos ins Spiel kommt, kannst du eine Hand- karte, die maxi- mal 3 Karten kos- tet, kos- ten- los aus- spie- len. ", "Held/-in"],
  /* AlreadyDone */   [4, ["red", "green", "yellow", "blue"], "silver", 1, 4, "Immer wenn die Medea ge- gen- über- lie- gen- de Ein- heit ab- ge- legt wird, kannst du sie auf die Hand neh- men. ", "Held/-in"],
/* AlreadyDone */[3, ["blue", "red", "yellow"], "silver", 1, 5, "Immer wenn eine aus- lie- gen- de Ein- heit auf den Ab- la- ge- sta- pel ge- legt wird, er- hält Andromeda 1 Schaden. ", "Held/-in"],
                 [3, ["red", "blue", "blue"], "blue", 1, 4, "Wenn Peleus ins Spiel kommt, wählt dein Gge- ner ei- ne seiner Hand- karten und gibt sie dir auf die Hand. ", "Held/-in"],
        /* Ideen eigene Fähigkeiten/Karten */
        [4, ["green", "yellow", "red", "blue"], "silver", 1, 5, "Immer wenn Nelos an- ge- grif- fen wird, wird dem An- grei- fer 1 Scha- den zu- ge- fügt. ", "Held/-in"],
        [2, ["red", "blue"], "blue", 1, 2, "Wenn Adrus ins Spiel kommt, kannst du ei- nen geg- ne- ri- chen Hel- den aus- wäh- len, wes- sen Le- ben für 2 Run- den um 1 ge- senkt werden. ", "Held/-in"],
        [2, ["red", "blue", "yellow", "green"], "silver", 1, 3, "Wenn Adron ins Spiel kommt, kannst du ei- ne geg- ne- ri- che Ein- heit aus- wäh- len, wes- sen An- griff für 3 Run- den um 1 ge- senkt wird. ", "Held/-in"],
        [2, ["red", "blue", "yellow", "green"], "silver", 1, 3, "Wenn Arnus ins Spiel kommt, kannst du ei- ne geg- ne- ri- che Ein- heit aus- wäh- len, wel- che für 2 Run- den aussetzt. ", "Held/-in"]
      /*  wenn gegner (bestimmte Farbe) angreift, wird auch/nur ihm Schaden zugefügt
          Gegnerische/-r Leben/Schaden wird für (2) Runden um 1 verringert

        */
      ];

      for (i = kartenZiehen.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = kartenZiehen[i];
        kartenZiehen[i] = kartenZiehen[j];
        kartenZiehen[j] = x;
      }
      kartenSpieler1 = [];
      kartenSpieler2 = [];
      console.log("neu geordnet")
  // //    console.log(this.player1.client + ", " + this.player1.id + "; " + this.player2.client + ", " + this.player2.id);
  //     if (this.player1.client == undefined) {
  //       console.log("player1.client is undefined");
  //     }
  //     if (this.player1.id == undefined) {
  //       console.log("this.player1.id is undefined");
  //     }
      console.log("client.sessionId: " + this.player1.client.sessionId + ", " + this.player2.client.sessionId);
      this.send(this.player1.client, {
        "type": "player1",
        "data": this.player1.id
      });
      this.send(this.player2.client, {
        "type": "player2",
        "data": this.player2.id
      });
      this.broadcast({
        "type": "spielerIds",
        "data": [this.player1.id, this.player2.id]
      });
      //    this.send(client, "player" + this.player1.id + "player" + this.player2.id);
      reihenfolge = ["player1", "player2"]
      console.log("Kartenerteilung");
      while (kartenSpieler1.length < 6) {
        kartenSpieler1[kartenSpieler1.length] = kartenZiehen[0];
        kartenZiehen.shift();
      }
      while (kartenSpieler2.length < 6) {
        kartenSpieler2[kartenSpieler2.length] = kartenZiehen[0];
        kartenZiehen.shift();
      }
      this.send(this.player1.client, {
        "type": "kartenSpieler1",
        "data": kartenSpieler1
      });
      this.send(this.player2.client, {
        "type": "kartenSpieler2",
        "data": kartenSpieler2
      });
      this.broadcast({
        "type": "kartenZiehen",
        "data": kartenZiehen
      });
    }
  }

  onLeave(client) {
    if (client.sessionId == undefined == false) {
    //  console.log(client.ix);
      console.log(`${client.sessionId} left.`);
      this.broadcast(`${client.sessionId} left`);
      if (client.sessionId === this.player1.id) this.player1 = null;
      else this.player2 = null;
    }
  }

  onMessage(client, data) {
    if (!(this.player1 && this.player2)) return this.broadcast("Es fehlt noch ein Spieler!");
    if (data.message == "Spielerwechsel") {
      console.log("Spielerwechsel");
      if (reihenfolge[0] == "player1") {
        this.broadcast({
          "type": "spielerIds",
          "data": [this.player2.id, this.player1.id]
        });
        reihenfolge = ["player2", "player1"];
      } else {
        this.broadcast({
          "type": "spielerIds",
          "data": [this.player1.id, this.player2.id]
        });
        reihenfolge = ["player1", "player2"];
      }
      /*  this.send(this.player1.client, data.message);
        this.send(this.player2.client, data.message);
        this.broadcast(data.message); */
    } else if (data.message == this.player1.id + "hat gewonnen") {

      this.send(this.player2.client, this.player1.id + "hat gewonnen");
    } else if (data.message == this.player2.id + "hat gewonnen") {

      this.send(this.player1.client, this.player2.id + "hat gewonnen");
    }
    //  else if (data.message.type == "kartenSpieler1") this.send(this.player1.client, data.message);
    //  else if (data.message.type == "kartenSpieler2") this.send(this.player2.client, data.message);
    else if (data.message.type == "MitteSpieler2" || data.message.type == "MitteSpieler1" || data.message.type == "kartenZiehen" || data.message.type == "Siegpunkte" || data.message.type == "Zustand") this.broadcast(data.message);
    else if (data.message.type == "Spieler1KarteGegnerZurrücknehmen") this.send(this.player2.client, data.message);
    else if (data.message.type == "Spieler2KarteGegnerZurrücknehmen") this.send(this.player1.client, data.message);
    else if (data.message == "gegnerKartenZiehen" && this.client == this.player1.client) this.send(this.player1.client, "gegnerKartenZiehen");
    else if (data.message == "gegnerKartenZiehen") this.send(this.player2.client, "gegnerKartenZiehen");
    else {
      this.broadcast(data.message)
    }
  }
  onDispose() {
    console.log("Dispose BasicRoom");
  }

}
module.exports = heldenDesOlymp;
