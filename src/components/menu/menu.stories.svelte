<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Menu from './menu.svelte'
  import Icon from '../icon/icon.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
</script>

<Meta
  title="Menu"
  component={Menu}
  argTypes={{
    isOpen: {
      type: 'boolean',
      defaultValue: true,
      description:
        "This isn't a real prop of the component, it's just useful for configuring the storybook"
    }
  }}
/>

<Template let:args>
  <div class="container">
    <Menu isOpen={args.isOpen}>
      <leo-menu-item>
        <div>Regenerate</div>
      </leo-menu-item>
      <leo-menu-item> Copy </leo-menu-item>
      <leo-menu-item> Share </leo-menu-item>
      <leo-menu-item>
        <div>New Chat</div>
        <Icon name="plus-add" />
      </leo-menu-item>
    </Menu>
  </div>
</Template>

<Story name="Default" />

<Story name="Slots" let:args>
  <SlotInfo
    description="The input provides several slots for customization. In addition, it accepts all properties which the default HTML Input element accepts"
  >
    <Slot name="default" explanation="Menu with leo-menu-item">
      <Menu isOpen={args.isOpen}>
        <leo-menu-item>
          <div>Regenerate</div>
        </leo-menu-item>
        <leo-menu-item> Copy </leo-menu-item>
        <leo-menu-item> Share </leo-menu-item>
        <leo-menu-item>
          <div>New Chat</div>
          <Icon name="plus-add" />
        </leo-menu-item>
      </Menu>
    </Slot>
  </SlotInfo>
</Story>

<style>
  .container {
    width: 250px;
  }

  leo-menu-item {
    --leo-icon-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
