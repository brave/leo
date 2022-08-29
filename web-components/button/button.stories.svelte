
<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';

  import Button from './button.svelte';

  let count = 0;
  function handleClick() {
    count += 1;
  }
</script>

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

<Meta title="Button" component={Button}/>

<Template let:args>
  <Button {...args} on:click={handleClick}>
    You clicked: {count}
  </Button>
</Template>

<Story name="Primary" args={{kind: 'primary'}}/>

<Story name="Secondary" source args={{kind: 'secondary'}}/>

<Story name="All" let:args>
  <h2 class="label">Large</h2>
  <div class="button-group">
    <Button kind="primary" size="large" {...args}>Primary</Button>
    <Button kind="secondary" size="large" {...args}>Secondary</Button>
    <Button kind="tertiary" size="large" {...args}>Tertiary</Button>
  </div>
  <h2 class="label">Medium</h2>
  <div class="button-group">
    <Button kind="primary" size="medium" {...args}>Primary</Button>
    <Button kind="secondary" size="medium" {...args}>Secondary</Button>
    <Button kind="tertiary" size="medium" {...args}>Tertiary</Button>
  </div>
  <h2 class="label">Small</h2>
  <div class="button-group">
    <Button kind="primary" size="small" {...args}>Primary</Button>
    <Button kind="secondary" size="small" {...args}>Secondary</Button>
    <Button kind="tertiary" size="small" {...args}>Tertiary</Button>
  </div>
</Story>
