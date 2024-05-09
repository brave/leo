<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import RadioButton, { sizes } from './radioButton.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'

  let currentValue = 'hello'
</script>

<Meta
  title="Components/Radio Button"
  component={RadioButton}
  argTypes={{
    '--leo-radiobutton-focus-border-radius': {
      control: 'text',
      type: 'string',
      description: 'The border radius of the focus shadow'
    },
    '--leo-radiobutton-label-gap': {
      control: 'text',
      type: 'string',
      description: 'The gap between the label and the checkbox'
    },
    '--leo-radiobutton-flex-direction': {
      control: 'select',
      description: 'The flex direction of the label/button',
      options: ['row', 'row-reverse', 'column', 'column-reverse']
    },
    '--leo-radiobutton-checked-color': {
      control: 'color',
      type: 'string',
      description: 'The color of the checkbox when checked'
    },
    '--leo-radiobutton-checked-color-hover': {
      control: 'color',
      type: 'string',
      description: 'The color of the checkbox when checked and hovered'
    },
    '--leo-radiobutton-unchecked-color': {
      control: 'color',
      type: 'string',
      description: 'The color of the checkbox when unchecked'
    },
    '--leo-radiobutton-unchecked-color-hover': {
      control: 'color',
      type: 'string',
      description: 'The color of the checkbox when unchecked and hovered'
    },
    '--leo-radiobutton-font': {
      control: 'text',
      type: 'string',
      description: 'The font to use for the label'
    },
    '--leo-radiobutton-disabled-color': {
      control: 'color',
      type: 'string',
      description: 'The color of the checkbox + label when disabled'
    },
    name: {
      control: 'text',
      description:
        'The name of the group of radio buttons (i.e. the name of the property the buttons are selecting for).'
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the control is disabled'
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'The size of the control'
    },
    value: {
      control: null,
      description:
        'This is the value |currentValue| will be when the radio is selected'
    },
    currentValue: {
      control: null,
      description:
        'The current value of the control. In Svelte, this can be bound. WebComponents can also manage it automatically. The checked event is fired with the new value when the current value changes.'
    }
  }}
  args={{
    size: 'normal',
    isDisabled: false,
    name: 'options'
  }}
/>

<Template let:args>
  <RadioButton {...args} name={args.name} bind:currentValue value={'hello'}
    >Hello</RadioButton
  >
  <RadioButton {...args} name={args.name} bind:currentValue value={'world'} />
  <RadioButton {...args} name={args.name} bind:currentValue value={'foo'} />
  <RadioButton {...args} name={args.name} bind:currentValue value={'bar'} />
  <div>Current: {currentValue}</div>
</Template>

<Story name="Slots" let:args>
  <SlotInfo
    description="The radio button contains a single slot, for setting the label"
  >
    <Slot
      name="default"
      explanation="The content of the label. If unset, defaults to the value of the radio button"
    >
      <RadioButton {...args} name="option" value={1} bind:currentValue>
        Hello label!
      </RadioButton>
      <RadioButton {...args} name="option" value={2} bind:currentValue>
        Hello other label!
      </RadioButton>
    </Slot>
  </SlotInfo>
</Story>

<Story name="Default" />
