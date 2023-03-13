<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Button from '../button/button.svelte'

  import Alert, { modes, types } from './alert.svelte'
  import AlertCentre, { showAlert } from './alertCentre.svelte'

  const alertUser = () => showAlert(
    {
      content: 'Hello World',
      mode: 'toast',
      type: 'warning',
      actions: [
        {
          text: 'dismiss',
          action: (a) => a.dismiss()
        }
      ]
    },
    2000
  )
</script>

<AlertCentre position='bottom-right' />
<Button on:click={alertUser}>Show Alert</Button>

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
    <div slot="actions">
      <Button kind="tertiary">Secondary</Button>
      <Button kind="primary">Primary</Button>
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
          <div slot="actions">
            <Button kind="tertiary">Secondary</Button>
            <Button kind="primary">Primary</Button>
          </div>
        </Alert>
      {/each}
    {/each}
  </div>
</Story>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 500px;
  }
</style>
