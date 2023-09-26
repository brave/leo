<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        'nl-menu-item': HTMLAttributes<HTMLElement> & {
          // Note: This should line up with Reacts key type, but we don't want
          // to depend on React in this layer, so we just define it manually.
          key?: string | number | null
          children?: any
          onClick?: EventListener
        }
        'nl-option': HTMLAttributes<HTMLElement> & {
          key?: string | number | null
          value?: string
          children?: any
        }
      }
    }
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import clickOutside from '../../svelteDirectives/clickOutside'
  import Floating from '../floating/floating.svelte'

  export let isOpen = false
  export let target: HTMLElement | undefined = undefined
  export let currentValue: string | undefined = undefined

  const dispatch = createEventDispatcher()

  let popup: HTMLDivElement

  function getValue(e: Element) {
    // If the option element doesn't have a value, fallback to using the text
    // content - this allows writing simplified options:
    // i.e. <o>1</o>
    return e.getAttribute('value') ?? e.textContent
  }

  $: menuItems = Array.from(
    // TODO(petemil): support slot *descendents* that are nl-menu-item or nl-option (or something else unstyled like nala-menu-action?) so that we can
    // select items that are in complex positions (see an example in the browser app menu zoom controls).
    (popup?.querySelector('.nala-menu-popup slot') as HTMLSlotElement)
      ?.assignedElements()
      ?.filter((element) =>
        ['NALA-OPTION', 'NALA-MENU-ITEM'].includes(element.tagName)
      ) ??
      popup?.querySelectorAll(
        '.nala-menu-popup > :is(nl-menu-item, nl-option'
      ) ??
      []
  ) as HTMLElement[]

  $: {
    for (const menuItem of menuItems) {
      menuItem.setAttribute('tabindex', '0')

      if (menuItem.tagName === 'NALA-OPTION') {
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

    // Use data-is-interactive=true to prevent the menu from closing when selected. This infers
    // there is interacitivity inside the menu item (e.g. a Toggle), which would be good for the user
    // to see change state and allowing the user to manually close when ready.
    if (
      (item.tagName === 'NALA-OPTION' || item.tagName === 'NALA-MENU-ITEM') &&
      !item.dataset.isInteractive
    ) {
      isOpen = false
      dispatch('close')
    }

    if (item.tagName === 'NALA-OPTION') {
      currentValue = getValue(item)

      dispatch('select-item', {
        value: currentValue
      })
    }

    if (item.tagName === 'NALA-MENU-ITEM') {
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
      isOpen = false
      dispatch('close')
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

  function handleBlur(e) {
    isOpen = false
    dispatch('close')
  }
</script>

<div class="nala-menu">
  {#if isOpen}
    <Floating {target} placement="bottom-start" autoUpdate>
      <div
        class="nala-menu-popup"
        id="menu"
        role="menu"
        tabindex="-1"
        style:min-width="{minWidth}px"
        bind:this={popup}
        use:clickOutside={isOpen && handleBlur}
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

  .nala-menu {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    button {
      all: unset;
    }
  }

  .nala-menu .nala-menu-popup {
    background: var(--nl-color-container-background);
    box-shadow: var(--nl-effect-elevation-03);

    // TODO(petemill): Make the "floating-ui" element be this popup element,
    // so that we get the correct thing scrolling when overflow happens. In the meantime,
    // overflow: 'auto' (or anything but 'visible') helps clip the content
    // to the border-radius.
    overflow: auto;

    border: 1px solid var(--nl-color-divider-subtle);
    border-radius: var(--nl-radius-m);
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  /* custom items can fit in by making optional use of these variables */
  :global .nala-menu-popup ::slotted(*),
  :global .nala-menu-popup > * {
    --nl-menu-item-margin: var(--nl-spacing-s);
    --nl-menu-item-padding: var(--nl-spacing-xl);
    --nl-menu-item-border-radius: var(--nl-spacing-m);
  }

  /**
   * Default Styles for our dropdown options. The selectors are broken up
   * because the :global selector doesn't work with Nesting or combinations (e.g. :is or in ::slotted).
   * Each pseudo element has two sets of selectors: One for when it's inside a Svelte component, and one for
   * inside a web component. This could be simplified if nl-menu-item becomes its own Component.
   */
  :global .nala-menu-popup ::slotted(nl-menu-item),
  :global .nala-menu-popup ::slotted(nl-option),
  :global .nala-menu-popup > nl-menu-item,
  :global .nala-menu-popup > nl-option {
    all: unset;
    cursor: pointer;
    margin: var(--nl-menu-item-margin);
    border-radius: var(--nl-menu-item-border-radius);
    padding: var(--nl-menu-item-padding);
    display: revert;
  }

  :global .nala-menu-popup ::slotted(nl-menu-item:hover),
  :global .nala-menu-popup ::slotted(nl-option:hover),
  :global .nala-menu-popup > nl-menu-item:hover,
  :global .nala-menu-popup > nl-option:hover {
    background: var(--nl-color-container-highlight);
  }

  :global .nala-menu-popup ::slotted(*[aria-selected]),
  :global .nala-menu-popup ::slotted(*:active),
  :global .nala-menu-popup > *[aria-selected],
  :global .nala-menu-popup > *:active {
    background: var(--nl-color-container-interactive);
    color: var(--nl-color-text-interactive);
  }

  :global .nala-menu-popup ::slotted(*:focus-visible),
  :global .nala-menu-popup > *:focus-visible {
    box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
      0px 0px 4px 2px #423eee;
  }

  :global
    .nala-menu-popup
    > ::slotted(*:hover:not(nl-menu-item):not(nl-option)),
  :global .nala-menu-popup > *:hover:not(nl-menu-item):not(nl-option) {
    color: inherit;
    background: none;
    cursor: default;
  }
</style>
