const plugin = require("tailwindcss/plugin");
const variables = require("./_variables.css.js");
const fonts = require("./fonts.js");

module.exports = plugin(function ({ addBase }) {
	addBase({
        ...fonts,
        ...variables
    });
});
