var express = require('express');
var exec = require('child_process').exec;
var bodyParser = require("body-parser");
var ip = require('ip');
var ssdp = require('@achingbrain/ssdp');
var app = express();

var bus = ssdp({
  udn: 'unique-identifier', // defaults to a random UUID
  // a string to identify the server by
  signature: 'RICH',
  retry: {
    times: 5, // how many times to attempt joining the UDP multicast group
    interval: 5000 // how long to wait between attempts
  },
  // specify one or more sockets to listen on
  sockets: [{
    type: 'udp4', // or 'udp6'
    broadcast: {
      address: '239.255.255.250', // or 'FF02::C'
      port: 1900 // SSDP broadcast port
    },
    bind: {
      address: '0.0.0.0', // or '0:0:0:0:0:0:0:0'
      port: 1900
    },
    maxHops: 4 // how many network segments packets are allow to travel through (UDP TTL)
  }]
});
bus.on('error', console.error);

bus.advertise({
  usn: 'urn:schemas-upnp-org:service:ContentDirectory:1',
  location: {
    udp4: 'http://' + ip.address() + ':3000/details.xml'
  },
  /*details: { // the contents of the description document
    specVersion: {
      major: 1,
      minor: 1
    },
    URLBase: 'http://' + ip.address() + ':3000',
    device: {
      deviceType: 'a-usn',
      friendlyName: 'A friendly device name',
      manufacturer: 'Manufactuer name',
      manufacturerURL: 'http://example.com',
      modelDescription: 'A description of the device',
      modelName: 'A model name',
      modelNumber: 'A vendor specific model number',
      modelURL: 'http://example.com',
      serialNumber: 'A device specific serial number',
      UDN: 'unique-identifier', // should be the same as the bus UDN
      presentationURL: 'index.html'
    }
  }*/
});
/*.then(advert => {
  app.get('/details.xml', (request, response) => {
    advert.service.details()
    .then(details => {
      response.set('Content-Type', 'text/xml');
      response.send(details);
    })
    .catch(error => {
      response.set('Content-Type', 'text/xml');
      response.send(error);
    });
  });
});*/

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
app.get('/recordRemoteBackend/getRemoteButtons', function(req, res) {
  require('./backend_controllers/getRemoteButtons').getRemoteButtons(req, res);
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
