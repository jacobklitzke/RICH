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
  //TODO Change file permissions on lirc file
  var customName = "";
  if(req.body.custom_name === "") {
    customName = req.body.model;
  }
  var duplicateCustomName = false;
  var remotes = JSON.parse(fs.readFileSync('user_files/added_remotes.json'));
  for (var i = 0; i < remotes.length; i++) {
    if(remotes[i].custom_name == customName)
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
      custom_name: customName
    };
    remotes.push(remote);
    var remotesJSON = JSON.stringify(remotes);
    fs.writeFileSync('user_files/added_remotes.json', remotesJSON);
    copyRemoteToLirc(req.body.brand, req.body.model);
  }

  function copyRemoteToLirc(brand, model) {
    var lineder = require( "lineder" );
    //TODO Add quotation marks around path, but not around include.
    lineder( "/etc/lirc/lircd.conf" ).find( "include /home/pi/RICH/remotes/" + brand + "/" + model, function( err, results ) {
      if(results.length === 0) {
        fs.appendFile("/etc/lirc/lircd.conf", "include /home/pi/RICH/remotes/" + brand + "/" + model + "\n");
      }
    });
  }
};
