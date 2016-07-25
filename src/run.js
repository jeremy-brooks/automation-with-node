/**
 * Created by jbrooks on 08/07/2016.
 */
const fileSystem = require('fs');
var copy = require("ncp").ncp;

var releaseBackupFolderNamePlaceholder = "{folderName}";
var releaseBackupLocation = "var/tmp/tomcatReleaseBackup_" + releaseBackupFolderNamePlaceholder;
var tomcatReleaseLocation = "var/tmp/tomcatRelease_" + releaseBackupFolderNamePlaceholder;
var tomcatBackupLocation = null;
var tomcatLocation = "var/tomcat";
var rootContext = "/";

exports.dateTimeFormat = "YYYYMMDDThh-mm-ss_SSS";
exports.setRootContext = function (value) {
    if (typeof value === "string" && value.length > 0){
        rootContext = value;
    }
};

/*
 Take backup of all servlet containers state before release (e.g /{tomcat home}).
 sudo mkdir -p /var/tmp/tomcatReleaseBackup_{YYYYMMDDTHH-MM-SS}
 */
exports.createTomcatBackupFolder = function (folderName, callBack) {
    tomcatBackupLocation = rootContext + releaseBackupLocation.replace(releaseBackupFolderNamePlaceholder, folderName);
    fileSystem.mkdir(tomcatBackupLocation, callBack);
};

 /*
 sudo cp -rp /var/tomcat/server{#} /var/tmp/tomcatReleaseBackup_{YYYYMMDDTHH-MM-SS}/
 */
exports.backupTomcatByServerNumber = function (serverNumber, callBack) {
    var source = rootContext + tomcatLocation + "/server" + serverNumber;
    var destination = tomcatBackupLocation + "/server" + serverNumber;
    copy(source, destination, callBack);
};

/*
Prepare Apache Tomcat with the new release(s) so deploying them later is just a matter of copying the entire folder and starting Tomcat.
    Create a copy of the backup so you can prepare the new release for later
    sudo mkdir -p /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}
    sudo cp -rp /var/tmp/tomcatReleaseBackup_{YYYYMMDDTHH-MM-SS}/* /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/
*/
exports.createTomcatReleaseFolder = function (folderName, callBack) {
    tomcatReleaseLocation = rootContext + tomcatReleaseLocation.replace(releaseBackupFolderNamePlaceholder, folderName);
    fileSystem.mkdir(tomcatReleaseLocation, callBack);
};

/*Deployment steps*/

/*Rollback steps*/

