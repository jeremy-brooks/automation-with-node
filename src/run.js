/**
 * Created by jbrooks on 08/07/2016.
 */
const fileSystem = require('fs');
var copy = require("ncp").ncp;
var rimraf = require("rimraf");

var releaseBackupFolderNamePlaceholder = "{folderName}";
var releaseBackupLocation = "var/tmp/" + releaseBackupFolderNamePlaceholder + "_tomcatReleaseBackup";
var tomcatReleaseLocation = "var/tmp/" + releaseBackupFolderNamePlaceholder + "_tomcatRelease";
var releaseCandidateLocationBase = "/var/tmp/" + releaseBackupFolderNamePlaceholder + "_releaseCandidates";
var tomcatBackupLocation = null;
var releaseCandidateLocation = null;
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
exports.createReleaseCandidateFolder = function (folderName, callback) {
    releaseCandidateLocation = rootContext + releaseCandidateLocationBase.replace(releaseBackupFolderNamePlaceholder, folderName);
    fileSystem.mkdir(releaseCandidateLocation, callback);
};

/*
 Delete any old application folders and war files from the servlet container
 For example, if you are releasing a new version of map display, then remove its old expanded mom folder:
 sudo rm -rf /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/{applicationName}
 sudo rm -rf /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/{applicationName}.war
 */
exports.deleteOldApplicationFilesByServerNumberAndApplicationName = function (applicationName, serverNumber, callback) {
    var locationToClearOut = tomcatReleaseLocation + "/server" + serverNumber + "/" + applicationName;
    rimraf(locationToClearOut, callback);
};

/*Deployment steps*/

/*Rollback steps*/

