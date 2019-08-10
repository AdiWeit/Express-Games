const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const monopoly = require('./Monopoly/index.js');
app.use('/monopoly/', monopoly);

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

app.listen(PORT, function() {
  console.log('express-games server listening on port ' + PORT);
});
