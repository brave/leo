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
    `@container style(--leo-theme: light) {
    :global(.component) {
      background: pink;
      flex-direction: row;
    }
  }

  @container style(--leo-theme: dark) {
    :global(.component) {
      background: red;
      flex-direction: column;
    }
  }

  :global(.component[data-theme="light"]) {
    background: pink;
    flex-direction: row;
  }

  :global(.component[data-theme="dark"]) {
    background: red;
    flex-direction: column;
  }

  .component {
    padding: 12px;
    display: flex;
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
    `@container style(--leo-theme: light) {
    :global(.component) {
      background: pink;
      flex-direction: row;
    }
  }

  @container style(--leo-theme: dark) {
    :global(.component) {
      background: red;
      flex-direction: column;
    }
  }

  :global(.component[data-theme="light"]) {
    background: pink;
    flex-direction: row;
  }

  :global(.component[data-theme="dark"]) {
    background: red;
    flex-direction: column;
  }

  .component {
    padding: 12px;
    display: flex;
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
    `
  .component {
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
    `@container style(--leo-theme: light) {
    :global(.component) {
      background: unset;
      color: unset;
    }
  }

  @container style(--leo-theme: dark) {
    :global(.component) {
      background: red;
      color: white;
    }
  }

  :global(.component[data-theme="light"]) {
    background: unset;
    color: unset;
  }

  :global(.component[data-theme="dark"]) {
    background: red;
    color: white;
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
    `@container style(--leo-theme: light) {
    :global(.component) {
      background: pink;
      color: unset;
    }
  }

  @container style(--leo-theme: dark) {
    :global(.component) {
      background: red;
      color: white;
    }
  }

  :global(.component[data-theme="light"]) {
    background: pink;
    color: unset;
  }

  :global(.component[data-theme="dark"]) {
    background: red;
    color: white;
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
    `
    @container style(--leo-theme: light) {
      :global(.component .foo) {
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component .foo) {
        background: red;
      }
    }

    :global(.component .foo[data-theme="light"]) {
      background: pink;
    }

    :global(.component .foo[data-theme="dark"]) {
      background: red;
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
    `
    @container style(--leo-theme: light) {
      :global(.component + .foo) {
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component + .foo) {
        background: red;
      }
    }

    :global(.component + .foo[data-theme="light"]) {
      background: pink;
    }

    :global(.component + .foo[data-theme="dark"]) {
      background: red;
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
    `
    @container style(--leo-theme: light) {
      :global(.component > .foo) {
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component > .foo) {
        background: red;
      }
    }

    :global(.component > .foo[data-theme="light"]) {
      background: pink;
    }

    :global(.component > .foo[data-theme="dark"]) {
      background: red;
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
    `
    @container style(--leo-theme: light) {
      :global(.component ~ .foo) {
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component ~ .foo) {
        background: red;
      }
    }

    :global(.component ~ .foo[data-theme="light"]) {
      background: pink;
    }

    :global(.component ~ .foo[data-theme="dark"]) {
      background: red;
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
    `
    @container style(--leo-theme: light) {
      :global(.foo) {
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.foo) {
        background: red;
      }
    }

    :global(.foo[data-theme="light"]) {
      background: pink;
    }

    :global(.foo[data-theme="dark"]) {
      background: red;
    }

    @container style(--leo-theme: light) {
      :global(.component) {
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        background: red;
      }
    }

    :global(.component[data-theme="light"]) {
      background: pink;
    }

    :global(.component[data-theme="dark"]) {
      background: red;
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
    `
    @container style(--leo-theme: light) {
      :global(.foo) {
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.foo) {
        background: red;
      }
    }

    :global(.foo[data-theme="light"]) {
      background: pink;
    }

    :global(.foo[data-theme="dark"]) {
      background: red;
    }

    @container style(--leo-theme: light) {
      :global(.component) {
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        background: red;
      }
    }

    :global(.component[data-theme="light"]) {
      background: pink;
    }

    :global(.component[data-theme="dark"]) {
      background: red;
    }

    .component {
      padding: 12px;
    }

    .foo {
      padding: 12px;
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
    `
    @container style(--leo-theme: light) {
      :global(.foo) {
        background: unset;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.foo) {
        background: red;
      }
    }

    :global(.foo[data-theme="light"]) {
      background: unset;
    }

    :global(.foo[data-theme="dark"]) {
      background: red;
    }

    @container style(--leo-theme: light) {
      :global(.component) {
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        background: red;
      }
    }

    :global(.component[data-theme="light"]) {
      background: pink;
    }

    :global(.component[data-theme="dark"]) {
      background: red;
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
    `
    @container style(--leo-theme: light) {
      :global(.foo) {
        background: unset;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.foo) {
        background: red;
      }
    }

    :global(.foo[data-theme="light"]) {
      background: unset;
    }

    :global(.foo[data-theme="dark"]) {
      background: red;
    }

    @container style(--leo-theme: light) {
      :global(.component) {
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        background: red;
      }
    }

    :global(.component[data-theme="light"]) {
      background: pink;
    }

    :global(.component[data-theme="dark"]) {
      background: red;
    }

    .component {
      padding: 12px;
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
    `
    @container style(--leo-theme: light) {
      :global(.component) {
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        background: red;
      }
    }

    :global(.component[data-theme="light"]) {
      background: pink;
    }

    :global(.component[data-theme="dark"]) {
      background: red;
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
    `
    @container style(--leo-theme: light) {
      :global(.component) {
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        background: red;
      }
    }

    :global(.component[data-theme="light"]) {
      background: pink;
    }

    :global(.component[data-theme="dark"]) {
      background: red;
    }

    .component {
      padding: 12px;
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
    `
    @container style(--leo-theme: light) {
      :global(.component) {
        padding: unset;
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        padding: 12px;
        background: red;
      }
    }

    :global(.component[data-theme="light"]) {
      padding: unset;
      background: pink;
    }

    :global(.component[data-theme="dark"]) {
      padding: 12px;
      background: red;
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
    `
    @container style(--leo-theme: light) {
      :global(.frob) {
        padding: unset;
        background: unset;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.frob) {
        padding: 12px;
        background: red;
      }
    }

    :global(.frob[data-theme="light"]) {
      padding: unset;
      background: unset;
    }

    :global(.frob[data-theme="dark"]) {
      padding: 12px;
      background: red;
    }

    @container style(--leo-theme: light) {
      :global(.component) {
        padding: unset;
        background: pink;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        padding: 12px;
        background: red;
      }
    }

    :global(.component[data-theme="light"]) {
      padding: unset;
      background: pink;
    }

    :global(.component[data-theme="dark"]) {
      padding: 12px;
      background: red;
    }

    .component {
      margin: 8px;
    }

    .foo {
      margin: 8px;
      background: pink;
    }`
  )
})
