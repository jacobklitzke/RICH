//TODO DELETE THIS
var path = require('path');
exports.get = function(req, res)
{
  res.sendFile('Home.html', { root: path.join(__dirname, '../views') });
};
