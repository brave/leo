<script lang="ts">
  import { onMount } from 'svelte'
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css/variables-browser'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'
  // @ts-ignore
  import styles from '../../tokens/css/variables-browser.css?raw'

  onMount(() => {
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(styles);
    document.adoptedStyleSheets = [stylesheet];

    return () => document.adoptedStyleSheets = [];
  })
</script>

<Meta title="Tokens/Browser/Fonts" />

<Story name="All Fonts">
  <FontTokenSwatchGroup tokens={allFonts} />
</Story>

<Story name="Large">
  <FontTokenSwatchGroup tokens={allFonts.large} />
</Story>

<Story name="Default">
  <FontTokenSwatchGroup tokens={allFonts.default} />
</Story>

<Story name="Small">
  <FontTokenSwatchGroup tokens={allFonts.small} />
</Story>

<Story name="Extra Small">
  <FontTokenSwatchGroup tokens={allFonts.xSmall} />
</Story>
