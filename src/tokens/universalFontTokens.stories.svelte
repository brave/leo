<script context="module">
  export const meta = {
    title: 'Tokens/Universal/Fonts'
  }
</script>
<script lang="ts">
  import { Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css/variables'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'

  const { monospace, ...sansMonospace } = allFonts
</script>

<Story name="All Fonts">
  <FontTokenSwatchGroup tokens={sansMonospace} />
</Story>

<Story name="Default">
  <FontTokenSwatchGroup tokens={allFonts.default} />
</Story>

<Story name="Heading">
  <FontTokenSwatchGroup tokens={allFonts.heading} />
</Story>

<Story name="Components">
  <FontTokenSwatchGroup tokens={allFonts.components} />
</Story>
