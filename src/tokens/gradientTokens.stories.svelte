<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import { gradient as allGradients } from '../../tokens/css'
  import ColorTokenSwatchGroup from '../storyHelpers/ColorTokenSwatchGroup.svelte'
</script>

<Meta title="Gradient Tokens" />

<Story name="All Gradients">
  <ColorTokenSwatchGroup tokens={allGradients} />
</Story>
