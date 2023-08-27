<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Input from './input.svelte'
  import Icon from '../icon/icon.svelte'
  import { cssProperties, modes, sizes } from '../formItem/formItem.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'

  let characterCountValue = ''
</script>

<Meta
  title="Input"
  component={Input}
  argTypes={{
    ...cssProperties,
    placeholder: {
      type: 'string',
      description: 'The placeholder'
    },
    label: {
      type: 'string',
      defaultValue: 'Label',
      description:
        "This isn't a real prop of the component, it's just useful for configuring the storybook"
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'date', 'time', 'color']
    },
    size: {
      control: 'select',
      options: sizes
    },
    mode: {
      control: 'select',
      options: modes
    }
  }}
/>

<Template let:args>
  <Input {...args}>
    {args.label}
    <div slot="errors">
      <Icon name="warning-triangle-filled" />
      Something went wrong!
    </div>
  </Input>
</Template>

<Story name="Default" />

<Story name="Character Count" let:args>
  <Input {...args} bind:value={characterCountValue}>
    {args.label}
    <div slot="extra">{characterCountValue.length}/100</div>
    <Icon name="send" slot="right-icon" />
  </Input>
</Story>

<Story name="Slots" let:args>
  <SlotInfo description="The input provides several slots for customization">
    <Slot
      name="left-icon"
      explanation="An icon displayed on the left hand side of the input"
    >
      <Input {...args}>
        <Icon name="list-heart" slot="left-icon" />
      </Input>
    </Slot>
    <Slot
      name="right-icon"
      explanation="An icon displayed on the right hand side of the input. If unset, a picker icon may be displayed here for some inputs (such as the date/time/color pickers)"
    >
      <Input {...args}>
        <Icon name="code" slot="right-icon" />
      </Input>
    </Slot>
    <Slot
      name="extra"
      explanation="A slot for displaying extra information in the input"
    >
      <Input {...args}>
        <span slot="extra">This is a very helpful message</span>
      </Input>
    </Slot>
    <Slot
      name="errors"
      explanation="A slot where any errors related to the component will be shown. Errors are only show if showErrors and hasErrors are set on the Input (this one has them forced on)"
    >
      <Input {...args} hasErrors showErrors>
        <div slot="errors">
          Your password must contain a proof of Pythagoras' theorem!
        </div>
      </Input>
    </Slot>
  </SlotInfo>
</Story>

<style>
  [slot='errors'] {
    display: flex;
    flex-direction: row;
    gap: var(--leo-spacing-8);
    align-items: center;

    margin-top: var(--leo-spacing-4);

    color: var(--leo-color-systemfeedback-error-icon);
  }
</style>
