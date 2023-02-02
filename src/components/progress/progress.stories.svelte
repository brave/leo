<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Ring from './progressRing.svelte'
  import Bar from './progressBar.svelte'
  import Icon from '../icon/icon.svelte'
</script>

<Meta title="Progress Components" component={Ring} argTypes={{}} />

<Story name="Ring" let:args>
  <Ring {...args} />
</Story>

<Story name="Ring Icon" let:args>
  <Ring {...args}>
    <div style="color: var(--color-icon-default)">
      <Icon name="notification" />
    </div>
  </Ring>
</Story>

<Story name="Bar" let:args>
  <Bar {...args} />
</Story>
