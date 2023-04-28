<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Dropdown from './dropdown.svelte'
</script>

<Meta
  title="Dropdown"
  component={Dropdown}
  argTypes={{
    placeholder: {
      defaultValue: 'select...'
    }
  }}
/>

<Template let:args>
  <div class="container">
    <Dropdown {...args} options={['one', 'two', 'three']} />
  </div>
</Template>

<Story name="Default" />

<style>
  .container {
    width: 200px;
  }
</style>
