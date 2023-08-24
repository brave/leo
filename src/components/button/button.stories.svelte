<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Button from './button.svelte'
  import { buttonKinds, buttonSizes } from './props'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import Icon from '../icon/icon.svelte'

  let count = 0
  function handleClick() {
    count += 1
  }
</script>

<Meta
  title="Button"
  component={Button}
  argTypes={{
    '--leo-button-padding': {
      control: 'text',
      type: 'string',
      description: 'The padding to apply to the button content'
    },
    kind: { control: 'select', options: buttonKinds },
    size: { control: 'select', options: buttonSizes }
  }}
/>

<Template let:args>
  <Button {...args} on:click={handleClick}>
    You clicked: {count}
  </Button>
</Template>

<Story name="Slots" let:args>
  <SlotInfo
    description="The button contains a single slot, for setting the content of the button"
  >
    <Slot name="default" explanation="The content of the button">
      <Button {...args}>
        Button <b>can</b> <i>contain</i> <s>HTML</s>
      </Button>
    </Slot>
  </SlotInfo>
</Story>

<Story name="Hero" args={{ kind: 'hero' }} />

<Story name="Filled" args={{ kind: 'filled' }} />

<Story name="Outline" source args={{ kind: 'outline' }} />

<Story name="Plain" source args={{ kind: 'plain' }} />

<Story name="Plain Faint" source args={{ kind: 'plain-faint' }} />

<Story name="FAB" let:args>
  <Button {...args} fab>
    <Icon name="check-circle-outline" />
  </Button>
</Story>

<Story name="All" let:args>
  {#each [false, true] as fab}
    {#each buttonSizes as size}
      <h2 class="label capitalize">{size}</h2>
      <div class="button-group">
        {#each buttonKinds as kind}
          <Button {kind} {size} {fab} {...args}>
            {#if !fab}
              <span class="capitalize">{kind}</span>
            {:else}
              <Icon name="check-circle-outline" />
            {/if}
          </Button>
        {/each}
      </div>
    {/each}
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
