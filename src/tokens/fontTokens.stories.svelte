<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'

  const { macos, windows, monospace, ...rest } = allFonts
  const { primary, secondary, mobile, components } = rest
  const allFontsForDisplay = { primary, secondary, components, mobile }
</script>

<Meta title="Tokens/Fonts" />

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
