<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Checkbox, { sizes } from './checkbox.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
</script>

<Meta
  title="Checkbox"
  component={Checkbox}
  argTypes={{
    '--leo-checkbox-focus-border-radius': {
      control: 'text',
      type: 'string',
      description: 'The border radius of the focus shadow'
    },
    '--leo-checkbox-label-gap': {
      control: 'text',
      type: 'string',
      description: 'The gap between the label and the checkbox'
    },
    '--leo-checkbox-flex-direction': {
      control: 'select',
      description: 'The flex direction of the label/checkbox',
      options: ['row', 'row-reverse', 'column', 'column-reverse']
    },
    '--leo-checkbox-checked-color': {
      control: 'color',
      type: 'string',
      description: 'The color of the checkbox when checked'
    },
    '--leo-checkbox-checked-color-hover': {
      control: 'color',
      type: 'string',
      description: 'The color of the checkbox when checked and hovered'
    },
    '--leo-checkbox-unchecked-color': {
      control: 'color',
      type: 'string',
      description: 'The color of the checkbox when unchecked'
    },
    '--leo-checkbox-unchecked-color-hover': {
      control: 'color',
      type: 'string',
      description: 'The color of the checkbox when unchecked and hovered'
    },
    '--leo-checkbox-font': {
      control: 'text',
      type: 'string',
      description: 'The font to use for the label'
    },
    '--disabled-color': {
      control: 'color',
      type: 'string',
      description: 'The color of the checkbox + label when disabled'
    },
    size: {
      control: 'select',
      description: 'The size of the checkbox',
      options: sizes,
      defaultValue: 'normal'
    },
    checked: {
      control: 'boolean',
      description: 'Is the checkbox checked',
      defaultValue: false
    },
    label: {
      control: 'text',
      description: 'The checkbox label. This is passed in via slot',
      defaultValue: 'Label'
    }
  }}
/>

<Template let:args>
  <Checkbox {...args}>{args.label}</Checkbox>
</Template>

<Story name="Slots" let:args>
  <SlotInfo
    description="The checkbox contains a single slot, for setting the label"
  >
    <Slot name="default" explanation="The content of the label">
      <Checkbox {...args}>
        {args.label || 'Hello label!'}
      </Checkbox>
    </Slot>
  </SlotInfo>
</Story>

<Story name="Primary" />
