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

    describe("createTomcatBackupFolder()", function () {
        it("should create a folder without error", function (done) {
            try {
                run.createTomcatBackupFolder(releaseBackupFolderName, function () {
                    run.backupTomcatByServerNumber("1", function () {
                        run.backupTomcatByServerNumber("2", function () {
                            done();
                        });
                    });
                });
            } catch (error){
                throw error;
            }
        });
    });
});