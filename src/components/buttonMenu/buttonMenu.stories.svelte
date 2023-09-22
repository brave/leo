<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import ButtonMenu from './buttonMenu.svelte'
  import Icon from '../icon/icon.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import Toggle from '../toggle/toggle.svelte'
</script>

<Meta title="Components/ButtonMenu" component={ButtonMenu} />

<Template let:args>
  <div class="container">
    <ButtonMenu>
      <leo-menu-item> Copy </leo-menu-item>
      <leo-menu-item> Share </leo-menu-item>
      <div class="section">Section</div>
      <leo-menu-item>
        <div class="item">
          <div>New Chat</div>
          <Icon name="plus-add" />
        </div>
      </leo-menu-item>
      <div class="item">
        <div>Suggested questions</div>
        <Toggle />
      </div>
    </ButtonMenu>
  </div>
</Template>

<Story name="Default" />

<Story name="Slots" let:args>
  <SlotInfo
    description="The ButtonMenu provides several slots for customization. It accepts '<leo-menu-item>' and '<leo-option>' elements as well as any other element types. Use '<leo-menu-item>' for menu-style commands and '<leo-option>' for select-style selectable choices."
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
    width: 300px;
  }

  .item {
    --leo-icon-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .section {
    border-top: 1px solid rgba(128, 128, 128, 0.225);
    padding-top: 0;
    padding-bottom: 0;
    font-size: 12px;
    color: grey;
  }

  .section:hover {
    color: grey;
  }
</style>
