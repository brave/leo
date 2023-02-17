<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Ring from './progressRing.svelte'
  import Icon from '../icon/icon.svelte'
  import { getStyleFromArgs } from '../../../.storybook/argHelper'
</script>

<Meta
  title="Progress Ring"
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

<Story name="Ring" let:args>
  <div style={getStyleFromArgs(args)}>
    <Ring {...args} />
  </div>
</Story>

<Story name="Ring Icon" let:args>
  <div style={getStyleFromArgs(args)}>
    <Ring {...args}>
      <div style="color: var(--leo-color-icon-default)">
        <Icon name="notification" />
      </div>
    </Ring>
  </div>
</Story>
