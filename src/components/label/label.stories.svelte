<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Icon from '../icon/icon.svelte'

  import Label, { colors, modes } from './label.svelte'

  const variables = {
    '--leo-label-icon-size': 'number',
    '--leo-label-font-text': 'string',
    '--leo-label-padding': 'number',
    '--leo-label-radius': 'number'
  }

  const getStyle = (args) =>
    Object.entries(args)
      .filter(([key]) => key.startsWith('--leo-'))
      .reduce(
        (prev, [key, value]) => prev + `${key}: ${value || 'unset'}; `,
        ''
      )
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
    leftIcon: {
      control: 'text',
      description: 'Icon to the left',
      type: 'text',
      defaultValue: 'check-circle-outline'
    },
    rightIcon: {
      control: 'text',
      description: 'Icon to the right',
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
  <div style={getStyle(args)}>
    <Label {...args}>
      {#if args.leftIcon}
        <Icon name={args.leftIcon} />
      {/if}
      Label
      {#if args.rightIcon}
        <Icon name={args.rightIcon} />
      {/if}
    </Label>
  </div>
</Template>

<Story name="All" let:args>
  <div class="column" style={getStyle(args)}>
    {#each colors as color}
      {#each modes as mode}
        <Label {color} {mode}>
          {#if args.leftIcon}
            <Icon name={args.leftIcon} />
          {/if}
          {mode}
          {color}
          {#if args.rightIcon}
            <Icon name={args.rightIcon} />
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
    gap: var(--spacing-4);
    align-items: flex-start;
  }
</style>
