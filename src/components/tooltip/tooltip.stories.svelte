<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import Tooltip, { modes } from './tooltip.svelte'
  import Button from '../button/button.svelte'
  import Checkbox from '../checkbox/checkbox.svelte'

  const sides = ['top', 'bottom', 'left', 'right']
  const positions = ['', '-start', '-end']
  const placements = positions.flatMap((p) => sides.map((s) => `${s}${p}`))

  let showTooltip = false
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

<Story name="Controlled" let:args>
  <Checkbox bind:checked={showTooltip}>Show tooltip</Checkbox>
  <Tooltip {...args} visible={showTooltip}>
    Some text with a triggered tooltip
  </Tooltip>
</Story>
