var path = require('path');
var fs = require('fs');
exports.get = function(req, res)
{
  console.log(req.query.selected);
  res.send('Hello World!');
};

exports.getRemoteBrands = function(req, res)
{
  var fileArr = [];
  fs.readdir('remotes', function(err, files) {
    for(var i = 0; i < files.length; i++) {
      fileArr.push({
        fileName: files[i]
      });
    }
    res.json(fileArr);
  });
};

exports.getRemoteFiles = function(req, res)
{
  var fileArr = [];
  fs.readdir('remotes/' + req.query.selectedBrand, function(err, files) {
    for(var i = 0; i < files.length; i++) {
      fileArr.push({
        fileName: files[i]
      });
    }
    res.json(fileArr);
  });
};

exports.putNewRemote = function(req, res) {
  //TODO Create string containing brand, model, and custom name. The brand and model
  //tell me where the file is located. The custom name field tells me to replace The
  //name field in the file with the custom one. After both of these operation are completed
  //the proper remote file in its entirety should be copied into the /etc/lircd.conf file.
  //TODO Change file permissions on lirc file.
  //TODO Use includes to add remote file to lirc.conf
  var duplicateCustomName = false;
  var remotes = JSON.parse(fs.readFileSync('user_files/added_remotes.json'));
  for (var i = 0; i < remotes.length; i++) {
    if(remotes[i].custom_name == req.body.custom_name)
    {
      duplicateCustomName = true;
      break;
    }
  }
  if(duplicateCustomName === true)
  {
    copyRemoteToLirc(req.body.brand, req.body.model);
  }
  else {
    var remote = {
      brand: req.body.brand,
      model: req.body.model,
      custom_name: req.body.custom_name
    };
    remotes.push(remote);
    var remotesJSON = JSON.stringify(remotes);
    fs.writeFileSync('user_files/added_remotes.json', remotesJSON);
    copyRemoteToLirc(req.body.brand, req.body.model);
  }

  function copyRemoteToLirc(brand, model) {
    //var fileData = fs.readFileSync("remotes/" + brand + "/" + model, 'utf8');
    //console.log(fileData);
    //TODO lineder checking for the same include filestatement
    var lineder = require( "lineder" );
    lineder( "/etc/lirc/lircd.conf" ).find( "include /home/pi/RICH/remotes/" + brand + "/" + model, function( err, results ) {
      if(results.length === 0) {
        fs.appendFile("/etc/lirc/lircd.conf", "include /home/pi/RICH/remotes/" + brand + "/" + model + "\n");
      }
    });
  }
};
