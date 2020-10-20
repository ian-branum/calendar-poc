const express = require('express');
const app = express();
var server = require('http').Server(app);
var apis = require('./routes/apis')
var cors = require('cors');

app.use(cors());
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.use("/api", apis);
app.use('/', express.static('static'));

const htmlPort = 5000;

app.listen(htmlPort, () => console.log(`HTTP server started on port ${htmlPort}`));
