<script lang="ts">
  import { onMount } from 'svelte'
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { gradient as allGradients } from '../../tokens/css/variables-news'
  import ColorTokenSwatchGroup from '../storyHelpers/ColorTokenSwatchGroup.svelte'
  import { scopedApplyLayer } from '../../.storybook/global.svelte'

  onMount(() => scopedApplyLayer("variables-news"))
</script>

<Meta title="Tokens/News/Gradients" />

<Story name="All Gradients">
  <ColorTokenSwatchGroup tokens={allGradients} swatchSize={300} />
</Story>
