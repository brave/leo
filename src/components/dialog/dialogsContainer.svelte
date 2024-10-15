<script lang="ts">
  import Dialog from './dialog.svelte'
  import Button from '../button/button.svelte'
  import { dialogs } from '../dialogHelpers'
</script>

{#each $dialogs as dialog}
  <Dialog modal isOpen onClose={() => dialog.resolve()}>
    <div slot="title">{dialog.title}</div>
    {#if dialog.body}
      <div>{dialog.body}</div>
    {/if}
    <div slot="actions">
      {#each dialog.actions as action}
        <Button
          kind={action.kind}
          onClick={() => dialog.resolve(action.result)}
        >
          {action.text}
        </Button>
      {/each}
    </div>
  </Dialog>
{/each}
