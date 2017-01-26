var express = require('express');
var IRRecord = require('infrared').irrecord;
var exec = require('child_process').exec;
var app = express();

app.use(express.static('angular'));
app.use(express.static('backend_controllers'));
app.get('/addRemote', function (req, res) {
  require('./controllers/addRemote').get(req, res);
});
app.get('/addRemoteBackend', function (req, res) {
  require('./backend_controllers/addRemoteBackend').get(req, res);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

/*
setTimeout(function() {
  irrecord.quit();
}, 5000);
*/
