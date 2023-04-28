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
    <span class="value">{value}</span>
    <slot name="right-icon" slot="right-icon" />
  </Control>
  <div class="menu">
    {#if isOpen}
      <div class="popup" use:clickOutside={(e) => (isOpen = false)}>
        {#each options as option}
          <button on:click={(e) => selectOption(option)}>{option}</button>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .leo-dropdown {
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
    background: white;
    box-shadow: var(--leo-effect-elevation-04);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    display: flex;
    flex-direction: column;
  }
</style>
