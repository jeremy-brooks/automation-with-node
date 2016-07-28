var fileSystem = require("fs-extra");
var ncp = require("ncp");

exports.createFolder = function (folder, callback) {
    fileSystem.mkdirs(folder, callback);
};

exports.copy = function (source, destination, callback) {
    ncp(source, destination, callback);
};

exports.getReleaseCandidates = function (dummyReleaseCandidate, releaseCandidateDir, callback) {
    ncp(dummyReleaseCandidate, releaseCandidateDir, callback);
};

exports.deleteOldRelease = function (releaseToDelete, callback) {
    fileSystem.remove(releaseToDelete, callback);
};

exports.rename = function (file, renamedFile, callback) {
    fileSystem.move(file, renamedFile, callback);
};