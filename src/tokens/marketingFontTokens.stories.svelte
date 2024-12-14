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

  const { mobile, desktop } = allFonts
</script>

<Story name="Desktop/Tablet">
  <FontTokenSwatchGroup tokens={desktop} />
</Story>

<Story name="Mobile">
  <FontTokenSwatchGroup tokens={mobile} />
</Story>
