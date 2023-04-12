<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import {
    getNonStyleArgs,
    getStyleFromArgs
  } from '../../../.storybook/argHelper'

  import Dialog from './dialog.svelte'
  import Button from '../button/button.svelte'
</script>

<Meta
  title="Dialog"
  component={Dialog}
  argTypes={{
    isOpen: {
      control: 'boolean',
      defaultValue: true
    },
    size: {
      control: 'select',
      options: ['mobile', 'normal']
    }
  }}
/>

<Template let:args>
  <div style={getStyleFromArgs(args)}>
    <Dialog {...getNonStyleArgs(args)}>
      <div slot="title">This is the title</div>
      <div slot="subtitle">This is the subtitle</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum pharetra
        est et viverra massa enim aliquam. Volutpat tristique id mi blandit
        interdum elit quam commodo vel. Ac laoreet magna ac sed diam volutpat.
        Sit mauris, orci diam in habitasse nec dolor odio pharetra.
      </div>
      <div slot="actions">
        <Button kind="outline">Secondary</Button>
        <Button kind="filled">Primary</Button>
      </div>
    </Dialog>
  </div>
</Template>
<Story name="Default" />
