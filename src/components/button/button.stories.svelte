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

<Story name="Quaternary" source args={{ kind: 'quaternary' }} />

<Story name="All" let:args>
  {#each buttonSizes as size}
    <h2 class="label capitalize">{size}</h2>
    <div class="button-group">
      {#each buttonKinds as kind}
        <Button kind={kind} size={size} {...args}>
          <span class="capitalize">{kind}</span>
        </Button>
      {/each}
    </div>
  {/each}
</Story>

<style>
  .button-group {
    margin-bottom: 24px;
    display: flex;
    gap: 24px;
    align-items: center;
  }
  .capitalize { 
    text-transform: capitalize;
  }
  .label {
    font: 500 14px sans-serif;
  }
</style>
