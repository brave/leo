<script context="module" lang="ts">
  export function scopedApplyLayer(name: string) {
    let ss: CSSStyleSheet
    fetch(`/css/${name}.css`)
      .then((r) => r.text())
      .then((css) => {
        ss = new CSSStyleSheet()
        ss.replaceSync(css)
        document.adoptedStyleSheets.push(ss)
      })

    return () => {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
        (s) => s !== ss
      )
    }
  }
</script>

<script lang="ts">
  import AlertCenter from '../src/components/alert/alertCenter.svelte'
  import '../tokens/css/variables.css'
</script>

<AlertCenter />

<div class="layout">
  <slot />
</div>

<style>
  :global(html),
  :global(body),
  :global(#storybook-root),
  :global(#storybook-docs),
  .layout {
    background: var(--leo-color-container-background);
    color: var(--leo-color-text-primary);
    font: var(--leo-font-default-regular);
  }

  .layout {
    padding: 30px;
  }
</style>
