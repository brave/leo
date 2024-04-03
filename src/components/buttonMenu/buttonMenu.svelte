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
  import { createEventDispatcher } from 'svelte'

  export let isOpen: boolean | undefined = undefined

  let anchor: HTMLElement

  const dispatch = createEventDispatcher<{
    change: { isOpen: boolean }
  }>()

  $: controlled = isOpen !== undefined

  const toggle = () => {
    if (!controlled) isOpen = !isOpen
    dispatch('change', { isOpen })
  }
</script>

<div class="leo-button-menu">
  <!--
    We disable this check - the menu is triggered by the contained element
    firing a `click` event. This may be triggered with a keypress or click.
  -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div bind:this={anchor} on:click|stopPropagation={toggle}>
    <slot name="anchor-content">Click</slot>
  </div>
  <Menu
    bind:isOpen
    target={anchor}
    on:click={toggle}
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
