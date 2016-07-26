/**
 * Created by jbrooks on 25/07/2016.
 */
var run = require("../src/automate");
var moment = require("moment");
var path = require("path");
var rimraf = require("rimraf");

var releaseBackupFolderName = "";
var rootContextForTests = "area/";

function clearUpTestDirectory(directoryToDelete, callback){
    directoryToDelete = path.normalize(directoryToDelete);
    directoryToDelete = path.resolve(directoryToDelete);
    rimraf(directoryToDelete, callback);
}

describe("Run", function() {

    before(function (done) {
        clearUpTestDirectory(rootContextForTests + "var/tmp/*", function (error) {
            if (error) throw error;
            releaseBackupFolderName = moment().format(run.dateTimeFormat);
            run.setRootContext(rootContextForTests);
            done();
        });
    });

    after(function (done) {
        clearUpTestDirectory(rootContextForTests + "var/tmp/*", function (error) {
            if (error) throw error;
            done();
        });
    });

    describe("Prepare Apache Tomcat with the new release(s) so deploying them later is just a matter of copying the entire folder and starting Tomcat", function () {
        describe("Create a copy of the backup so you can prepare the new release for later", function () {
            it("completes without error", function (done) {
                run.createTomcatBackupFolder(releaseBackupFolderName, function (error) {
                    if (error) throw error;
                    run.backupTomcatByServerNumber("1", function (error) {
                        if (error) throw error;
                        run.backupTomcatByServerNumber("2", function (error) {
                            if (error) throw error;
                            run.createTomcatReleaseFolder(releaseBackupFolderName, function (error) {
                                if (error) throw error;
                                run.copyTomcatBackupIntoTomcatReleaseFolder(function (error) {
                                    if (error) throw error;
                                    run.createReleaseCandidateFolder(releaseBackupFolderName, function (error) {
                                        if (error) throw error;
                                        run.deleteOldApplicationFilesByServerNumberAndApplicationName("app", 1, function (error) {
                                            if (error) throw error;
                                            run.deleteOldApplicationFilesByServerNumberAndApplicationName("app.war", 1, function (error) {
                                                if (error) throw error;
                                                run.deleteOldApplicationFilesByServerNumberAndApplicationName("app", 2, function (error) {
                                                    if (error) throw error;
                                                    run.deleteOldApplicationFilesByServerNumberAndApplicationName("app.war", 2, function (error) {
                                                        if (error) throw error;
                                                        done();
                                                    })
                                                })
                                            })  
                                        })
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

    });
});