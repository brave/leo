<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        'leo-menu-item': HTMLAttributes<HTMLElement> & {
          // Note: This should line up with Reacts key type, but we don't want
          // to depend on React in this layer, so we just define it manually.
          key?: string | number | null
          // Menu items can have borders, so we need to allow that.
          // TODO(petemill): probably make this in to a Component with props and built-in styles
          className?: string
          children?: any
          onClick?: EventListener
        }
        'leo-option': HTMLAttributes<HTMLElement> & {
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
    (
      popup?.querySelector('.leo-menu-popup slot') as HTMLSlotElement
    )?.assignedElements() ??
      popup?.querySelectorAll('.leo-menu-popup > *') ??
      []
  )

  $: {
    for (const [menuItem, index] of menuItems.map((o, i) => [o, i] as const)) {
      menuItem.setAttribute('tabindex', (index + 1).toString())

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

    if (item.tagName === 'LEO-OPTION') {
      currentValue = getValue(item)
    }

    if (item.tagName === 'LEO-OPTION' || item.tagName === 'LEO-MENU-ITEM') {
      isOpen = false
    }

    dispatch('select-item', {
      value: currentValue
    })

    dispatch('close')
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

<div class="leo-menu">
  {#if isOpen}
    <Floating {target} placement="bottom-start" autoUpdate>
      <div
        class="leo-menu-popup"
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

  .leo-menu {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    button {
      all: unset;
    }
  }

  .leo-menu .leo-menu-popup {
    background: var(--leo-color-container-background);
    box-shadow: var(--leo-effect-elevation-03);

    display: flex;
    flex-direction: column;
    border-radius: var(--leo-radius-m);
    width: 100%;
    border: 1px solid var(--leo-color-divider-subtle);
  }

  /**
   * Default Styles for our dropdown options. The selectors are broken up
   * because the :global selector doesn't work with Nesting. Each pseudo element
   * has two selectors: One for when it's inside a Svelte component, and one for
   * inside a web component.
   */
  :global .leo-menu-popup ::slotted(*),
  :global .leo-menu-popup > * {
    all: unset;
    display: revert;
    padding: var(--leo-spacing-xl);
    cursor: pointer;
  }

  :global .leo-menu-popup ::slotted(*:hover),
  :global .leo-menu-popup > *:hover {
    background: var(--leo-color-container-interactive);
    color: var(--leo-color-text-interactive);
  }

  :global .leo-menu-popup ::slotted(*[aria-selected]),
  :global .leo-menu-popup ::slotted(*:active),
  :global .leo-menu-popup > *[aria-selected],
  :global .leo-menu-popup > *:active {
    background: var(--leo-color-primary-20);
    color: var(--leo-color-text-interactive);
  }

  :global .leo-menu-popup ::slotted(*:focus-visible),
  :global .leo-menu-popup > *:focus-visible {
    /** Our glow won't be visible if it's outside the parent, so shrink the
        * padding a little bit so the glow fits inside */
    --glow-size: 3px;
    padding: calc(var(--leo-spacing-xl) - var(--glow-size));
    margin: var(--glow-size);

    border-radius: var(--leo-spacing-m);
    box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
      0px 0px 4px 2px #423eee;
  }

  :global
    .leo-menu-popup
    > ::slotted(*:hover:not(leo-menu-item):not(leo-option)),
  :global .leo-menu-popup > *:hover:not(leo-menu-item):not(leo-option) {
    color: inherit;
    background: none;
    cursor: default;
  }
</style>
