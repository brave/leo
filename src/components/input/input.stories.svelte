<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Input from './input.svelte'
  import {
    getNonStyleArgs,
    getStyleFromArgs
  } from '../../../.storybook/argHelper'
  import Icon from '../icon/icon.svelte'
  import { modes, sizes } from '../formItem/formItem.svelte'

  let characterCountValue = ''
</script>

<Meta
  title="Input"
  component={Input}
  argTypes={{
    '--leo-control-layout': {
      control: 'select',
      options: ['row', 'row-reverse', 'column', 'column-reverse']
    },
    label: {
      type: 'string',
      defaultValue: 'Label'
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'date', 'time', 'color']
    },
    size: {
      control: 'select',
      options: sizes
    },
    mode: {
      control: 'select',
      options: modes
    }
  }}
/>

<Template let:args>
  <Input {...args}>
    {args.label}
    <div slot="errors">
      <Icon name="warning-triangle-filled" />
      Something went wrong!
    </div>
  </Input>
</Template>

<Story name="Default" />

<Story name="Character Count" let:args>
  <Input {...args} bind:value={characterCountValue}>
    {args.label}
    <div slot="extra">{characterCountValue.length}/100</div>
    <Icon name="send" slot="right-icon" />
  </Input>
</Story>

<style>
  [slot='errors'] {
    display: flex;
    flex-direction: row;
    gap: var(--leo-spacing-8);
    align-items: center;

    margin-top: var(--leo-spacing-4);

    color: var(--leo-color-systemfeedback-error-icon);
  }
</style>
