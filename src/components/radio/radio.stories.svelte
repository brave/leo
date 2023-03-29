<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import { getStyleFromArgs } from '../../../.storybook/argHelper'
  import RadioButton from './radioButton.svelte'

  let currentValue = 'hello'
  let container

  let button = 0

  // Number of radios per template - we do this here because the template is
  // duplicated for light/dark/user pref and we don't want them to be in the
  // same group.
  let numRadios = 4
</script>

<Meta
  title="Radio"
  component={RadioButton}
  argTypes={{
    name: { control: 'text', defaultValue: `options` }
  }}
/>

<Template let:args>
  <div bind:this={container} style={getStyleFromArgs(args)}>
    <RadioButton
      {...args}
      name={args.name + Math.floor(button++ / numRadios)}
      bind:currentValue
      value={'hello'}>Hello</RadioButton
    >
    <RadioButton
      {...args}
      name={args.name + Math.floor(button++ / numRadios)}
      bind:currentValue
      value={'world'}
    />
    <RadioButton
      {...args}
      name={args.name + Math.floor(button++ / numRadios)}
      bind:currentValue
      value={'foo'}
    />
    <RadioButton
      {...args}
      name={args.name + Math.floor(button++ / numRadios)}
      bind:currentValue
      value={'bar'}
    />
    <div>Current: {currentValue}</div>
  </div>
</Template>

<Story name="Default" />
