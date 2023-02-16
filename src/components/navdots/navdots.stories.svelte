<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import { getStyleFromArgs } from '../../../.storybook/argHelper'
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

    '--leo-navdots-size': {
      type: 'string',
      description: 'The size of the navdots (a CSS unit)'
    },
    '--leo-navdots-expanded-size': {
      type: 'string',
      description: 'The size of the expanded navdot'
    },
    '--leo-navdots-spacing': {
      type: 'string',
      description: 'The space between the individual dots'
    },
    '--leo-navdots-vertical-margin': {
      type: 'string',
      description: 'The margin above and below the navdots'
    },
    '--leo-navdots-transition-duration': {
      type: 'string',
      description:
        'The amount of time it takes for the dot to slide into position. Only used if animateSlide is true'
    },
    '--leo-navdots-transition-easing': {
      type: 'string',
      description: 'The easing function for the slide animation'
    },
    '--leo-navdots-active-color': {
      control: 'color',
      description: 'The color of the active dot'
    },
    '--leo-navdots-active-color-hover': {
      control: 'color',
      description: 'The color of the active dot when hovering'
    },
    '--leo-navdots-color': {
      control: 'color',
      description: 'The color of the non-active dots'
    },
    '--leo-navdots-color-hover': {
      control: 'color',
      description: 'The color of the non-active dots when hovering'
    }
  }}
/>

<Template let:args>
  <div style={getStyleFromArgs(args)}>
    <NavDots {activeDot} on:change={handleChange} {...args} />
  </div>
</Template>

<Story name="Default" />
