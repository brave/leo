<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { font as allFonts } from '../../tokens/css/variables-search'
  import FontTokenSwatchGroup from '../storyHelpers/FontTokenSwatchGroup.svelte'
  import '../../tokens/css/variables-search.css'
</script>

<Meta title="Tokens/Search/Fonts" />

<Story name="All Fonts">
  <FontTokenSwatchGroup tokens={allFonts} />
</Story>
