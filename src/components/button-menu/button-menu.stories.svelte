<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import ButtonMenu from './button-menu.svelte'
  import Icon from '../icon/icon.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
</script>

<Meta title="ButtonMenu" component={ButtonMenu} />

<Template let:args>
  <div class="container">
    <ButtonMenu>
      <leo-menu-item> Copy </leo-menu-item>
      <leo-menu-item> Share </leo-menu-item>
      <leo-menu-item>
        <div class="item">
          <div>New Chat</div>
          <Icon name="plus-add" />
        </div>
      </leo-menu-item>
    </ButtonMenu>
  </div>
</Template>

<Story name="Default" />

<Story name="Slots" let:args>
  <SlotInfo
    description="The ButtonMenu provides several slots for customization. It accepts 'leo-menu-item' and 'leo-option.' 'Leo-menu-item' is mainly used for context menus, which are contained within a menu, while 'leo-option' is used for selectable choices."
  >
    <Slot
      name="anchor-content"
      explanation="A custom icon inside of anchor button"
    >
      <ButtonMenu>
        <div slot="anchor-content">
          <Icon name="more-horizontal" />
        </div>
        <leo-menu-item> Copy </leo-menu-item>
        <leo-menu-item> Share </leo-menu-item>
        <leo-menu-item>
          <div class="item">
            <div>New Chat</div>
            <Icon name="plus-add" />
          </div>
        </leo-menu-item>
      </ButtonMenu>
    </Slot>
  </SlotInfo>
</Story>

<style>
  .container {
    width: 250px;
  }

  .item {
    --leo-icon-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
