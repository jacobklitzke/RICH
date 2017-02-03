var path = require('path');
var fs = require('fs');
exports.get = function(req, res)
{
  console.log(req.query.selected);
  res.send('Hello World!');
};

exports.getFiles = function(req, res)
{
  var fileArr = [];
  fs.readdir('files', function(err, files) {
    for(var i = 0; i < files.length; i++) {
      fileArr.push({
        fileName: files[i]
      });
    }
    res.json(fileArr);
  });
};
