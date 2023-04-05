<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import { getStyleFromArgs } from '../../../.storybook/argHelper'
  import Checkbox, { sizes } from './checkbox.svelte'
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
  <div style={getStyleFromArgs(args)}>
    <Checkbox {...args}>{args.label}</Checkbox>
  </div>
</Template>

<Story name="Primary" />
