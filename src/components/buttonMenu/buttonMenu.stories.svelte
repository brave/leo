<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import ButtonMenu from './buttonMenu.svelte'
  import Icon from '../icon/icon.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import Toggle from '../toggle/toggle.svelte'

  export let toggleIsChecked = false
</script>

<Meta title="ButtonMenu" component={ButtonMenu} />

<Template let:args>
  <div class="container">
    <ButtonMenu>
      <nl-menu-item> Copy </nl-menu-item>
      <nl-menu-item> Share </nl-menu-item>
      <div class="section">Section</div>
      <nl-menu-item>
        <div class="item">
          <div>New Chat</div>
          <Icon name="plus-add" />
        </div>
      </nl-menu-item>
      <div class="custom-item">
        <div>Suggested questions</div>
        <Toggle size="small" />
      </div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <nl-menu-item
        class="item"
        on:click|stopPropagation={(e) => {
          toggleIsChecked = !toggleIsChecked
        }}
        data-is-interactive="true"
      >
        <div>Suggested questions</div>
        <Toggle checked={toggleIsChecked} size="small" />
      </nl-menu-item>
    </ButtonMenu>
  </div>
</Template>

<Story name="Default" />

<!-- TODO(petemill): We should probably only allow nl-menu-item for ButtonMenu, otherwise it gets complicated about event dispatching. Alternatively, we
        should cleanup item selection handling in Menu.svelte and have Menu know whether it is in Select mode or not. -->
<Story name="Slots" let:args>
  <SlotInfo description="">
    <Slot name="default" explanation="The menu items">
      <p>
        The ButtonMenu provides a default slot for menu items. It accepts
        &lt;nl-menu-item&gt; and &lt;nl-option&gt; elements as well as any other
        element types.
      </p>
      <ul>
        <li>
          Use &lt;nl-menu-item&gt; for menu-style commands and &lt;nl-option&gt;
          for select-style selectable choices.
        </li>
        <li>
          Add the data-is-interactive=true attribute if you want the item to not
          cause the menu to close when clicked / selected (perhaps its
          interactive, like a Toggle and you want the user to see that the
          Toggle changed)
        </li>
        <li>
          Use other element types if you want to handle layout and selection
          independently (set tabindex to 0 on child interactive elements).
        </li>
      </ul>
    </Slot>

    <Slot
      name="anchor-content"
      explanation="A custom icon inside of anchor button"
    >
      <ButtonMenu>
        <div slot="anchor-content">
          <Icon name="more-horizontal" />
        </div>
        <nl-menu-item> Copy </nl-menu-item>
        <nl-menu-item> Share </nl-menu-item>
        <nl-menu-item>
          <div class="item">
            <div>New Chat</div>
            <Icon name="plus-add" />
          </div>
        </nl-menu-item>
      </ButtonMenu>
    </Slot>
  </SlotInfo>
</Story>

<style>
  .container {
    width: 300px;
  }

  .item {
    --nl-icon-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .custom-item {
    margin: var(--nl-menu-item-margin);
    padding: var(--nl-menu-item-padding);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .section {
    margin: var(--nl-menu-item-margin);
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
