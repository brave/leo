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

  @theme (light) {
    .component {
      background: red;
      flex-direction: column;
    }
  }`,
    `@container style(--leo-theme: light) {
    :global(.component) {
      background: red;
      flex-direction: column;
    }
  }

  @container style(--leo-theme: dark) {
    :global(.component) {
      background: pink;
      flex-direction: row;
    }
  }

  :global(.component[data-theme="light"]) {
    background: red;
    flex-direction: column;
  }

  :global(.component[data-theme="dark"]) {
    background: pink;
    flex-direction: row;
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

  @theme (light) {
    .component {
      background: red;
      flex-direction: column;
    }
  }`,
    `@container style(--leo-theme: light) {
    :global(.component) {
      background: red;
      flex-direction: column;
    }
  }

  @container style(--leo-theme: dark) {
    :global(.component) {
      background: pink;
      flex-direction: row;
    }
  }

  :global(.component[data-theme="light"]) {
    background: red;
    flex-direction: column;
  }

  :global(.component[data-theme="dark"]) {
    background: pink;
    flex-direction: row;
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
  @theme (light) {
    .component {
      background: red;
      color: white;
    }
  }`,
    `@container style(--leo-theme: light) {
    :global(.component) {
      background: red;
      color: white;
    }
  }

  @container style(--leo-theme: dark) {
    :global(.component) {
      background: unset;
      color: unset;
    }
  }

  :global(.component[data-theme="light"]) {
    background: red;
    color: white;
  }

  :global(.component[data-theme="dark"]) {
    background: unset;
    color: unset;
  }`,
    {}
  )
})

it('Converts lightmode only properties', async () => {
  await run(
    `.component {
    background: pink;
  }

  @theme (light) {
    .component {
      background: red;
      color: white;
    }
  }`,
    `@container style(--leo-theme: light) {
    :global(.component) {
      background: red;
      color: white;
    }
  }

  @container style(--leo-theme: dark) {
    :global(.component) {
      background: pink;
      color: unset;
    }
  }

  :global(.component[data-theme="light"]) {
    background: red;
    color: white;
  }

  :global(.component[data-theme="dark"]) {
    background: pink;
    color: unset;
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

    @theme (light) {
      .component .foo {
        background: red;
      }
    }`,
    `
    @container style(--leo-theme: light) {
      :global(.component .foo) {
        background: red;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component .foo) {
        background: pink;
      }
    }

    :global(.component .foo[data-theme="light"]) {
      background: red;
    }

    :global(.component .foo[data-theme="dark"]) {
      background: pink;
    }`
  )
})

it('Converts sibling selectors', async () => {
  await run(
    `
    .component + .foo {
      background: red;
    }

    @theme (light) {
      .component + .foo {
        background: pink;
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
      background: red;
    }

    @theme (light) {
      .component > .foo {
        background: pink;
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
      background: red;
    }

    @theme (light) {
      .component ~ .foo {
        background: pink;
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

it('Converts multi selectors (dark and light same)', async () => {
  await run(
    `
    .component, .foo {
      background: red;
    }

    @theme (light) {
      .component, .foo {
        background: pink;
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

it('Converts multi selectors (dark and light same, with remainder)', async () => {
  await run(
    `
    .component, .foo {
      padding: 12px;
      background: red;
    }

    @theme (light) {
      .component, .foo {
        background: pink;
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
      background: red;
    }

    @theme (light) {
      .component, .foo {
        background: pink;
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
        background: unset;
      }
    }

    :global(.foo[data-theme="light"]) {
      background: pink;
    }

    :global(.foo[data-theme="dark"]) {
      background: unset;
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
      background: red;
      padding: 12px;
    }

    @theme (light) {
      .component, .foo {
        background: pink;
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
        background: unset;
      }
    }

    :global(.foo[data-theme="light"]) {
      background: pink;
    }

    :global(.foo[data-theme="dark"]) {
      background: unset;
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

it('Converts multi selectors (light subset of dark)', async () => {
  await run(
    `
    .component, .foo {
      background: red;
    }

    @theme (light) {
      .component {
        background: white;
      }
    }`,
    `
    @container style(--leo-theme: light) {
      :global(.component) {
        background: white;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        background: red;
      }
    }

    :global(.component[data-theme="light"]) {
      background: white;
    }

    :global(.component[data-theme="dark"]) {
      background: red;
    }

    .foo {
      background: red;
    }`
  )
})

it('Converts multi selectors (light subset of base, with remainder)', async () => {
  await run(
    `
    .component, .foo {
      padding: 12px;
      background: pink;
    }

    @theme (light) {
      .component {
        background: red;
      }
    }`,
    `
    @container style(--leo-theme: light) {
      :global(.component) {
        background: red;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        background: pink;
      }
    }

    :global(.component[data-theme="light"]) {
      background: red;
    }

    :global(.component[data-theme="dark"]) {
      background: pink;
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

it('Converts multi selectors (light subset of dark, with unset)', async () => {
  await run(
    `
    .component, .foo {
      background: pink;
    }

    @theme (light) {
      .component {
        padding: 12px;
        background: red;
      }
    }`,
    `
    @container style(--leo-theme: light) {
      :global(.component) {
        padding: 12px;
        background: red;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        padding: unset;
        background: pink;
      }
    }

    :global(.component[data-theme="light"]) {
      padding: 12px;
      background: red;
    }

    :global(.component[data-theme="dark"]) {
      padding: unset;
      background: pink;
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

    @theme (light) {
      .component, .frob {
        padding: 12px;
        background: red;
      }
    }`,
    `
    @container style(--leo-theme: light) {
      :global(.frob) {
        padding: 12px;
        background: red;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.frob) {
        padding: unset;
        background: unset;
      }
    }

    :global(.frob[data-theme="light"]) {
      padding: 12px;
      background: red;
    }

    :global(.frob[data-theme="dark"]) {
      padding: unset;
      background: unset;
    }

    @container style(--leo-theme: light) {
      :global(.component) {
        padding: 12px;
        background: red;
      }
    }

    @container style(--leo-theme: dark) {
      :global(.component) {
        padding: unset;
        background: pink;
      }
    }

    :global(.component[data-theme="light"]) {
      padding: 12px;
      background: red;
    }

    :global(.component[data-theme="dark"]) {
      padding: unset;
      background: pink;
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
