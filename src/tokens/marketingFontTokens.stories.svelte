<script lang="ts">
  import { onMount } from 'svelte'
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css/variables-marketing'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'
  // @ts-ignore
  import styles from '../../tokens/css/variables-marketing.css?raw'

  onMount(() => {
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(styles);
    document.adoptedStyleSheets = [stylesheet];

    return () => document.adoptedStyleSheets = [];
  })

  const { mobile, desktop } = allFonts
</script>

<Meta title="Tokens/Marketing/Fonts" />

<Story name="Desktop/Tablet">
  <FontTokenSwatchGroup tokens={desktop} />
</Story>

<Story name="Mobile">
  <FontTokenSwatchGroup tokens={mobile} />
</Story>
