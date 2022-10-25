const merge = require("lodash.merge");

const themes = ["light", "dark"];

const formatColorVar = (name, isStatic = true) => {
	name = isStatic ? name : name.replace("-dark-", "-").replace("-light-", "-");
	return `rgba(var(--tw-${name}), <alpha-value>)`;
};

/**
 * This function transforms tokens into a nested object
 * structure ready for Tailwind. The conditional statements
 * are largely to handle creating both static and dynamic
 * tokens. E.g. A given token needs three variants:
 * dynamic, static light, and static dark. This function gets
 * run twice: once to create all static tokens, and another
 * time to create the dynamic tokens which places values on
 * the parent (e.g. the root object, or 'legacy') and uses the
 * appropriate color variable.
 */
function createColorTokensFromGroup(tokens, staticTheme = true) {
	const colorTokens = {};
	tokens.forEach(({ type, name, ...t }) => {
		if (type === "color") {
			let colorGroup = colorTokens[t.attributes.type] ?? {};
			if (t.attributes.state) {
				console.log(t.attributes)
				if (!staticTheme) {
					colorTokens[t.attributes.item] = colorTokens[t.attributes.item] || {};
					const tokenGroup = colorTokens[t.attributes.item][t.attributes.subitem] ?? {};
					colorTokens[t.attributes.item][t.attributes.subitem] = merge(tokenGroup, {
						[t.attributes.state]: formatColorVar(name, staticTheme),
					});
				} else {
					const tokenGroup = colorGroup[t.attributes.item];
					colorGroup[t.attributes.item] = merge(tokenGroup, {
						[t.attributes.subitem]: formatColorVar(name, staticTheme),
					});
				}
			} else if (t.attributes.subitem) {
				if (themes.includes(t.attributes.type) && !staticTheme) {
					const tokenGroup = colorTokens[t.attributes.item] ?? {};
					colorTokens[t.attributes.item] = merge(tokenGroup, {
						[t.attributes.subitem]: formatColorVar(name, staticTheme),
					});
				} else if (themes.includes(t.attributes.item) && !staticTheme) {
					const tokenGroup = colorTokens[t.attributes.type] ?? {};
					colorTokens[t.attributes.type] = merge(tokenGroup, {
						[t.attributes.subitem]: formatColorVar(name, staticTheme),
					});
				} else {
					const tokenGroup = colorGroup[t.attributes.item];
					colorGroup[t.attributes.item] = merge(tokenGroup, {
						[t.attributes.subitem]: formatColorVar(name, staticTheme),
					});
				}
			} else if (t.attributes.item) {
				colorGroup[t.attributes.item] = formatColorVar(name, staticTheme);
			} else if (t.attributes.type) {
				colorGroup = formatColorVar(name, staticTheme);
			}
			colorTokens[t.attributes.type] = colorGroup;
		}
	});
	return colorTokens;
}

function createStaticColorTokens(tokens) {
	return createColorTokensFromGroup(tokens);
}

function createDynamicColorTokens(tokens) {
	return createColorTokensFromGroup(tokens, false);
}

module.exports = ({ dictionary }) => {
	const staticColorTokens = createStaticColorTokens(dictionary.allTokens);
	const dynamicColorTokens = createDynamicColorTokens(dictionary.allTokens);
	const colorTokens = merge(dynamicColorTokens, staticColorTokens);

	const fontSizes = new Map();
	const borderRadii = new Map();
	const gradients = new Map();
	const boxShadows = new Map();
	const dropShadows = new Map();

	// Format all other tokens
	dictionary.allTokens.forEach(({ type, name, ...t }) => {
		if (type === "custom-fontStyle") {
			const { fontSize, ...rest } = t.value;
			const fontName = `${t.attributes.item}-${t.attributes.subitem}`.replace("heading-", "");
			fontSizes.set(fontName, [fontSize, rest]);
		} else if (type === "custom-radius") {
			if (t.attributes.type === "full") {
				borderRadii.set(t.attributes.type, "9999px");
			} else {
				borderRadii.set(t.attributes.type, t.value);
			}
		} else if (type === "custom-gradient") {
			const [, ...pathParts] = t.path;
			gradients.set(pathParts.join("-"), t.value);
		} else if (type === "custom-shadow") {
			const [, ...pathParts] = t.path;
			boxShadows.set(pathParts.join("-").replace(" ", "-").replace("elevation-", ""), t.value.boxShadow);
			dropShadows.set(pathParts.join("-").replace(" ", "-").replace("elevation-", ""), t.value.dropShadow);
		}
	});

	// Note: replace strips out 'light-mode' and 'dark-mode' inside media queries
	return `module.exports = ${JSON.stringify(
		{
			colors: colorTokens,
			primaryFont: ["Poppins", "Helvetica", "sans-serif"],
			fontSize: Object.fromEntries(fontSizes),
			borderRadius: Object.fromEntries(borderRadii),
			boxShadow: Object.fromEntries(boxShadows),
			dropShadow: Object.fromEntries(dropShadows),
			gradients: Object.fromEntries(gradients),
		},
		null,
		" ".repeat(2)
	)}`;
};
