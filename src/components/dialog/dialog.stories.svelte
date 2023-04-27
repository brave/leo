<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import {
    getNonStyleArgs,
    getStyleFromArgs
  } from '../../../.storybook/argHelper'

  import Dialog from './dialog.svelte'
  import Button from '../button/button.svelte'
  import Alert from '../alert/alert.svelte'
  import './dialogHelpers'

  let isOpen = false
</script>

<Meta
  title="Dialog"
  component={Dialog}
  argTypes={{
    '--leo-dialog-width': {
      type: 'string',
      description: 'The CSS width of the dialog'
    },
    '--leo-dialog-padding': {
      type: 'string',
      description: 'The CSS padding of the dialog'
    },
    '--leo-dialog-border-radius': {
      type: 'string',
      description: 'The border radius of the dialog'
    },
    '--leo-dialog-background': {
      type: 'string',
      control: 'color',
      description: 'The background color of the dialog'
    },
    '--leo-dialog-color': {
      type: 'string',
      control: 'color',
      description: 'The default text color of the dialog'
    },
    isOpen: {
      control: 'none',
      defaultValue: false
    },
    size: {
      control: 'select',
      options: ['mobile', 'normal']
    }
  }}
/>

<Template let:args>
  <Button isDisabled={isOpen} on:click={() => (isOpen = true)}
    >Show Dialog</Button
  >
  <div style={getStyleFromArgs(args)}>
    <Dialog {...getNonStyleArgs(args)} bind:isOpen>
      <div slot="title">This is the title</div>
      <div slot="subtitle">This is the subtitle</div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum pharetra
        est et viverra massa enim aliquam. Volutpat tristique id mi blandit
        interdum elit quam commodo vel. Ac laoreet magna ac sed diam volutpat.
        Sit mauris, orci diam in habitasse nec dolor odio pharetra.

        <div class="alert-container">
          <Alert>
            <div>This is an info box</div>
          </Alert>
        </div>
      </div>
      <div slot="actions">
        <Button kind="outline">Secondary</Button>
        <Button kind="filled">Primary</Button>
      </div>
    </Dialog>
  </div>
</Template>
<Story name="Default" />

<style>
  .alert-container {
    margin-top: var(--leo-spacing-16);
  }
</style>
