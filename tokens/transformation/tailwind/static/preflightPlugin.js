const plugin = require("tailwindcss/plugin");
const variables = require("./_variables.css.js");

module.exports = plugin(function ({ addBase }) {
	addBase({
        ...variables
    });
});
