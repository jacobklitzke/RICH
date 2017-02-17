var path = require('path');
var fs = require('fs');

exports.getScripts = function (req, res) {
    var jsonFile = require('../user_files/scripts.json');
    res.json(jsonFile);
};

exports.getScript = function (req, res) {
    var jsonFile = require('../user_files/scripts.json');
    var scripts = JSON.parse(jsonFile);
    for(var i = 0; i < scripts.length; i++) {
        if(req.query.custom_name === scripts[i].name) {
            res.json(scripts[i].name);
        }
    }
};

exports.putNewScript = function( req, res) {

};
