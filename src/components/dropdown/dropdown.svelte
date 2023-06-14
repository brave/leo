<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        'leo-option': HTMLAttributes<HTMLElement> & {
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
  import FormItem, { type Size } from '../formItem/formItem.svelte'
  import { scale } from 'svelte/transition'
  import Icon from '../icon/icon.svelte'

  export let placeholder = ''
  export let value: string = ''
  export let disabled = false
  export let size: Size = 'normal'
  export let required = false

  let dispatch = createEventDispatcher()

  let isOpen = false
  let popup: HTMLDivElement
  let button: HTMLButtonElement

  function getValue(e: Element) {
    // If the option element doesn't have a value, fallback to using the text
    // content - this allows writing simplified options:
    // i.e. <o>1</o>
    return e.getAttribute('value') ?? e.textContent
  }

  // Work out what options have been slotted into the control. We need to handle
  // being in a web-component (via assignedElements) and Svelte's internal
  // slotting separately.
  $: options = Array.from(
    (
      popup?.querySelector('.leo-dropdown-popup slot') as HTMLSlotElement
    )?.assignedElements() ??
      popup?.querySelectorAll('.leo-dropdown-popup > *') ??
      []
  )

  // When the options change, we should assign each one a tabindex - this let's
  // us handle changing the selection with the keyboard (tab or arrow keys).
  $: {
    for (const [option, index] of options.map((o, i) => [o, i] as const)) {
      option.setAttribute('tabindex', (index + 1).toString())
      if (value === getValue(option)) option.setAttribute('aria-selected', '')
      else option.removeAttribute('aria-selected')
    }
  }

  /**
   * Selects an option from an element
   * @param option The element containing the option.
   */
  function selectOption(e: Event) {
    // Find the option which was clicked on, if any.
    const option = options.find((option) => e.composedPath().includes(option))

    // If the event was triggered for something which isn't an option don't fire
    // a change event.
    if (!option) return

    value = getValue(option)

    // Close the popup
    isOpen = false

    // focus the button again for accessibility - this makes it easy to quickly
    // change the selection.
    button.focus()

    dispatch('change', {
      value
    })
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
    let focusedIndex = options.findIndex((e) => e.matches(':focus-within'))
    if (focusedIndex === -1) {
      focusedIndex = 0
    } else {
      focusedIndex += dir
      if (focusedIndex < 0) focusedIndex = options.length - 1
      if (focusedIndex >= options.length) focusedIndex = 0
    }

    ;(options[focusedIndex] as any)?.focus()
    e.preventDefault() // preventDefault, so we don't accidentally scroll
  }
</script>

<div class="leo-dropdown">
  <FormItem bind:disabled bind:required bind:size>
    <slot name="label" slot="label" />
    <slot name="left-icon" slot="left-icon" />
    <button
      bind:this={button}
      class="click-target"
      {disabled}
      on:click={(e) => (isOpen = !isOpen)}
    >
      {#if value}
        <slot name="value" {value}>
          <span class="value">{value}</span>
        </slot>
      {:else}
        <slot name="placeholder">
          <span class="placeholder">{placeholder}</span>
        </slot>
      {/if}
    </button>
    <slot name="right-icon" slot="right-icon">
      <div class="indicator" class:open={isOpen}>
        <Icon name="arrow-small-down" />
      </div>
    </slot>
    <div class="menu" slot="after">
      {#if isOpen}
        <div
          class="leo-dropdown-popup"
          transition:scale={{ duration: 60, start: 0.8 }}
          use:clickOutside={(e) => (isOpen = false)}
          on:keypress={(e) => {
            if (e.code !== 'Enter' && e.code !== 'Space') return
            selectOption(e)
          }}
          on:click={selectOption}
          bind:this={popup}
        >
          <slot />
        </div>
      {/if}
    </div>
  </FormItem>
</div>

<svelte:window on:keydown={changeSelection} />

<style lang="scss">
  :host {
    display: inline-block;
  }

  .leo-dropdown {
    --dropdown-gap: var(--leo-dropdown-gap, var(--leo-spacing-8));
    --transition-duration: var(--leo-dropdown-transition-duration, 0.12s);

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    button {
      all: unset;
    }
  }

  .leo-dropdown .click-target {
    flex: 1;
    pointer-events: none;
  }

  .leo-dropdown .value {
    width: 100%;
  }

  .leo-dropdown .placeholder {
    color: var(--leo-color-text-secondary);
  }

  .leo-dropdown .menu {
    position: relative;
    z-index: 1000;
  }

  .leo-dropdown .indicator {
    transition: transform var(--transition-duration) ease-in-out;

    &.open {
      transform: rotate(-180deg);
    }
  }

  .leo-dropdown .leo-dropdown-popup {
    background: var(--leo-color-container-background);
    box-shadow: var(--leo-effect-elevation-03);
    position: absolute;
    top: var(--dropdown-gap);
    left: 0;
    right: 0;

    display: flex;
    flex-direction: column;
    border-radius: var(--leo-radius-8);
    max-height: 200px;
    overflow-y: auto;
    overflow-x: visible;
    border: 1px solid var(--leo-color-divider-subtle);
  }

  /**
   * Default Styles for our dropdown options. The selectors are broken up
   * because the :global selector doesn't work with Nesting. Each pseudo element
   * has two selectors: One for when it's inside a Svelte component, and one for
   * inside a web component.
   */
  :global .leo-dropdown-popup ::slotted(*),
  :global .leo-dropdown-popup > * {
    all: unset;
    display: revert;

    padding: var(--leo-spacing-16);
    transition: background var(--transition-duration) ease-in-out,
      color var(--transition-duration) ease-in-out;
  }

  :global .leo-dropdown-popup ::slotted(*:hover),
  :global .leo-dropdown-popup > *:hover {
    background: var(--leo-color-container-interactive-background);
    color: var(--leo-color-text-interactive);
  }

  :global .leo-dropdown-popup ::slotted(*[aria-selected]),
  :global .leo-dropdown-popup ::slotted(*:active),
  :global .leo-dropdown-popup > *[aria-selected],
  :global .leo-dropdown-popup > *:active {
    background: var(--leo-color-primary-20);
    color: var(--leo-color-text-interactive);
  }

  :global .leo-dropdown-popup ::slotted(*:focus-visible),
  :global .leo-dropdown-popup > *:focus-visible {
    /** Our glow won't be visible if it's outside the parent, so shrink the
        * padding a little bit so the glow fits inside */
    --glow-size: 3px;
    padding: calc(var(--leo-spacing-16) - var(--glow-size));
    margin: var(--glow-size);

    border-radius: var(--leo-spacing-8);
    box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
      0px 0px 4px 2px #423eee;
  }
</style>
