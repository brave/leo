module.exports = {
  source: ["tokens/*.json"],
  parsers: [{
    pattern: /\.json$/,
    parse: ({ filePath, contents, ...rest }) => {
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
                extensions: itemValue.extensions
              };

              contents[category][type][item].value = subitems.filter(v => v && v.value).map(v => v.value);
            }
          }
        }
      }
      return contents;
    }
  }],
  platforms: {
    tailwind: {
      transformGroup: "tailwind/css",
      buildPath: "build/tailwind/",
      files: [
        {
          destination: "_variables.css",
          format: "tailwind/css",
          filter: "filterWeb",
          options: {
            showFileHeader: false,
            prefix: `tw`
          },
        },
        {
          destination: "tokens.js",
          format: "tailwind/tokens",
          filter: "filterWeb",
          options: {
            showFileHeader: false,
          },
        },
      ],
      actions: [
        "tailwind/copy_static_files",
        "tailwind/convert_css_to_js"
      ]
    },
    css: {
      transformGroup: "custom/css",
      buildPath: "build/css/",
      files: [
        {
          destination: "variables.css",
          format: "custom/css",
          filter: "filterWeb",
          options: {
            showFileHeader: true,
          },
        },
      ],
    },
    "json-flat": {
      transformGroup: "js",
      buildPath: "build/json/",
      files: [
        {
          destination: "styles.json",
          format: "json/flat",
        },
      ],
    },
    ios: {
      transformGroup: "ios",
      buildPath: "build/ios/",
      files: [
        {
          destination: "StyleDictionaryColor.h",
          format: "ios/colors.h",
          className: "StyleDictionaryColor",
          type: "StyleDictionaryColorName",
          filter: {
            type: "color",
          },
        },
        {
          destination: "StyleDictionaryColor.m",
          format: "ios/colors.m",
          className: "StyleDictionaryColor",
          type: "StyleDictionaryColorName",
          filter: {
            type: "color",
          },
        },
        {
          destination: "StyleDictionarySize.h",
          format: "ios/static.h",
          className: "StyleDictionarySize",
          type: "float",
          filter: {
            type: "number",
          },
        },
        {
          destination: "StyleDictionarySize.m",
          format: "ios/static.m",
          className: "StyleDictionarySize",
          type: "float",
          filter: {
            type: "number",
          },
        },
      ],
    },
    "ios-swift": {
      transformGroup: "ios-swift",
      buildPath: "build/ios-swift/",
      files: [
        {
          destination: "StyleDictionary.swift",
          format: "ios-swift/class.swift",
          className: "StyleDictionary",
          filter: {},
        },
      ],
    },
    "ios-swift-separate-enums": {
      transformGroup: "ios-swift-separate",
      buildPath: "build/ios-swift/",
      files: [
        {
          destination: "StyleDictionaryColor.swift",
          format: "ios-swift/enum.swift",
          className: "StyleDictionaryColor",
          filter: {
            type: "color",
          },
        },
        {
          destination: "StyleDictionarySize.swift",
          format: "ios-swift/enum.swift",
          className: "StyleDictionarySize",
          type: "float",
          filter: {
            type: "number",
          },
        },
      ],
    },
  },
};
