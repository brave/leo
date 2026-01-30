const { run } = require('./theme.common')

it('Can mix theme overrides', () =>
  run(
    `.component {
        padding: 12px;
        color: white;
        background: white;
  }

  @theme (light) {
    .component {
      color: black;
    }
  }

  @theme (dark) {
    .component {
        background: black;
    }
  }`,
    `@container style(--leo-theme: light) {
    :global(.component) {
      background: white;
      color: black;
    }
  }

  @container style(--leo-theme: dark) {
    :global(.component) {
      background: black;
      color: white;
    }
  }

  :global(.component[data-theme="light"]) {
    background: white;
    color: black;
  }

  :global(.component[data-theme="dark"]) {
    background: black;
    color: white;
  }

  .component {
    padding: 12px;
  }`,
    {}
  ))

it('Light & Dark mode can be specified for a property', () =>
  run(
    `.component {
      no-override: none;
      override-both: both;
      override-light: dark;
      override-dark: light;
    }

    @theme (light) {
      .component {
        override-both: light;
        override-light: light;
        new-light: light;
      }
    }

    @theme (dark) {
    .component {
      override-both: dark;
      override-dark: dark;
      new-dark: dark;
    }
    }`,
    `@container style(--leo-theme: light) {
      :global(.component) {
        override-both: light;
        override-dark: light;
        new-dark: unset;
        override-light: light;
        new-light: light;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        override-both: dark;
        override-dark: dark;
        new-dark: dark;
        override-light: dark;
        new-light: unset;
      }
    }

    :global(.component[data-theme="light"]) {
      override-both: light;
      override-dark: light;
      new-dark: unset;
      override-light: light;
      new-light: light;
    }

    :global(.component[data-theme="dark"]) {
      override-both: dark;
      override-dark: dark;
      new-dark: dark;
      override-light: dark;
      new-light: unset;
    }

    .component {
      no-override: none;
    }`,
    {}
  ))

it('Light & Dark mode work with weird class overlaps', () =>
  run(
    `.component, .other, .no-override {
      padding: 12px;
      color: red;
    }

    @theme (light) {
      .component, .other, .light {
        color: black;
        light: light;
      }
    }

    @theme (dark) {
    .component, .other, .dark {
      color: white;
      dark: dark;
    }
    }`,
    `@container style(--leo-theme: light) {
      :global(.dark) {
        color: unset;
        dark: unset;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.dark) {
        color: white;
        dark: dark;
      }
    }

    :global(.dark[data-theme="light"]) {
      color: unset;
      dark: unset;
    }

    :global(.dark[data-theme="dark"]) {
      color: white;
      dark: dark;
    }

    @container style(--leo-theme: light) {
      :global(.light) {
        color: black;
        light: light;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.light) {
        color: unset;
        light: unset;
      }
    }

    :global(.light[data-theme="light"]) {
      color: black;
      light: light;
    }

    :global(.light[data-theme="dark"]) {
      color: unset;
      light: unset;
    }

    @container style(--leo-theme: light) {
      :global(.other) {
        color: black;
        dark: unset;
        light: light;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.other) {
        color: white;
        dark: dark;
        light: unset;
      }
    }

    :global(.other[data-theme="light"]) {
      color: black;
      dark: unset;
      light: light;
    }

    :global(.other[data-theme="dark"]) {
      color: white;
      dark: dark;
      light: unset;
    }

    @container style(--leo-theme: light) {
      :global(.component) {
        color: black;
        dark: unset;
        light: light;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        color: white;
        dark: dark;
        light: unset;
      }
    }

    :global(.component[data-theme="light"]) {
      color: black;
      dark: unset;
      light: light;
    }

    :global(.component[data-theme="dark"]) {
      color: white;
      dark: dark;
      light: unset;
    }

    .component {
      padding: 12px;
    }

    .other {
      padding: 12px;
    }

    .no-override {
      padding: 12px;
      color: red;
    }`,
    {}
  ))
