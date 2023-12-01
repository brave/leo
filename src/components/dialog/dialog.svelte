<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { SvelteHTMLElements } from 'svelte/elements'
  import { scale } from 'svelte/transition'
  import Button from '../button/button.svelte'
  import Icon from '../icon/icon.svelte'

  type DialogSizes = 'mobile' | 'normal'

  type $$Props = Omit<Partial<SvelteHTMLElements['dialog']>, 'open'> & {
    isOpen?: boolean
    modal?: boolean
    showClose?: boolean
    showBack?: boolean
    size?: DialogSizes
    escapeCloses?: boolean
    backdropClickCloses?: boolean
    animate?: boolean
  }

  export let isOpen = false
  export let modal = true
  export let showClose = false
  export let showBack = false
  export let size: DialogSizes = 'normal'
  export let escapeCloses = true
  export let backdropClickCloses = true
  export let animate = true

  const dispatch = createEventDispatcher<{
    close: undefined
    back: undefined
  }>()

  let dialog: HTMLDialogElement
  $: {
    if (isOpen && !dialog?.open && dialog?.isConnected) dialog?.showModal()
  }

  const hasHeader = showBack || $$slots.title || $$slots.subtitle

  const close = () => {
    isOpen = false
    dispatch('close')
  }
</script>

{#if isOpen}
  <dialog
    transition:scale={{ duration: animate ? 60 : 0, start: 0.8 }}
    {...$$restProps}
    class="leo-dialog"
    class:mobile={size === 'mobile'}
    class:modal
    class:hasHeader
    class:hasActions={$$slots.actions}
    bind:this={dialog}
    on:close={close}
    on:cancel={(e) => {
      // We handle the modal being opened by adding/removing from the DOM - this
      // let's the animations work properly.
      e.preventDefault()

      if (escapeCloses) close()
    }}
  >
    {#if showClose}
      <div class="close-button">
        <Button kind="plain-faint" on:click={close}>
          <Icon name="close" />
        </Button>
      </div>
    {/if}
    {#if hasHeader}
      <header>
        {#if showBack || $$slots.title}
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
        {/if}
        {#if $$slots.subtitle}
          <div class="subtitle">
            <slot name="subtitle" />
          </div>
        {/if}
      </header>
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
  .leo-dialog {
    --padding: var(--leo-dialog-padding, var(--leo-spacing-4xl));
    --border-radius: var(--leo-dialog-border-radius, var(--leo-radius-xl));
    --background: var(
      --leo-dialog-background,
      var(--leo-color-container-background)
    );
    --color: var(--leo-dialog-color, var(--leo-color-text-primary));

    position: fixed;
    margin: auto;
    border: none;
    display: grid;

    width: var(--leo-dialog-width, 500px);
    max-width: calc(100% - var(--leo-spacing-m) * 2);

    border-radius: var(--border-radius);

    color: var(--color);

    padding: 0;
    background: transparent;
  }

  .leo-dialog.hasHeader {
    grid-template-rows: auto 1fr;
  }

  .leo-dialog.hasActions {
    grid-template-rows: 1fr auto;
  }

  .leo-dialog.hasHeader.hasActions {
    grid-template-rows: auto 1fr auto;
  }

  .leo-dialog.mobile {
    --padding: var(--leo-dialog-padding, var(--leo-spacing-2xl));
    width: var(--leo-dialog-width, 374px);
  }

  .leo-dialog:not(.modal) {
    box-shadow: var(--leo-effect-elevation-04);
    &::backdrop {
      display: none;
    }
  }

  .leo-dialog header {
    background: var(--background);
    padding: var(--padding);
  }

  .leo-dialog .title {
    font: var(--leo-font-heading-h2);
  }

  .leo-dialog .close-button {
    position: absolute;
    right: var(--leo-spacing-xl);
    top: var(--leo-spacing-xl);
  }

  .leo-dialog {
    .close-button,
    .back-button {
      --leo-button-padding: var(--leo-spacing-s);
    }
  }

  .leo-dialog .subtitle {
    margin-bottom: var(--leo-spacing-xl);
    font: var(--leo-font-heading-h4);
  }

  .leo-dialog .body {
    overflow-y: auto;
    background: var(--background);
    color: var(--leo-color-text-secondary);
    font: var(--leo-font-default-regular);
    padding: var(--padding);
  }

  .leo-dialog.hasHeader .body {
    padding-top: 0;
  }

  .leo-dialog.hasActions .body {
    padding-bottom: 0;
  }

  .leo-dialog .actions {
    background: var(--background);
    padding: var(--padding);
  }

  /** The below :global selectors are so that Svelte doesn't remove the classes
    * at compile time (as the slotted content is put in via the parent).
    * Note: We have to handle the case where we're in a web component (via the
    * ::slotted selector) and the case where we're in a Svelte component (via
    * the div[slot='actions'] selector).
    *
    * The :global selector doesn't seem to be able to handle nesting, so we have
    * two separate selectors for mobile & non-mobile layouts */
  :global .leo-dialog.mobile .actions ::slotted(*),
  :global .leo-dialog.mobile .actions div[slot='actions'] {
    flex-direction: column;
    align-items: stretch;
    justify-content: end;
  }

  :global .leo-dialog .actions ::slotted(*),
  :global .leo-dialog div[slot='actions'] {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    gap: var(--leo-spacing-xl);
  }

  .leo-dialog .title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    gap: var(--leo-spacing-l);
  }
</style>
