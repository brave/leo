const { readdirSync } = require("fs");
const { parse } = require("path");

const plugins = readdirSync(__dirname).filter((file) => {
	const { name } = parse(file);
	return name !== "index" && !name.startsWith("_");
});

module.exports = plugins.map((file) => {
	return require(`./${file}`);
});
