<script lang="ts">
  import Menu from '../menu/menu.svelte'

  export let isOpen = false
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
</style>
