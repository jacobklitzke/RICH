//TODO DELETE THIS
var path = require('path');
exports.get = function(req, res)
{
  res.sendFile('addRemote.html', { root: path.join(__dirname, '../views') });
};
