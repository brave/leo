<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Checkbox from './checkbox.svelte'
</script>

<Meta title="Checkbox" component={Checkbox} />

<Template let:args>
  <Checkbox {...args}>Label</Checkbox>
</Template>

<Story name="Primary" />
