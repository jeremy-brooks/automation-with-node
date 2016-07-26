var fileSystem = require("fs-extra");

exports.createFolder = function (folder, callback) {
    fileSystem.mkdirs(folder, callback);
};

