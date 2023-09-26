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
    '--nl-collapse-summary-padding': {
      type: 'string',
      description: 'The padding to apply to the collapse summary'
    },
    '--nl-collapse-content-padding': {
      type: 'string',
      description: 'The padding to apply to the collapse content'
    },
    '--nl-collapse-background-color': {
      control: 'color',
      description: 'The background color of the collapse'
    },
    '--nl-collapse-background-color-hover': {
      control: 'color',
      description: 'The background color of the collapse when hovering'
    },
    '--nl-collapse-icon-size': {
      type: 'string',
      description: 'The size of icons in the collapse'
    },
    '--nl-collapse-transition-duration': {
      type: 'string',
      description: 'The transition duration'
    },
    '--nl-collapse-border-color': {
      control: 'color',
      description: 'The border color of the collapse'
    },
    '--nl-collapse-border-color-hover': {
      control: 'color',
      description: 'The border color of the collapse when hovered'
    },
    '--nl-collapse-shadow': {
      type: 'string',
      description: 'The shadow of the collapse'
    },
    '--nl-collapse-shadow-hover': {
      type: 'string',
      description: 'The shadow of the collapse when hovered'
    },
    '--nl-collapse-shadow-focus': {
      type: 'string',
      description: 'The shadow of the collapse when focused'
    },
    '--nl-collapse-radius': {
      type: 'string',
      description: 'The border radius of the collapse'
    },
    '--nl-collapse-summary-color': {
      control: 'color',
      description: 'The color of the summary text'
    },
    '--nl-collapse-summary-color-hover': {
      control: 'color',
      description: 'The color of the summary text when hovered'
    },
    '--nl-collapse-icon-color': {
      control: 'color',
      description: 'The color of the icons in the collapse'
    },
    '--nl-collapse-icon-color-hover': {
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
    <Slot
      name="title"
      explanation="The title for the collapse. When provided, this overrides the title property. It allows for more advanced styling"
    >
      <Collapse {...args} title="Title">
        <div slot="title"><b>Foo</b> <i>bar</i> <s>hello</s></div>
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
