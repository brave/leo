<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Button from '../button/button.svelte'
  import Icon from '../icon/icon.svelte'

  export let isOpen = false
  export let showClose = true
  export let showBack = true

  const dispatch = createEventDispatcher()

  let dialog: HTMLDialogElement
  $: {
    if (!isOpen && dialog?.open) dialog?.close()
    if (isOpen && !dialog?.open) dialog?.showModal()
  }

  const close = () => {
    isOpen = false
    dispatch('close')
  }
</script>

<dialog class="leo-modal" bind:this={dialog}>
  <div class="title-row">
    {#if showBack}
      <Button kind="plain-faint" on:click={close}>
        <Icon name="arrow-left" />
      </Button>
    {/if}
    <div class="title">
      <slot name="title" />
    </div>
  </div>
  {#if showClose}
    <div class="close-button">
      <Button kind="plain-faint" on:click={close}>
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

  .leo-modal {
    position: relative;

    width: 500px;
    margin: auto;

    border: none;

    border-radius: var(--leo-radius-16);

    color: var(--leo-color-gray-120);
    background: var(--leo-color-container-background);
    padding: var(--leo-spacing-32) var(--leo-spacing-32) var(--leo-spacing-40)
      var(--leo-spacing-32);
  }

  .leo-modal .title {
    font: var(--leo-font-heading-h2);
  }

  .leo-modal .close-button {
    position: absolute;
    right: var(--leo-spacing-16);
    top: calc(var(--leo-spacing-16) - 5px);
  }

  .leo-modal .subtitle {
    margin-bottom: var(--leo-spacing-16);
    font: var(--leo-font-heading-h4);
  }

  .leo-modal .body {
    color: var(--leo-color-text-secondary);
    font: var(--leo-font-primary-default-regular);
  }

  .leo-modal .actions {
    margin-top: var(--leo-spacing-32);
    > * {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: stretch;
    }
  }

  :global ::slotted(actions),
  :global .leo-modal div[slot='actions'] {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    gap: var(--leo-spacing-16);
  }

  :global .leo-modal div[slot='actions'] > * {
    flex: 1;
  }

  .leo-modal .title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    gap: var(--leo-spacing-12);
    margin-bottom: var(--leo-spacing-32);
  }
</style>
