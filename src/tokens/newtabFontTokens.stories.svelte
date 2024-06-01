<script lang="ts">
  import { onMount } from 'svelte'
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css/variables-newtab'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'
  // @ts-ignore
  import styles from '../../tokens/css/variables-newtab.css?raw'

  onMount(() => {
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(styles);
    document.adoptedStyleSheets = [stylesheet];

    return () => document.adoptedStyleSheets = [];
  })
</script>

<Meta title="Tokens/New Tab/Fonts" />

<Story name="All Fonts">
  <FontTokenSwatchGroup tokens={allFonts} />
</Story>
