var express = require('express');
var IRRecord = require('infrared').irrecord;
var exec = require('child_process').exec;
var bodyParser = require("body-parser");
var app = express();

app.use(express.static('angular'));
app.use(express.static('backend_controllers'));
app.use(express.static('files'));
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Add remote routes*/
app.get('/addRemote', function (req, res) {
  require('./controllers/addRemote').get(req, res);
});
app.get('/addRemoteBackend', function (req, res) {
  require('./backend_controllers/addRemoteBackend').get(req, res);
});
app.get('/addRemoteBackend/getRemoteFiles', function (req, res) {
  require('./backend_controllers/addRemoteBackend').getRemoteFiles(req, res);
});
app.get('/addRemoteBackend/getRemoteBrands', function (req, res) {
  require('./backend_controllers/addRemoteBackend').getRemoteBrands(req, res);
});
app.put('/addRemoteBackend/putNewRemote', function (req, res) {
  require('./backend_controllers/addRemoteBackend').putNewRemote(req, res);
});
app.delete('/addRemoteBackend/deleteRemote', function (req, res) {
  require('./backend_controllers/addRemoteBackend').deleteRemote(req, res);
});

/* Record Remote routes*/
app.get('/recordRemote', function (req, res) {
  require('./controllers/recordRemote').get(req, res);
});
app.get('/recordRemoteBackend/startRecording', function(req, res) {
  require('./backend_controllers/recordRemoteBackend').startRecording(req, res);
});
app.get('/recordRemoteBackend/getRecordOutput', function(req, res) {
  require('./backend_controllers/recordRemoteBackend').getRecordOutput(req, res);
});
app.post('/recordRemoteBackend/postRecordData', function(req, res) {
  require('./backend_controllers/recordRemoteBackend').postRecordData(req, res);
});
app.get('/recordRemoteBackend/quitIRRecord', function(req, res) {
  require('./backend_controllers/recordRemoteBackend').quitIRRecord(req, res);
});

/* Script Editor */
app.get('/editScriptsBackend/getScripts', function(req, res) {
  console.log('hi');
  require('./backend_controllers/editScriptsBackend').getScripts(req, res);
});
app.get('/editScriptsBackend/getScript', function(req, res) {
  require('./backend_controllers/editScriptsBackend').getScript(req, res);
});
app.put('/editScriptsBackend/putNewScript', function(req, res) {
  require('./backend_controllers/editScriptsBackend').putNewScript(req, res);
});


app.get('/Home', function (req, res) {
  require('./controllers/Home').get(req,res);
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

/*
setTimeout(function() {
  irrecord.quit();
}, 5000);
*/
