<script context="module">
  import Label from './label.svelte'

  export const meta = {
    title: 'Components/Label',
    component: Label,
    argTypes: {
      color: {
        control: 'select',
        description: 'The color to use for the icon',
        options: colors
      },
      mode: {
        control: 'select',
        options: modes,
        description: 'The mode of the label'
      },
      storyLeftIcon: {
        control: 'text',
        description:
          'Icon to the left of the label. This is only used for demonstration purposes',
        type: 'text'
      },
      storyRightIcon: {
        control: 'text',
        description:
          'Icon to the right of the label. This is only used for demonstration purposes',
        type: 'text'
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
    },
    args: {
      storyRightIcon: 'check-circle-outline',
      storyLeftIcon: 'check-circle-outline',
      mode: 'loud',
      color: 'teal'
    }
  }
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import Icon from '../icon/icon.svelte'

  import { colors, modes } from './label.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
</script>

<Template let:args>
  <Label {...args}>
    <svelte:fragment slot="icon-before">
      {#if args.storyLeftIcon}
        <Icon name={args.storyLeftIcon} />
      {/if}
    </svelte:fragment>
    Text
    <svelte:fragment slot="icon-after">
      {#if args.storyRightIcon}
        <Icon name={args.storyRightIcon} />
      {/if}
    </svelte:fragment>
  </Label>
</Template>

<Story name="Slots" let:args>
  <SlotInfo description="The label has three slots for content and icons.">
    <Slot
      name="default"
      explanation="The content of the label. Can be any HTML"
    >
      <div>
        <Label {...args}>
          Label content ==&gt; <Icon slot="icon-after" name="copy" />
        </Label>
      </div>
    </Slot>
    <Slot
      name="icon-before"
      explanation="The icon to be placed before the label content. Can be any HTML"
    >
      <div>
        <Label {...args}>
          <Icon slot="icon-before" name="copy" /> ==&gt; Label content
        </Label>
      </div>
    </Slot>
    <Slot
      name="icon-after"
      explanation="The icon to be placed after the label content. Can be any HTML"
    >
      <div>
        <Label {...args}>
          Label content ==&gt; <Icon slot="icon-after" name="copy" />
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
          <svelte:fragment slot="icon-before">
            {#if args.storyLeftIcon}
              <Icon name={args.storyLeftIcon} />
            {/if}
          </svelte:fragment>
          {mode}
          {color}
          <svelte:fragment slot="icon-after">
            {#if args.storyRightIcon}
              <Icon name={args.storyRightIcon} />
            {/if}
          </svelte:fragment>
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
