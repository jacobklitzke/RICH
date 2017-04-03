var path = require('path');
var fs = require('fs');

exports.getRemotes = function (req, res) {
  res.json(JSON.parse(fs.readFileSync('user_files/added_remotes.json')));
};

exports.getScripts = function (req, res) {
    var jsonFile = require('../user_files/scripts.json');
    res.json(jsonFile);
};

exports.putNewScript = function(req, res) {
  var scripts = JSON.parse(fs.readFileSync('user_files/scripts.json'));
  var script = req.body;
  scripts.push(script);
  var scriptsJSON = JSON.stringify(scripts);
  fs.writeFileSync('user_files/scripts.json', scriptsJSON);
  res.send("Success");
};

exports.updateExistingScript = function(req, res) {
  var scripts = JSON.parse(fs.readFileSync('user_files/scripts.json'));
  var script = req.body;

  for(var i = 0; i < scripts.length; i++) {
    if(scripts[i].name === script.name) {
      scripts[i] = script;
    }
  }

  var scriptsJSON = JSON.stringify(scripts);
  fs.writeFileSync('user_files/scripts.json', scriptsJSON);
  res.send("Success");
};

exports.deleteScript = function(req, res) {
  var custom_name = req.body.custom_name;
  var scripts = JSON.parse(fs.readFileSync('user_files/scripts.json'));
  for (var i = 0; i < scripts.length; i++) {
    if(scripts[i].name === req.body.custom_name)
    {
      scripts.splice(i, 1);
      break;
    }
  }
  var scriptsJSON = JSON.stringify(scripts);
  fs.writeFileSync('user_files/scripts.json', scriptsJSON);
  res.send("Success");
};

exports.executeScript = function(req, res) {
  console.log(req.query.script);
  sendScriptToLIRC(JSON.parse(req.query.script));
  res.send("Success");
};

exports.executeSingleButton = function(req, res) {
  sendScriptToLIRC(req.body);
  res.send("Success");
};

exports.updateScriptName = function(req, res) {
  var newName = req.body.newName;
  var oldName = req.body.oldName;
  var scripts = JSON.parse(fs.readFileSync('user_files/scripts.json'));

  for(var i = 0; i < scripts.length; i++) {
    if(scripts[i].name === oldName) {
      scripts[i].name = newName;
    }
  }
  var scriptsJSON = JSON.stringify(scripts);
  fs.writeFileSync('user_files/scripts.json', scriptsJSON);

  res.json(scripts);
};

function sendScriptToLIRC(script) {
  var IRSend = require('infrared').irsend;
  var irsend = new IRSend();
  var sleep = require('sleep');
  for(var i = 0; i < script.steps.length; i++) {
    if(script.steps[i].button === "WAIT") {
      sleep.sleep(script.steps[i].count);
    }
    irsend.send_once_repeat(script.steps[i].remote, script.steps[i].button, script.steps[i].count);
  }
}
