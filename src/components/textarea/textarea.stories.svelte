<script context="module">
  import TextArea from './textarea.svelte'
  import { cssProperties, modes } from '../formItem/formItem.svelte'

  export const meta = {
    title: 'Components/TextArea',
    component: TextArea,
    argTypes: {
      ...cssProperties,
      placeholder: {
        type: 'string',
        description: 'The placeholder'
      },
      label: {
        type: 'string',
        description:
          "This isn't a real prop of the component, it's just useful for configuring the storybook"
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
  <TextArea {...args}>
    {args.label}
  </TextArea>
</Template>

<Story name="Default" />

<Story name="Resizable" let:args>
  <TextArea {...args} resizeable>
    {args.label}
  </TextArea>
</Story>

<Story name="minRows/maxRows" let:args>
  <TextArea {...args} minRows="1" maxRows="3">
    {args.label}
  </TextArea>
</Story>

<Story name="Character Count" let:args>
  <TextArea {...args} bind:value={characterCountValue}>
    {args.label}
    <div slot="extra">{characterCountValue.length}/100</div>
  </TextArea>
</Story>

<Story name="Slots" let:args>
  <SlotInfo
    description="The input provides several slots for customization. In addition, it accepts all properties which the default HTML Input element accepts"
  >
    <Slot name="default" explanation="The label for the input">
      <TextArea {...args}>
        <span>This is a label: <b>foo</b><i>bar</i><s>hello</s></span>
      </TextArea>
    </Slot>
    <Slot
      name="left-icon"
      explanation="An icon displayed on the left hand side of the input"
    >
      <TextArea {...args}>
        <Icon name="list-heart" slot="left-icon" />
      </TextArea>
    </Slot>
    <Slot
      name="right-icon"
      explanation="An icon displayed on the right hand side of the input. If unset, a picker icon may be displayed here for some inputs (such as the date/time/color pickers)"
    >
      <TextArea {...args}>
        <Icon name="code" slot="right-icon" />
      </TextArea>
    </Slot>
    <Slot
      name="extra"
      explanation="A slot for displaying extra information in the input"
    >
      <TextArea {...args}>
        <span slot="extra">This is a very helpful message</span>
      </TextArea>
    </Slot>
    <Slot
      name="errors"
      explanation="A slot where any errors related to the component will be shown. Errors are only show if showErrors is set and an error slot exists on the Input (this one has them forced on)"
    >
      <TextArea {...args} showErrors>
        <div slot="errors">
          Your password must contain a proof of Pythagoras' theorem!
        </div>
      </TextArea>
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
