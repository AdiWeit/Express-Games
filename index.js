const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const monopoly = require('./Monopoly/index.js');
app.use('/monopoly/', monopoly);

const go = require('./go/index.js');
app.use('/go/', go);

const heldenDesOlymp = require('./helden_des_olymp/index.js');
app.use('/heldenDesOlymp/', heldenDesOlymp);

const davincicode = require('./davincicode/index.js');
app.use('/davincicode/', davincicode);

const stratego = require('./stratego/index.js');
app.use('/stratego/', stratego);

const strategoChars = require('./strategoChars/index.js');
app.use('/strategoChars/', strategoChars);

const dieSiedler = require('./dieSiedler/index.js');
app.use('/dieSiedler/', dieSiedler);

const geduldsspiel = require('./geduldsspiel/index.js');
app.use('/geduldsspiel/', geduldsspiel);

const uno = require('./uno/index.js');
app.use('/uno/', uno);

const snakeGame = require('./snakeGame/index.js');
app.use('/snakeGame/', snakeGame);

const SchereSteinPapier = require('./SchereSteinPapier/index.js');
app.use('/SchereSteinPapier/', SchereSteinPapier);

const gruselino = require('./gruselino/index.js');
app.use('/gruselino/', gruselino);

const vierGewinnt = require('./vierGewinnt/index.js');
app.use('/vierGewinnt/', vierGewinnt);

const vierGewinntTeams = require('./vierGewinntTeams/index.js');
app.use('/vierGewinntTeams/', vierGewinntTeams);

const labyrinth = require('./labyrinth/index.js');
app.use('/labyrinth/', labyrinth);

const dieMaulwurfCompany = require('./dieMaulwurfCompany/index.js');
app.use('/dieMaulwurfCompany/', dieMaulwurfCompany);

const asFastAsYouCan = require('./asFastAsYouCan/index.js');
app.use('/asFastAsYouCan/', asFastAsYouCan);

const stayOnTheStage = require('./stayOnTheStage/index.js');
app.use('/stayOnTheStage/', stayOnTheStage);

const galgenmaennchen = require('./galgenmaennchen/index.js');
app.use('/galgenmaennchen/', galgenmaennchen);

// const turnbasedClashRoyale = require('./turnbasedClashRoyale/index.js');
// app.use('/turnbasedClashRoyale/', turnbasedClashRoyale);
// const tabu = require('./tabu/index.js');
// app.use('/tabu/', tabu);

const dasVerrueckteLabyrinth = require('./dasVerrueckteLabyrinth/index.js');
app.use('/dasVerrueckteLabyrinth/', dasVerrueckteLabyrinth);

const Kaesekaestchen = require('./Kaesekaestchen/index.js');
app.use('/Kaesekaestchen/', Kaesekaestchen);

const fillTheGlass = require('./fillTheGlass/index.js');
app.use('/fillTheGlass/', fillTheGlass);

const guessTheValue = require('./guessTheValue/index.js');
app.use('/guessTheValue/', guessTheValue);

const zeichenbattle = require('./zeichenbattle/index.js');
app.use('/zeichenbattle/', zeichenbattle);

const HeyDasIstMeinFisch = require('./HeyDasIstMeinFisch/index.js');
app.use('/HeyDasIstMeinFisch/', HeyDasIstMeinFisch);

const Qwirkle = require('./Qwirkle/index.js');
app.use('/Qwirkle/', Qwirkle);
// const replica = require('./replica/index.js');
// app.use('/replica/', replica);

const theMind = require('./theMind/index.js');
app.use('/theMind/', theMind);

/* just file Test*/
app.use('/index.html', express.static(__dirname + '/playbacks'))

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

app.listen(PORT, function() {
  console.log('express-games server listening on port ' + PORT);
});
