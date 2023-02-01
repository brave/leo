<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Button from './button.svelte'
  import { buttonKinds, buttonSizes } from './props'

  let count = 0
  function handleClick() {
    count += 1
  }
</script>

<Meta
  title="Button"
  component={Button}
  argTypes={{
    kind: { control: 'select', options: buttonKinds },
    size: { control: 'select', options: buttonSizes }
  }}
/>

<Template let:args>
  <Button {...args} on:click={handleClick}>
    You clicked: {count}
  </Button>
</Template>

<Story name="Hero" args={{ kind: 'hero' }} />

<Story name="Primary" args={{ kind: 'primary' }} />

<Story name="Secondary" source args={{ kind: 'secondary' }} />

<Story name="Tertiary" source args={{ kind: 'tertiary' }} />

<Story name="All" let:args>
  <h2 class="label">Large</h2>
  <div class="button-group">
    <Button kind="hero" size="large" {...args}>Hero</Button>
    <Button kind="primary" size="large" {...args}>Primary</Button>
    <Button kind="secondary" size="large" {...args}>Secondary</Button>
    <Button kind="tertiary" size="large" {...args}>Tertiary</Button>
  </div>
  <h2 class="label">Medium</h2>
  <div class="button-group">
    <Button kind="hero" size="medium" {...args}>Hero</Button>
    <Button kind="primary" size="medium" {...args}>Primary</Button>
    <Button kind="secondary" size="medium" {...args}>Secondary</Button>
    <Button kind="tertiary" size="medium" {...args}>Tertiary</Button>
  </div>
  <h2 class="label">Small</h2>
  <div class="button-group">
    <Button kind="hero" size="small" {...args}>Hero</Button>
    <Button kind="primary" size="small" {...args}>Primary</Button>
    <Button kind="secondary" size="small" {...args}>Secondary</Button>
    <Button kind="tertiary" size="small" {...args}>Tertiary</Button>
  </div>
</Story>

<style>
  .button-group {
    margin-bottom: 24px;
    display: flex;
    gap: 24px;
    align-items: center;
  }
  .label {
    font: 500 14px sans-serif;
  }
</style>
