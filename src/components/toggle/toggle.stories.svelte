<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Icon from '../icon/icon.svelte'
  import Toggle, { sizes } from './toggle.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
</script>

<Meta
  title="Components/Toggle"
  component={Toggle}
  argTypes={{
    '--leo-toggle-width': {
      type: 'string',
      description: 'The width of the toggle (in CSS units)'
    },
    '--leo-toggle-height': {
      type: 'string',
      description: 'The height of the toggle (in CSS units)'
    },
    '--leo-toggle-padding': {
      type: 'string',
      description: 'The padding of the toggle'
    },
    '--leo-toggle-checked-color': {
      control: 'color',
      description: 'The background color of the toggle when checked'
    },
    '--leo-toggle-checked-color-hover': {
      control: 'color',
      description:
        'The background color of the toggle when checked and hovering'
    },
    '--leo-toggle-unchecked-color': {
      control: 'color',
      description: 'The background color of the toggle when not checked'
    },
    '--leo-toggle-unchecked-color-hover': {
      control: 'color',
      description:
        'The background color of the toggle when not checked and hovering'
    },
    '--leo-toggle-thumb-color': {
      control: 'color',
      description: 'The color of the thumb'
    },
    '--leo-toggle-thumb-disabled-color': {
      control: 'color',
      description: 'The color of the thumb when the control is disabled'
    },
    '--leo-toggle-label-gap': {
      control: 'The space between the label and the toggle (in CSS units)'
    },
    '--leo-toggle-label-flex-direction': {
      control: 'select',
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
      description:
        'Controls how the label is laid out in relation to the toggle.'
    },

    size: { control: 'select', options: sizes },
    label: { control: 'text' }
  }}
  args={{
    label: 'Label',
    size: 'medium'
  }}
/>

<Template let:args>
  <Toggle {...args}>{args.label}</Toggle>
</Template>

<Story name="Slots" let:args>
  <SlotInfo
    description="The toggle contains a couple of slots for customization"
  >
    <Slot name="default" explanation="The content of the label">
      <Toggle {...args} let:checked>
        {checked ? 'Checked' : 'Unchecked'}
      </Toggle>
    </Slot>
    <Slot
      name="on-icon"
      explanation="The icon shown when the toggle is on. If unset, the tick icon is used"
    >
      <Toggle {...args}>
        <Icon name="cookie" slot="on-icon" />
      </Toggle>
    </Slot>
  </SlotInfo>
</Story>

<Story name="Default" />
