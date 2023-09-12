<script lang="ts">
  import Menu from '../menu/menu.svelte'

  let isOpen = false
</script>

<div class="leo-button-menu">
  <button on:click|stopPropagation={() => (isOpen = !isOpen)}>
    <slot name="anchor-content">Click</slot>
  </button>
  <Menu
    {isOpen}
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
