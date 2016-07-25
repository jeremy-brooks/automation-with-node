/**
 * Created by jbrooks on 08/07/2016.
 */
const fileSystem = require('fs');
var ncp = require("ncp").ncp;

var releaseBackupFolderNamePlaceholder = "{folderName}";
var releaseBackupLocation = "/var/tmp/tomcatReleaseBackup_" + releaseBackupFolderNamePlaceholder;
var tomcatBackupLocation = null;

exports.dateTimeFormat = "YYYYMMDDThh-mm-ss";
exports.getTomcatBackupLocation = function () {
    return tomcatBackupLocation;
};

/*Pre-deployment steps
 Take a backup of each servlet container (e.g. Apache Tomcat)
 Stop application servers individually making use of the load balancer to ensure minimal customer impact
 /*
 Stop tomcat.
 /etc/init.d/tomcat{#} stop
 Check status of tomcat to make sure it has stopped.
 /etc/init.d/tomcat{#} status
 If each tomcat instance has stopped successfully then move onto step 2, otherwise you may have to kill the tomcat process by id.
 /etc/init.d/tomcat{#} killtomcat
 */


/*
 Take backup of all servlet containers state before release (e.g /{tomcat home}).
 sudo mkdir -p /var/tmp/tomcatReleaseBackup_{YYYYMMDDTHH-MM-SS}
 */
exports.createTomcatBackupFolder = function (folderName, callBack, rootContext) {
    tomcatBackupLocation = "";
    if (typeof rootContext === "string" && rootContext.length > 0){
        tomcatBackupLocation = rootContext;
    }
    tomcatBackupLocation += releaseBackupLocation.replace(releaseBackupFolderNamePlaceholder, folderName);
    fileSystem.mkdir(tomcatBackupLocation, callBack);
};

 /*
 sudo cp -rp /var/tomcat/server{#} /var/tmp/tomcatReleaseBackup_{YYYYMMDDTHH-MM-SS}/
 */
exports.backupTomcatByServerNumber = function (serverNumber, callBack) {
    ncp("area/var/tomcat/server" + serverNumber, tomcatBackupLocation + "/server" + serverNumber, callBack);
};

/*
 Start all servlet containers (e.g. Apache Tomcat).
 /etc/init.d/tomcat{#} start
 Check that each servlet container has started
 /etc/init.d/tomcat{#} status
 */

/*Deployment steps*/

/*Rollback steps*/

