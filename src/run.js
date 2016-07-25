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
exports.createTomcatBackupFolder = function (folderName, callback) {
    tomcatBackupLocation = rootContext + releaseBackupLocation.replace(releaseBackupFolderNamePlaceholder, folderName);
    fileSystem.mkdir(tomcatBackupLocation, callback);
};

 /*
 sudo cp -rp /var/tomcat/server{#} /var/tmp/tomcatReleaseBackup_{YYYYMMDDTHH-MM-SS}/
 */
exports.backupTomcatByServerNumber = function (serverNumber, callback) {
    var source = rootContext + tomcatLocation + "/server" + serverNumber;
    var destination = tomcatBackupLocation + "/server" + serverNumber;
    copy(source, destination, callback);
};

/*
Prepare Apache Tomcat with the new release(s) so deploying them later is just a matter of copying the entire folder and starting Tomcat.
    Create a copy of the backup so you can prepare the new release for later
    sudo mkdir -p /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}
    sudo cp -rp /var/tmp/tomcatReleaseBackup_{YYYYMMDDTHH-MM-SS}/* /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/
*/
exports.createTomcatReleaseFolder = function (folderName, callback) {
    tomcatReleaseLocation = rootContext + tomcatReleaseLocation.replace(releaseBackupFolderNamePlaceholder, folderName);
    fileSystem.mkdir(tomcatReleaseLocation, callback);
};

exports.copyTomcatBackupIntoTomcatReleaseFolder = function (callback) {
    copy(tomcatBackupLocation, tomcatReleaseLocation, callback);
};

/*
 Get ALL release candidates as detailed in release notes and put them onto the server ready for deployment
 sudo mkdir -p /var/tmp/releaseCandidates_{YYYYMMDDTHH-MM-SS}
 cd /var/tmp/releaseCandidates_{YYYYMMDDTHH-MM-SS}
 sudo wget --user={user} --password={password} http://{domain}/{releaseCandidateURI}
 */


/*Deployment steps*/

/*Rollback steps*/

