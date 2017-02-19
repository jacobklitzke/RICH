var path = require('path');
var exec = require('child_process').exec;
var output = "";

var IRRecord = require('infrared').irrecord;
var irrecord = new IRRecord();
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
  irrecord.write(req.body.button);
  if(req.body.button === "") {
    if(irrecord.recording === false) {
      startLirc();
      res.send("Remote successfully saved!");
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
