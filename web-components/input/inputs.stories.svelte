<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import { Text } from './index';

  import { textInputKinds } from './text/props'

  let value;
</script>

<Meta
  title="Inputs"
  component={Text}
  argTypes={{
    kind: { control: 'select', options: textInputKinds }
  }}
/>

<p>Value: {value}</p>
<Story name="Text" args={{ kind: 'email', name: "email", label: "Email address", placeholder: "Email address" }} />

<Template let:args>
  <Text {...args} bind:value={value} />
</Template>