<script context="module" lang="ts">
  import type { HTMLAttributes } from '../types/attributes'

  declare global {
    namespace JSX {
      interface IntrinsicElements {
        'leo-menu-item': HTMLAttributes<HTMLElement> & {
          key?: string | number | null
          children?: string | Element[]
          onClick?: EventListener
        }
      }
    }
  }
</script>

<script lang="ts">
  import Menu, { type CloseEvent } from '../menu/menu.svelte'
  import type { Strategy, Placement } from '@floating-ui/dom'

  export let isOpen: boolean | undefined = undefined
  export let onClose: CloseEvent = undefined
  export let onChange: (e: { isOpen: boolean }) => void = undefined
  export let positionStrategy: Strategy = 'absolute'
  export let placement: Placement = 'bottom-start'
  export let flip: boolean = true

  let anchor: HTMLElement

  $: isOpenInternal = isOpen ?? false

  const toggle = () => {
    const toggleTo = !isOpenInternal
    if (isOpen === undefined) isOpenInternal = toggleTo
    onChange?.({ isOpen: toggleTo })
  }

  const close: CloseEvent = (e) => {
    if (e.originalEvent.composedPath().includes(anchor) || onClose?.(e) === false) {
      return false
    } else if ('key' in e) {
      anchor.focus()
    }

    if (isOpen === undefined) isOpenInternal = false
    onChange?.({ isOpen: false })
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
    on:click={toggle}
    role="button"
    aria-haspopup="menu"
    aria-expanded={isOpenInternal}
    tabindex="0"
  >
    <slot name="anchor-content"/>
  </div>
  {#if isOpenInternal}
    <Menu
      {placement}
      {positionStrategy}
      {flip}
      isOpen={isOpenInternal} 
      target={anchor} 
      onClose={close}
    >
      <slot />
    </Menu>
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
</style>
