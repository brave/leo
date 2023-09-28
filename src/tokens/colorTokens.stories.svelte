<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import { color as allColors } from '../../tokens/css'
  import ColorTokenSwatchGroup from '../storyHelpers/ColorTokenSwatchGroup.svelte'

  const {
    primitive,
    legacy,
    text,
    icon,
    button,
    container,
    page,
    divider,
    dialogs,
    systemfeedback,
    white,
    black,
    ...themeable
  } = allColors

  const reversedThemeable = Object.entries(themeable).reverse()
  const reversedPrimitive = Object.entries(themeable).reverse()

  const semantic = {
    page,
    container,
    text,
    button,
    icon,
    dialogs,
    divider,
    systemfeedback
  }

  const allColorsForDisplay = {
    themeable: reversedThemeable,
    semantic,
    primitive: reversedPrimitive,
    legacy,
    white,
    black
  }
</script>

<Meta title="Tokens/Colors" />

<Story name="All Colors">
  <ColorTokenSwatchGroup tokens={allColorsForDisplay} />
</Story>

<Story name="Themeable">
  <ColorTokenSwatchGroup tokens={reversedThemeable} />
</Story>

<Story name="Semantic">
  <ColorTokenSwatchGroup tokens={semantic} />
</Story>

<Story name="Primitive">
  <ColorTokenSwatchGroup tokens={reversedPrimitive} />
</Story>

<Story name="Legacy">
  <ColorTokenSwatchGroup tokens={legacy} />
</Story>
