<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        'leo-bottomsheet': HTMLAttributes<HTMLElement> & {
          children?: any
        }
      }
    }
  }
</script>

<script lang="ts">
  import { fly, fade } from 'svelte/transition'

  export let isOpen = false
  export let onClose: () => void = undefined
  export let escapeCloses = true
  export let backdropClickCloses = true
  export let dragToClose = true

  let sheetEl: HTMLDivElement
  let dragStartY = 0
  let dragCurrentY = 0
  let isDragging = false

  $: dragOffset = isDragging ? Math.max(0, dragCurrentY - dragStartY) : 0

  function close() {
    isOpen = false
    onClose?.()
  }

  function handleBackdropClick() {
    if (backdropClickCloses) close()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!isOpen) return

    if (e.code === 'Escape' && escapeCloses) {
      e.preventDefault()
      close()
      return
    }

    // Arrow key navigation through menu items
    let dir = 0
    if (e.code === 'ArrowUp') dir = -1
    if (e.code === 'ArrowDown') dir = 1
    if (dir === 0) return

    if (!sheetEl) return
    const items = Array.from(
      sheetEl.querySelectorAll('leo-menu-item, leo-option')
    ) as HTMLElement[]
    if (!items.length) return

    let focusedIndex = items.findIndex((el) => el.matches(':focus-within'))
    if (focusedIndex === -1) {
      focusedIndex = 0
    } else {
      focusedIndex += dir
      if (focusedIndex < 0) focusedIndex = items.length - 1
      if (focusedIndex >= items.length) focusedIndex = 0
    }

    items[focusedIndex]?.focus()
    e.preventDefault()
  }

  function handleItemClick(e: MouseEvent) {
    if (!sheetEl) return
    const items = Array.from(
      sheetEl.querySelectorAll('leo-menu-item, leo-option')
    ) as HTMLElement[]

    const item = items.find((el) => e.composedPath().includes(el))
    if (!item) return

    if (!item.dataset.isInteractive) {
      close()
    }
  }

  function handlePointerDown(e: PointerEvent) {
    if (!dragToClose) return
    isDragging = true
    dragStartY = e.clientY
    dragCurrentY = e.clientY
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return
    dragCurrentY = e.clientY
  }

  function handlePointerUp() {
    if (!isDragging) return
    const threshold = sheetEl ? sheetEl.offsetHeight * 0.3 : 100
    if (dragOffset > threshold) {
      close()
    }
    isDragging = false
    dragStartY = 0
    dragCurrentY = 0
  }

  $: if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="leo-bottomsheet-backdrop"
    role="presentation"
    on:click={handleBackdropClick}
    transition:fade={{ duration: 200 }}
  />
  <div
    class="leo-bottomsheet"
    role="dialog"
    aria-modal="true"
    transition:fly={{ y: '100%', duration: 300, opacity: 1 }}
    style:transform={isDragging ? `translateY(${dragOffset}px)` : undefined}
    style:transition={isDragging ? 'none' : undefined}
    bind:this={sheetEl}
  >
    <div
      class="drag-handle-area"
      on:pointerdown={handlePointerDown}
      on:pointermove={handlePointerMove}
      on:pointerup={handlePointerUp}
      on:pointercancel={handlePointerUp}
    >
      <div class="drag-handle" />
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="leo-bottomsheet-content" role="menu" tabindex="-1" on:click={handleItemClick}>
      <slot />
    </div>
  </div>
{/if}

<svelte:window on:keydown={handleKeydown} />

<style lang="scss">
  :host {
    display: block;
  }

  .leo-bottomsheet-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 9998;
    -webkit-tap-highlight-color: transparent;
  }

  .leo-bottomsheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 9999;

    width: 100%;
    max-width: var(--leo-bottomsheet-max-width, 480px);

    background: var(
      --leo-bottomsheet-background,
      var(--leo-color-container-background)
    );
    border-radius: var(
        --leo-bottomsheet-border-radius,
        var(--leo-radius-xl)
      )
      var(--leo-bottomsheet-border-radius, var(--leo-radius-xl)) 0 0;
    box-shadow: var(--leo-effect-elevation-05);

    display: flex;
    flex-direction: column;
    max-height: var(--leo-bottomsheet-max-height, 85vh);
    overflow: hidden;
  }

  .drag-handle-area {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--leo-spacing-m) 0;
    cursor: grab;
    touch-action: none;
    flex-shrink: 0;

    &:active {
      cursor: grabbing;
    }
  }

  .drag-handle {
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: var(--leo-color-divider-subtle);
  }

  .leo-bottomsheet-content {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
    gap: var(--leo-spacing-s);
    padding-bottom: calc(var(--leo-spacing-xl) + env(safe-area-inset-bottom, 0px));
  }

  /*
   * Replicate menu item styles from menu.svelte so slotted leo-menu-item,
   * leo-option, leo-title, hr, and leo-menu-section render identically.
   */

  :global(.leo-bottomsheet-content ::slotted(*)),
  :global(.leo-bottomsheet-content > *) {
    --leo-menu-item-margin: var(--leo-menu-item-margin-top, 0)
      var(--leo-spacing-s) var(--leo-menu-item-margin-bottom, 0)
      var(--leo-spacing-s);
    --leo-menu-item-padding: var(--leo-spacing-m) var(--leo-spacing-xl);
    --leo-menu-item-border-radius: var(--leo-spacing-s);
  }

  :global(
      .leo-bottomsheet-content
        ::slotted(leo-option:nth-child(1 of :not([slot])))
    ),
  :global(
      .leo-bottomsheet-content
        ::slotted(leo-menu-item:nth-child(1 of :not([slot])))
    ),
  :global(.leo-bottomsheet-content leo-option:first-child),
  :global(.leo-bottomsheet-content leo-menu-item:first-child) {
    --leo-menu-item-margin-top: var(--leo-spacing-s);
  }

  :global(
      .leo-bottomsheet-content
        ::slotted(leo-option:nth-last-child(1 of :not([slot])))
    ),
  :global(
      .leo-bottomsheet-content
        ::slotted(leo-menu-item:nth-last-child(1 of :not([slot])))
    ),
  :global(.leo-bottomsheet-content leo-option:last-child),
  :global(.leo-bottomsheet-content leo-menu-item:last-child) {
    --leo-menu-item-margin-bottom: var(--leo-spacing-s);
  }

  :global(.leo-bottomsheet-content ::slotted(leo-title)),
  :global(.leo-bottomsheet-content leo-title) {
    padding: var(--leo-spacing-l);
    background: transparent;
    font: var(--leo-font-components-label);
    color: var(--leo-color-text-secondary);
  }

  :global(.leo-bottomsheet-content ::slotted(leo-title:not(:first-of-type))),
  :global(.leo-bottomsheet-content leo-title:not(:first-of-type)) {
    margin-top: -4px;
  }

  :global(.leo-bottomsheet-content ::slotted(hr)),
  :global(.leo-bottomsheet-content hr) {
    all: unset;
    display: block;
    border-top: 1px solid var(--leo-color-divider-subtle);
    width: 100%;
    margin: 0;
  }

  :global(.leo-bottomsheet-content ::slotted(leo-menu-section)),
  :global(.leo-bottomsheet-content leo-menu-section) {
    display: flex;
    flex-direction: column;
    gap: var(--leo-spacing-s);
    max-height: var(--leo-menu-section-max-height, none);
    overflow-y: auto;
    padding: var(--leo-spacing-s) 0;
    margin: -4px 0;
  }

  :global(:where(.leo-bottomsheet-content) ::slotted(leo-menu-item)),
  :global(:where(.leo-bottomsheet-content) ::slotted(leo-option)),
  :global(:where(.leo-bottomsheet-content) > leo-menu-item),
  :global(:where(.leo-bottomsheet-content) > leo-option),
  :global(:where(.leo-bottomsheet-content) leo-menu-section leo-menu-item),
  :global(:where(.leo-bottomsheet-content) leo-menu-section leo-option) {
    all: unset;
    cursor: pointer;
    margin: var(--leo-menu-item-margin);
    border-radius: var(--leo-menu-item-border-radius);
    padding: var(--leo-menu-item-padding);
    display: revert;
  }

  :global(:where(.leo-bottomsheet-content) ::slotted(leo-menu-item:hover)),
  :global(:where(.leo-bottomsheet-content) ::slotted(leo-option:hover)),
  :global(:where(.leo-bottomsheet-content) > leo-menu-item:hover),
  :global(:where(.leo-bottomsheet-content) > leo-option:hover),
  :global(
      :where(.leo-bottomsheet-content) leo-menu-section leo-menu-item:hover
    ),
  :global(
      :where(.leo-bottomsheet-content) leo-menu-section leo-option:hover
    ) {
    background: var(--leo-color-container-highlight);
  }

  :global(
      :where(.leo-bottomsheet-content) ::slotted(leo-option[aria-selected])
    ),
  :global(
      :where(.leo-bottomsheet-content) ::slotted(leo-menu-item[aria-selected])
    ),
  :global(:where(.leo-bottomsheet-content) ::slotted(leo-option:active)),
  :global(:where(.leo-bottomsheet-content) ::slotted(leo-menu-item:active)),
  :global(:where(.leo-bottomsheet-content) > leo-option[aria-selected]),
  :global(:where(.leo-bottomsheet-content) > leo-menu-item[aria-selected]),
  :global(:where(.leo-bottomsheet-content) > leo-option:active),
  :global(:where(.leo-bottomsheet-content) > leo-menu-item:active),
  :global(
      :where(.leo-bottomsheet-content)
        leo-menu-section
        leo-option[aria-selected]
    ),
  :global(
      :where(.leo-bottomsheet-content)
        leo-menu-section
        leo-menu-item[aria-selected]
    ),
  :global(
      :where(.leo-bottomsheet-content) leo-menu-section leo-option:active
    ),
  :global(
      :where(.leo-bottomsheet-content) leo-menu-section leo-menu-item:active
    ) {
    background: var(--leo-color-container-interactive);
    color: var(--leo-color-text-interactive);
  }

  :global(
      :where(.leo-bottomsheet-content)
        ::slotted(leo-option:focus-visible)
    ),
  :global(
      :where(.leo-bottomsheet-content)
        ::slotted(leo-menu-item:focus-visible)
    ),
  :global(:where(.leo-bottomsheet-content) > leo-option:focus-visible),
  :global(:where(.leo-bottomsheet-content) > leo-menu-item:focus-visible),
  :global(
      :where(.leo-bottomsheet-content)
        leo-menu-section
        leo-option:focus-visible
    ),
  :global(
      :where(.leo-bottomsheet-content)
        leo-menu-section
        leo-menu-item:focus-visible
    ) {
    box-shadow:
      0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
      0px 0px 4px 2px #423eee;
  }

  :global(.leo-bottomsheet-content leo-menu-section leo-menu-item),
  :global(.leo-bottomsheet-content leo-menu-section leo-option) {
    --leo-menu-item-margin: 0 var(--leo-spacing-s);
  }
</style>
