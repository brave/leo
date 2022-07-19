const { join } = require("path");
const { unlink, readFileSync, writeFileSync } = require("fs");
const postcssJs = require("postcss-js");
const postcss = require("postcss");

const cssFiles = [
    "_variables.css"
];

module.exports = {
    do: function (dictionary, config) {
        cssFiles.forEach(file => {
            const css = readFileSync(join(config.buildPath, file), "utf8");
            const root = postcss.parse(css);
            const cssAsJs = postcssJs.objectify(root);

            writeFileSync(join(config.buildPath, `${file}.js`), `module.exports = ${JSON.stringify(cssAsJs, null, 2)}`)
        })
    },
    undo: function (dictionary, config) {
        cssFiles.forEach(file => {
            unlink(join(config.buildPath, `${file}.js`));
        })
    }
}