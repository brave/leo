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
  import Menu, { type CloseEvent } from '../menu/menu.svelte'

  export let isOpen: boolean | undefined = undefined
  export let onClose: CloseEvent = undefined
  export let onChange: (e: { isOpen: boolean }) => void = undefined

  let anchor: HTMLElement

  $: isOpenInternal = isOpen ?? false

  const toggle = () => {
    const toggleTo = !isOpenInternal
    if (isOpen === undefined) isOpenInternal = toggleTo
    onChange?.({ isOpen: toggleTo })
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
    bind:isOpenInternal
    target={anchor}
    onClose={onClose}
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
