<script lang="ts">
  import { onMount } from 'svelte'
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { gradient as allGradients } from '../../tokens/css/variables-search'
  import ColorTokenSwatchGroup from '../storyHelpers/ColorTokenSwatchGroup.svelte'
  import { scopedApplyLayer } from '../../.storybook/global.svelte'

  onMount(() => scopedApplyLayer("variables-search"))
</script>

<Meta title="Tokens/Search/Gradients" />

<Story name="All Gradients">
  <ColorTokenSwatchGroup tokens={allGradients} swatchSize={300} />
</Story>
