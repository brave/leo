<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements'
  import { scale } from 'svelte/transition'
  import Button from '../button/button.svelte'
  import Icon from '../icon/icon.svelte'

  type $$Props = Omit<Partial<SvelteHTMLElements['dialog']>, 'open'> & {
    isOpen?: boolean
    modal?: boolean
    showClose?: boolean
    showBack?: boolean
    escapeCloses?: boolean
    backdropClickCloses?: boolean
    animate?: boolean
    onClose?: () => void
    onBack?: () => void
  }

  export let isOpen = false
  export let modal = true
  export let showClose = false
  export let showBack = false
  export let escapeCloses = true
  export let backdropClickCloses = true
  export let animate = true

  export let onClose: () => void = undefined
  export let onBack: () => void = undefined

  let dialog: HTMLDialogElement
  $: {
    if (isOpen && !dialog?.open && dialog?.isConnected) dialog?.showModal()
  }

  const hasHeader = showBack || $$slots.title || $$slots.subtitle

  const close = () => {
    isOpen = false
    onClose?.()
  }
</script>

{#if isOpen}
  <dialog
    transition:scale={{ duration: animate ? 60 : 0, start: 0.8 }}
    {...$$restProps}
    class="leo-dialog"
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
        <Button kind="plain-faint" fab onClick={close}>
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
                <Button kind="plain-faint" fab onClick={onBack}>
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
    if (!dialog || !isOpen || !backdropClickCloses || !dialog.checkVisibility()) return

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
    --padding: var(--leo-dialog-padding, var(--leo-spacing-2xl));
    --border-radius: var(--leo-dialog-border-radius, var(--leo-radius-xl));
    --background: var(
      --leo-dialog-background,
      var(--leo-color-container-background)
    );
    --color: var(--leo-dialog-color, var(--leo-color-text-primary));

    --backdrop-background: var(
      --leo-dialog-backdrop-background,
      rgba(0, 0, 0, 0.1)
    );
    --backdrop-filter: var(--leo-dialog-backdrop-filter);

    position: fixed;
    margin: auto;
    border: none;
    display: grid;
    align-content: center;

    width: calc(100% - var(--leo-spacing-m) * 2);
    max-width: var(--leo-dialog-width, 374px);

    border-radius: var(--border-radius);
    outline: none;

    color: var(--color);

    padding: 0;
    background: transparent;
    box-shadow: var(--leo-effect-elevation-05);

    &::backdrop {
      background: var(--backdrop-background);
      backdrop-filter: var(--backdrop-filter);
    }
  }

  .leo-dialog.hasHeader {
    grid-template-rows: auto auto;
  }

  /** Since Svelte 4 doesn't support conditional slots in the consumer,
   * we only want to account for actions if there's actually content in the slot
   * however for webcomponents, we don't need to check for this, so we special
   * case the selector with :host. */
  :host .leo-dialog.hasActions,
  .leo-dialog.hasActions:has([slot='actions']:not(:empty)) {
    grid-template-rows: auto auto;
  }

  :host .leo-dialog.hasHeader.hasActions,
  .leo-dialog.hasHeader.hasActions:has(.actions [slot='actions']:not(:empty)) {
    grid-template-rows: auto auto auto;
  }

  .leo-dialog:not(.modal) {
    box-shadow: var(--leo-effect-elevation-04);
    border: 1px solid var(--leo-color-divider-subtle);
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
    inset-inline-end: var(--leo-spacing-xl);
    top: var(--leo-spacing-xl);
  }

  .leo-dialog {
    .close-button,
    .back-button {
      --leo-button-padding: var(--leo-spacing-s);

      flex: 0;
    }
  }

  .leo-dialog .subtitle {
    margin-bottom: var(--leo-spacing-xl);
    font: var(--leo-font-heading-h4);
  }

  .leo-dialog .body {
    background: var(--background);
    color: var(--leo-color-text-secondary);
    font: var(--leo-font-default-regular);
    padding: var(--padding);
  }

  .leo-dialog.hasHeader .body {
    padding-top: 0;
  }

  :host .leo-dialog .actions .body,
  .leo-dialog.hasActions:has([slot='actions']:not(:empty)) .body {
    padding-bottom: 0;
  }

  :host .leo-dialog .actions,
  .leo-dialog .actions:has([slot='actions']:not(:empty)) {
    background: var(--background);
    padding: var(--padding);
  }

  /** The below :global selectors are so that Svelte doesn't remove the classes
    * at compile time (as the slotted content is put in via the parent).
    * Note: We have to handle the case where we're in a web component (via the
    * ::slotted selector) and the case where we're in a Svelte component (via
    * the [slot='actions'] selector).
    *
    * The :global selector doesn't seem to be able to handle nesting, so we have
    * two separate selectors for mobile & non-mobile layouts */
  :global(.leo-dialog .actions ::slotted(*)),
  :global(.leo-dialog .actions [slot='actions']:not(:empty)) {
    display: flex;
    gap: var(--leo-spacing-xl);
    flex-direction: column;
    align-items: stretch;
    justify-content: end;
  }

  @media (orientation: portrait) {
    :global(.leo-dialog .actions ::slotted(*)),
    :global(.leo-dialog .actions div[slot='actions']) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .leo-dialog .title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    gap: var(--leo-spacing-l);
  }

  @media (min-width: 480px) and (min-height: 480px) {
    .leo-dialog {
      --padding: var(--leo-dialog-padding, var(--leo-spacing-4xl));
      max-width: var(--leo-dialog-width, 500px);
    }

    :global(.leo-dialog .actions ::slotted(*)),
    :global(.leo-dialog [slot='actions']:not(:empty)) {
      flex-direction: row;
      align-items: center;
      justify-content: end;
    }
  }

  @media (orientation: landscape) {
    .leo-dialog {
      max-width: var(--leo-dialog-width, 520px);
    }
  }
</style>
