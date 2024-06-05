<script lang="ts">
  import { onMount } from 'svelte'
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css/variables-search'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'
  import { scopedApplyLayer } from '../../.storybook/global.svelte'

  onMount(() => scopedApplyLayer("variables-search"))
</script>

<Meta title="Tokens/Search/Fonts" />

<Story name="All Fonts">
  <FontTokenSwatchGroup tokens={allFonts} />
</Story>
