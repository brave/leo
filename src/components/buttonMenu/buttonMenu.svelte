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
  import type { Strategy } from '@floating-ui/dom'
  import { fade, scale } from 'svelte/transition'

  export let isOpen: boolean | undefined = undefined
  export let onClose: CloseEvent = undefined
  export let onChange: (e: { isOpen: boolean }) => void = undefined
  export let positionStrategy: Strategy = 'absolute'

  let anchor: HTMLElement

  $: isOpenInternal = isOpen ?? false

  const toggle = () => {
    const toggleTo = !isOpenInternal
    if (isOpen === undefined) isOpenInternal = toggleTo
    onChange?.({ isOpen: toggleTo })
  }

  const close: CloseEvent = (e) => {
    if (isOpen === undefined) isOpenInternal = false
    onChange?.({ isOpen: false })
    onClose?.(e)
  }
</script>

<div class="leo-button-menu">
  <!--
    We disable this check - the menu is triggered by the contained element
    firing a `click` event. This may be triggered with a keypress or click.
  -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div 
    bind:this={anchor} 
    on:click|preventDefault|stopPropagation={toggle}
    role="button"
    aria-haspopup="menu"
    aria-expanded={isOpenInternal}
    tabindex="0"
  >
    <slot name="anchor-content"/>
  </div>
  {#if isOpenInternal}
    <div 
      class="menu-wrapper"
      in:fade={{ duration: 150 }}
      out:fade={{ duration: 100 }}
    >
      <div 
        class="menu-content"
        in:scale={{ duration: 150, start: 0.95 }}
        out:scale={{ duration: 100, start: 1 }}
      >
        <Menu 
          {positionStrategy} 
          isOpen={isOpenInternal} 
          target={anchor} 
          onClose={close}
        >
          <slot />
        </Menu>
      </div>
    </div>
  {/if}
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

  .menu-wrapper {
    position: absolute;
    z-index: 1000;
  }

  .menu-content {
    transform-origin: top left;
  }
</style>
