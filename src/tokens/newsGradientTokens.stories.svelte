<script lang="ts">
  import { onMount } from 'svelte'
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { gradient as allGradients } from '../../tokens/css/variables-news'
  import ColorTokenSwatchGroup from '../storyHelpers/ColorTokenSwatchGroup.svelte'
  // @ts-ignore
  import styles from '../../tokens/css/variables-news.css?raw'

  onMount(() => {
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(styles);
    document.adoptedStyleSheets = [stylesheet];

    return () => document.adoptedStyleSheets = [];
  })
</script>

<Meta title="Tokens/News/Gradients" />

<Story name="All Gradients">
  <ColorTokenSwatchGroup tokens={allGradients} swatchSize={300} />
</Story>
