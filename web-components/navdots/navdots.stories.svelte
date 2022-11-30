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
    dots: { control: 'number', defaultValue: 10 },
    dotSize: { control: 'number', defaultValue: 8 },
    activeColor: { control: 'color' },
    defaultColor: { control: 'color' },
  }}
/>

<Template let:args>
  <div style={`--color-interaction-button-primary-background: ${args.activeColor || 'unset'}; --color-primary-20: ${args.defaultColor || 'unset'}`}>
    <NavDots dotCount={args.dots} {activeDot} on:change={handleChange} />
  </div>
</Template>

<Story name="Default" />
