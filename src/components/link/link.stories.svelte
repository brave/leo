<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Link from './link.svelte'
</script>

<Meta
  title="Link"
  component={Link}
  argTypes={{
    href: {
      control: 'text',
      description: 'The href for the link',
      type: 'string',
      defaultValue: 'https://brave.com'
    },
    target: {
      control: 'text',
      description: 'The target for the link',
      type: 'string',
      defaultValue: '_blank'
    },
    text: {
      control: 'text',
      description: 'The text content of the link',
      type: 'string',
      defaultValue: 'Download Brave'
    }
  }}
/>

<Template let:args>
  <div style={`color: ${args.color}; --leo-icon-size: ${args.size}px;`}>
    <Link href="#foo" {...args} />
  </div>
</Template>

<Story name="Default" />
