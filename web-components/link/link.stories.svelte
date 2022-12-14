<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Link from './link.svelte'
  import { buttonKinds, buttonSizes } from '../button/props'
</script>

<Meta
  title="Link"
  component={Link}
  argTypes={{
    kind: { control: 'select', options: buttonKinds },
    size: { control: 'select', options: buttonSizes },
  }}
/>

<Template let:args>
  <Link {...args} href="#clicked!" target="_blank" rel="noopener">Click Me!</Link>
</Template>


<Story name="Default"/>

<Story name="CTA" args={{ kind: 'CTA' }} />

<Story name="Primary" args={{ kind: 'primary' }} />

<Story name="Secondary" source args={{ kind: 'secondary' }} />

<Story name="Tertiary" source args={{ kind: 'tertiary' }} />
