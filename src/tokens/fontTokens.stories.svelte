<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'

  const { macos, windows, monospace, ...allFontsForDisplay } = allFonts;
  const { primary, secondary, mobile, components } =
  allFontsForDisplay
</script>

<Meta title="Font Tokens" />

<Story name="All Fonts">
  <FontTokenSwatchGroup tokens={allFontsForDisplay} />
</Story>

<Story name="Mobile">
  <FontTokenSwatchGroup tokens={mobile} />
</Story>

<Story name="Primary">
  <FontTokenSwatchGroup tokens={primary} />
</Story>

<Story name="Secondary">
  <FontTokenSwatchGroup tokens={secondary} />
</Story>

<Story name="Components">
  <FontTokenSwatchGroup tokens={components} />
</Story>
