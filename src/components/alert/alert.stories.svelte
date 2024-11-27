<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Button from '../button/button.svelte'

  import Alert, { types } from './alert.svelte'
  import { showAlert } from './alertCenter.svelte'
  import Icon from '../icon/icon.svelte'
  import Slot from '../../storyHelpers/Slot.svelte'
  import SlotInfo from '../../storyHelpers/SlotInfo.svelte'
  import ButtonWithProgress from '../../storyHelpers/ButtonWithProgress.svelte'

  let content = 'Hello World'
  let title = 'Title'
  let canDismiss = true
  let hasAction = false
  let duration = 2000
  let customButton = false

  $: alertUser = (type) =>
    showAlert(
      {
        content,
        title,
        type: type ?? 'error',
        actions: hasAction
          ? [
              {
                text: 'Retry',
                kind: 'filled',
                component: customButton && ButtonWithProgress,
                action: () => {}
              }
            ]
          : []
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
    <Slot
      name="content-after"
      explanation="optional content after the main content of the alert"
    >
      <Alert {...args}>
        Some content
        <Button kind="plain-faint" fab slot="content-after">
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
      <Alert {...args}>
        <div slot="title">{args.title}</div>
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
    types: { table: { disable: true } },
    type: { control: 'select', options: types },
    hasActions: { control: 'boolean' },
    title: { type: 'string', defaultValue: 'Title' },
    '--leo-alert-center-width': {
      type: 'string',
      description: 'The width to apply to the alert center'
    },
    '--leo-alert-center-position': {
      type: 'string',
      description: 'The position of the alert center'
    },
    '--leo-alert-padding': {
      type: 'string',
      description: 'The css padding for the alert'
    }
  }}
  args={{
    title: 'Alert title',
  }}
/>

<Template let:args>
  <Alert {...args}>
    <div slot="title">{args.title}</div>
    Alert content
    <div slot="actions">
      <Button kind="plain-faint">Secondary</Button>
      <Button kind="filled">Primary</Button>
    </div>
  </Alert>
</Template>

<Story name="Alert" />
<Story name="All" let:args>
  <div class="container">
    {#each [true, false] as hasTitle}
      {#each types as type}
        <Alert {type} {...args}>
          <div slot="title">{#if hasTitle}{args.title}{/if}</div>
          Alert content
          <div slot="actions" class="actions">
            <Button kind="filled">Primary</Button>
            <Button kind="plain-faint">Secondary</Button>
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
  <div class="options">
    <label>
      Dismissable
      <input type="checkbox" bind:checked={canDismiss} />
    </label>
    <label>
      Has action
      <input type="checkbox" bind:checked={hasAction} />
    </label>
    {#if hasAction}
      <label>
        Use custom button
        <input type="checkbox" bind:checked={customButton} />
      </label>
    {/if}
  </div>
  <Button
    onClick={() => {
      alertUser(args.type)
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

  .options {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
    margin-bottom: 16px;
  }

  /* Note: in the real world we don't need this to reverse the button order (as
   * we'd just order the buttons differently), but it makes the story look nicer
   */
  .reverse {
    flex-direction: row-reverse !important;
    justify-content: start;
  }
</style>
