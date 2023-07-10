<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Icon from '../icon/icon.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import Tooltip, { modes } from './tooltip.svelte'
  import Button from '../button/button.svelte'

  const sides = ['top', 'bottom', 'left', 'right']
  const positions = ['', '-start', '-end']
  const placements = positions.flatMap((p) => sides.map((s) => `${s}${p}`))
</script>

<Meta
  title="Tooltip"
  component={Tooltip}
  argTypes={{
    text: { control: 'text', defaultValue: 'A helpful hint' },
    mode: { control: 'select', options: modes, defaultValue: 'default' },
    placement: { control: 'select', options: placements }
  }}
/>

<Template let:args>
  <Tooltip {...args}>
    <Button>Trigger</Button>
  </Tooltip>
</Template>

<Story name="Slots" let:args>
  <SlotInfo description="">
    <Slot name="default" explanation="The trigger for the tooltip">
      <Tooltip {...args} />
    </Slot>
  </SlotInfo>
</Story>

<Story name="Default" />
