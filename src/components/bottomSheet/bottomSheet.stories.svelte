<script context="module">
  import BottomSheet from './bottomSheet.svelte'

  export const meta = {
    title: 'Components/BottomSheet',
    component: BottomSheet,
    argTypes: {
      '--leo-bottomsheet-max-height': {
        type: 'string',
        description: 'Max height of the bottom sheet (default: 85vh)'
      },
      '--leo-bottomsheet-background': {
        type: 'string',
        control: 'color',
        description: 'Background color of the bottom sheet'
      },
      '--leo-bottomsheet-border-radius': {
        type: 'string',
        description: 'Border radius of the top corners'
      },
      '--leo-bottomsheet-max-width': {
        type: 'string',
        description: 'Max width of the bottom sheet (default: 480px)'
      },
      isOpen: {
        control: 'none'
      }
    }
  }
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import Button from '../button/button.svelte'
  import Icon from '../icon/icon.svelte'
  import Hr from '../hr/hr.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'

  let isOpen = false
  let slotsOpen = false
  let sectionsOpen = false
  let scrollableOpen = false
  let stackedSheet1 = false
  let stackedSheet2 = false
  let stackedSheet3 = false

  const handleAction = () => console.log('action')
</script>

<Template let:args>
  <Button onClick={() => (isOpen = true)}>Open Bottom Sheet</Button>
  <BottomSheet {...args} bind:isOpen onClose={() => (isOpen = false)}>
    <leo-title>Section title</leo-title>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
  </BottomSheet>
</Template>

<Story name="Default" />

<Story name="With Sections" let:args>
  <Button onClick={() => (sectionsOpen = true)}>Open Sectioned Sheet</Button>
  <BottomSheet
    {...args}
    isOpen={sectionsOpen}
    onClose={() => (sectionsOpen = false)}
  >
    <leo-title>Section title</leo-title>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <Hr />
    <leo-title>Section title</leo-title>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
  </BottomSheet>
</Story>

<Story name="Scrollable Sections" let:args>
  <Button onClick={() => (scrollableOpen = true)}>Open Scrollable Sheet</Button>
  <BottomSheet
    {...args}
    isOpen={scrollableOpen}
    onClose={() => (scrollableOpen = false)}
  >
    <leo-title>Fixed Section</leo-title>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Settings</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Account</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <Hr />
    <leo-title>Scrollable Section</leo-title>
    <leo-menu-section style="--leo-menu-section-max-height: 200px;">
      <leo-menu-item on:click={handleAction}>
        <div class="item">
          <Icon name="info-outline" />
          <span>Item 1</span>
          <Icon name="carat-right" />
        </div>
      </leo-menu-item>
      <leo-menu-item on:click={handleAction}>
        <div class="item">
          <Icon name="info-outline" />
          <span>Item 2</span>
          <Icon name="carat-right" />
        </div>
      </leo-menu-item>
      <leo-menu-item on:click={handleAction}>
        <div class="item">
          <Icon name="info-outline" />
          <span>Item 3</span>
          <Icon name="carat-right" />
        </div>
      </leo-menu-item>
      <leo-menu-item on:click={handleAction}>
        <div class="item">
          <Icon name="info-outline" />
          <span>Item 4</span>
          <Icon name="carat-right" />
        </div>
      </leo-menu-item>
      <leo-menu-item on:click={handleAction}>
        <div class="item">
          <Icon name="info-outline" />
          <span>Item 5</span>
          <Icon name="carat-right" />
        </div>
      </leo-menu-item>
      <leo-menu-item on:click={handleAction}>
        <div class="item">
          <Icon name="info-outline" />
          <span>Item 6</span>
          <Icon name="carat-right" />
        </div>
      </leo-menu-item>
    </leo-menu-section>
    <Hr />
    <leo-title>Another Section</leo-title>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Help</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
  </BottomSheet>
</Story>

<Story name="Stacked" let:args>
  <Button onClick={() => (stackedSheet1 = true)}>Open Stacked Sheets</Button>
  <BottomSheet
    {...args}
    isOpen={stackedSheet1}
    onClose={() => (stackedSheet1 = false)}
  >
    <leo-title>First Sheet</leo-title>
    <leo-menu-item
      on:click={() => {
        stackedSheet2 = true
      }}
      data-is-interactive="true"
    >
      <div class="item">
        <Icon name="info-outline" />
        <span>Open second sheet</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <Hr />
    <leo-title>Section title</leo-title>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
  </BottomSheet>
  <BottomSheet
    {...args}
    isOpen={stackedSheet2}
    onClose={() => (stackedSheet2 = false)}
  >
    <leo-title>Second Sheet</leo-title>
    <leo-menu-item
      on:click={() => {
        stackedSheet3 = true
      }}
      data-is-interactive="true"
    >
      <div class="item">
        <Icon name="info-outline" />
        <span>Open third sheet</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
  </BottomSheet>
  <BottomSheet
    {...args}
    isOpen={stackedSheet3}
    onClose={() => (stackedSheet3 = false)}
  >
    <leo-title>Third Sheet</leo-title>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
    <leo-menu-item on:click={handleAction}>
      <div class="item">
        <Icon name="info-outline" />
        <span>Text</span>
        <Icon name="carat-right" />
      </div>
    </leo-menu-item>
  </BottomSheet>
</Story>

<Story name="Slots" let:args>
  <SlotInfo description="The BottomSheet provides a default slot for menu content.">
    <Slot
      name="default"
      explanation="The content of the bottom sheet. Accepts leo-menu-item, leo-option, leo-title, leo-menu-section, and hr elements."
    >
      <Button onClick={() => (slotsOpen = true)}>Open Bottom Sheet</Button>
      <BottomSheet
        {...args}
        isOpen={slotsOpen}
        onClose={() => (slotsOpen = false)}
      >
        <leo-title>Section title</leo-title>
        <leo-menu-item on:click={handleAction}>
          <div class="item">
            <Icon name="info-outline" />
            <span>Copy</span>
            <Icon name="carat-right" />
          </div>
        </leo-menu-item>
        <leo-menu-item on:click={handleAction}>
          <div class="item">
            <Icon name="info-outline" />
            <span>Share</span>
            <Icon name="carat-right" />
          </div>
        </leo-menu-item>
        <Hr />
        <leo-title>More actions</leo-title>
        <leo-menu-item on:click={handleAction}>
          <div class="item">
            <Icon name="info-outline" />
            <span>Delete</span>
            <Icon name="carat-right" />
          </div>
        </leo-menu-item>
      </BottomSheet>
    </Slot>
  </SlotInfo>
</Story>

<style>
  .item {
    --leo-icon-size: 20px;
    display: flex;
    align-items: center;
    gap: var(--leo-spacing-l);
    width: 100%;
  }

  .item span {
    flex: 1;
  }
</style>
