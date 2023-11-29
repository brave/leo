<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Slot from '../../storyHelpers/Slot.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import ControlItem from '../controlItem/controlItem.svelte'
  import Icon from '../icon/icon.svelte'
  import SegmentedControl, {
    segmentedControlSizes
  } from './segmentedControl.svelte'

  let selected = 'item1'
</script>

<Meta
  title="Components/SegmentedControl"
  component={SegmentedControl}
  argTypes={{
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
  }}
  args={{}}
/>

<Template let:args>
  <p>Selected item: <code>{selected}</code></p>
  {#key args.size}
    <SegmentedControl {...args} bind:value={selected}>
      <ControlItem value="item1">
        <Icon slot="icon-before" name="check-circle-outline" />
        Item
      </ControlItem>

      <ControlItem value="item2">
        <Icon slot="icon-before" name="check-circle-outline" />
        Item
      </ControlItem>

      <ControlItem value="item3">
        <Icon slot="icon-before" name="check-circle-outline" />
        Item
      </ControlItem>
    </SegmentedControl>
  {/key}
</Template>

<Story name="Slots">
  <SlotInfo
    description="This component accepts one slot. This slot should only contain ControlItem components."
  >
    <Slot name="default"></Slot>
  </SlotInfo>
</Story>

<Story name="Default" />
