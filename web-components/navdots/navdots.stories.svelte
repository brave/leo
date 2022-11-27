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
    dots: { control: 'number' },
  }}
/>

<Template let:args>
  <NavDots dotCount={args.dots} activeDot={activeDot} on:change={handleChange}/>
</Template>

<Story name="Default" />
