var path = require('path');
var exec = require('child_process').exec;
var output = "";

var IRRecord = require('infrared').irrecord;
var irrecord = new IRRecord({device: '/dev/lirc0'});
irrecord.on('stdout', function(data) {
  console.log(data);
  output = data;
});
irrecord.on('stderr', function(data) {
  console.log(data);
  output = data;
});
irrecord.on('exit', function() {
  console.log(data);
  output = data;
});

function startIRRecord(customName) {
  //TODO You need to add a directory to the customName paramter so the file goes in the remotes/custom/<filename> directory.
  stopLirc();
  irrecord.start(customName, {disable_namespace: false});
  return getOutput();
}

function getOutput() {
  return output;
}

function stopLirc() {
  exec('sudo systemctl stop lirc', function(error, stdout, stderr) {
    if (error) {
      console.log(error);
      return;
    }
    console.log(stdout);
    console.log(stderr);
  });
}

function startLirc() {
  exec('sudo systemctl start lirc', function(error, stdout, stderr) {
    if (error) {
      console.log(error);
      return;
    }
    console.log(stdout);
    console.log(stderr);
  });
}


exports.startRecording = function(req, res) {
  res.send(startIRRecord(req.query.custom_name));
};

exports.getRecordOutput = function(req, res) {
  res.send(getOutput());
};

exports.postRecordData = function(req, res) {
  //TODO Need to send the custom name paramter with this post request. 
  irrecord.write(req.body.button);
  if(req.body.button === "") {
    if(irrecord.recording === false) {
      startLirc();
      res.send("Remote successfully saved!");
      //TODO Right here you need to add the custom name of the remote to the LIRC file. You also need to parse the newly created
      //file and put the buttons in the remote buttons json file.
    }
    else {
      res.send(getOutput());
    }
  }
  else {
    res.send(getOutput());
  }
};

exports.quitIRRecord = function(req, res) {
  irrecord.quit();
  startLirc();
};
