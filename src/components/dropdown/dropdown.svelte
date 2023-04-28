<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import clickOutside from '../../directives/clickOutside'
  import Control from '../control/control.svelte'

  export let placeholder = ''
  export let value: string
  export let options: string[]

  let isOpen = false
  let dispatch = createEventDispatcher()

  function selectOption(option: string) {
    value = option
    isOpen = false

    dispatch('change', {
      value
    })
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
      <div class="popup" use:clickOutside={(e) => (isOpen = false)}>
        {#each options as option}
          <button class="popup-item" on:click={(e) => selectOption(option)}
            >{option}</button
          >
        {/each}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .leo-dropdown {
    --dropdown-gap: var(--leo-dropdown-gap, var(--leo-spacing-8));
    --font: var(--leo-dropdown-font, var(--leo-font-primary-default-regular));

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
