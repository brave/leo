<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css/variables-marketing'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'
  import '../../tokens/css/variables-marketing.css'

  const { mobile, desktop } = allFonts
</script>

<Meta title="Tokens/Marketing/Fonts" />

<Story name="Desktop/Tablet">
  <FontTokenSwatchGroup tokens={desktop} />
</Story>

<Story name="Mobile">
  <FontTokenSwatchGroup tokens={mobile} />
</Story>
