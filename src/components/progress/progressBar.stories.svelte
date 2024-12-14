<script context="module">
  import Bar from './progressBar.svelte'

  export const meta = {
    title: 'Components/Progress Bar',
    component: Bar,
    argTypes: {
      '--leo-progressbar-radius': {
        type: 'string',
        description: 'The border radius of the progress bar'
      },
      '--leo-progressbar-height': {
        type: 'string',
        description: 'The height of the progress bar'
      },
      '--leo-progressbar-background-color': {
        type: 'string',
        control: 'color',
        description: 'The background color of the progress bar'
      },
      '--leo-progressbar-color': {
        type: 'string',
        control: 'color',
        description: 'The color of the progress on the progress bar'
      }
    }
  }
</script>

<script lang="ts">
  import { Story } from '@storybook/addon-svelte-csf'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
</script>

<Story name="Slots">
  <SlotInfo description="The progress bar has no slots" />
</Story>

<Story name="Default Bar" let:args>
  <Bar {...args} />
</Story>
