<script lang="ts">
  export let kind: 'vertical' | 'horizontal' = 'vertical'
</script>

<div
  class="leo-navigation kind-{kind}"
>
  {#if $$slots.header}
    <slot name="header" />
  {/if}

  <nav>
    <slot />
  </nav>

  {#if $$slots.actions}
    <slot name="actions" />
  {/if}
</div>

<style lang="scss">
  .leo-navigation {
    --nav-direction: row;
    display: flex;
    flex-direction: var(--nav-direction);
    height: 100%;

    &.kind-vertical {
      --nav-direction: column;
    }
  }
</style>
