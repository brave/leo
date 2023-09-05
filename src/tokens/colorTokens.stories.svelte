<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import { font as allFonts, color as allColors } from '../../tokens/css'
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
    ...rest
  } = allColors
  const { white, black, ...themable } = rest
</script>

<Meta title="Color Tokens" />

<Story name="All Colors">
  <ColorTokenSwatchGroup tokens={allColors} />
</Story>

<Story name="Primitive">
  <ColorTokenSwatchGroup tokens={primitive} />
</Story>

<Story name="Themable">
  <ColorTokenSwatchGroup tokens={themable} />
</Story>

<Story name="Semantic">
  <ColorTokenSwatchGroup
    tokens={{
      text,
      icon,
      button,
      container,
      page,
      divider,
      dialogs,
      systemfeedback
    }}
  />
</Story>

<Story name="Legacy">
  <ColorTokenSwatchGroup tokens={legacy} />
</Story>
