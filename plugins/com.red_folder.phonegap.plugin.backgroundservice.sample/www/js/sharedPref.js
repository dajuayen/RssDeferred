var exec = require('cordova/exec');

function SharedPref() {
    console.log("SharedPrefPlugin.js: is created");
}

SharedPref.prototype.arkPref = function (action, key, str, callback) {
    var args = [key, str];
    exec(function (result) {
        callback(result);
    }, function (result) {
        alert("Error");
    }, "SharedPref", action, args);
};

var SharedPref = new SharedPref();
module.exports = SharedPref;