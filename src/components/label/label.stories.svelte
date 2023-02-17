<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Icon from '../icon/icon.svelte'
  import { getStyleFromArgs } from '../../../.storybook/argHelper'

  import Label, { colors, modes } from './label.svelte'
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
  <div style={getStyleFromArgs(args)}>
    <Label {...args}>
      {#if args.storyLeftIcon}
        <Icon name={args.storyLeftIcon} />
      {/if}
      Label
      {#if args.storyRightIcon}
        <Icon name={args.storyRightIcon} />
      {/if}
    </Label>
  </div>
</Template>

<Story name="All" let:args>
  <div class="column" style={getStyleFromArgs(args)}>
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
    gap: var(--leo-spacing-4);
    align-items: flex-start;
  }
</style>
