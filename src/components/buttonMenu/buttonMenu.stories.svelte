<script context="module">
  import ButtonMenu from './buttonMenu.svelte'

  export const meta = {
    title: 'Components/ButtonMenu',
    component: ButtonMenu,
    argTypes: {
      '--leo-menu-control-width': {
        description: '(readonly): Computed width of menu control'
      },
      '--leo-menu-max-height': {
        description: 'user controlled max height'
      }
    }
  }
</script>
<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'

  import Icon from '../icon/icon.svelte'
  import Hr from '../hr/hr.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import Toggle from '../toggle/toggle.svelte'
  import Checkbox from '../checkbox/checkbox.svelte'
  import Button from '../button/button.svelte'

  let toggleIsChecked = false
  let controlledMenuOpen = false

  const handleAction = () => console.log('action')

</script>

<Template let:args>
  <div class="container">
    <ButtonMenu>
      <span slot="anchor-content">Click Me!</span>
      <leo-title> 
        Section title here 
      </leo-title>
      <leo-menu-item on:click={handleAction}> Copy </leo-menu-item>
      <leo-menu-item> Share </leo-menu-item>
      <!-- Divider -->
      <Hr />
      <leo-title> 
        Section title here 
      </leo-title>
      <leo-menu-item>
        <div class="item">
          <div>New Chat</div>
          <Icon name="plus-add" />
        </div>
      </leo-menu-item>
      <div class="custom-item">
        <div>Suggested questions</div>
        <Toggle bind:checked={toggleIsChecked} size="small" />
      </div>
      <leo-menu-item
        class="item"
        on:click={(e) => {
          handleAction()
          toggleIsChecked = !toggleIsChecked
        }}
        data-is-interactive="true"
      >
        <div>Suggested questions</div>
        <Toggle bind:checked={toggleIsChecked} size="small" />
      </leo-menu-item>
    </ButtonMenu>
  </div>
</Template>

<Story name="Default" />

<!-- TODO(petemill): We should probably only allow leo-menu-item for ButtonMenu, otherwise it gets complicated about event dispatching. Alternatively, we
        should cleanup item selection handling in Menu.svelte and have Menu know whether it is in Select mode or not. -->
<Story name="Slots" let:args>
  <SlotInfo description="">
    <Slot name="default" explanation="The menu items">
      <p>
        The ButtonMenu provides a default slot for menu items. It accepts
        &lt;leo-menu-item&gt; and &lt;leo-option&gt; elements as well as any
        other element types.
      </p>
      <ul>
        <li>
          Use &lt;leo-menu-item&gt; for menu-style commands and
          &lt;leo-option&gt; for select-style selectable choices.
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
      <ButtonMenu {...args}>
        <div slot="anchor-content">
          <Icon name="more-horizontal" />
        </div>
        <leo-menu-item> 
          Copy 
        </leo-menu-item>
        <leo-menu-item> 
          Share 
        </leo-menu-item>
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

<Story name="Controlled" let:args>
  <Checkbox bind:checked={controlledMenuOpen}>Open</Checkbox>
  **Note:** Clicking the checkbox will not close the menu.
  <ButtonMenu {...args} isOpen={controlledMenuOpen} onClose={() => (controlledMenuOpen = false)} onChange={e => (controlledMenuOpen = e.isOpen)}>
    <div slot="anchor-content">
      <Icon name="more-horizontal" />
    </div>
    <leo-menu-item> 
      Copy 
    </leo-menu-item>
    <leo-menu-item> 
      Share 
    </leo-menu-item>
    <leo-menu-item>
      <div class="item">
        <div>New Chat</div>
        <Icon name="plus-add" />
      </div>
    </leo-menu-item>
  </ButtonMenu>
</Story>

<Story name="Multiple Menus" let:args>
  <div class="multi">
    <ButtonMenu {...args}>
      <Button slot="anchor-content">Anchor 1</Button>
      <leo-menu-item>First</leo-menu-item>
      <leo-menu-item>Second</leo-menu-item>
    </ButtonMenu>
    <ButtonMenu {...args}>
      <Button slot="anchor-content">Anchor 2</Button>
      <leo-menu-item>Third</leo-menu-item>
      <leo-menu-item>Fourth Fourth Fourth Fourth Fourth Fourth</leo-menu-item>
    </ButtonMenu>
  </div>
</Story>

<Story name="With Sections" let:args>
  <div class="container">
    <ButtonMenu {...args}>
      <span slot="anchor-content">Menu with Sections</span>
      <leo-title> 
        Section title here 
      </leo-title>
      <!-- Section 1 -->
      <leo-menu-section>
        <leo-menu-item on:click={handleAction}> Item 1 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 2 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 3 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 4 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 5 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 6 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 7 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 8 </leo-menu-item>
      </leo-menu-section> 
      <!-- Divider -->
      <Hr />
      <!-- Section 2 -->
      <leo-menu-item on:click={handleAction}> Select All </leo-menu-item>
      <leo-menu-item on:click={handleAction}> Find </leo-menu-item>
      <!-- Divider -->
      <Hr />
      <!-- Section 3 -->
      <leo-menu-item on:click={handleAction}>
        <div class="item">
          <div>Settings</div>
          <Icon name="settings" />
        </div>
      </leo-menu-item>
    </ButtonMenu>
  </div>
</Story>

<Story name="With Scrollable Sections" let:args>
  <div class="container">
    <ButtonMenu {...args}>
      <span slot="anchor-content">Scrollable Sections</span>
      <!-- Section 1: Fixed items -->
      <leo-title> 
        Section title here 
      </leo-title>
      <leo-menu-item on:click={handleAction}> New </leo-menu-item>
      <leo-menu-item on:click={handleAction}> Open </leo-menu-item>
      <!-- Divider -->
      <Hr />
      <!-- Section 2: Scrollable list with max-height -->
      <leo-menu-section style="--leo-menu-section-max-height: 150px;">
        <leo-menu-item on:click={handleAction}> Item 1 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 2 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 3 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 4 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 5 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 6 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 7 </leo-menu-item>
        <leo-menu-item on:click={handleAction}> Item 8 </leo-menu-item>
      </leo-menu-section>
      <!-- Divider -->
      <Hr />
      <!-- Section 3: Fixed items -->
       <leo-title> 
        Section title here 
      </leo-title>
      <leo-menu-item on:click={handleAction}>
        <div class="item">
          <div>Settings</div>
          <Icon name="settings" />
        </div>
      </leo-menu-item>
    </ButtonMenu>
  </div>
</Story>

<style>
  .container {
    width: 300px;
  }

  .item {
    --leo-icon-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .custom-item {
    margin: var(--leo-menu-item-margin);
    padding: var(--leo-menu-item-padding);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .multi {
    display: flex;
    gap: 10px;
  }
</style>
