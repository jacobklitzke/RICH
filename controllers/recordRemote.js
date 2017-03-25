var path = require('path');
exports.get = function(req, res)
{
  res.sendFile('recordRemote.html', { root: path.join(__dirname, '../views') });
};
