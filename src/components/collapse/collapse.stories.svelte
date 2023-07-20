<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Icon from '../icon/icon.svelte'

  import Collapse from './collapse.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
</script>

<Meta
  title="Collapse"
  component={Collapse}
  argTypes={{
    '--leo-collapse-summary-padding': {
      type: 'string',
      description: 'The padding to apply to the collapse summary'
    },
    '--leo-collapse-content-padding': {
      type: 'string',
      description: 'The padding to apply to the collapse content'
    },
    '--leo-collapse-background-color': {
      control: 'color',
      description: 'The background color of the collapse'
    },
    '--leo-collapse-background-color-hover': {
      control: 'color',
      description: 'The background color of the collapse when hovering'
    },
    '--leo-collapse-icon-size': {
      type: 'string',
      description: 'The size of icons in the collapse'
    },
    '--leo-collapse-transition-duration': {
      type: 'string',
      description: 'The transition duration'
    },
    '--leo-collapse-border-color': {
      control: 'color',
      description: 'The border color of the collapse'
    },
    '--leo-collapse-border-color-hover': {
      control: 'color',
      description: 'The border color of the collapse when hovered'
    },
    '--leo-collapse-shadow': {
      type: 'string',
      description: 'The shadow of the collapse'
    },
    '--leo-collapse-shadow-hover': {
      type: 'string',
      description: 'The shadow of the collapse when hovered'
    },
    '--leo-collapse-shadow-focus': {
      type: 'string',
      description: 'The shadow of the collapse when focused'
    },
    '--leo-collapse-radius': {
      type: 'string',
      description: 'The border radius of the collapse'
    },
    '--leo-collapse-summary-color': {
      control: 'color',
      description: 'The color of the summary text'
    },
    '--leo-collapse-summary-color-hover': {
      control: 'color',
      description: 'The color of the summary text when hovered'
    },
    '--leo-collapse-icon-color': {
      control: 'color',
      description: 'The color of the icons in the collapse'
    },
    '--leo-collapse-icon-color-hover': {
      control: 'color',
      description: 'The color of icons in the collapse in a hover state'
    }
  }}
/>

<Template let:args>
  <Collapse {...args} />
</Template>

<Story name="Slots" let:args>
  <SlotInfo description="The collapse has some slots to allow customization">
    <Slot name="default" explanation="The content of the collapse">
      <Collapse {...args} title="Title">Collapse content</Collapse>
    </Slot>
    <Slot
      name="icon"
      explanation="The icon for the collapse. Displayed before the title"
    >
      <Collapse {...args} title="Title">
        <Icon name="country-nz" slot="icon" />
        Collapse content
      </Collapse>
    </Slot>
  </SlotInfo>
</Story>

<Story name="Primary" let:args>
  <Collapse title="Title" {...args}>
    <div slot="icon">
      <Icon name="info-outline" />
    </div>
    Content goes here
  </Collapse>
</Story>

<style>
</style>
