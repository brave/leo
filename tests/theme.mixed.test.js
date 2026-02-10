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
                --\\.component_background: white;
                --\\.component_color: black;
        }
}

  @container style(--leo-theme: dark) {

        :global(.component) {
                --\\.component_background: black;
                --\\.component_color: white;
        }
}

  :global(.component[data-theme="light"]) {
        --\\.component_background: white;
        --\\.component_color: black;
}

  :global(.component[data-theme="dark"]) {
        --\\.component_background: black;
        --\\.component_color: white;
}

  .component {
        padding: 12px;
        background: var(--\\.component_background);
        color: var(--\\.component_color);
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
            --\\.component_override-both: light;
            --\\.component_override-dark: light;
            --\\.component_new-dark: unset;
            --\\.component_override-light: light;
            --\\.component_new-light: light;
      }
}

    @container style(--leo-theme: dark) {

      :global(.component) {
            --\\.component_override-both: dark;
            --\\.component_override-dark: dark;
            --\\.component_new-dark: dark;
            --\\.component_override-light: dark;
            --\\.component_new-light: unset;
      }
}

    :global(.component[data-theme="light"]) {
      --\\.component_override-both: light;
      --\\.component_override-dark: light;
      --\\.component_new-dark: unset;
      --\\.component_override-light: light;
      --\\.component_new-light: light;
}

    :global(.component[data-theme="dark"]) {
      --\\.component_override-both: dark;
      --\\.component_override-dark: dark;
      --\\.component_new-dark: dark;
      --\\.component_override-light: dark;
      --\\.component_new-light: unset;
}

    .component {
      no-override: none;
      override-both: var(--\\.component_override-both);
      override-dark: var(--\\.component_override-dark);
      new-dark: var(--\\.component_new-dark);
      override-light: var(--\\.component_override-light);
      new-light: var(--\\.component_new-light);
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
            --\\.dark_color: unset;
            --\\.dark_dark: unset;
      }
}
@container style(--leo-theme: dark) {
      :global(.dark) {
            --\\.dark_color: white;
            --\\.dark_dark: dark;
      }
}
:global(.dark[data-theme="light"]) {
      --\\.dark_color: unset;
      --\\.dark_dark: unset;
}
:global(.dark[data-theme="dark"]) {
      --\\.dark_color: white;
      --\\.dark_dark: dark;
}
.dark {
      color: var(--\\.dark_color);
      dark: var(--\\.dark_dark);
}
@container style(--leo-theme: light) {
      :global(.light) {
            --\\.light_color: black;
            --\\.light_light: light;
      }
}
@container style(--leo-theme: dark) {
      :global(.light) {
            --\\.light_color: unset;
            --\\.light_light: unset;
      }
}
:global(.light[data-theme="light"]) {
      --\\.light_color: black;
      --\\.light_light: light;
}
:global(.light[data-theme="dark"]) {
      --\\.light_color: unset;
      --\\.light_light: unset;
}
.light {
      color: var(--\\.light_color);
      light: var(--\\.light_light);
}
@container style(--leo-theme: light) {
      :global(.other) {
            --\\.other_color: black;
            --\\.other_dark: unset;
            --\\.other_light: light;
      }
}
@container style(--leo-theme: dark) {
      :global(.other) {
            --\\.other_color: white;
            --\\.other_dark: dark;
            --\\.other_light: unset;
      }
}
:global(.other[data-theme="light"]) {
      --\\.other_color: black;
      --\\.other_dark: unset;
      --\\.other_light: light;
}
:global(.other[data-theme="dark"]) {
      --\\.other_color: white;
      --\\.other_dark: dark;
      --\\.other_light: unset;
}
@container style(--leo-theme: light) {
      :global(.component) {
            --\\.component_color: black;
            --\\.component_dark: unset;
            --\\.component_light: light;
      }
}
@container style(--leo-theme: dark) {
      :global(.component) {
            --\\.component_color: white;
            --\\.component_dark: dark;
            --\\.component_light: unset;
      }
}
:global(.component[data-theme="light"]) {
      --\\.component_color: black;
      --\\.component_dark: unset;
      --\\.component_light: light;
}
:global(.component[data-theme="dark"]) {
      --\\.component_color: white;
      --\\.component_dark: dark;
      --\\.component_light: unset;
}
.component {
      padding: 12px;
      color: var(--\\.component_color);
      dark: var(--\\.component_dark);
      light: var(--\\.component_light);
    }
.other {
      padding: 12px;
      color: var(--\\.other_color);
      dark: var(--\\.other_dark);
      light: var(--\\.other_light);
    }
.no-override {
      padding: 12px;
      color: red;
    }`,
    {}
  ))
