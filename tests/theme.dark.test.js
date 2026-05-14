const { run } = require('./theme.common')

/* Write tests here */

it('Converts the base case', async () => {
  await run(
    `.component {
    padding: 12px;
    background: pink;
    display: flex;
    flex-direction: row;
  }

  @theme (dark) {
    .component {
      background: red;
      flex-direction: column;
    }
  }`,
    `:global(:root) {
        --\\.component_background: pink;
        --\\.component_flex-direction: row;
}

  @media (prefers-color-scheme: dark) {

        :global(.component) {
                --\\.component_background: red;
                --\\.component_flex-direction: column;
        }
}

  :global([data-theme="light"]) {
        --\\.component_background: pink;
        --\\.component_flex-direction: row;
}

  :global([data-theme="dark"]) {
        --\\.component_background: red;
        --\\.component_flex-direction: column;
}

  @container style(--leo-theme: light) {

        :global(.component) {
                --\\.component_background: pink;
                --\\.component_flex-direction: row;
        }
}

  @container style(--leo-theme: dark) {

        :global(.component) {
                --\\.component_background: red;
                --\\.component_flex-direction: column;
        }
}

  .component {
    padding: 12px;
    display: flex;
    background: var(--\\.component_background);
    flex-direction: var(--\\.component_flex-direction);
  }`,
    {}
  )
})

it('Selectors can be overridden', async () => {
  await run(
    `.component {
    padding: 12px;
    background: pink;
    display: flex;
    flex-direction: row;
  }

  @theme (dark) {
    .component {
      background: red;
      flex-direction: column;
    }
  }`,
    `:global(:root) {
        --\\.component_background: pink;
        --\\.component_flex-direction: row;
}

  @media (prefers-color-scheme: dark) {

        :global(.component) {
                --\\.component_background: red;
                --\\.component_flex-direction: column;
        }
}

  :global([data-theme="light"]) {
        --\\.component_background: pink;
        --\\.component_flex-direction: row;
}

  :global([data-theme="dark"]) {
        --\\.component_background: red;
        --\\.component_flex-direction: column;
}

  @container style(--leo-theme: light) {

        :global(.component) {
                --\\.component_background: pink;
                --\\.component_flex-direction: row;
        }
}

  @container style(--leo-theme: dark) {

        :global(.component) {
                --\\.component_background: red;
                --\\.component_flex-direction: column;
        }
}

  .component {
    padding: 12px;
    display: flex;
    background: var(--\\.component_background);
    flex-direction: var(--\\.component_flex-direction);
  }`,
    {}
  )
})

it('Handles no dark mode', async () => {
  await run(
    `
  .component {
    background: red;
    color: white;
  }`,
    `.component {
    background: red;
    color: white;
  }`,
    {}
  )
})

it('Handles no light mode', async () => {
  await run(
    `
  @theme (dark) {
    .component {
      background: red;
      color: white;
    }
  }`,
    `:global(:root) {
    --\\.component_background: unset;
    --\\.component_color: unset
}

@media (prefers-color-scheme: dark) {

    :global(.component) {
        --\\.component_background: red;
        --\\.component_color: white
    }
}

:global([data-theme="light"]) {
    --\\.component_background: unset;
    --\\.component_color: unset
}

:global([data-theme="dark"]) {
    --\\.component_background: red;
    --\\.component_color: white
}

@container style(--leo-theme: light) {

    :global(.component) {
        --\\.component_background: unset;
        --\\.component_color: unset
    }
}

@container style(--leo-theme: dark) {

    :global(.component) {
        --\\.component_background: red;
        --\\.component_color: white
    }
}

.component {
    background: var(--\\.component_background);
    color: var(--\\.component_color)
}`,
    {}
  )
})

it('Converts darkmode only properties', async () => {
  await run(
    `.component {
    background: pink;
  }

  @theme (dark) {
    .component {
      background: red;
      color: white;
    }
  }`,
    `:global(:root) {
        --\\.component_background: pink;
        --\\.component_color: unset;
}

  @media (prefers-color-scheme: dark) {

        :global(.component) {
                --\\.component_background: red;
                --\\.component_color: white;
        }
}

  :global([data-theme="light"]) {
        --\\.component_background: pink;
        --\\.component_color: unset;
}

  :global([data-theme="dark"]) {
        --\\.component_background: red;
        --\\.component_color: white;
}

  @container style(--leo-theme: light) {

        :global(.component) {
                --\\.component_background: pink;
                --\\.component_color: unset;
        }
}

  @container style(--leo-theme: dark) {

        :global(.component) {
                --\\.component_background: red;
                --\\.component_color: white;
        }
}

  .component {
    background: var(--\\.component_background);
    color: var(--\\.component_color);
  }`,
    {}
  )
})

it('Converts nested selectors', async () => {
  await run(
    `
    .component .foo {
      background: pink;
    }

    @theme (dark) {
      .component .foo {
        background: red;
      }
    }`,
    `:global(:root) {
      --\\.component_\\.foo_background: pink;
}

    @media (prefers-color-scheme: dark) {

      :global(.component .foo) {
            --\\.component_\\.foo_background: red;
      }
}

    :global([data-theme="light"]) {
      --\\.component_\\.foo_background: pink;
}

    :global([data-theme="dark"]) {
      --\\.component_\\.foo_background: red;
}

    @container style(--leo-theme: light) {

      :global(.component .foo) {
            --\\.component_\\.foo_background: pink;
      }
}

    @container style(--leo-theme: dark) {

      :global(.component .foo) {
            --\\.component_\\.foo_background: red;
      }
}

    .component .foo {
      background: var(--\\.component_\\.foo_background);
    }`
  )
})

it('Converts sibling selectors', async () => {
  await run(
    `
    .component + .foo {
      background: pink;
    }

    @theme (dark) {
      .component + .foo {
        background: red;
      }
    }`,
    `:global(:root) {
      --\\.component_\\+_\\.foo_background: pink;
}

    @media (prefers-color-scheme: dark) {

      :global(.component + .foo) {
            --\\.component_\\+_\\.foo_background: red;
      }
}

    :global([data-theme="light"]) {
      --\\.component_\\+_\\.foo_background: pink;
}

    :global([data-theme="dark"]) {
      --\\.component_\\+_\\.foo_background: red;
}

    @container style(--leo-theme: light) {

      :global(.component + .foo) {
            --\\.component_\\+_\\.foo_background: pink;
      }
}

    @container style(--leo-theme: dark) {

      :global(.component + .foo) {
            --\\.component_\\+_\\.foo_background: red;
      }
}

    .component + .foo {
      background: var(--\\.component_\\+_\\.foo_background);
    }`
  )
})

it('Converts child selectors', async () => {
  await run(
    `
    .component > .foo {
      background: pink;
    }

    @theme (dark) {
      .component > .foo {
        background: red;
      }
    }`,
    `:global(:root) {
      --\\.component_\\>_\\.foo_background: pink;
}

    @media (prefers-color-scheme: dark) {

      :global(.component > .foo) {
            --\\.component_\\>_\\.foo_background: red;
      }
}

    :global([data-theme="light"]) {
      --\\.component_\\>_\\.foo_background: pink;
}

    :global([data-theme="dark"]) {
      --\\.component_\\>_\\.foo_background: red;
}

    @container style(--leo-theme: light) {

      :global(.component > .foo) {
            --\\.component_\\>_\\.foo_background: pink;
      }
}

    @container style(--leo-theme: dark) {

      :global(.component > .foo) {
            --\\.component_\\>_\\.foo_background: red;
      }
}

    .component > .foo {
      background: var(--\\.component_\\>_\\.foo_background);
    }`
  )
})

it('Converts general sibling selectors', async () => {
  await run(
    `
    .component ~ .foo {
      background: pink;
    }

    @theme (dark) {
      .component ~ .foo {
        background: red;
      }
    }`,
    `:global(:root) {
      --\\.component_\\~_\\.foo_background: pink;
}

    @media (prefers-color-scheme: dark) {

      :global(.component ~ .foo) {
            --\\.component_\\~_\\.foo_background: red;
      }
}

    :global([data-theme="light"]) {
      --\\.component_\\~_\\.foo_background: pink;
}

    :global([data-theme="dark"]) {
      --\\.component_\\~_\\.foo_background: red;
}

    @container style(--leo-theme: light) {

      :global(.component ~ .foo) {
            --\\.component_\\~_\\.foo_background: pink;
      }
}

    @container style(--leo-theme: dark) {

      :global(.component ~ .foo) {
            --\\.component_\\~_\\.foo_background: red;
      }
}

    .component ~ .foo {
      background: var(--\\.component_\\~_\\.foo_background);
    }`
  )
})

it('Converts multi selectors (light and dark same)', async () => {
  await run(
    `
    .component, .foo {
      background: pink;
    }

    @theme (dark) {
      .component, .foo {
        background: red;
      }
    }`,
    `:global(:root) {
      --\\.component_background: pink;
}
@media (prefers-color-scheme: dark) {
      :global(.component) {
            --\\.component_background: red;
      }
}
:global([data-theme="light"]) {
      --\\.component_background: pink;
}
:global([data-theme="dark"]) {
      --\\.component_background: red;
}
@container style(--leo-theme: light) {
      :global(.component) {
            --\\.component_background: pink;
      }
}
@container style(--leo-theme: dark) {
      :global(.component) {
            --\\.component_background: red;
      }
}
:global(:root) {
      --\\.foo_background: pink;
}
@media (prefers-color-scheme: dark) {
      :global(.foo) {
            --\\.foo_background: red;
      }
}
:global([data-theme="light"]) {
      --\\.foo_background: pink;
}
:global([data-theme="dark"]) {
      --\\.foo_background: red;
}
@container style(--leo-theme: light) {
      :global(.foo) {
            --\\.foo_background: pink;
      }
}
@container style(--leo-theme: dark) {
      :global(.foo) {
            --\\.foo_background: red;
      }
}
.component {
      background: var(--\\.component_background);
    }
.foo {
      background: var(--\\.foo_background);
    }`
  )
})

it('Converts multi selectors (light and dark same, with remainder)', async () => {
  await run(
    `
    .component, .foo {
      padding: 12px;
      background: pink;
    }

    @theme (dark) {
      .component, .foo {
        background: red;
      }
    }`,
    `:global(:root) {
      --\\.component_background: pink;
}
@media (prefers-color-scheme: dark) {
      :global(.component) {
            --\\.component_background: red;
      }
}
:global([data-theme="light"]) {
      --\\.component_background: pink;
}
:global([data-theme="dark"]) {
      --\\.component_background: red;
}
@container style(--leo-theme: light) {
      :global(.component) {
            --\\.component_background: pink;
      }
}
@container style(--leo-theme: dark) {
      :global(.component) {
            --\\.component_background: red;
      }
}
:global(:root) {
      --\\.foo_background: pink;
}
@media (prefers-color-scheme: dark) {
      :global(.foo) {
            --\\.foo_background: red;
      }
}
:global([data-theme="light"]) {
      --\\.foo_background: pink;
}
:global([data-theme="dark"]) {
      --\\.foo_background: red;
}
@container style(--leo-theme: light) {
      :global(.foo) {
            --\\.foo_background: pink;
      }
}
@container style(--leo-theme: dark) {
      :global(.foo) {
            --\\.foo_background: red;
      }
}
.component {
      padding: 12px;
      background: var(--\\.component_background);
    }
.foo {
      padding: 12px;
      background: var(--\\.foo_background);
    }`
  )
})

it('Converts multi selectors (light subset of dark)', async () => {
  await run(
    `
    .component {
      background: pink;
    }

    @theme (dark) {
      .component, .foo {
        background: red;
      }
    }`,
    `:global(:root) {
      --\\.component_background: pink;
}

    @media (prefers-color-scheme: dark) {

      :global(.component) {
            --\\.component_background: red;
      }
}

    :global([data-theme="light"]) {
      --\\.component_background: pink;
}

    :global([data-theme="dark"]) {
      --\\.component_background: red;
}

    @container style(--leo-theme: light) {

      :global(.component) {
            --\\.component_background: pink;
      }
}

    @container style(--leo-theme: dark) {

      :global(.component) {
            --\\.component_background: red;
      }
}

    :global(:root) {
      --\\.foo_background: unset;
}

    @media (prefers-color-scheme: dark) {

      :global(.foo) {
            --\\.foo_background: red;
      }
}

    :global([data-theme="light"]) {
      --\\.foo_background: unset;
}

    :global([data-theme="dark"]) {
      --\\.foo_background: red;
}

    @container style(--leo-theme: light) {

      :global(.foo) {
            --\\.foo_background: unset;
      }
}

    @container style(--leo-theme: dark) {

      :global(.foo) {
            --\\.foo_background: red;
      }
}

    .foo {
      background: var(--\\.foo_background);
}

    .component {
      background: var(--\\.component_background);
    }`
  )
})

it('Converts multi selectors (light subset of dark, with remainder)', async () => {
  await run(
    `
    .component {
      background: pink;
      padding: 12px;
    }

    @theme (dark) {
      .component, .foo {
        background: red;
      }
    }`,
    `:global(:root) {
      --\\.component_background: pink;
}

    @media (prefers-color-scheme: dark) {

      :global(.component) {
            --\\.component_background: red;
      }
}

    :global([data-theme="light"]) {
      --\\.component_background: pink;
}

    :global([data-theme="dark"]) {
      --\\.component_background: red;
}

    @container style(--leo-theme: light) {

      :global(.component) {
            --\\.component_background: pink;
      }
}

    @container style(--leo-theme: dark) {

      :global(.component) {
            --\\.component_background: red;
      }
}

    :global(:root) {
      --\\.foo_background: unset;
}

    @media (prefers-color-scheme: dark) {

      :global(.foo) {
            --\\.foo_background: red;
      }
}

    :global([data-theme="light"]) {
      --\\.foo_background: unset;
}

    :global([data-theme="dark"]) {
      --\\.foo_background: red;
}

    @container style(--leo-theme: light) {

      :global(.foo) {
            --\\.foo_background: unset;
      }
}

    @container style(--leo-theme: dark) {

      :global(.foo) {
            --\\.foo_background: red;
      }
}

    .foo {
      background: var(--\\.foo_background);
}

    .component {
      padding: 12px;
      background: var(--\\.component_background);
    }`
  )
})

it('Converts multi selectors (dark subset of light)', async () => {
  await run(
    `
    .component, .foo {
      background: pink;
    }

    @theme (dark) {
      .component {
        background: red;
      }
    }`,
    `:global(:root) {
      --\\.component_background: pink;
}
@media (prefers-color-scheme: dark) {
      :global(.component) {
            --\\.component_background: red;
      }
}
:global([data-theme="light"]) {
      --\\.component_background: pink;
}
:global([data-theme="dark"]) {
      --\\.component_background: red;
}
@container style(--leo-theme: light) {
      :global(.component) {
            --\\.component_background: pink;
      }
}
@container style(--leo-theme: dark) {
      :global(.component) {
            --\\.component_background: red;
      }
}
.component {
      background: var(--\\.component_background);
    }
.foo {
      background: pink;
    }`
  )
})

it('Converts multi selectors (dark subset of light, with remainder)', async () => {
  await run(
    `
    .component, .foo {
      padding: 12px;
      background: pink;
    }

    @theme (dark) {
      .component {
        background: red;
      }
    }`,
    `:global(:root) {
      --\\.component_background: pink;
}
@media (prefers-color-scheme: dark) {
      :global(.component) {
            --\\.component_background: red;
      }
}
:global([data-theme="light"]) {
      --\\.component_background: pink;
}
:global([data-theme="dark"]) {
      --\\.component_background: red;
}
@container style(--leo-theme: light) {
      :global(.component) {
            --\\.component_background: pink;
      }
}
@container style(--leo-theme: dark) {
      :global(.component) {
            --\\.component_background: red;
      }
}
.component {
      padding: 12px;
      background: var(--\\.component_background);
    }
.foo {
      padding: 12px;
      background: pink;
    }`
  )
})

it('Converts multi selectors (dark subset of light, with unset)', async () => {
  await run(
    `
    .component, .foo {
      background: pink;
    }

    @theme (dark) {
      .component {
        padding: 12px;
        background: red;
      }
    }`,
    `:global(:root) {
      --\\.component_padding: unset;
      --\\.component_background: pink;
}
@media (prefers-color-scheme: dark) {
      :global(.component) {
            --\\.component_padding: 12px;
            --\\.component_background: red;
      }
}
:global([data-theme="light"]) {
      --\\.component_padding: unset;
      --\\.component_background: pink;
}
:global([data-theme="dark"]) {
      --\\.component_padding: 12px;
      --\\.component_background: red;
}
@container style(--leo-theme: light) {
      :global(.component) {
            --\\.component_padding: unset;
            --\\.component_background: pink;
      }
}
@container style(--leo-theme: dark) {
      :global(.component) {
            --\\.component_padding: 12px;
            --\\.component_background: red;
      }
}
.component {
      padding: var(--\\.component_padding);
      background: var(--\\.component_background);
    }
.foo {
      background: pink;
    }`
  )
})

it('Converts multi selectors (weird intersection)', async () => {
  await run(
    `
    .component, .foo {
      margin: 8px;
      background: pink;
    }

    @theme (dark) {
      .component, .frob {
        padding: 12px;
        background: red;
      }
    }`,
    `:global(:root) {
      --\\.component_padding: unset;
      --\\.component_background: pink;
}
@media (prefers-color-scheme: dark) {
      :global(.component) {
            --\\.component_padding: 12px;
            --\\.component_background: red;
      }
}
:global([data-theme="light"]) {
      --\\.component_padding: unset;
      --\\.component_background: pink;
}
:global([data-theme="dark"]) {
      --\\.component_padding: 12px;
      --\\.component_background: red;
}
@container style(--leo-theme: light) {
      :global(.component) {
            --\\.component_padding: unset;
            --\\.component_background: pink;
      }
}
@container style(--leo-theme: dark) {
      :global(.component) {
            --\\.component_padding: 12px;
            --\\.component_background: red;
      }
}
:global(:root) {
      --\\.frob_padding: unset;
      --\\.frob_background: unset;
}
@media (prefers-color-scheme: dark) {
      :global(.frob) {
            --\\.frob_padding: 12px;
            --\\.frob_background: red;
      }
}
:global([data-theme="light"]) {
      --\\.frob_padding: unset;
      --\\.frob_background: unset;
}
:global([data-theme="dark"]) {
      --\\.frob_padding: 12px;
      --\\.frob_background: red;
}
@container style(--leo-theme: light) {
      :global(.frob) {
            --\\.frob_padding: unset;
            --\\.frob_background: unset;
      }
}
@container style(--leo-theme: dark) {
      :global(.frob) {
            --\\.frob_padding: 12px;
            --\\.frob_background: red;
      }
}
.frob {
      padding: var(--\\.frob_padding);
      background: var(--\\.frob_background);
}
.component {
      margin: 8px;
      padding: var(--\\.component_padding);
      background: var(--\\.component_background);
    }
.foo {
      margin: 8px;
      background: pink;
    }`
  )
})
