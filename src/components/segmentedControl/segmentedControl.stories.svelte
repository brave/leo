<script context="module">
  import SegmentedControl, {
    segmentedControlSizes
  } from './segmentedControl.svelte'

  export const meta = {
    title: 'Components/SegmentedControl',
    component: SegmentedControl,
    argTypes: {
      '--leo-segmented-control-width': {
        control: 'text',
        type: 'string',
        description:
          'The width for the entire control (defaults to `fit-content`).'
      },
      '--leo-control-padding': {
        control: 'text',
        type: 'string',
        description: 'The padding for the entire control.'
      },
      '--leo-segmented-control-item-radius': {
        control: 'text',
        type: 'string',
        description: 'The radius for the individual control items.'
      },
      '--leo-segmented-control-item-height': {
        control: 'text',
        type: 'string',
        description: 'The height for the individual control items.'
      },
      '--leo-segmented-control-item-padding': {
        control: 'text',
        type: 'string',
        description: 'The padding for the individual control items.'
      },
      '--leo-segmented-control-item-color': {
        control: 'text',
        type: 'string',
        description: 'The text color for the individual control items.'
      },
      '--leo-segmented-control-item-font': {
        control: 'text',
        type: 'string',
        description:
          'The font (shorthand CSS property) for the individual control items.'
      },
      '--leo-segmented-control-item-background': {
        control: 'text',
        type: 'string',
        description: 'The background color for the individual control items.'
      },
      '--leo-segmented-control-item-shadow': {
        control: 'text',
        type: 'string',
        description:
          "The box shadow for the individual control items' hover state."
      },
      '--leo-segmented-control-item-icon-color': {
        control: 'text',
        type: 'string',
        description: 'The icon color for the individual control items.'
      },
      '--leo-segmented-control-item-icon-gap': {
        control: 'text',
        type: 'string',
        description:
          'The gap between icon and content for the individual control items.'
      },
      size: {
        control: 'select',
        options: segmentedControlSizes
      },
      value: {
        table: {
          disable: true
        }
      },
      segmentedControlSizes: {
        table: {
          disable: true
        }
      }
    },
    args: {}
  }
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf'

  import Slot from '../../storyHelpers/Slot.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import ControlItem from './segmentedControlItem.svelte'
  import Icon from '../icon/icon.svelte'

  let selected = 'full'
</script>

<Template let:args>
  <p>Selected item: <code>{selected}</code></p>
  {#key args.size}
    <SegmentedControl {...args} bind:value={selected}>
      <ControlItem value="full">
        <Icon slot="icon-before" name="check-circle-outline" />
        Full
      </ControlItem>

      <ControlItem value="simple">
        <Icon slot="icon-before" name="check-circle-outline" />
        Simple
      </ControlItem>
    </SegmentedControl>
  {/key}
</Template>

<Story name="Slots">
  <SlotInfo
    description="This component accepts one slot. This slot should only contain ControlItem components."
  >
    <Slot name="default" explanation="The individual segments for the control.">
      <SegmentedControl bind:value={selected}>
        <ControlItem value="full">
          <Icon slot="icon-before" name="check-circle-outline" />
          Full
        </ControlItem>

        <ControlItem value="simple">
          <Icon slot="icon-before" name="check-circle-outline" />
          Simple
        </ControlItem>
      </SegmentedControl>
    </Slot>
  </SlotInfo>
</Story>

<Story name="Default" />
