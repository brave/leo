<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Ring from './progressRing.svelte'
  import Bar from './progressBar.svelte'
  import Icon from '../icon/icon.svelte'
</script>

<Meta
  title="Progress Components"
  component={Ring}
  argTypes={{
    color: { control: 'color', defaultValue: 'var(--color-icon-default)' }
  }}
/>

<Story name="Ring" let:args>
  <Ring {...args} />
</Story>

<Story name="Ring Icon" let:args>
  <div style="color: {args.color}">
    <Ring {...args}>
      <Icon name="notification" />
    </Ring>
  </div>
</Story>

<Story name="Bar" let:args>
  <div style="color: {args.color}">
    <Bar {...args} />
  </div>
</Story>
