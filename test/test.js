const assert = require("chai").assert;
const fileSystem = require("fs-extra");
const moment = require("moment");
const path = require("path");
const rimraf = require("rimraf");
const automate = require("../src/automate");

var timestamp = "";
var dateTimeFormat = "YYYYMMDDThh-mm-ss_SSS";
var timestampPlaceHolder = "{timestamp}";
var preDeploymentBaseDirectory = "sandbox/pre-deployment";
var testResourcesBaseDirectory = "resources/";
var tomcatReleaseBackupDir = preDeploymentBaseDirectory + "/var/tmp/" + timestampPlaceHolder + "_tomcatReleaseBackup";
var tomcatReleaseDir = preDeploymentBaseDirectory + "/var/tmp/" + timestampPlaceHolder + "_tomcatRelease";
var releaseCandidateDir = preDeploymentBaseDirectory + "/var/tmp/" + timestampPlaceHolder + "_releaseCandidates";
var dummyServletContainersDir = testResourcesBaseDirectory + "dummyServletContainers";
var dummyReleaseCandidateName = "dummyReleaseCandidate.war";
var dummyReleaseCandidate = testResourcesBaseDirectory + dummyReleaseCandidateName;

before(function (done) {
    timestamp = moment().format(dateTimeFormat);
    tomcatReleaseBackupDir = tomcatReleaseBackupDir.replace(timestampPlaceHolder, timestamp);
    tomcatReleaseDir = tomcatReleaseDir.replace(timestampPlaceHolder, timestamp);
    releaseCandidateDir = releaseCandidateDir.replace(timestampPlaceHolder, timestamp);
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
    tomcatReleaseBackupDir = tomcatReleaseBackupDir.replace(timestamp, timestampPlaceHolder);
    tomcatReleaseDir = tomcatReleaseDir.replace(timestamp, timestampPlaceHolder);
    releaseCandidateDir = releaseCandidateDir.replace(timestamp, timestampPlaceHolder);
});

describe("Pre-deployment steps", function () {

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
                automate.createFolder(tomcatReleaseBackupDir, function (error) {
                    assert.isNull(error);
                    fileSystem.access(tomcatReleaseBackupDir, function (error) {
                        assert.isNull(error);
                        done();
                    });
                });
            });
            it("sudo cp -rp /var/tomcat/server{#} /var/tmp/{YYYYMMDDTHH-MM-SS}_tomcatReleaseBackup/", function (done) {
                automate.copy(dummyServletContainersDir, tomcatReleaseBackupDir, function (error) {
                    assert.isNull(error);
                    fileSystem.access(tomcatReleaseBackupDir + "/server1", function (error) {
                        assert.isNull(error);
                        fileSystem.access(tomcatReleaseBackupDir + "/server2", function (error) {
                            assert.isNull(error);
                            done();
                        });
                    });
                });
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
            it("sudo mkdir -p /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}", function (done) {
                automate.createFolder(tomcatReleaseDir, function (error) {
                    assert.isNull(error);
                    fileSystem.access(tomcatReleaseDir, function (error) {
                        assert.isNull(error);
                        done();
                    });
                });
            });
            it("sudo cp -rp /var/tmp/tomcatReleaseBackup_{YYYYMMDDTHH-MM-SS}/* /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/", function (done) {
                automate.copy(tomcatReleaseBackupDir, tomcatReleaseDir, function (error) {
                    assert.isNull(error);
                    fileSystem.access(tomcatReleaseDir + "/server1", function (error) {
                        assert.isNull(error);
                        fileSystem.access(tomcatReleaseDir + "/server2", function (error) {
                            assert.isNull(error);
                            done();
                        });
                    });
                });
            })
        });
        describe("Get ALL release candidates as detailed in release notes and put them onto the server ready for deployment", function () {
            it("sudo mkdir -p /var/tmp/releaseCandidates_{YYYYMMDDTHH-MM-SS}", function (done) {
                automate.createFolder(releaseCandidateDir, function (error) {
                    assert.isNull(error);
                    fileSystem.access(releaseCandidateDir, function (error) {
                        assert.isNull(error);
                        done();
                    });
                });
            });
            it("cd /var/tmp/releaseCandidates_{YYYYMMDDTHH-MM-SS}", function () {
                // not doing this for now
            });
            it("sudo wget --user={user} --password={password} http://{domain}/{releaseCandidateURI}", function (done) {
                var expectedReleaseCandidateAfterGet = releaseCandidateDir + "/" + dummyReleaseCandidateName;
                automate.getReleaseCandidates(dummyReleaseCandidate, expectedReleaseCandidateAfterGet, function (error) {
                    assert.isNull(error);
                    fileSystem.access(expectedReleaseCandidateAfterGet, function (error) {
                        assert.isNull(error);
                        done();
                    });
                });
            });
        });
        describe("Delete any old application folders and war files from the servlet container", function () {
            describe("For example, if you are releasing a new version of an app, then remove its old expanded app folder", function () {
                it("sudo rm -rf /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/{applicationName}", function (done) {
                    automate.remove(tomcatReleaseDir + "/server1/webapps/app", function (error) {
                        assert.isNull(error);
                        automate.remove(tomcatReleaseDir + "/server2/webapps/app", function (error) {
                            assert.isNull(error);
                            fileSystem.access(tomcatReleaseDir + "/server1/webapps/app", function (error) {
                                assert.isNotNull(error);
                                fileSystem.access(tomcatReleaseDir + "/server2/webapps/app", function (error) {
                                    assert.isNotNull(error);
                                    done();
                                });
                            });
                        });
                    });
                });
                it("sudo rm -rf /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/{applicationName}.war", function (done) {
                    automate.remove(tomcatReleaseDir + "/server1/webapps/app.war", function (error) {
                        assert.isNull(error);
                        automate.remove(tomcatReleaseDir + "/server2/webapps/app.war", function (error) {
                            assert.isNull(error);
                            fileSystem.access(tomcatReleaseDir + "/server1/webapps/app.war", function (error) {
                                assert.isNotNull(error);
                                fileSystem.access(tomcatReleaseDir + "/server2/webapps/app.war", function (error) {
                                    assert.isNotNull(error);
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
        describe("Copy ALL new release candidates to the correct servlet container in your 'tomcatRelease' folder.", function () {
            describe("Refer to 'Additional technical details' table for which Apache tomcat instance to put specific applications into", function () {
                it("sudo cp -rp /var/tmp/releaseCandidates_{YYYYMMDDTHH-MM-SS}/{releaseCandidate}.war /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/", function (done) {
                    var releaseCandidateToCopy = releaseCandidateDir + "/" + dummyReleaseCandidateName;
                    var copiedReleaseCandidate = tomcatReleaseDir + "/server#/webapps/" + dummyReleaseCandidateName;
                    automate.copy(releaseCandidateToCopy, copiedReleaseCandidate.replace("server#", "server1"), function (error) {
                        assert.isNull(error);
                        automate.copy(releaseCandidateToCopy, copiedReleaseCandidate.replace("server#", "server2"), function (error) {
                            assert.isNull(error);
                            fileSystem.access(copiedReleaseCandidate.replace("server#", "server1"), function (error) {
                                assert.isNull(error);
                                fileSystem.access(copiedReleaseCandidate.replace("server#", "server2"), function (error) {
                                    assert.isNull(error);
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
        describe("Rename new release candidates to appropriate application name (e.g. mom.war).", function () {
            describe("Refer to 'Additional technical details' for naming conventions.", function () {
                it("sudo mv /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/{releaseCandidate}.war /var/tmp/tomcatRelease_{YYYYMMDDTHH-MM-SS}/server{#}/webapps/{applicationName}.war", function (done) {
                    var releaseCandidateToRename = tomcatReleaseDir + "/server#/webapps/" + dummyReleaseCandidateName;
                    var expectedNewName = "app.war";
                    var expectedRenamedReleaseCandidate = releaseCandidateToRename.replace(dummyReleaseCandidateName, expectedNewName);
                    automate.rename(releaseCandidateToRename.replace("server#", "server1"), expectedRenamedReleaseCandidate.replace("#", "1"), function (error) {
                        assert.isNull(error);
                        automate.rename(releaseCandidateToRename.replace("server#", "server2"), expectedRenamedReleaseCandidate.replace("#", "2"), function (error) {
                            assert.isNull(error);
                            fileSystem.access(expectedRenamedReleaseCandidate.replace("server#", "server1"), function (error) {
                                assert.isNull(error);
                                fileSystem.access(expectedRenamedReleaseCandidate.replace("server#", "server2"), function (error) {
                                    assert.isNull(error);
                                    done();
                                });
                            });
                        });
                    });
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