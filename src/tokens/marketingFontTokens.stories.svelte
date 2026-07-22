<script context="module">
  export const meta = {
    title: 'Tokens/Marketing/Fonts'
  }
</script>
<script lang="ts">
  import { onMount } from 'svelte'
  import { Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css/variables-marketing'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'
  import { scopedApplyLayer } from '../../.storybook/global.svelte'

  onMount(() => scopedApplyLayer("variables-marketing"))

  const { monospace, ...sansMonospace } = allFonts
</script>

<Story name="All Fonts">
  <FontTokenSwatchGroup tokens={sansMonospace} />
</Story>

<Story name="Display Primary">
  <FontTokenSwatchGroup tokens={allFonts.displayPrimary} />
</Story>

<Story name="Display Secondary">
  <FontTokenSwatchGroup tokens={allFonts.displaySecondary} />
</Story>

<Story name="Heading">
  <FontTokenSwatchGroup tokens={allFonts.heading} />
</Story>

<Story name="Extra Large">
  <FontTokenSwatchGroup tokens={allFonts.xLarge} />
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

<Story name="Monospace">
  <FontTokenSwatchGroup tokens={allFonts.monospace} />
</Story>
