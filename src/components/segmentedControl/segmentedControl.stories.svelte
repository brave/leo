<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import SegmentedControl from './segmentedControl.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import Icon from '../icon/icon.svelte'

  let selected = "item1";
</script>

<Meta
  title="Components/SegmentedControl"
  component={SegmentedControl}
  argTypes={{}}
  args={{}}
/>

<Template let:args>
  <SegmentedControl {...args} bind:selected>
    <leo-segmented-item value="item1">
      <Icon name="check-circle-outline" />
      Item
    </leo-segmented-item>
  
    <leo-segmented-item value="item2">
      <Icon name="check-circle-outline" />
      Item
    </leo-segmented-item>
  
    <leo-segmented-item value="item3">
      <Icon name="check-circle-outline" />
      Item
    </leo-segmented-item>
  </SegmentedControl>
</Template>

<Story name="Slots" let:args>
  <SlotInfo
    description=""
  >
    <Slot name="default">
    </Slot>
  </SlotInfo>
</Story>

<Story name="Default" />
