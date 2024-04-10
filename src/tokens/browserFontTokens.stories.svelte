<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css/variables-browser'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'
</script>

<Meta title="Tokens/Browser/Fonts" />

<Story name="All Fonts">
  <FontTokenSwatchGroup tokens={allFonts} />
</Story>

<Story name="Large">
  <FontTokenSwatchGroup tokens={allFonts.large} />
</Story>

<Story name="Default">
  <FontTokenSwatchGroup tokens={allFonts.default} />
</Story>

<Story name="Small">
  <FontTokenSwatchGroup tokens={allFonts.small} />
</Story>

<Story name="Extra Small">
  <FontTokenSwatchGroup tokens={allFonts.xSmall} />
</Story>
