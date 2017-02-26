var express = require('express');
var exec = require('child_process').exec;
var bodyParser = require("body-parser");
var app = express();
var Server = require('node-ssdp').Server;

var server = new Server();

server.addUSN('upnp:rootdevice');
server.addUSN('urn:schemas-upnp-org:device:MediaServer:1');
server.addUSN('urn:schemas-upnp-org:service:ContentDirectory:1');
server.addUSN('urn:schemas-upnp-org:service:ConnectionManager:1');

server.on('advertise-alive', function (headers) {
  // Expire old devices from your cache.
  // Register advertising device somewhere (as designated in http headers heads)
});

server.on('advertise-bye', function (headers) {
  // Remove specified device from cache.
});

// start the server
server.start();
console.log('SSDP Started!');

process.on('exit', function(){
  server.stop(); // advertise shutting down and stop listening
});

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
app.get('/addRemoteBackend/', function (req, res) {
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
  require('./backend_controllers/editScriptsBackend').getScripts(req, res);
});
app.put('/editScriptsBackend/putNewScript', function(req, res) {
  require('./backend_controllers/editScriptsBackend').putNewScript(req, res);
});
app.delete('/editScriptsBackend/deleteScript', function(req, res) {
  require('./backend_controllers/editScriptsBackend').deleteScript(req, res);
});
app.get('/editScriptsBackend/executeScript', function(req, res) {
  require('./backend_controllers/editScriptsBackend').executeScript(req, res);
});
app.get('/editScriptsBackend/getRemotes', function(req, res) {
  require('./backend_controllers/editScriptsBackend').getRemotes(req, res);
});
app.get('/editScriptsBackend/getRemoteButtons', function(req, res) {
  require('./backend_controllers/editScriptsBackend').getRemoteButtons(req, res);
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
