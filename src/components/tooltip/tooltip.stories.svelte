<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import Tooltip, { modes } from './tooltip.svelte'
  import Button from '../button/button.svelte'
  import Checkbox from '../checkbox/checkbox.svelte'
  import Icon from '../icon/icon.svelte'

  const sides = ['top', 'bottom', 'left', 'right']
  const positions = ['', '-start', '-end']
  const placements = positions.flatMap((p) => sides.map((s) => `${s}${p}`))

  let showTooltip = true
</script>

<Meta
  title="Components/Tooltip"
  component={Tooltip}
  argTypes={{
    text: { control: 'text', defaultValue: 'A helpful hint' },
    mode: { control: 'select', options: modes, defaultValue: 'default' },
    placement: { control: 'select', options: placements }
  }}
/>

<Template let:args>
  <Tooltip {...args}>
    <Button>Trigger</Button>
  </Tooltip>
</Template>

<Story name="Slots" let:args>
  <SlotInfo description="">
    <Slot name="default" explanation="The trigger for the tooltip">
      <Tooltip {...args}>
        <Button>Trigger</Button>
      </Tooltip>
    </Slot>
    <Slot
      name="content"
      explanation="The HTML content of the tooltip. If unspecified, the value of the `text` prop will be used"
    >
      <Tooltip {...args}>
        <div slot="content">
          The <s>HTML</s> content <i>of</i> the <b>tooltip</b>
        </div>
        <span>Hover over me!</span>
      </Tooltip>
    </Slot>
  </SlotInfo>
</Story>

<Story name="Default" />

<Story name="Controlled" let:args>
  <Checkbox bind:checked={showTooltip}>Show tooltip</Checkbox>
  <Tooltip {...args} visible={showTooltip}>
    <div slot="content" class="tooltip-content">
      <div class="close">
        <Button
          kind="plain-faint"
          fab
          size="tiny"
          on:click={() => (showTooltip = false)}
        >
          <Icon name="close" />
        </Button>
      </div>
      <div class="title">
        <Icon name="info-outline" />
        This is the title
      </div>
      {args.text}
      <Button kind="outline">Text</Button>
    </div>
    Some text with a triggered tooltip
  </Tooltip>
</Story>

<style>
  .title {
    font: var(--leo-font-heading-h4);
    display: flex;
    flex-direction: row;
    gap: var(--leo-spacing-s);
    align-items: center;
    --leo-icon-size: 18px;
    --leo-icon-color: var(--leo-color-icon-default);
  }

  .close {
    position: absolute;
    right: 0;
    top: 0;
  }

  .tooltip-content {
    display: flex;
    flex-direction: column;
    gap: var(--leo-spacing-xl);
  }
</style>
