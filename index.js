const express = require('express');
const app = express();
var server = require('http').Server(app);

app.use('/', express.static('static'))

const htmlPort = 5000;

app.listen(htmlPort, () => console.log(`HTTP server started on port ${htmlPort}`));

