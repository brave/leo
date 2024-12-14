<script context="module">
  export const meta = {
    title: 'Tokens/Browser/Fonts'
  }
</script>
<script lang="ts">
  import { onMount } from 'svelte'
  import { Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css/variables-browser'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'
  import { scopedApplyLayer } from '../../.storybook/global.svelte'

  onMount(() => scopedApplyLayer("variables-browser"))
</script>

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
