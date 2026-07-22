<script context="module">
  export const meta = {
    title: 'Tokens/Search/Colors'
  }
</script>
<script lang="ts">
  import { onMount } from 'svelte'
  import { Story } from '@storybook/addon-svelte-csf'
  import { color as allColors } from '../../tokens/css/variables-search'
  import ColorTokenSwatchGroup from '../storyHelpers/ColorTokenSwatchGroup.svelte'
  import { scopedApplyLayer } from '../../.storybook/global.svelte'

  onMount(() => scopedApplyLayer("variables-search"))

  const { search } = allColors
</script>

<Story name="All Colors">
  <ColorTokenSwatchGroup tokens={search} />
</Story>
