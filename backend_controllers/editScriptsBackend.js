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
  var exec = require('child_process').exec;
  var sleep = require('sleep');
  var socketReg = new RegExp("irsend: Connection refused*");
  var irsend = new IRSend();
  var counter = 0;

  irsend.list("","",function(error, stdout, stderr) {
	console.log(stderr);
	if(socketReg.test(stderr)) {
		console.log("Here");
		exec('sudo systemctl restart lirc', function(error, stdout, stderr) {
        		if (error) {
            			console.log(error);
            			return;
        		}
        		console.log(stdout);
        		console.log(stderr);
			sendScriptToLIRC(script);
    		});
	}
	else {
  		execute();
	}
 });
  


  function execute() {
    if(counter < script.steps.length) {
      console.log(counter);
      if(script.steps[counter].button === "WAIT") {
        counter++;
	console.log(script.steps[counter - 1].button + " " + script.steps[counter - 1].count);
        console.log("Waiting for " + script.steps[counter - 1].count + " seconds...");
        setTimeout(execute, script.steps[counter - 1].count * 1000);
      }
      else {
        sendCommand(script.steps[counter].model, script.steps[counter].button, 0, function() {
          counter++;
          setTimeout(execute, 500);
        });
      }
    }
  }

  function sendCommand(remote, button, sendThisManyTimes, fn) {
    irsend.send_once(remote, button, function() {
      sendThisManyTimes++;
      if(script.steps[counter].count - sendThisManyTimes !== 0) {
        setTimeout(function() {
          sendCommand(remote, button, sendThisManyTimes, fn);
        }, 100);
      }
      else {
        fn();
      }
    });
  }

  /*for(var i = 0; i < script.steps.length; i++) {
    console.log(i);
    if(script.steps[i].button === "WAIT") {
      console.log("Waiting for " + script.steps[i].count + " seconds...");
      sleep.sleep(script.steps[i].count);
      console.log("Awake!");
    }
    else {
      irsend.send_once_repeat(script.steps[i].remote, script.steps[i].button, script.steps[i].count);
    }
  }*/
}
