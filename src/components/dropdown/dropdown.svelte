<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import clickOutside from '../../directives/clickOutside'
  import Control from '../control/control.svelte'
  import { scale } from 'svelte/transition'

  export let value: string
  export let options: string[]

  let isOpen = false
  let dispatch = createEventDispatcher()
  let popup: HTMLDivElement

  function selectOption(option: string) {
    value = option
    isOpen = false

    dispatch('change', {
      value
    })
  }

  function changeSelection(e: KeyboardEvent) {
    if (!isOpen || !popup) return

    if (e.code === 'Escape') {
      isOpen = false
      return
    }

    let dir = 0
    if (e.code == 'ArrowUp') dir -= 1
    if (e.code === 'ArrowDown') dir += 1
    if (dir === 0) return

    const children = Array.from(popup.children)
    let focusedIndex = Array.from(popup.children).findIndex((e) =>
      e.matches(':focus-within')
    )
    if (focusedIndex === -1) {
      focusedIndex = 0
    } else {
      focusedIndex += dir
      if (focusedIndex < 0) focusedIndex = children.length - 1
      if (focusedIndex >= children.length) focusedIndex = 0
    }

    ;(children[focusedIndex] as any)?.focus()
  }
</script>

<div class="leo-dropdown">
  <Control on:click={(e) => (isOpen = !isOpen)}>
    <slot name="left-icon" slot="left-icon" />
    <button>
      <span class="value">{value}</span>
    </button>
    <slot name="right-icon" slot="right-icon" />
  </Control>
  <div class="menu">
    {#if isOpen}
      <div
        class="popup"
        transition:scale={{ duration: 60, start: 0.8 }}
        use:clickOutside={(e) => (isOpen = false)}
        bind:this={popup}
      >
        {#each options as option}
          <button class="popup-item" on:click={(e) => selectOption(option)}
            >{option}</button
          >
        {/each}
      </div>
    {/if}
  </div>
</div>

<svelte:window on:keydown={changeSelection} />

<style lang="scss">
  .leo-dropdown {
    --dropdown-gap: var(--leo-dropdown-gap, var(--leo-spacing-8));
    --font: var(--leo-dropdown-font, var(--leo-font-primary-default-regular));
    --transition-duration: var(--leo-dropdown-transition-duration, 0.12s);

    font: var(--font);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    button {
      all: unset;
    }
  }

  .leo-dropdown .value {
    width: 100%;
  }

  .leo-dropdown .menu {
    position: relative;
  }

  .leo-dropdown .popup {
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

  .leo-dropdown .popup-item {
    padding: var(--leo-spacing-16);
    transition: background var(--transition-duration) ease-in-out,
      color var(--transition-duration) ease-in-out;

    &:hover {
      background: var(--leo-color-container-interactive-background);
      color: var(--leo-color-text-interactive);
    }

    &:active {
      background: var(--leo-color-primary-20);
      color: var(--leo-color-text-interactive);
    }

    &:focus-visible {
      /** Our glow won't be visible if it's outside the parent, so shrink the
        * padding a little bit so the glow fits inside */
      --glow-size: 3px;
      padding: calc(var(--leo-spacing-16) - var(--glow-size));
      margin: var(--glow-size);

      border-radius: var(--leo-spacing-8);
      box-shadow: 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5),
        0px 0px 4px 2px #423eee;
    }
  }
</style>
