/**
 * Created by jbrooks on 25/07/2016.
 */
var run = require("../src/run");
var assert = require("chai").assert;
var moment = require("moment");

var releaseBackupFolderName = "";
var rootContextForTests = "area/";

describe("Run", function() {

    before(function () {
        releaseBackupFolderName = moment().format(run.dateTimeFormat);
        run.setRootContext(rootContextForTests);
    });

    describe("Take a backup of each servlet container", function () {
        it("should backup each erver without error", function (done) {
            run.createTomcatBackupFolder(releaseBackupFolderName, function (error) {
                if (error) throw error;
                run.backupTomcatByServerNumber("1", function (error) {
                    if (error) throw error;
                    run.backupTomcatByServerNumber("2", function (error) {
                        if (error) throw error;
                        done();
                    });
                });
            });
        });
    });

    describe("Prepare Apache Tomcat with the new release(s) so deploying them later is just a matter of copying the entire folder and starting Tomcat", function () {

        before(function () {
            releaseBackupFolderName = moment().format(run.dateTimeFormat);
        });

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
                                done();
                            })
                        });
                    });
                });
            });
        })

    });
});