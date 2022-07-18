const filteredTokens = (dictionary, filterFn) => {
	let filtered = dictionary.allTokens;
	if (typeof filterFn === "function") {
		filtered = dictionary.allTokens.filter((token) => filterFn(token));
	}

	return {
		...dictionary,
		...{
			allProperties: filtered,
			allTokens: filtered,
		},
	};
};

module.exports = ({ dictionary, options, file }) => {
	const groupedColorTokens = new Map();
  const fontSizes = new Map();

	dictionary.allTokens.forEach(({ type, name, ...t }) => {
		if (type === "color") {
			if (t.attributes.subitem) {
				const colorGroup = groupedColorTokens.get(t.attributes.type);
				groupedColorTokens.set(t.attributes.type, {
					...colorGroup,
					[t.attributes.subitem]: `rgba(var(--${name
						.replace("-dark-mode", "")
						.replace("-light-mode", "")}), <alpha-value>)`,
				});
			} else {
				groupedColorTokens.set(
					t.attributes.type,
					`rgba(var(--${name.replace("-dark-mode", "").replace("-light-mode", "")}), <alpha-value>)`
				);
			}
		} else if (type === "custom-fontStyle") {
      const { fontSize, ...rest } = t.value;
      const fontName = `${t.attributes.item}-${t.attributes.subitem}`.replace("heading-", "");
      fontSizes.set(fontName, [
        fontSize, rest
      ])
    }
	});

	// Note: replace strips out 'light-mode' and 'dark-mode' inside media queries
	return `module.exports = ${JSON.stringify(
		{
			colors: Object.fromEntries(groupedColorTokens),
			primaryFont: ["Poppins", "Helvetica", "sans-serif"],
			fontSize: Object.fromEntries(fontSizes),
			spacing: {},
			width: {},
			borderRadius: {},
			borderWidth: {},
			fontWeight: {},
			boxShadow: {},
		},
		null,
		" ".repeat(2)
	)}`;
};
