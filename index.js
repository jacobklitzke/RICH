var shell = require('shelljs');
var express = require('express')
var IRRecord = require('infrared').irrecord;
var exec = require('child_process').exec;
var app = express()

app.get('/', function (req, res) {
  var irrecord = new IRRecord({device: '/dev/lirc0'});
  irrecord.on('stdout', function(data) {
    console.log(data);
  });
  irrecord.on('stderr', function(data) {
    console.log(data);
  });
  irrecord.on('exit', function() {
    // handle exit event
  });
  //TODO Before running this command, lirc must be stopped with "sudo systemctl stop lirc"
  //TODO There should also be a way to name the remote control before starting so 'remote' below is replaced with a name variable.
  exec('sudo systemctl stop lirc', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });

  irrecord.start('remote', {disable_namespace: true});
  irrecord.write('');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

/*
setTimeout(function() {
  irrecord.quit();
}, 5000);
*/
