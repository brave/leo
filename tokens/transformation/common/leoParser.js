/**
 * Convert layers from multiple tokens to single token with array of values.
 * 
 * Figma exports named gradients (e.g. gradient-gradient-04) with
 * layered gradients as individual tokens (e.g. gradient-gradient-04-01, 
 * gradient-gradient-02, etc.). This parser converts those layers to an
 * array of values within the parent token (gradient-gradient-04).
 */

module.exports = {
	pattern: /\.json$/,
	parse: ({ filePath, contents }) => {
		contents = JSON.parse(contents);
		const categories = Object.entries(contents);
		for (const [category, categoryValue] of categories) {
			const types = Object.entries(categoryValue);

			for (const [type, typeValue] of types) {
				const items = Object.entries(typeValue);

				for (const [item, itemValue] of items) {
					if (["gradient", "elevation"].includes(type) && itemValue && !itemValue.type) {
						const subitems = Object.values(itemValue);
						contents[category][type][item] = {
							...subitems[0],
							extensions: itemValue.extensions,
						};

						contents[category][type][item].value = subitems.filter((v) => v && v.value).map((v) => v.value);
					}
				}
			}
		}
		return contents;
	},
};
