<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Button from '../button/button.svelte'
  import Icon from '../icon/icon.svelte'

  export let isOpen = false
  export let modal = true
  export let showClose = false
  export let showBack = false
  export let size: 'mobile' | 'normal' = 'normal'
  export let cancellable = true

  const dispatch = createEventDispatcher()

  let dialog: HTMLDialogElement
  $: {
    if (!isOpen && dialog?.open) dialog?.close()
    if (isOpen && !dialog?.open && dialog?.getRootNode()) dialog?.showModal()
  }

  const close = () => {
    isOpen = false
    dispatch('close')
  }
</script>

<dialog
  class="leo-dialog"
  class:mobile={size === 'mobile'}
  class:modal
  bind:this={dialog}
  on:close={close}
  on:cancel={e => {
    // If the dialog isn't cancellable, stop it from being closed via escape.
    if (!cancellable) e.preventDefault()
  }}
>
  <div class="title-row">
    {#if showBack}
      <div class="back-button">
        <Button kind="plain-faint" on:click={() => dispatch('back')}>
          <Icon name="arrow-left" />
        </Button>
      </div>
    {/if}
    <div class="title">
      <slot name="title" />
    </div>
  </div>
  {#if showClose}
    <div class="close-button">
      <Button kind="plain-faint" on:click={() => isOpen = false}>
        <Icon name="close" />
      </Button>
    </div>
  {/if}
  {#if $$slots.subtitle}
    <div class="subtitle">
      <slot name="subtitle" />
    </div>
  {/if}
  <div class="body">
    <slot />
  </div>
  {#if $$slots.actions}
    <div class="actions">
      <slot name="actions" />
    </div>
  {/if}
</dialog>

<style lang="scss">
  :host {
  }

  .leo-dialog {
    position: relative;

    width: 500px;
    max-width: calc(100% - var(--leo-spacing-8) * 2);
    margin: auto;

    border: none;

    border-radius: var(--leo-radius-16);

    color: var(--leo-color-gray-120);
    background: var(--leo-color-container-background);
    padding: var(--leo-spacing-32) var(--leo-spacing-32) var(--leo-spacing-40)
      var(--leo-spacing-32);
  }

  .leo-dialog.mobile {
    width: 374px;
  }

  .leo-dialog:not(.modal) {
    box-shadow: var(--leo-effect-elevation-04);
    &::backdrop {
      display: none;
    }
  }

  .leo-dialog .title {
    font: var(--leo-font-heading-h2);
  }

  .leo-dialog .close-button {
    position: absolute;
    right: var(--leo-spacing-16);
    top: var(--leo-spacing-16);
  }

  .leo-dialog {
    .close-button,
    .back-button {
      --leo-button-padding: var(--leo-spacing-4);
    }
  }

  .leo-dialog .subtitle {
    margin-bottom: var(--leo-spacing-16);
    font: var(--leo-font-heading-h4);
  }

  .leo-dialog .body {
    color: var(--leo-color-text-secondary);
    font: var(--leo-font-primary-default-regular);
  }

  .leo-dialog .actions {
    margin-top: var(--leo-spacing-32);
  }

  :global .leo-dialog.mobile .actions div[slot='actions'] {
    flex-direction: column;
    align-items: stretch;
    justify-content: end;
  }

  :global ::slotted(actions),
  :global .leo-dialog div[slot='actions'] {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    gap: var(--leo-spacing-16);
  }

  :global .leo-dialog div[slot='actions'] > * {
    flex: 1;
  }

  .leo-dialog .title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    gap: var(--leo-spacing-12);
    margin-bottom: var(--leo-spacing-32);
  }
</style>