var path = require('path');
var exec = require('child_process').exec;
var fs = require('fs');
var output = "";
var toggleReg = new RegExp("Checking for toggle bit mask*");
var toggleFlag = false;

var IRRecord = require('infrared').irrecord;
var irrecord = new IRRecord({
    device: '/dev/lirc0'
});
irrecord.on('stdout', function(data) {
    console.log(data);
    if (toggleReg.test(data)) {
        irrecord.write("");
        toggleFlag = true;
    }
    output = data;
});
irrecord.on('stderr', function(data) {
    console.log(data);
    output = data;
});
irrecord.on('exit', function() {
    console.log("Exited");
});

function startIRRecord(customName) {
    //TODO Verify the file goes into the remotes/custom directory. You might need to use the entire path.
    stopLirc();
    irrecord.start('remotes/custom/' + customName, {
        disable_namespace: false
    });

    irrecord.write("");
    irrecord.write("");
    return getOutput();
}

function getOutput() {
    if (toggleFlag) {
        toggleFlag = false;
        return "Checking for toggle bit mask";
    } else {
        return output;
    }

}

function stopLirc() {
    exec('sudo systemctl stop lirc', function(error, stdout, stderr) {
        if (error) {
            console.log(error);
            return;
        }
        console.log(stdout);
        console.log(stderr);
    });
}

function startLirc() {
    exec('sudo systemctl start lirc', function(error, stdout, stderr) {
        if (error) {
            console.log(error);
            return;
        }
        console.log(stdout);
        console.log(stderr);
    });
}

function addRemoteButtons(custom_name) {
    var exec = require('child_process').exec;
    var result;
    var remote;
    var counter = 0;
    exec('grep -oh \"KEY_\\w*\" remotes/custom/' + custom_name, function(err, out, code) {
        if (out.length > 1) {
            out = out.split("\n");
        } else {
            out = [''];
        }
        createRemote(out, custom_name);
    });

    exec('grep -oh \"BTN_\\w*\" remotes/custom/' + custom_name, function(err, out, code) {
        if (out.length > 1) {
            out = out.split("\n");
        } else {
            out = [''];
        }
        createRemote(out, custom_name);
    });

    function createRemote(out, custom_name) {
        var buttons = [];
        counter++;
        if (counter === 1) {
            result = out;
        }
        if (counter === 2) {
            result = result.concat(out);
            for (var i = 0; i < result.length; i++) {
                if (result[i] === '') {
                    result.splice(i, 1);
                    i--;
                } else {
                    buttons.push({
                        "button": result[i]
                    });
                }
            }
            result.unshift("WAIT");

            remote = {
                brand: "custom",
                model: "custom",
                custom_name: custom_name,
                buttons: buttons
            };
            counter = 0;
            addRemoteToJSON(remote);
        }
    }
}

function addRemoteToJSON(remote) {
    var remotes = JSON.parse(fs.readFileSync('user_files/added_remotes.json'));
    for (var i = 0; i < remotes.length; i++) {
        if (remotes.custom_name === remote.custom_name) {
            remotes.splice(i, 1);
        }
    }
    remotes.push(remote);
    var remotesJSON = JSON.stringify(remotes);
    fs.writeFileSync('user_files/added_remotes.json', remotesJSON);
}

function addRemoteToLIRC(custom_name) {
    var lineder = require("lineder");
    lineder("/etc/lirc/lircd.conf").find("include \"/home/pi/RICH/remotes/custom/" + custom_name + "\"", function(err, results) {
        if (results.length === 0) {
            fs.appendFile("/etc/lirc/lircd.conf", "include \"/home/pi/RICH/remotes/custom/" + custom_name + "\"\n");
        }
    });
}

exports.startRecording = function(req, res) {
    res.send(startIRRecord(req.query.custom_name));
};

exports.getRecordOutput = function(req, res) {
    res.send(getOutput());
};

exports.postRecordData = function(req, res) {
    //TODO Need to send the custom name paramter with this post request.
    irrecord.write(req.body.button);
    if (req.body.doneFlag === true) {
        startLirc();
        addRemoteToLIRC(req.body.custom_name);
        addRemoteButtons(req.body.custom_name);
        res.send("Remote successfully saved!");
    } else {
        res.send(getOutput());
    }
};

exports.getRemoteButtons = function(req, res) {
    var buttons = JSON.parse(fs.readFileSync('user_files/remote_buttons.json'));
    res.json(buttons);
};

exports.quitIRRecord = function(req, res) {
    irrecord.quit();
    startLirc();
    res.send("Success");
};
