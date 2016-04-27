cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.red_folder.phonegap.plugin.backgroundservice/www/backgroundService.js",
        "id": "com.red_folder.phonegap.plugin.backgroundservice.BackgroundService"
    },
    {
        "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
        "id": "cordova-sqlite-storage.SQLitePlugin",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/com.red_folder.phonegap.plugin.backgroundservice.sample/www/js/myService.js",
        "id": "com.red_folder.phonegap.plugin.backgroundservice.sample.MyService",
        "clobbers": [
            "cordova.plugins.myService"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "com.red_folder.phonegap.plugin.backgroundservice": "2.0.0",
    "cordova-sqlite-storage": "1.2.2",
    "cordova-plugin-splashscreen": "4.0.0",
    "com.red_folder.phonegap.plugin.backgroundservice.sample": "4.0.0",
    "cordova-plugin-android-support-v4": "21.0.1"
};
// BOTTOM OF METADATA
});