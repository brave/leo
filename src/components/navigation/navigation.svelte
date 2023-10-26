<script lang="ts">
  export let kind: 'vertical' | 'horizontal' = 'vertical'
</script>

<nav
  class="leo-navigation"
  class:isVertical={kind === 'vertical'}
  class:isHorizontal={kind === 'horizontal'}
>
  {#if $$slots.header}
    <slot name="header" />
  {/if}

  <ul>
    <slot />
  </ul>

  {#if $$slots.actions}
    <slot name="actions" />
  {/if}
</nav>

<style lang="scss">
  .leo-navigation {
    --nav-direction: row;
    display: flex;
    flex-direction: var(--nav-direction);

    :global(ul) {
      display: flex;
      flex-direction: var(--nav-direction);
      gap: var(--leo-spacing-m);
      margin: 0;
      padding: var(--leo-spacing-2xl) 0;
      list-style: none;
    }

    &.isVertical {
      --nav-direction: column;
    }
  }
</style>
