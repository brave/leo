<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'

  import Dialog from './dialog.svelte'
  import Button from '../button/button.svelte'
  import Alert from '../alert/alert.svelte'
  import './dialogHelpers'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'

  let openDialog
  let isOpen = false
</script>

<Meta
  title="Components/Dialog"
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
      control: 'none'
    },
    size: {
      control: 'select',
      options: ['mobile', 'normal']
    }
  }}
  args={{
    isOpen: false
  }}
/>

<Template let:args>
  <Button isDisabled={isOpen} on:click={() => (isOpen = true)}
    >Show Dialog</Button
  >
  <Dialog {...args} bind:isOpen>
    <div slot="title">This is the title</div>
    <div slot="subtitle">This is the subtitle</div>
    <div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum pharetra
      est et viverra massa enim aliquam. Volutpat tristique id mi blandit
      interdum elit quam commodo vel. Ac laoreet magna ac sed diam volutpat. Sit
      mauris, orci diam in habitasse nec dolor odio pharetra.

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
</Template>

<Story name="Slots" let:args>
  <SlotInfo description="The dialog supports several slots">
    <Slot name="default" explanation="The content of the dialog">
      <Button on:click={() => (openDialog = 'default')}>Show Dialog</Button>
      <Dialog
        {...args}
        isOpen={openDialog === 'default'}
        on:close={() => (openDialog = undefined)}
      >
        This is the dialog content
      </Dialog>
    </Slot>
    <Slot name="title" explanation="The title of the dialog">
      <Button on:click={() => (openDialog = 'title')}>Show Title Dialog</Button>
      <Dialog
        {...args}
        isOpen={openDialog === 'title'}
        on:close={() => (openDialog = undefined)}
      >
        <div slot="title">Dialog Title</div>
      </Dialog>
    </Slot>
    <Slot name="subtitle" explanation="The subtitle of the dialog">
      <Button on:click={() => (openDialog = 'subtitle')}
        >Show Subtitle Dialog</Button
      >
      <Dialog
        {...args}
        isOpen={openDialog === 'subtitle'}
        on:close={() => (openDialog = undefined)}
      >
        <div slot="subtitle">Dialog Subtitle</div>
      </Dialog>
    </Slot>
    <Slot name="actions" explanation="The actions for the dialog">
      <Button on:click={() => (openDialog = 'actions')}
        >Show Actions Dialog</Button
      >
      <Dialog
        {...args}
        isOpen={openDialog === 'actions'}
        on:close={() => (openDialog = undefined)}
      >
        Dialog body
        <div slot="actions">
          <Button>Action 1</Button>
          <Button kind="outline">Action 2</Button>
        </div>
      </Dialog>
    </Slot>
  </SlotInfo>
</Story>

<Story name="Default" />

<style>
  .alert-container {
    margin-top: var(--leo-spacing-xl);
  }
</style>
