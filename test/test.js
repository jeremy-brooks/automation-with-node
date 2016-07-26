var assert = require("chai").assert;
var fileSystem = require("fs-extra");
var moment = require("moment");
var path = require("path");
var rimraf = require("rimraf");
var automate = require("../src/automate");

describe("Pre-deployment steps", function () {

    var timestamp = "";
    var dateTimeFormat = "YYYYMMDDThh-mm-ss_SSS";
    var timestampPlaceHolder = "{timestamp}";
    var preDeploymentBaseDirectory = "sandbox/pre-deployment";
    var tomcatReleaseBackupUri = preDeploymentBaseDirectory + "/var/tmp/" + timestampPlaceHolder + "_tomcatReleaseBackup";

    before(function (done) {
        timestamp = moment().format(dateTimeFormat);
        fileSystem.mkdirs(preDeploymentBaseDirectory, function (error) {
            if (error) throw error;
            done();
        });
    });

    after(function (done) {
        var directoryToDelete = path.normalize(preDeploymentBaseDirectory);
        directoryToDelete = path.resolve(directoryToDelete);
        rimraf(directoryToDelete, function (error) {
            if (error) throw error;
            done();
        });
    });
    
    describe("Take a backup of each servlet container (e.g. Apache Tomcat)", function () {
        describe("Stop application servers individually", function () {
            it("Stop tomcat", function () {
               
            });
            it("Check if tomcat has stopped", function () {
               
            });
            it("Force stop tomcat", function () {
               
            });
        });
        describe("Take backup of all servlet containers state before release (e.g /{tomcat home})", function () {
            it("sudo mkdir -p /var/tmp/{YYYYMMDDTHH-MM-SS}_tomcatReleaseBackup", function (done) {
                automate.createFolder(tomcatReleaseBackupUri.replace(timestampPlaceHolder, timestamp), function (error) {
                    if (error) throw error;
                    fileSystem.access(tomcatReleaseBackupUri.replace(timestampPlaceHolder, timestamp), function (error) {
                        if (error) throw error;
                        done();
                    });
                });
            });
            it("sudo cp -rp /var/tomcat/server{#} /var/tmp/{YYYYMMDDTHH-MM-SS}_tomcatReleaseBackup/", function () {
               
            });
        });
        describe("Start all servlet containers (e.g. Apache Tomcat)", function () {
            it("/etc/init.d/tomcat{#} start", function () {
               
            });
            it("/etc/init.d/tomcat{#} status", function () {
               
            });
        });
    });

    describe("Prepare Apache Tomcat with the new release(s) so deploying them later is just a matter of copying the entire folder and starting Tomcat.", function () {
        describe("Create a copy of the backup so you can prepare the new release for later", function () {
            it("sudo mkdir -p /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}", function () {
               
            });
            it("sudo cp -rp /var/tmp/tomcatReleaseBackup_{YYYYMMDDTHH-MM-SS}/* /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/", function () {
               
            })
        });
        describe("Get ALL release candidates as detailed in release notes and put them onto the server ready for deployment", function () {
            it("sudo mkdir -p /var/tmp/releaseCandidates_{YYYYMMDDTHH-MM-SS}", function () {
               
            });
            it("cd /var/tmp/releaseCandidates_{YYYYMMDDTHH-MM-SS}", function () {
               
            });
            it("sudo wget --user={user} --password={password} http://{domain}/{releaseCandidateURI}", function () {
               
            });
        });
        describe("Delete any old application folders and war files from the servlet container", function () {
            describe("For example, if you are releasing a new version of map display, then remove its old expanded mom folder", function () {
                it("sudo rm -rf /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/{applicationName}", function () {
                   
                });
                it("sudo rm -rf /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/{applicationName}.war", function () {
                   
                });
            });
        });
        describe("Copy ALL new release candidates to the correct servlet container in your 'tomcatRelease' folder.", function () {
            describe("Refer to 'Additional technical details' table for which Apache tomcat instance to put specific applications into", function () {
                it("sudo cp -rp /var/tmp/releaseCandidates_{YYYYMMDDTHH-MM-SS}/{releaseCandidate}.war /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/", function () {
                   
                })
            });
        });
        describe("Rename new release candidates to appropriate application name (e.g. mom.war).", function () {
            describe("Refer to 'Additional technical details' for naming conventions.", function () {
                it("sudo mv /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/{releaseCandidate}.war /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/{applicationName}.war", function () {
                   
                });
            });
        });
        describe("Update properties/context files if required as per release notes", function () {
            describe("Manually update application properties files", function () {
                it("cd /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/shared/lib", function () {
                    // update or create properties files here
                   
                });
            });
            describe("Manually update application context files", function () {
                it("cd /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/conf", function () {
                    // update or create context files here
                   
                });
            });
            describe("Change permissions and ownership of any changed or created properties or context files", function () {
                it("sudo chmod 644 /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/shared/lib/{applicationName}.properties", function () {
                   
                });
                it("sudo chown tomcat.tomcat /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/shared/lib/{applicationName}.properties", function () {
                   
                });
            });
            describe("Modify permissions and ownership of new RC war", function () {
                it("sudo chmod 0664 /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/{applicationName}.war", function () {
                   
                });
                it("sudo chown tomcat.tomcat /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/{applicationName}.war", function () {
                   
                });
            });
            describe("Delete tomcat cached content", function () {
                it("sudo rm -rf /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/temp/*", function () {
                   
                });
                it("sudo rm -rf /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/work/Catalina/*", function () {
                   
                });
            });
        });
    });
});