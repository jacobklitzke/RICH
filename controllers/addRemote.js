var path = require('path');
exports.get = function(req, res)
{
  res.sendFile('addRemote.html', { root: path.join(__dirname, '../views') });
};


/*var irrecord = new IRRecord({device: '/dev/lirc0'});
irrecord.on('stdout', function(data) {
  console.log(data);
});
irrecord.on('stderr', function(data) {
  console.log(data);
});
irrecord.on('exit', function() {
  // handle exit event
});
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
*/
//TODO Restart LIRC


function recordRemote()
{
  instructions
}
