<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import NavDots from './navdots.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'

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

    '--nl-navdots-size': {
      type: 'string',
      description: 'The size of the navdots (a CSS unit)'
    },
    '--nl-navdots-expanded-size': {
      type: 'string',
      description: 'The size of the expanded navdot'
    },
    '--nl-navdots-spacing': {
      type: 'string',
      description: 'The space between the individual dots'
    },
    '--nl-navdots-vertical-margin': {
      type: 'string',
      description: 'The margin above and below the navdots'
    },
    '--nl-navdots-transition-duration': {
      type: 'string',
      description:
        'The amount of time it takes for the dot to slide into position. Only used if animateSlide is true'
    },
    '--nl-navdots-transition-easing': {
      type: 'string',
      description: 'The easing function for the slide animation'
    },
    '--nl-navdots-active-color': {
      control: 'color',
      description: 'The color of the active dot'
    },
    '--nl-navdots-active-color-hover': {
      control: 'color',
      description: 'The color of the active dot when hovering'
    },
    '--nl-navdots-color': {
      control: 'color',
      description: 'The color of the non-active dots'
    },
    '--nl-navdots-color-hover': {
      control: 'color',
      description: 'The color of the non-active dots when hovering'
    }
  }}
/>

<Template let:args>
  <NavDots {activeDot} on:change={handleChange} {...args} />
</Template>

<Story name="Slots">
  <SlotInfo description="The navdots component has no slots" />
</Story>

<Story name="Default" />
