<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Button from '../button/button.svelte'

  import Alert, { modes, types } from './alert.svelte'
  import { showAlert } from './alertCenter.svelte'
  import Icon from '../icon/icon.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'

  let content = 'Hello World'
  let title = 'Title'
  let canDismiss = true
  let hasAction = false
  let duration = 2000

  $: alertUser = (mode, type) =>
    showAlert(
      {
        content,
        title,
        mode: mode ?? 'simple',
        type: type ?? 'error',
        actions: hasAction ? [
          {
            text: 'Retry',
            kind: 'filled',
            action: () => {}
          }
        ] : []
      },
      duration,
      canDismiss
    )
</script>

<Story name="Slots" let:args>
  <SlotInfo description="The Alert component has a number of useful slots:">
    <Slot name="default" explanation="the content of the alert">
      <Alert {...args}>Some content</Alert>
    </Slot>
    <Slot
      name="icon"
      explanation="the icon on the left hand side of the
    Alert. This can be used to override the default icon for the different
    types of Alert"
    >
      <Alert {...args}>
        <Icon name="airplay-audio" slot="icon" />
        Some content
      </Alert>
    </Slot>
    <Slot name="content-after" explanation="optional content after the main content of the alert">
      <Alert {...args} mode="simple">
        Some content
        <Button kind='plain-faint' fab slot="content-after">
          <Icon name="close" />
        </Button>
      </Alert>
    </Slot>
    <Slot
      name="title"
      explanation="the icon on the left hand side of the Alert.
      This can be used to override the default icon for the different types of
      Alert"
    >
      <Alert {...args} mode="full">
        <div slot="title">Title</div>
        Some content
      </Alert>
    </Slot>
    <Slot
      name="actions"
      explanation="the actions a user can take from an
      Alert. These are optional. When specified, these are generally a list of
      buttons"
    >
      <Alert {...args}>
        <div slot="actions">
          <Button kind="outline">Don't!</Button>
          <Button>Do the thing!</Button>
        </div>
        Some content
      </Alert>
    </Slot>
  </SlotInfo>
</Story>

<Meta
  title="Components/Alert"
  component={Alert}
  argTypes={{
    modes: { table: { disable: true } },
    mode: { control: 'select', options: modes },
    types: { table: { disable: true } },
    type: { control: 'select', options: types },
    hasActions: { control: 'boolean' },
    '--leo-alert-center-width': {
      type: 'string',
      description: 'The width to apply to the alert center'
    },
    '--leo-alert-center-position': {
      type: 'string',
      description: 'The position of the alert center'
    }
  }}
/>

<Template let:args>
  <Alert {...args}>
    <div slot="title">Title</div>
    Alert content
    <div slot="actions" class:reverse={args.mode === 'full'}>
      <Button kind="plain-faint">Secondary</Button>
      <Button kind="filled">Primary</Button>
    </div>
  </Alert>
</Template>

<Story name="Alert" />
<Story name="All" let:args>
  <div class="container">
    {#each modes as mode}
      {#each types as type}
        <Alert {mode} {type} {...args}>
          <div slot="title">Title</div>
          Alert content
          <div slot="actions" class="actions" class:reverse={mode === 'full'}>
            <Button kind="plain-faint">Secondary</Button>
            <Button kind="filled">Primary</Button>
          </div>
        </Alert>
      {/each}
    {/each}
  </div>
</Story>

<Story name="Alert Center" let:args>
  <label>
    Alert Content
    <input type="text" bind:value={content} />
  </label>
  <label>
    Alert Title
    <input type="text" bind:value={title} />
  </label>
  <label>
    Duration
    <input type="text" bind:value={duration} />
  </label>
  <label>
    Dismissable
    <input type="checkbox" bind:checked={canDismiss} />
  </label>
  <label>
    Has action
    <input type="checkbox" bind:checked={hasAction} />
  </label>
  <Button
    on:click={() => {
      alertUser(args.mode, args.type)
    }}>Show Alert</Button
  >
</Story>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 500px;
  }

  /* Note: in the real world we don't need this to reverse the button order (as
   * we'd just order the buttons differently), but it makes the story look nicer
   */
  .reverse {
    flex-direction: row-reverse !important;
    justify-content: start;
  }
</style>
