<script context="module">
  export const meta = {
    title: 'Tokens/Universal/Gradients'
  }
</script>
<script lang="ts">
  import { Story } from '@storybook/addon-svelte-csf'
  import { gradient as allGradients } from '../../tokens/css/variables'
  import ColorTokenSwatchGroup from '../storyHelpers/ColorTokenSwatchGroup.svelte'
</script>

<Story name="All Gradients">
  <ColorTokenSwatchGroup tokens={allGradients} swatchSize={300} />
</Story>
