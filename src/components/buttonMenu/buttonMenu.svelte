<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        'nl-menu-item': HTMLAttributes<HTMLElement> & {
          key?: string | number | null
          children?: any
          onClick?: EventListener
        }
      }
    }
  }
</script>

<script lang="ts">
  import Menu from '../menu/menu.svelte'

  export let isOpen = false
  let button: HTMLButtonElement
</script>

<div class="nala-button-menu">
  <button
    bind:this={button}
    on:click|stopPropagation={() => (isOpen = !isOpen)}
  >
    <slot name="anchor-content">Click</slot>
  </button>
  <Menu
    bind:isOpen
    target={button}
    on:click={() => (isOpen = !isOpen)}
    on:close
  >
    <slot />
  </Menu>
</div>

<style lang="scss">
  :host {
    display: inline-block;
  }

  .nala-button-menu {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    button {
      all: unset;
    }
  }
</style>
