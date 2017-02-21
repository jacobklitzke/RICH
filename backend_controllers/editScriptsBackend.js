var path = require('path');
var fs = require('fs');

exports.getRemotes = function (req, res) {

};

exports.getRemoteButtons = function(req, res) {
  //TODO Add a function in addremote which will parse remote file and add buttons to a remote buttons json file. This json
  //file should contain the custom name of the remote, and the relevant buttons. After a remote has been included in the lirc
  //file, the buttons from the file should be parsed and added to the remote buttons json file. 
};

exports.getScripts = function (req, res) {
    var jsonFile = require('../user_files/scripts.json');
    res.json(jsonFile);
};

exports.putNewScript = function(req, res) {
  var custom_name = req.body.custom_name;
  var scripts = JSON.parse(fs.readFileSync('user_files/scripts.json'));
  var script = req.body;
  scripts.push(script);
  var scriptsJSON = JSON.stringify(scripts);
  fs.writeFileSync('user_files/scripts.json', scriptsJSON);
};

exports.deleteScript = function(req, res) {
  var custom_name = req.body.custom_name;
  var scripts = JSON.parse(fs.readFileSync('user_files/scripts.json'));
  for (var i = 0; i < scripts.length; i++) {
    if(scripts[i].name === req.query.custom_name)
    {
      scripts.splice(i, 1);
      break;
    }
  }
  var scriptsJSON = JSON.stringify(scripts);
  fs.writeFileSync('user_files/scripts.json', scriptsJSON);
};

exports.executeScript = function(req, res) {
  var custom_name = req.body.custom_name;
  var scripts = JSON.parse(fs.readFileSync('user_files/scripts.json'));

  for (var i = 0; i < scripts.length; i++) {
    if(scripts[i].name === req.query.custom_name)
    {
      sendScriptToLIRC(scripts[i]);
      break;
    }
  }
};

function sendScriptToLIRC(script) {
  var IRSend = require('infrared').irsend;
  var irsend = new IRSend();
  var sleep = require('sleep');
  for(var i = 0; i < script.steps.length; i++) {
    if(script.steps[i].button === "wait") {
      //TODO Install sleep npm package
      sleep.sleep(script.steps[i].count);
    }
    irsend.send_once_repeat(script.steps[i].remote, script.steps[i].button, script.steps[i].count);
  }
}
