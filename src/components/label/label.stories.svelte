<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Label from './label.svelte'
</script>

<Meta
  title="Label"
  component={Label}
  argTypes={{
    color: {
      control: 'color',
      description: 'The color to use for the icon',
      type: 'string',
    },
    mode: {
      control: 'select',
      options: ['faint', 'heavy'],
    },
  }}
/>

<Template let:args>
  <Label {...args} />
</Template>

<Story name="Default" />
