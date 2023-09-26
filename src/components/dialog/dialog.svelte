<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Button from '../button/button.svelte'
  import Icon from '../icon/icon.svelte'
  import { fade, blur, scale } from 'svelte/transition'

  export let isOpen = false
  export let modal = true
  export let showClose = false
  export let showBack = false
  export let size: 'mobile' | 'normal' = 'normal'
  export let escapeCloses = true
  export let backdropClickCloses = true
  export let animate = true

  const dispatch = createEventDispatcher()

  let dialog: HTMLDialogElement
  $: {
    if (isOpen && !dialog?.open && dialog?.isConnected) dialog?.showModal()
  }

  const close = () => {
    isOpen = false
    dispatch('close')
  }
</script>

{#if isOpen}
  <dialog
    transition:scale={{ duration: animate ? 60 : 0, start: 0.8 }}
    class="nala-dialog"
    class:mobile={size === 'mobile'}
    class:modal
    bind:this={dialog}
    on:close={close}
    on:cancel={(e) => {
      // We handle the modal being opened by adding/removing from the DOM - this
      // let's the animations work properly.
      e.preventDefault()

      if (escapeCloses) close()
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
{/if}

<svelte:window
  on:click|capture={(e) => {
    if (!dialog || !isOpen || !backdropClickCloses) return

    const rect = dialog.getBoundingClientRect()
    const clickedOutside =
      e.clientX < rect.x ||
      e.clientY < rect.y ||
      e.clientX > rect.x + rect.width ||
      e.clientY > rect.y + rect.height
    if (clickedOutside) {
      close()
    }
  }}
/>

<style lang="scss">
  .nala-dialog {
    --padding: var(
      --nl-dialog-padding,
      var(--nl-spacing-3xl) var(--nl-spacing-3xl) var(--nl-spacing-4xl)
        var(--nl-spacing-3xl)
    );
    --border-radius: var(--nl-dialog-border-radius, var(--nl-radius-xl));
    --background: var(
      --nl-dialog-background,
      var(--nl-color-container-background)
    );
    --color: var(--nl-dialog-color, var(--nl-color-text-primary));

    position: relative;
    margin: auto;
    border: none;

    width: var(--nl-dialog-width, 500px);
    max-width: calc(100% - var(--nl-spacing-m) * 2);

    border-radius: var(--border-radius);

    color: var(--color);
    background: var(--background);
    padding: var(--padding);
  }

  .nala-dialog.mobile {
    width: var(--nl-dialog-width, 374px);
  }

  .nala-dialog:not(.modal) {
    box-shadow: var(--nl-effect-elevation-04);
    &::backdrop {
      display: none;
    }
  }

  .nala-dialog .title {
    font: var(--nl-font-primary-heading-h2);
  }

  .nala-dialog .close-button {
    position: absolute;
    right: var(--nl-spacing-xl);
    top: var(--nl-spacing-xl);
  }

  .nala-dialog {
    .close-button,
    .back-button {
      --nl-button-padding: var(--nl-spacing-s);
    }
  }

  .nala-dialog .subtitle {
    margin-bottom: var(--nl-spacing-xl);
    font: var(--nl-font-primary-heading-h4);
  }

  .nala-dialog .body {
    color: var(--nl-color-text-secondary);
    font: var(--nl-font-primary-default-regular);
  }

  .nala-dialog .actions {
    margin-top: var(--nl-spacing-3xl);
  }

  /** The below :global selectors are so that Svelte doesn't remove the classes
    * at compile time (as the slotted content is put in via the parent).
    * Note: We have to handle the case where we're in a web component (via the
    * ::slotted selector) and the case where we're in a Svelte component (via
    * the div[slot='actions'] selector).
    *
    * The :global selector doesn't seem to be able to handle nesting, so we have
    * two separate selectors for mobile & non-mobile layouts */
  :global .nala-dialog.mobile .actions ::slotted(*),
  :global .nala-dialog.mobile .actions div[slot='actions'] {
    flex-direction: column;
    align-items: stretch;
    justify-content: end;
  }

  :global .nala-dialog .actions ::slotted(*),
  :global .nala-dialog div[slot='actions'] {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    gap: var(--nl-spacing-xl);
  }

  .nala-dialog .title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    gap: var(--nl-spacing-l);
    margin-bottom: var(--nl-spacing-3xl);
  }
</style>
