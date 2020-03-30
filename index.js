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


app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

app.listen(PORT, function() {
  console.log('express-games server listening on port ' + PORT);
});
