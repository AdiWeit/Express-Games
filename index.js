const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const monopoly = require('./Monopoly/index.js');
app.use('/monopoly/', monopoly);

const heldenDesOlymp = require('./helden_des_olymp/index.js');
app.use('/heldenDesOlymp/', heldenDesOlymp);

const davincicode = require('./davincicode/index.js');
app.use('/davincicode/', davincicode);

const stratego = require('./stratego/index.js');
app.use('/stratego/', stratego);

const dieSiedler = require('./dieSiedler/index.js');
app.use('/dieSiedler/', dieSiedler);

const geduldsspiel = require('./geduldsspiel/index.js');
app.use('/geduldsspiel/', geduldsspiel);

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

app.listen(PORT, function() {
  console.log('express-games server listening on port ' + PORT);
});
