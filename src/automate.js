var fileSystem = require("fs-extra");
var ncp = require("ncp").ncp;

exports.createFolder = function (folder, callback) {
    fileSystem.mkdirs(folder, callback);
};

exports.copy = function (source, destination, callback) {
    ncp(source, destination, callback);
};

exports.getReleaseCandidates = function (dummyReleaseCandidate, releaseCandidateDir, callback) {
    fileSystem.copy(dummyReleaseCandidate, releaseCandidateDir, callback);
};