const { join } = require("path");
const { readdirSync, copyFileSync, unlink } = require("fs");

const staticFilesPath = join(__dirname, "./static");
const staticFiles = readdirSync(staticFilesPath);

module.exports = {
    do: function (dictionary, config) {
        staticFiles.forEach(file => {
            const source = join(staticFilesPath, file);
            const target = join(config.buildPath, file);

            copyFileSync(source, target);
        })
    },
    undo: function (dictionary, config) {
        staticFiles.forEach(file => {
            const target = join(config.buildPath, file);

            unlink(target);
        })
    }
}