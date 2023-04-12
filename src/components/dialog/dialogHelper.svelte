<script lang="ts" context="module">
  import { writable } from 'svelte/store'

  interface Action {
    result?: any
    text: string
    kind?: ButtonKind
  }

  interface AlertOptions {
    title: string
    body?: string
    actions: Action[]
  }

  interface AlertInfo extends AlertOptions {
    resolve: (result?: any) => void
  }

  const dialogs = writable<AlertInfo[]>([])

  export const dialog = <T>(options: AlertOptions) => {
    let resolve: (result?: T) => void
    const promise = new Promise((a) => (resolve = a))

    const info = {
      title: options.title,
      body: options.body,
      actions: options.actions,
      resolve: (result?: T) => {
        dialogs.update((d) => d.filter((i) => i !== info))
        resolve(result)
      }
    }

    dialogs.update((d) => [...d, info])

    return promise
  }

  interface AlertDialogOptions {
    okText?: string
  }

  export const alert = (message: string, options?: AlertDialogOptions) =>
    dialog({
      title: message,
      actions: [
        {
          text: options?.okText ?? 'OK'
        }
      ]
    })

  interface ConfirmDialogOptions {
    okText?: string
    cancelText?: string
  }

  export const confirm = (message: string, options?: ConfirmDialogOptions) =>
    dialog({
      title: message,
      actions: [
        {
          result: false,
          kind: 'outline',
          text: options?.cancelText ?? 'Cancel'
        },
        {
          result: true,
          kind: 'filled',
          text: options?.okText ?? 'OK'
        }
      ]
    }).then((r) => !!r)

  const leo = (window as any)?.leo ?? ((window as any).leo = {})
  leo.alert = alert
  leo.confirm = confirm
  leo.dialog = dialog
</script>

<script lang="ts">
  import Dialog from './dialog.svelte'
  import Button from '../button/button.svelte'
  import type { ButtonKind } from '../button/props'
</script>

{#each $dialogs as dialog}
  <Dialog modal isOpen on:close={() => dialog.resolve()}>
    <div slot="title">{dialog.title}</div>
    {#if dialog.body}
      <div>{dialog.body}</div>
    {/if}
    <div slot="actions">
      {#each dialog.actions as action}
        <Button
          kind={action.kind}
          on:click={() => dialog.resolve(action.result)}
        >
          {action.text}
        </Button>
      {/each}
    </div>
  </Dialog>
{/each}
