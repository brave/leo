<script lang="ts">
  import { Meta, Story } from '@storybook/addon-svelte-csf'
  import Ring from './progressRing.svelte'
  import Icon from '../icon/icon.svelte'
</script>

<Meta
  title="Progress Ring"
  component={Ring}
  argTypes={{
    strokeColor: {
      name: 'color',
      type: 'string',
      control: 'color'
    },
    backgroundColor: {
      name: 'background',
      type: 'string',
      control: 'color'
    }
  }}
/>

<Story name="Ring" let:args>
  <div
    style:--leo-progress-color={args.strokeColor || 'unset'}
    style:--leo-progress-background-color={args.backgroundColor || 'unset'}
  >
    <Ring {...args} />
  </div>
</Story>

<Story name="Ring Icon" let:args>
  <div
    style:--leo-progress-color={args.strokeColor || 'unset'}
    style:--leo-progress-background-color={args.backgroundColor || 'unset'}
  >
    <Ring {...args}>
      <div style="color: var(--color-icon-default)">
        <Icon name="notification" />
      </div>
    </Ring>
  </div>
</Story>
