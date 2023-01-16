<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import NavDots from './navdots.svelte'

  let activeDot = 0
  function handleChange(n) {
    activeDot = n.detail.activeDot
  }
</script>

<Meta
  title="Nav Dots"
  component={NavDots}
  argTypes={{
    dotCount: { control: 'number', defaultValue: 10 },
    dotSize: { control: 'number', defaultValue: 8 },
    activeColor: { control: 'color' },
    defaultColor: { control: 'color' },
  }}
/>

<Template let:args>
  <div style={`--leo-navdots-active-color: ${args.activeColor || 'unset'}; --leo-navdots-color: ${args.defaultColor || 'unset'}`}>
    <NavDots {activeDot} on:change={handleChange} {...args} />
  </div>
</Template>

<Story name="Default" />
