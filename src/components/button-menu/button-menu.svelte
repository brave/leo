<script lang="ts">
  import Menu from '../menu/menu.svelte'

  let isOpen = false
  let button: HTMLButtonElement
</script>

<div class="leo-button-menu">
  <button
    bind:this={button}
    on:click|stopPropagation={() => (isOpen = !isOpen)}
  >
    <slot name="anchor-content">Click</slot>
  </button>
  <Menu
    {isOpen}
    target={button}
    on:blur={() => (isOpen = false)}
    on:escape={() => (isOpen = false)}
    on:select-item={(e) => (isOpen = false)}
    on:click={(e) => (isOpen = !isOpen)}
  >
    <slot />
  </Menu>
</div>

<style lang="scss">
  :host {
    display: inline-block;
  }
</style>
