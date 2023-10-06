<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        'leo-menu-item': HTMLAttributes<HTMLElement> & {
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
  let anchor: HTMLElement
</script>

<div class="leo-button-menu">
  <!-- 
    We disable this check - the menu is triggered by the contained element
    firing a `click` event. This may be triggered with a keypress or click.
  -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div bind:this={anchor} on:click|stopPropagation={() => (isOpen = !isOpen)}>
    <slot name="anchor-content">Click</slot>
  </div>
  <Menu
    bind:isOpen
    target={anchor}
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

  .leo-button-menu {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    button {
      all: unset;
    }
  }
</style>
