var path = require('path');
var fs = require('fs');

function addRemoteButtons(remotes, brand, model, custom_name) {
  var exec = require('child_process').exec;
  var result;
  var remote;
  var counter = 0;
  exec('grep -oh \"KEY_\\w*\" remotes/' + brand + '/' + model, function(err, out, code) {
    if(out.length > 1) {
      out = out.split("\n");
    }
    else {
      out = [''];
    }
    createRemote(out, brand, model, custom_name, remotes);
  });

  exec('grep -oh \"BTN_\\w*\" remotes/' + brand + '/' + model, function(err, out, code) {
    if(out.length > 1) {
      out = out.split("\n");
    }
    else {
      out = [''];
    }
    createRemote(out, brand, model, custom_name, remotes);
  });

  function createRemote(out, brand, model, custom_name, remotes)
  {
    var buttons = [];
    counter++;
    if(counter === 1) {
      result = out;
    }
    if(counter === 2) {
      result = result.concat(out);
      for(var i = 0; i < result.length; i++) {
        if(result[i] === '') {
          result.splice(i, 1);
          i--;
        }
        else {
          buttons.push({"button":result[i]});
        }
      }
      result.unshift("WAIT");

      remote = {
        brand: brand,
        model: model,
        custom_name: custom_name,
        buttons: buttons
      };
      counter = 0;
      addRemoteToJSON(remotes, remote);
    }
  }

  function addRemoteToJSON(remotes, remote) {
    remotes.push(remote);
    var remotesJSON = JSON.stringify(remotes);
    fs.writeFileSync('user_files/added_remotes.json', remotesJSON);
  }
}

exports.getRemoteBrands = function(req, res)
{
  var fileArr = [];
  fs.readdir('remotes', function(err, files) {
    for(var i = 0; i < files.length; i++) {
      fileArr.push({
        brandName: files[i]
      });
    }
    console.log(fileArr);
    res.json(fileArr);
  });
};

exports.getRemoteFiles = function(req, res)
{
  var fileArr = [];
  fs.readdir('remotes/' + req.query.selectedBrand, function(err, files) {
    for(var i = 0; i < files.length; i++) {
      fileArr.push({
        modelName: files[i]
      });
    }
    res.json(fileArr);
  });
};

exports.putNewRemote = function(req, res) {
  //TODO Change file permissions on lirc file
  var customName = req.body.custom_name;
  console.log(customName);
  if(req.body.custom_name === "") {
    customName = req.body.model;
  }
  var remotes = JSON.parse(fs.readFileSync('user_files/added_remotes.json'));
  for (var i = 0; i < remotes.length; i++) {
    if(remotes[i].custom_name === customName)
    {
      remotes.splice(i, 1);
    }
  }
  copyRemoteToLirc(req.body.brand, req.body.model);
  addRemoteButtons(remotes, req.body.brand, req.body.model, customName);

  function copyRemoteToLirc(brand, model) {
    var lineder = require( "lineder" );
    lineder( "/etc/lirc/lircd.conf" ).find( "include \"/home/pi/RICH/remotes/" + brand + "/" + model + "\"", function( err, results ) {
      if(results.length === 0) {
        fs.appendFile("/etc/lirc/lircd.conf", "include \"/home/pi/RICH/remotes/" + brand + "/" + model + "\"\n");
      }
    });
  }
  res.send("Success!");
};

exports.deleteRemote = function(req, res) {
  console.log(req.query.custom_name);
  var remotes = JSON.parse(fs.readFileSync('user_files/added_remotes.json'));
  for (var i = 0; i < remotes.length; i++) {
    if(remotes[i].custom_name === req.query.custom_name)
    {
      remotes.splice(i, 1);
      break;
    }
  }
  var remotesJSON = JSON.stringify(remotes);
  fs.writeFileSync('user_files/added_remotes.json', remotesJSON);
  res.send("Success");
};
