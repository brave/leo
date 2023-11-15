<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'

  const { monospace, ...sansMonospace } = allFonts
</script>

<Meta title="Tokens/Fonts" />

<Story name="All Fonts">
  <FontTokenSwatchGroup tokens={sansMonospace} />
</Story>

<Story name="Default">
  <FontTokenSwatchGroup tokens={allFonts.default} />
</Story>

<Story name="Heading">
  <FontTokenSwatchGroup tokens={allFonts.heading} />
</Story>

<Story name="Mobile">
  <FontTokenSwatchGroup tokens={allFonts.mobile} />
</Story>

<Story name="Components">
  <FontTokenSwatchGroup tokens={allFonts.components} />
</Story>
