<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Icon from '../icon/icon.svelte'

  import Label, { colors, modes } from './label.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
</script>

<Meta
  title="Label"
  component={Label}
  argTypes={{
    color: {
      control: 'select',
      description: 'The color to use for the icon',
      options: colors,
      defaultValue: 'teal'
    },
    mode: {
      control: 'select',
      options: modes,
      description: 'The mode of the label',
      defaultValue: 'loud'
    },
    storyLeftIcon: {
      control: 'text',
      description:
        'Icon to the left of the label. This is only used for demonstration purposes',
      type: 'text',
      defaultValue: 'check-circle-outline'
    },
    storyRightIcon: {
      control: 'text',
      description:
        'Icon to the right of the label. This is only used for demonstration purposes',
      type: 'text',
      defaultValue: 'check-circle-outline'
    },
    '--leo-label-icon-size': {
      control: 'text',
      description: 'The size of the icons (if any) inside the label',
      type: 'number'
    },
    '--leo-label-font-text': {
      control: 'text',
      description: 'The font used for the label text',
      type: 'text'
    },
    '--leo-label-padding': {
      control: 'text',
      description: 'The internal padding of the label',
      type: 'text'
    }
  }}
/>

<Template let:args>
  <Label {...args}>
    {#if args.storyLeftIcon}
      <Icon name={args.storyLeftIcon} />
    {/if}
    TEXT
    {#if args.storyRightIcon}
      <Icon name={args.storyRightIcon} />
    {/if}
  </Label>
</Template>

<Story name="Slots" let:args>
  <SlotInfo description="The label has single slot for it's content">
    <Slot
      name="default"
      explanation="The content of the label. Can be any HTML"
    >
      <div>
        <Label {...args}>
          Label content ==&gt; <Icon name="copy" />
        </Label>
      </div>
    </Slot>
  </SlotInfo>
</Story>

<Story name="All" let:args>
  <div class="column">
    {#each colors as color}
      {#each modes as mode}
        <Label {color} {mode}>
          {#if args.storyLeftIcon}
            <Icon name={args.storyLeftIcon} />
          {/if}
          {mode}
          {color}
          {#if args.storyRightIcon}
            <Icon name={args.storyRightIcon} />
          {/if}
        </Label>
      {/each}
    {/each}
  </div>
</Story>
<Story name="Default" />

<style lang="scss">
  .column {
    display: flex;
    flex-direction: column;
    gap: var(--leo-spacing-s);
    align-items: flex-start;
  }
</style>
