<script lang="ts">
    import { Meta, Story, } from '@storybook/addon-svelte-csf'
    import Bar from './progressBar.svelte'
  </script>
  
  <Meta
    title="Progress Bar"
    component={Bar}
    argTypes={{
      '--leo-progressbar-radius': {
        type: 'number',
        description: 'The border radius of the progress bar',
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
    }}
  />
  
  <Story name="Bar" let:args>
    <div
      style:--leo-progress-color={args.strokeColor || 'unset'}
      style:--leo-progress-background-color={args.backgroundColor || 'unset'}
    >
      <Bar {...args} />
    </div>
  </Story>
  