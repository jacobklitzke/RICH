var path = require('path');
var fs = require('fs');

// Parameters: none
// This returns all remotes in added_remotes.json
exports.getRemotes = function (req, res) {
  var jsonFile = require('../user_files/added_remotes.json');
  res.json(jsonFile);
};

// Parameters: none
//This returns all the scripts in scripts.json
exports.getScripts = function (req, res) {
    var jsonFile = require('../user_files/scripts.json');
    res.json(jsonFile);
};

// Parameters: name, remote, button, count
// This receives an json and saves it into scripts.json
exports.putNewScript = function(req, res) {
  var custom_name = req.body.custom_name;
  var scripts = JSON.parse(fs.readFileSync('user_files/scripts.json'));
  var script = req.body;
  scripts.push(script);
  var scriptsJSON = JSON.stringify(scripts);
  fs.writeFileSync('user_files/scripts.json', scriptsJSON);
};

// Parameters: name
// Deletes the script object in the json file
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

// Parameters: name
// Finds the appoperiate script to execute and executes it
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

// Parameters: script
// Executes script on the node
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
