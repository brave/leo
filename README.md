# Leo - Brave's Design System

## Tokens

The tokens part of this package is supposed to be used together with the [Design Tokens plugin for Figma](https://github.com/lukasoppermann/design-tokens).
It transforms the exported design tokens using [Amazon style dictionary](https://amzn.github.io/style-dictionary/#/).
Destination formats for these tokens include CSS variables, Tailwind configuration, C++ (skia variables), Java and Swift.
The output files will be created at `/build` by running `npm run transform-tokens` which will also run upon install - regularly or when this package is used as a dependency.

## Components

For component creation see [components](src/components/README.md).

**Note:** components depend on the [css variables](#css) so make sure they're
available on your page somewhere.

### Web Components

Web Component wrappers are generated at build time and are available in the top
level `web-components` folder.

### React
React wrappers are generated at build time and are available in the top level
`react` folder.


## CSS

To get started with the CSS variables exported, you must have the contents of `build/css/variables.css` included in your html page. Perhaps directly through a `<link rel="stylesheet">` element, or indirectly through webpack's css-loader and `import '@brave/leo/build/css/variables.css'`.

### Typography

Individual typography variables are available but so are convenient combined font declarations:

```css
--typography-text-default-regular-font-size: 14px;
--typography-text-default-regular-letter-spacing: 0;
--typography-text-default-regular-line-height: 20px;
--typography-text-default-regular-paragraph-indent: 0;
--typography-text-default-regular-paragraph-spacing: 0;

--font-text-default-regular: 400 14px/20px Poppins;
```

### Colors

Any color in Brave's standard or extended palettes is available in a dark and light versions:

```css
--color-light-text-primary: rgb(29, 31, 37);
--color-dark-text-primary: rgb(236, 239, 242);
```

However, there are color variables which will select the light or dark version automatically:

```css
/* sometimes this */
--color-text-primary: rgb(29, 31, 37);

/* or this */
--color-text-primary: rgb(236, 239, 242);
```

The relevant light or dark version is selected by:

- The current global `@media (prefers-color-scheme: [value])` value
- The closest HTML ancestor with a `data-theme` attribute, e.g.

```html
<div class="footer" data-theme="dark">
  <p style="color: var(--color-text-primary);">I am always in dark mode</p>
</div>
```

All Web Components and css variables aim to use the color theme according to the nearest ancestor which defines an override using a `data-theme="[dark|light]" attribute

## Tailwind

A tailwind config, complete with plugin, is available at `@brave/leo/build/tailwind/index.js`. Once you configure this, all variables should be available using the `theme()` function.
