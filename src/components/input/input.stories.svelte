<script context="module">
  import Input from './input.svelte'
  import { cssProperties, modes, sizes } from '../formItem/formItem.svelte'

  export const meta = {
    title: 'Components/Input',
    component: Input,
    argTypes: {
      ...cssProperties,
      placeholder: {
        type: 'string',
        description: 'The placeholder'
      },
      label: {
        type: 'string',
        description: 'This is not a real prop of the component, it is just useful for configuring the storybook'
      },
      type: {
        control: 'select',
        options: ['text', 'password', 'date', 'time', 'color', 'number']
      },
      size: {
        control: 'select',
        options: sizes
      },
      mode: {
        control: 'select',
        options: modes
      }
    },
    args: {
      label: 'Label'
    }
  }
</script>
<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'

  import Icon from '../icon/icon.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'

  let characterCountValue = ''
</script>

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

<Story name="Inline" args={{ mode: 'inline' }} />

<Story name="Character Count" let:args>
  <Input {...args} bind:value={characterCountValue}>
    {args.label}
    <div slot="extra">{characterCountValue.length}/100</div>
    <Icon name="send" slot="right-icon" />
  </Input>
</Story>

<Story name="Slots" let:args>
  <SlotInfo
    description="The input provides several slots for customization. In addition, it accepts all properties which the default HTML Input element accepts"
  >
    <Slot name="default" explanation="The label for the input">
      <Input {...args}>
        <span>This is a label: <b>foo</b><i>bar</i><s>hello</s></span>
      </Input>
    </Slot>
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
      explanation="A slot where any errors related to the component will be shown. Errors are only show if showErrors is set and an error slot exists on the Input (this one has them forced on)"
    >
      <Input {...args} showErrors>
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
    gap: var(--leo-spacing-m);
    align-items: center;

    margin-top: var(--leo-spacing-s);

    color: var(--leo-color-systemfeedback-error-icon);
  }
</style>
