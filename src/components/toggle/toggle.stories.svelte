<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import { getStyleFromArgs } from '../../../.storybook/argHelper'
  import Icon from '../icon/icon.svelte'
  import Toggle, { sizes } from './toggle.svelte'
</script>

<Meta
  title="Toggle"
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
    '--leo-toggle-on-color': {
      control: 'color',
      description: 'The background color of the toggle when on'
    },
    '--leo-toggle-on-color-hover': {
      control: 'color',
      description: 'The background color of the toggle when on and hovering'
    },
    '--leo-toggle-off-color': {
      control: 'color',
      description: 'The background color of the toggle when off'
    },
    '--leo-toggle-off-color-hover': {
      control: 'color',
      description: 'The background color of the toggle when off and hovering'
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

    size: { control: 'select', options: sizes, defaultValue: 'medium' },
    label: { control: 'text', defaultValue: 'Label' }
  }}
/>

<Template let:args>
  <div style={getStyleFromArgs(args)}>
    <Toggle {...args}>{args.label}</Toggle>
  </div>
</Template>

<Story name="Default" />
<Story name="Custom Icon" let:args>
  <div style={getStyleFromArgs(args)}>
    <Toggle {...args}>
      <div slot="on-icon">
        <Icon name="check-normal" />
      </div>
      {args.label}
    </Toggle>
  </div>
</Story>
