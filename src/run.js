/**
 * Created by jbrooks on 08/07/2016.
 */
const fileSystem = require('fs');
var moment = require("moment");

exports.doRelease = function (/*root location to operate from*/ rootContext) {
    var dateTimeFormat = "YYYYMMDDThh-mm-ss";
    var releaseBackupLocation = rootContext + "/var/tmp/tomcatReleaseBackup_" + dateTimeFormat;

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
     sudo cp -rp /var/tomcat/server{#} /var/tmp/tomcatReleaseBackup_{YYYYMMDDTHH-MM-SS}/
     */
    var currentDateTime = moment().format(dateTimeFormat);
    fileSystem.mkdir(releaseBackupLocation.replace(dateTimeFormat, currentDateTime), function (error) {
        if (error){
            throw error;
        }
        console.info("created: " + releaseBackupLocation);
    });

    /*
     Start all servlet containers (e.g. Apache Tomcat).
     /etc/init.d/tomcat{#} start
     Check that each servlet container has started
     /etc/init.d/tomcat{#} status
     */

    /*Deployment steps*/

    /*Rollback steps*/
    
};