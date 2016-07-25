/**
 * Created by jbrooks on 25/07/2016.
 */
var run = require("../src/run");
var assert = require("chai").assert;
var moment = require("moment");

var releaseBackupFolderName = "";

describe("Run", function() {
    describe("prepReleaseBackupFolder()", function () {

        before(function () {
            releaseBackupFolderName = moment().format(run.dateTimeFormat);
        });

        it("should create a folder without error", function (done) {
            run.prepReleaseBackupFolder(releaseBackupFolderName, function (error) {
                if (error) {
                    throw error;
                }
                done();
            });
        });
    });
});