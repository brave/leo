<script context="module">
  import Ring from './progressRing.svelte'

  export const meta = {
    title: 'Components/Progress Ring',
    component: Ring,
    argTypes: {
      '--leo-progressring-spin-rate': {
        type: 'string',
        description: 'The rate that the indeterminate spinner spins at'
      },
      '--leo-progressring-color': {
        type: 'string',
        control: 'color',
        description: 'The color of the progress on the progress ring'
      },
      '--leo-progressring-size': {
        type: 'string',
        description: 'The size of the progress ring'
      },
      progress: {
        control: {
          type: 'number',
          min: 0,
          max: 1,
          step: 0.1
        },
        description: 'A number between 0 and 1 to describe current progress'
      },
      mode: {
        type: 'string',
        description: 'The mode of the progress indicator',
        control: 'select',
        options: ['determinate', 'indeterminate']
      }
    },
    args: {
      mode: 'indeterminate'
    }
  }
</script>

<script lang="ts">
  import { Story } from '@storybook/addon-svelte-csf'
  import Icon from '../icon/icon.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import ProgressRing from './progressRing.svelte'
</script>

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

<Story name="Default Ring" let:args>
  <Ring {...args} />
</Story>
