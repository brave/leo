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
  import type { Strategy } from '@floating-ui/dom'

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
  <div bind:this={anchor} on:click|preventDefault|stopPropagation={toggle}>
    <slot name="anchor-content"/>
  </div>
  <Menu {positionStrategy} isOpen={isOpenInternal} target={anchor} onClose={close}>
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
