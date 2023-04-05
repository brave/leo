<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Button from '../button/button.svelte'

  import Alert, { modes, types } from './alert.svelte'
  import { showAlert } from './alertCenter.svelte'

  let content = 'Hello World'
  let title = 'Title'
  let canDismiss = true
  let duration = 2000

  $: alertUser = (mode, type) =>
    showAlert(
      {
        content,
        title,
        mode: mode ?? 'simple',
        type: type ?? 'error',
        actions: canDismiss
          ? [
              {
                text: 'dismiss',
                action: (a) => a.dismiss()
              }
            ]
          : []
      },
      duration
    )
</script>

<Meta
  title="Alert"
  component={Alert}
  argTypes={{
    mode: { control: 'select', options: modes },
    type: { control: 'select', options: types }
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
