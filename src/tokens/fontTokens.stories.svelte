<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'

  const { macos, monospace, windows, primary, secondary, mobile, components } =
    allFonts
</script>

<Meta title="Font Tokens" />

<Story name="All Fonts">
  <FontTokenSwatchGroup tokens={allFonts} />
</Story>

<Story name="macOS">
  <FontTokenSwatchGroup tokens={macos} />
</Story>

<Story name="Windows">
  <FontTokenSwatchGroup tokens={windows} />
</Story>

<Story name="Mobile">
  <FontTokenSwatchGroup tokens={mobile} />
</Story>

<Story name="Primarcy">
  <FontTokenSwatchGroup tokens={primary} />
</Story>

<Story name="Secondary">
  <FontTokenSwatchGroup tokens={secondary} />
</Story>

<Story name="Monospace">
  <FontTokenSwatchGroup tokens={monospace} />
</Story>
