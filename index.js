var express = require('express')
var IRRecord = require('infrared').irrecord;
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
  irrecord.start('remote', {disable_namespace: true});
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

/*
setTimeout(function() {
  irrecord.quit();
}, 5000);
*/
