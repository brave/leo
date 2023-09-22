<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Ring from './progressRing.svelte'
  import Icon from '../icon/icon.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import ProgressRing from './progressRing.svelte'
</script>

<Meta
  title="Components/Progress Ring"
  component={Ring}
  argTypes={{
    '--leo-progressring-spin-rate': {
      type: 'string',
      description: 'The rate that the indeterminate spinner spins at'
    },
    '--leo-progressring-color': {
      type: 'string',
      control: 'color',
      description: 'The color of the progress on the progress ring'
    },
    '--leo-progressring-background-color': {
      type: 'string',
      control: 'color',
      description: 'The color of the progress ring'
    },
    '--leo-progressring-size': {
      type: 'string',
      description: 'The size of the progress ring'
    },
    mode: {
      type: 'string',
      description: 'The mode of the progress indicator',
      control: 'select',
      options: ['determinate', 'indeterminate'],
      defaultValue: 'indeterminate'
    }
  }}
/>

<Story name="Slots" let:args>
  <SlotInfo
    description="The progress ring has a default slot, for configuring central content"
  >
    <Slot name="default" explanation="The content to display inside the ring">
      <ProgressRing {...args}>
        <div style="color: var(--leo-color-icon-default)">
          <Icon name="notification" />
        </div>
      </ProgressRing>
    </Slot>
  </SlotInfo>
</Story>

<Story name="Ring" let:args>
  <Ring {...args} />
</Story>
