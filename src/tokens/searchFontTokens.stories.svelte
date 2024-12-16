<script context="module">
  export const meta = {
    title: 'Tokens/Search/Fonts'
  }
</script>
<script lang="ts">
  import { onMount } from 'svelte'
  import { Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css/variables-search'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'
  import { scopedApplyLayer } from '../../.storybook/global.svelte'

  onMount(() => scopedApplyLayer("variables-search"))
</script>

<Story name="All Fonts">
  <FontTokenSwatchGroup tokens={allFonts} />
</Story>
