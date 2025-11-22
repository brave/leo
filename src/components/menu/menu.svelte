<script context="module" lang="ts">
  import type { HTMLAttributes } from '../types/attributes'
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        'leo-menu-item': HTMLAttributes<HTMLElement> & {
          // Note: This should line up with Reacts key type, but we don't want
          // to depend on React in this layer, so we just define it manually.
          key?: string | number | null
          children?: string | Element[]
          onClick?: EventListener
        }
        'leo-option': HTMLAttributes<HTMLElement> & {
          key?: string | number | null
          value?: string
          children?: string | Element[]
        }
      }
    }
  }

  export interface CloseEventDetail {
    originalEvent: Event
    reason: 'select' | 'blur' | 'cancel' | 'explicit'
  }

  export type CloseEvent = (detail: CloseEventDetail) => boolean | undefined | void

  export interface SelectItemEventDetail {
    value: string | undefined
  }
</script>

<script lang="ts">
  import clickOutside from '../../svelteDirectives/clickOutside'
  import Floating from '../floating/floating.svelte'
  import { size as sizeMiddleware, type Placement, type Strategy } from '@floating-ui/dom'

  export let isOpen = false
  export let target: HTMLElement | undefined = undefined
  export let currentValue: string | undefined = undefined
  export let positionStrategy: Strategy = 'absolute'
  export let placement: Placement = 'bottom-start'
  export let flip: boolean = true
  export let onClose: CloseEvent =
    undefined
  export let onSelectItem: (detail: SelectItemEventDetail) => void = undefined

  function dispatchClose(
    originalEvent: Event,
    reason: CloseEventDetail['reason']
  ) {
    // Allow event handlers to cancel closing the dropdown by returning false
    if (onClose?.({ originalEvent, reason }) !== false) {
      isOpen = false
    }
  }

  let popup: HTMLDivElement

  function getValue(e: Element) {
    // If the option element doesn't have a value, fallback to using the text
    // content - this allows writing simplified options:
    // i.e. <o>1</o>
    return e.getAttribute('value') ?? e['value'] ?? e.textContent
  }

  $: menuItems = Array.from(
    // TODO(petemil): support slot *descendents* that are leo-menu-item or leo-option (or something else unstyled like leo-menu-action?) so that we can
    // select items that are in complex positions (see an example in the browser app menu zoom controls).
    (popup?.querySelector('.leo-menu-popup slot') as HTMLSlotElement)
      ?.assignedElements()
      ?.filter((element) =>
        ['LEO-OPTION', 'LEO-MENU-ITEM'].includes(element.tagName)
      ) ??
      popup?.querySelectorAll(
        '.leo-menu-popup > :is(leo-menu-item, leo-option'
      ) ??
      []
  ) as HTMLElement[]

  $: {
    for (const menuItem of menuItems) {
      menuItem.setAttribute('tabindex', '0')

      if (menuItem.tagName === 'LEO-OPTION') {
        menuItem.setAttribute('role', 'option')

        if (currentValue === getValue(menuItem)) {
          menuItem.setAttribute('aria-selected', '')
        } else menuItem.removeAttribute('aria-selected')
      } else {
        menuItem.setAttribute('role', 'menuitem')
      }
    }
  }

  // Note: we check isOpen !== undefined here so this is recalculated every time the
  // dropdown is opened/closed.
  $: minWidth =
    (isOpen !== undefined && target?.getBoundingClientRect().width) || 0

  function selectMenuItem(e: Event) {
    // Find the option which was clicked on, if any.
    const item = menuItems.find((item) => e.composedPath().includes(item))

    // If the event was triggered for something which isn't an option don't fire
    // a change event.
    if (!item) return

    // Use data-is-interactive=true to prevent the menu from closing when selected. This implies
    // there is interacitivity inside the menu item (e.g. a Toggle), which would be good for the user
    // to see change state and allowing the user to manually close when ready. In other words, when we want
    // the styles and menu navigation features of leo-menu-item, but we don't want the auto-close.
    if (
      (item.tagName === 'LEO-OPTION' || item.tagName === 'LEO-MENU-ITEM') &&
      !item.dataset.isInteractive
    ) {
      dispatchClose(e, 'select')
    }

    if (item.tagName === 'LEO-OPTION') {
      currentValue = getValue(item)

      onSelectItem?.({
        value: currentValue
      })
    }

    // When using keyboard navigation to call selectMenuItem, ensure click handlers happen on the item,
    // but not when this was called in a click handler, otherwise we'll get 2x clicks.
    if (item.tagName === 'LEO-MENU-ITEM' && e.type !== 'click') {
      item.click()
    }
  }

  /**
   * Handles changing the currently focused menu element with the up/down arrow.
   * @param e The KeyboardEvent
   */
  function changeSelection(e: KeyboardEvent) {
    if (!isOpen || !popup) return

    // Handle closing keys
    if (e.code === 'Escape') {
      dispatchClose(e, 'cancel')
      return
    }

    // We allow the user to select options with ArrowUp/ArrowDown as well as
    // tab/shift+tab.
    let dir = 0
    if (e.code == 'ArrowUp') dir -= 1
    if (e.code === 'ArrowDown') dir += 1
    if (dir === 0) return

    // First, find the currently focusedIndex. If no option is selected, we'll
    // select the first option. Otherwise, we select the next/previous item (and
    // wrap around).
    let focusedIndex = menuItems.findIndex((e) => e.matches(':focus-within'))
    if (focusedIndex === -1) {
      focusedIndex = 0
    } else {
      focusedIndex += dir
      if (focusedIndex < 0) focusedIndex = menuItems.length - 1
      if (focusedIndex >= menuItems.length) focusedIndex = 0
    }

    ;(menuItems[focusedIndex] as any)?.focus()
    e.preventDefault() // preventDefault, so we don't accidentally scroll
  }

  function handleBlur(e: Event) {
    dispatchClose(e, 'blur')
  }

  function applySizeMiddleware({ rects, availableHeight }) {
    popup.style.maxHeight = `var(--leo-menu-max-height, calc(${availableHeight}px - var(--leo-spacing-xl)))`
  }

  let floatingMiddleware = [sizeMiddleware({ apply: applySizeMiddleware })]
</script>

<div class="leo-menu" use:clickOutside={isOpen && handleBlur}>
  {#if isOpen}
    <Floating
      {target}
      {placement}
      {flip}
      autoUpdate
      middleware={floatingMiddleware}
      {positionStrategy}
    >
      <div
        class="leo-menu-popup"
        id="menu"
        role="menu"
        tabindex="-1"
        style:--leo-menu-control-width={`${minWidth}px`}
        bind:this={popup}
        on:keypress={(e) => {
          if (e.code !== 'Enter' && e.code !== 'Space') return
          selectMenuItem(e)
        }}
        on:click={selectMenuItem}
      >
        <slot />
      </div>
    </Floating>
  {/if}
</div>

<svelte:window on:keydown={changeSelection} />

<style lang="scss">
  :host {
    display: inline-block;
  }

  .leo-menu {
    -webkit-tap-highlight-color: transparent;

    button {
      all: unset;
    }
  }

  .leo-menu .leo-menu-popup {
    background: var(--leo-color-container-background);
    box-shadow: var(--leo-effect-elevation-03);
    transform-origin: top left;
    animation: menuIn 150ms ease-out;

    // TODO(petemill): Make the "floating-ui" element be this popup element,
    // so that we get the correct thing scrolling when overflow happens. In the meantime,
    // overflow: 'auto' (or anything but 'visible') helps clip the content
    // to the border-radius.
    overflow: auto;
    border: 1px solid var(--leo-color-divider-subtle);
    border-radius: var(--leo-radius-m);
    min-width: var(--leo-menu-control-width);
    display: flex;
    flex-direction: column;
    gap: var(--leo-spacing-s);
  }

  @keyframes menuIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* custom items can fit in by making optional use of these variables */
  :global(.leo-menu-popup ::slotted(*)),
  :global(.leo-menu-popup > *) {
    --leo-menu-item-margin: var(--leo-menu-item-margin-top, 0) var(--leo-spacing-s) var(--leo-menu-item-margin-bottom, 0) var(--leo-spacing-s);
    --leo-menu-item-padding:  var(--leo-spacing-m) var(--leo-spacing-xl);
    --leo-menu-item-border-radius: var(--leo-spacing-s);
  }

  :global(.leo-menu-popup ::slotted(leo-option:nth-child(1 of :not([slot])))),
  :global(.leo-menu-popup ::slotted(leo-menu-item:nth-child(1 of :not([slot])))),
  :global(.leo-menu-popup leo-option:first-child),
  :global(.leo-menu-popup leo-menu-item:first-child) {
    --leo-menu-item-margin-top: var(--leo-spacing-s);
  }
  :global(.leo-menu-popup ::slotted(leo-option:nth-last-child(1 of :not([slot])))),
  :global(.leo-menu-popup ::slotted(leo-menu-item:nth-last-child(1 of :not([slot])))),
  :global(.leo-menu-popup leo-option:last-child),
  :global(.leo-menu-popup leo-menu-item:last-child) {
    --leo-menu-item-margin-bottom: var(--leo-spacing-s);
  }
  :global(.leo-menu-popup ::slotted(leo-title)),
  :global(.leo-menu-popup leo-title) {
    padding: var(--leo-spacing-l);
    background: var(--leo-color-page-background);
    font: var(--leo-font-components-label);
    color: var(--leo-color-text-secondary);
  }

  /**
   * Default Styles for our dropdown options. The selectors are broken up
   * because the :global selector doesn't work with Nesting or combinations (e.g. :is or in ::slotted).
   * Each pseudo element has two sets of selectors: One for when it's inside a Svelte component, and one for
   * inside a web component. This could be simplified if leo-menu-item becomes its own Component.
   */
  :global(:where(.leo-menu-popup) ::slotted(leo-menu-item)),
  :global(:where(.leo-menu-popup) ::slotted(leo-option)),
  :global(:where(.leo-menu-popup) > leo-menu-item),
  :global(:where(.leo-menu-popup) > leo-option) {
    all: unset;
    cursor: pointer;
    margin: var(--leo-menu-item-margin);
    border-radius: var(--leo-menu-item-border-radius);
    padding: var(--leo-menu-item-padding);
    display: revert;
  }

  :global(:where(.leo-menu-popup) ::slotted(leo-menu-item:hover)),
  :global(:where(.leo-menu-popup) ::slotted(leo-option:hover)),
  :global(:where(.leo-menu-popup) > leo-menu-item:hover),
  :global(:where(.leo-menu-popup) > leo-option:hover) {
    background: var(--leo-color-container-highlight);
  }

  :global(:where(.leo-menu-popup) ::slotted(leo-option[aria-selected])),
  :global(:where(.leo-menu-popup) ::slotted(leo-menu-item[aria-selected])),
  :global(:where(.leo-menu-popup) ::slotted(leo-option:active)),
  :global(:where(.leo-menu-popup) ::slotted(leo-menu-item:active)),
  :global(:where(.leo-menu-popup) > leo-option[aria-selected]),
  :global(:where(.leo-menu-popup) > leo-menu-item[aria-selected]),
  :global(:where(.leo-menu-popup) > leo-option:active),
  :global(:where(.leo-menu-popup) > leo-menu-item:active) {
    background: var(--leo-color-container-interactive);
    color: var(--leo-color-text-interactive);
  }

  :global(:where(.leo-menu-popup) ::slotted(leo-option:focus-visible)),
  :global(:where(.leo-menu-popup) ::slotted(leo-menu-item:focus-visible)),
  :global(:where(.leo-menu-popup) > leo-option:focus-visible),
  :global(:where(.leo-menu-popup) > leo-menu-item:focus-visible) {
    box-shadow:
      0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
      0px 0px 4px 2px #423eee;
  }
</style>
