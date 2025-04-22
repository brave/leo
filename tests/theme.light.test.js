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
    `:root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
    --\\.component_background: red;
    --\\.component_flex-direction: column;
  }

  :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
    --\\.component_background: pink;
    --\\.component_flex-direction: row;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --\\.component_background: pink;
      --\\.component_flex-direction: row;
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

  @theme (light) {
    .component {
      background: red;
      flex-direction: column;
    }
  }`,
    `:root, :root.light, .light {
    --\\.component_background: red;
    --\\.component_flex-direction: column;
  }

  :root.dark, .dark {
    --\\.component_background: pink;
    --\\.component_flex-direction: row;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --\\.component_background: pink;
      --\\.component_flex-direction: row;
    }
  }

  .component {
    padding: 12px;
    display: flex;
    background: var(--\\.component_background);
    flex-direction: var(--\\.component_flex-direction);
  }`,
    { lightSelector: '.light', darkSelector: '.dark' }
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
    `:root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
    --\\.component_background: red;
    --\\.component_color: white;
  }

  :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
    --\\.component_background: unset;
    --\\.component_color: unset;
  }

  @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_background: unset;
        --\\.component_color: unset;
      }
  }

  .component {
      background: var(--\\.component_background);
      color: var(--\\.component_color);
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
    `:root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
    --\\.component_background: red;
    --\\.component_color: white;
  }

  :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
    --\\.component_background: pink;
    --\\.component_color: unset;
  }

  @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_background: pink;
        --\\.component_color: unset;
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

    @theme (light) {
      .component .foo {
        background: red;
      }
    }`,
    `
    :root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
      --\\.component_\\.foo_background: red;
    }
    
    :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
      --\\.component_\\.foo_background: pink;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_\\.foo_background: pink;
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
      background: red;
    }

    @theme (light) {
      .component + .foo {
        background: pink;
      }
    }`,
    `
    :root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
      --\\.component_\\+_\\.foo_background: pink;
    }
    
    :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
      --\\.component_\\+_\\.foo_background: red;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
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
      background: red;
    }

    @theme (light) {
      .component > .foo {
        background: pink;
      }
    }`,
    `
    :root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
      --\\.component_\\>_\\.foo_background: pink;
    }
    
    :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
      --\\.component_\\>_\\.foo_background: red;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
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
      background: red;
    }

    @theme (light) {
      .component ~ .foo {
        background: pink;
      }
    }`,
    `
    :root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
      --\\.component_\\~_\\.foo_background: pink;
    }
    
    :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
      --\\.component_\\~_\\.foo_background: red;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_\\~_\\.foo_background: red;
      }
    }

    .component ~ .foo {
      background: var(--\\.component_\\~_\\.foo_background);
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
    :root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
      --\\.component_background: pink;
      --\\.foo_background: pink;
    }
    
    :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
      --\\.component_background: red;
      --\\.foo_background: red;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_background: red;
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
    :root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
      --\\.component_background: pink;
      --\\.foo_background: pink;
    }
    
    :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
      --\\.component_background: red;
      --\\.foo_background: red;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_background: red;
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
      background: red;
    }

    @theme (light) {
      .component, .foo {
        background: pink;
      }
    }`,
    `
    :root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
      --\\.component_background: pink;
      --\\.foo_background: pink;
    }
    
    :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
      --\\.component_background: red;
      --\\.foo_background: unset;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_background: red;
        --\\.foo_background: unset;
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
      background: red;
      padding: 12px;
    }

    @theme (light) {
      .component, .foo {
        background: pink;
      }
    }`,
    `
    :root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
      --\\.component_background: pink;
      --\\.foo_background: pink;
    }
    
    :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
      --\\.component_background: red;
      --\\.foo_background: unset;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_background: red;
        --\\.foo_background: unset;
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
    :root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
      --\\.component_background: white;
    }
    
    :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
      --\\.component_background: red;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_background: red;
      }
    }

    .component {
      background: var(--\\.component_background);
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
    :root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
      --\\.component_background: red;
    }
    
    :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
      --\\.component_background: pink;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --\\.component_background: pink;
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
    :root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
      --\\.component_padding: 12px;
      --\\.component_background: red;
    }
    
    :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
      --\\.component_padding: unset;
      --\\.component_background: pink;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
      --\\.component_padding: unset;
      --\\.component_background: pink;
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
    
    @theme (light) {
      .component, .frob {
        padding: 12px;
        background: red;
      }
    }`,
    `
    :root, :root[data-theme][data-theme=light], [data-theme][data-theme=light] {
      --\\.component_padding: 12px;
      --\\.component_background: red;
      --\\.frob_padding: 12px;
      --\\.frob_background: red;
    }
    
    :root[data-theme][data-theme=dark], [data-theme][data-theme=dark] {
      --\\.component_padding: unset;
      --\\.component_background: pink;
      --\\.frob_padding: unset;
      --\\.frob_background: unset;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
      --\\.component_padding: unset;
      --\\.component_background: pink;
      --\\.frob_padding: unset;
      --\\.frob_background: unset;
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
